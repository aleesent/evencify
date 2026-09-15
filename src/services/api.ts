import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  UserAccount,
  CrewProfile,
  OrganiserProfile,
  EventItem,
  EventCrewRequirement,
  CrewApplication,
  AppNotification,
  CrewCategory,
} from '../types';

export interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
  role: 'crew' | 'organiser' | 'admin';
}

export const EvencifyApi = {
  // ==========================================================================
  // AUTHENTICATION
  // ==========================================================================

  /**
   * Retrieves current authenticated user session from Supabase Auth and database profile
   */
  async getCurrentSession(): Promise<AuthSessionUser | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return null;

      // Fetch user profile from database to get exact assigned role and active state
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        return null;
      }

      // Check if account has been suspended by an administrator
      if (!profile.is_active) {
        await supabase.auth.signOut();
        return null;
      }

      return {
        id: profile.id,
        email: profile.email || session.user.email || '',
        name: profile.full_name || 'Evencify User',
        role: profile.role as 'crew' | 'organiser' | 'admin',
      };
    } catch (err) {
      console.error('Failed to get current session:', err);
      return null;
    }
  },

  /**
   * Register a new Crew Member or Event Organiser using Supabase Auth.
   * Admin registration is strictly blocked.
   */
  async signUp(params: {
    email: string;
    password?: string;
    role: 'crew' | 'organiser';
    fullName: string;
    companyName?: string;
  }): Promise<{ user: AuthSessionUser; error?: string }> {
    if (params.role === ('admin' as any)) {
      return { user: null as any, error: 'Registration as Administrator is strictly forbidden.' };
    }

    if (!isSupabaseConfigured()) {
      return {
        user: {
          id: `usr-${Date.now()}`,
          email: params.email,
          name: params.fullName || (params.role === 'crew' ? 'Aarav Mehta' : 'Singhania Events'),
          role: params.role,
        },
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password || 'EvencifySecure123!',
        options: {
          data: {
            role: params.role,
            full_name: params.fullName,
            company_name: params.companyName,
          },
        },
      });

      if (error) {
        return { user: null as any, error: error.message };
      }

      if (!data.user) {
        return { user: null as any, error: 'User registration failed.' };
      }

      // Ensure profile record exists in profiles table
      const { error: profileUpsertError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email: params.email,
        full_name: params.fullName,
        role: params.role,
        is_active: true,
      });

      if (profileUpsertError) {
        console.warn('Profile upsert note:', profileUpsertError.message);
      }

      // Ensure role specific profile table is initialized
      if (params.role === 'crew') {
        await supabase.from('crew_profiles').upsert({
          user_id: data.user.id,
          rating: 4.9,
          total_reviews: 0,
          completed_events: 0,
          availability_status: 'Available',
          expected_pay: '₹1,500 / shift',
          categories: ['Event Helper'],
        });
      } else if (params.role === 'organiser') {
        await supabase.from('organiser_profiles').upsert({
          user_id: data.user.id,
          company_name: params.companyName || `${params.fullName} Events`,
          udyam_registered: false,
        });
      }

      const sessionUser: AuthSessionUser = {
        id: data.user.id,
        email: params.email,
        name: params.fullName,
        role: params.role,
      };

      return { user: sessionUser };
    } catch (err: any) {
      return { user: null as any, error: err.message || 'Registration failed.' };
    }
  },

  /**
   * Log into Evencify with email and password via Supabase Auth
   */
  async signIn(email: string, password?: string): Promise<{ user: AuthSessionUser; error?: string }> {
    if (!isSupabaseConfigured()) {
      const lower = email.trim().toLowerCase();
      if (lower === 'admin@evencify.com' || lower.includes('admin')) {
        return {
          user: {
            id: 'usr-admin',
            email: 'admin@evencify.com',
            name: 'Evencify Operations Admin',
            role: 'admin',
          },
        };
      }
      if (lower.includes('singhania') || lower.includes('org')) {
        return {
          user: {
            id: 'usr-1',
            email: email.trim(),
            name: 'Rajesh Singhania',
            role: 'organiser',
          },
        };
      }
      return {
        user: {
          id: 'usr-2',
          email: email.trim(),
          name: email.split('@')[0],
          role: 'crew',
        },
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'EvencifySecure123!',
      });

      if (error) {
        return { user: null as any, error: error.message };
      }

      if (!data.user) {
        return { user: null as any, error: 'Authentication failed.' };
      }

      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileErr || !profile) {
        return {
          user: null as any,
          error: 'Profile record not found. Please contact support.',
        };
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        return {
          user: null as any,
          error: 'Your account has been deactivated by an administrator. Please contact support.',
        };
      }

      return {
        user: {
          id: profile.id,
          email: profile.email || data.user.email || '',
          name: profile.full_name || 'Evencify User',
          role: profile.role as 'crew' | 'organiser' | 'admin',
        },
      };
    } catch (err: any) {
      return { user: null as any, error: err.message || 'Login failed.' };
    }
  },

  /**
   * Sign in using Google OAuth
   */
  async signInWithGoogle(selectedRole: 'crew' | 'organiser'): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase database configuration required for Google Sign-in.');
    }

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: { role: selectedRole },
        redirectTo: window.location.origin,
      },
    });
  },

  /**
   * Terminate active Supabase session
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
  },

  /**
   * Listen to real-time auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },

  // ==========================================================================
  // EVENTS CRUD
  // ==========================================================================

  /**
   * Fetch all published events or organiser-accessible events from Postgres
   */
  async getEvents(): Promise<EventItem[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_crew_requirements (*),
          profiles:organiser_id (full_name, email, city)
        `)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error querying events from Supabase:', error);
        return [];
      }

      if (!data) return [];

      return data.map((d: any) => {
        const primaryReq = d.event_crew_requirements?.[0];
        const statusMap: Record<string, EventItem['status']> = {
          published: 'Open',
          draft: 'draft',
          paused: 'paused',
          closed: 'closed',
          completed: 'completed',
          cancelled: 'cancelled',
        };

        const requirements: EventCrewRequirement[] = (d.event_crew_requirements || []).map((r: any) => ({
          id: r.id,
          eventId: r.event_id,
          category: r.category as CrewCategory,
          numberRequired: r.number_required || 1,
          genderRequirement: r.gender_requirement || 'Any',
          minAge: r.min_age,
          maxAge: r.max_age,
          experienceRequirement: r.experience_requirement || 'Both',
          dressCode: r.dress_code,
          specialRequirements: r.special_requirements,
          payAmount: Number(r.pay_amount || 1500),
          payBasis: r.payment_basis || 'Per Shift',
          paymentMethod: r.payment_method || 'Direct UPI / Bank Transfer',
          paymentTimeline: r.payment_timeline || 'Same Day',
          advanceRequired: Boolean(r.advance_required),
          advanceAmount: Number(r.advance_amount || 0),
        }));

        return {
          id: d.id,
          name: d.event_name,
          eventType: d.event_type || 'Wedding',
          date: d.event_date,
          startTime: d.start_time?.slice(0, 5) || '14:00',
          endTime: d.end_time?.slice(0, 5) || '22:00',
          venue: d.venue,
          fullAddress: d.full_address || d.venue,
          city: d.city,
          expectedAttendance: d.expected_attendance,
          organiserId: d.organiser_id,
          organiserName: d.profiles?.full_name || 'Singhania Events',
          crewPositionsTotal: d.total_crew_required || 1,
          crewPositionsAvailable: d.total_crew_required || 1,
          requiredCategory: (primaryReq?.category || 'Hospitality Staff') as CrewCategory,
          genderRequirement: primaryReq?.gender_requirement || 'Any',
          ageRequirement: primaryReq?.min_age ? `${primaryReq.min_age}-${primaryReq.max_age || 35}` : undefined,
          experienceRequirement: primaryReq?.experience_requirement || 'Both',
          dressCode: d.dress_code || primaryReq?.dress_code,
          specialRequirements: d.special_requirements || primaryReq?.special_requirements,
          payAmount: Number(primaryReq?.pay_amount || 1500),
          payBasis: primaryReq?.payment_basis || 'Per Shift',
          paymentMethod: primaryReq?.payment_method || 'Direct UPI / Bank Transfer',
          paymentTimeline: primaryReq?.payment_timeline || 'Same Day',
          advanceRequired: Boolean(primaryReq?.advance_required),
          createdAt: d.created_at,
          status: statusMap[d.status] || 'Open',
          requirements,
        };
      });
    } catch (err) {
      console.error('getEvents failure:', err);
      return [];
    }
  },

  /**
   * Create an event. Always derives organiser_id from verified authenticated user.
   */
  async createEvent(
    event: Omit<EventItem, 'id' | 'organiserId' | 'createdAt'>,
    requirements?: EventCrewRequirement[]
  ): Promise<EventItem> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required to publish events.');
    }

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      throw new Error('You must be logged in as an organiser to publish an event.');
    }

    // Insert Event record
    const { data, error } = await supabase
      .from('events')
      .insert({
        organiser_id: user.id,
        event_name: event.name,
        event_type: event.eventType,
        event_date: event.date,
        start_time: event.startTime,
        end_time: event.endTime,
        venue: event.venue,
        full_address: event.fullAddress || event.venue,
        city: event.city,
        expected_attendance: event.expectedAttendance,
        total_crew_required: event.crewPositionsTotal,
        dress_code: event.dressCode,
        special_requirements: event.specialRequirements,
        status: event.status === 'Open' ? 'published' : event.status.toLowerCase(),
      })
      .select('*, profiles:organiser_id(full_name)')
      .single();

    if (error || !data) {
      throw new Error(`Failed to create event: ${error?.message}`);
    }

    // Insert crew requirements
    const reqsToInsert = requirements && requirements.length > 0
      ? requirements
      : [
          {
            category: event.requiredCategory,
            numberRequired: event.crewPositionsTotal,
            genderRequirement: event.genderRequirement,
            experienceRequirement: event.experienceRequirement,
            payAmount: event.payAmount,
            payBasis: event.payBasis,
            paymentTimeline: event.paymentTimeline,
          } as EventCrewRequirement,
        ];

    const { data: reqData, error: reqErr } = await supabase
      .from('event_crew_requirements')
      .insert(
        reqsToInsert.map((r) => ({
          event_id: data.id,
          category: r.category,
          number_required: r.numberRequired,
          gender_requirement: r.genderRequirement || 'Any',
          min_age: r.minAge,
          max_age: r.maxAge,
          experience_requirement: r.experienceRequirement || 'Both',
          dress_code: r.dressCode || event.dressCode,
          special_requirements: r.specialRequirements || event.specialRequirements,
          pay_amount: r.payAmount || event.payAmount,
          payment_basis: r.payBasis || event.payBasis,
          payment_method: r.paymentMethod || event.paymentMethod || 'Direct UPI / Bank Transfer',
          payment_timeline: r.paymentTimeline || event.paymentTimeline || 'Same Day',
          advance_required: r.advanceRequired || false,
          advance_amount: r.advanceAmount || 0,
        }))
      )
      .select();

    if (reqErr) {
      console.warn('Requirements insert error:', reqErr.message);
    }

    return {
      ...event,
      id: data.id,
      organiserId: user.id,
      organiserName: data.profiles?.full_name || event.organiserName,
      createdAt: data.created_at,
      status: 'Open',
      requirements: (reqData || []).map((r: any) => ({
        id: r.id,
        eventId: r.event_id,
        category: r.category,
        numberRequired: r.number_required,
        genderRequirement: r.gender_requirement,
        minAge: r.min_age,
        maxAge: r.max_age,
        experienceRequirement: r.experience_requirement,
        dressCode: r.dress_code,
        specialRequirements: r.special_requirements,
        payAmount: Number(r.pay_amount),
        payBasis: r.payment_basis,
        paymentMethod: r.payment_method,
        paymentTimeline: r.payment_timeline,
        advanceRequired: r.advance_required,
        advanceAmount: Number(r.advance_amount || 0),
      })),
    };
  },

  /**
   * Update existing event in database
   */
  async updateEvent(eventId: string, updates: Partial<EventItem>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    const dbPayload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbPayload.event_name = updates.name;
    if (updates.eventType !== undefined) dbPayload.event_type = updates.eventType;
    if (updates.date !== undefined) dbPayload.event_date = updates.date;
    if (updates.startTime !== undefined) dbPayload.start_time = updates.startTime;
    if (updates.endTime !== undefined) dbPayload.end_time = updates.endTime;
    if (updates.venue !== undefined) dbPayload.venue = updates.venue;
    if (updates.fullAddress !== undefined) dbPayload.full_address = updates.fullAddress;
    if (updates.city !== undefined) dbPayload.city = updates.city;
    if (updates.crewPositionsTotal !== undefined) dbPayload.total_crew_required = updates.crewPositionsTotal;
    if (updates.dressCode !== undefined) dbPayload.dress_code = updates.dressCode;
    if (updates.specialRequirements !== undefined) dbPayload.special_requirements = updates.specialRequirements;
    if (updates.status !== undefined) {
      dbPayload.status = updates.status === 'Open' ? 'published' : updates.status.toLowerCase();
    }

    const { error } = await supabase.from('events').update(dbPayload).eq('id', eventId);
    if (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
    return true;
  },

  /**
   * Delete event from database
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
    return true;
  },

  // ==========================================================================
  // APPLICATIONS
  // ==========================================================================

  /**
   * Fetch applications from database
   */
  async getApplications(): Promise<CrewApplication[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          events (id, event_name, event_date, city),
          profiles:crew_user_id (id, full_name, email, phone, avatar_url, city),
          crew_profiles:crew_user_id (experience, rating, categories)
        `)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error querying applications:', error);
        return [];
      }

      if (!data) return [];

      return data.map((d: any) => ({
        id: d.id,
        eventId: d.event_id,
        eventName: d.events?.event_name || 'Event Gig',
        eventDate: d.events?.event_date || 'Upcoming',
        crewId: d.crew_user_id,
        crewName: d.profiles?.full_name || 'Crew Member',
        crewEmail: d.profiles?.email,
        crewPhoto: d.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        crewPhone: d.profiles?.phone || '+91 98000 00000',
        crewCategory: (d.category || d.crew_profiles?.categories?.[0] || 'Event Helper') as CrewCategory,
        experienceYears: d.crew_profiles?.experience === 'Veteran' ? 5 : d.crew_profiles?.experience === 'Experienced' ? 2 : 1,
        systemRating: Number(d.crew_profiles?.rating || 4.9),
        city: d.profiles?.city || d.events?.city || 'Surat',
        status: (d.status.charAt(0).toUpperCase() + d.status.slice(1)) as CrewApplication['status'],
        appliedAt: new Date(d.applied_at).toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        note: d.note,
      }));
    } catch (err) {
      console.error('getApplications failure:', err);
      return [];
    }
  },

  /**
   * Apply for an event. Verifies user identity via Supabase session. Prevents duplicates.
   */
  async applyForEvent(eventId: string, note?: string, category?: CrewCategory): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, message: 'Database connection required.' };
    }

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return { success: false, message: 'You must be signed in to apply for events.' };
    }

    // Check for duplicate application at query level
    const { data: existingApp, error: checkErr } = await supabase
      .from('applications')
      .select('id')
      .eq('event_id', eventId)
      .eq('crew_user_id', user.id)
      .maybeSingle();

    if (checkErr && checkErr.code !== 'PGRST116') {
      console.warn('Duplicate check warning:', checkErr);
    }

    if (existingApp) {
      return { success: false, message: 'You have already submitted an application for this event.' };
    }

    // Insert new application
    const { error: insertErr } = await supabase.from('applications').insert({
      event_id: eventId,
      crew_user_id: user.id,
      category: category || 'Event Helper',
      status: 'pending',
      note: note || null,
    });

    if (insertErr) {
      if (insertErr.code === '23505') {
        return { success: false, message: 'You have already applied for this event.' };
      }
      return { success: false, message: `Application failed: ${insertErr.message}` };
    }

    // Create notification for the crew member
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Shift Application Submitted',
      message: 'Your application has been received and sent to the event organiser for review.',
      type: 'application',
      is_read: false,
    });

    return { success: true, message: 'Application successfully submitted!' };
  },

  /**
   * Update application status (accepted, rejected, shortlisted)
   */
  async updateApplicationStatus(appId: string, status: CrewApplication['status']): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    const formattedStatus = status.toLowerCase();
    const { data, error } = await supabase
      .from('applications')
      .update({ status: formattedStatus, updated_at: new Date().toISOString() })
      .eq('id', appId)
      .select('crew_user_id, events(event_name)')
      .single();

    if (error) {
      throw new Error(`Failed to update application: ${error.message}`);
    }

    // Notify crew user of outcome
    if (data?.crew_user_id) {
      await supabase.from('notifications').insert({
        user_id: data.crew_user_id,
        title: `Application ${status}`,
        message: `Your shift application for "${(data.events as any)?.event_name || 'the event'}" has been updated to ${status}.`,
        type: 'application',
        is_read: false,
      });
    }

    return true;
  },

  // ==========================================================================
  // CREW PROFILES
  // ==========================================================================

  /**
   * Fetch all crew profiles from database
   */
  async getCrewProfiles(): Promise<CrewProfile[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('crew_profiles')
        .select(`
          *,
          profiles:user_id (id, full_name, email, phone, avatar_url, city, address, pincode)
        `);

      if (error || !data) {
        console.error('Error fetching crew profiles:', error);
        return [];
      }

      return data.map((d: any) => ({
        id: d.user_id,
        name: d.profiles?.full_name || 'Verified Crew Member',
        email: d.profiles?.email || '',
        phone: d.profiles?.phone || '+91 98000 00000',
        experienceYears: d.experience === 'Veteran' ? 6 : d.experience === 'Experienced' ? 3 : 1,
        experienceLevel: (d.experience || 'Experienced') as 'Fresher' | 'Experienced' | 'Veteran',
        categories: (d.categories || ['Event Helper']) as CrewCategory[],
        age: d.age || 23,
        gender: d.gender || 'Other',
        city: d.profiles?.city || 'Surat',
        address: d.profiles?.address || 'City Center',
        pinCode: d.profiles?.pincode || '395007',
        photoUrl: d.profile_photo_url || d.profiles?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        systemRating: Number(d.rating || 4.9),
        reviewsCount: d.total_reviews || 0,
        completedEventsCount: d.completed_events || 0,
        availability: d.availability_status || 'Available for Shifts',
        expectedPay: d.expected_pay || '₹1,500 / shift',
        bio: d.bio || 'Professional event crew member registered on Evencify.',
        profileCompletionPercentage: 85,
      }));
    } catch (err) {
      console.error('getCrewProfiles failure:', err);
      return [];
    }
  },

  /**
   * Update crew profile
   */
  async updateCrewProfile(userId: string, data: Partial<CrewProfile>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    // Update main profiles table
    const profileUpdates: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) profileUpdates.full_name = data.name;
    if (data.phone !== undefined) profileUpdates.phone = data.phone;
    if (data.city !== undefined) profileUpdates.city = data.city;
    if (data.address !== undefined) profileUpdates.address = data.address;
    if (data.pinCode || data.pincode) profileUpdates.pincode = data.pinCode || data.pincode;
    if (data.photoUrl !== undefined) profileUpdates.avatar_url = data.photoUrl;

    await supabase.from('profiles').update(profileUpdates).eq('id', userId);

    // Update crew_profiles table
    const crewUpdates: any = { updated_at: new Date().toISOString() };
    if (data.experienceLevel !== undefined) crewUpdates.experience = data.experienceLevel;
    if (data.categories !== undefined) crewUpdates.categories = data.categories;
    if (data.age !== undefined) crewUpdates.age = data.age;
    if (data.gender !== undefined) crewUpdates.gender = data.gender;
    if (data.photoUrl !== undefined) crewUpdates.profile_photo_url = data.photoUrl;
    if (data.expectedPay !== undefined) crewUpdates.expected_pay = data.expectedPay;
    if (data.bio !== undefined) crewUpdates.bio = data.bio;
    if (data.availability !== undefined) crewUpdates.availability_status = data.availability;

    const { error } = await supabase.from('crew_profiles').update(crewUpdates).eq('user_id', userId);
    if (error) {
      throw new Error(`Failed to update crew profile: ${error.message}`);
    }

    return true;
  },

  // ==========================================================================
  // ORGANISER PROFILES
  // ==========================================================================

  /**
   * Fetch organiser profile for user
   */
  async getOrganiserProfile(userId?: string): Promise<OrganiserProfile | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      let targetId = userId;
      if (!targetId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetId = user?.id;
      }

      if (!targetId) return null;

      const { data, error } = await supabase
        .from('organiser_profiles')
        .select(`
          *,
          profiles:user_id (id, full_name, email, phone, city, address, pincode)
        `)
        .eq('user_id', targetId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.user_id,
        name: data.profiles?.full_name || 'Event Organiser',
        companyName: data.company_name || 'Organiser Productions',
        hasUdyam: Boolean(data.udyam_registered),
        udyamNumber: data.udyam_number,
        address: data.address || data.profiles?.address || '',
        city: data.city || data.profiles?.city || 'Surat',
        pinCode: data.pincode || data.profiles?.pincode || '',
        email: data.profiles?.email || '',
        phone: data.phone || data.profiles?.phone || '',
      };
    } catch (err) {
      console.error('getOrganiserProfile failure:', err);
      return null;
    }
  },

  /**
   * Update organiser profile
   */
  async updateOrganiserProfile(userId: string, data: Partial<OrganiserProfile>): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    // Update main profiles
    const profileUpdates: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) profileUpdates.full_name = data.name;
    if (data.phone !== undefined) profileUpdates.phone = data.phone;
    if (data.city !== undefined) profileUpdates.city = data.city;
    if (data.address !== undefined) profileUpdates.address = data.address;
    if (data.pinCode || data.pincode) profileUpdates.pincode = data.pinCode || data.pincode;

    await supabase.from('profiles').update(profileUpdates).eq('id', userId);

    // Update organiser_profiles
    const orgUpdates: any = { updated_at: new Date().toISOString() };
    if (data.companyName !== undefined) orgUpdates.company_name = data.companyName;
    if (data.hasUdyam !== undefined) orgUpdates.udyam_registered = data.hasUdyam;
    if (data.udyamNumber !== undefined) orgUpdates.udyam_number = data.udyamNumber;
    if (data.address !== undefined) orgUpdates.address = data.address;
    if (data.city !== undefined) orgUpdates.city = data.city;
    if (data.pinCode || data.pincode) orgUpdates.pincode = data.pinCode || data.pincode;
    if (data.phone !== undefined) orgUpdates.phone = data.phone;

    const { error } = await supabase.from('organiser_profiles').update(orgUpdates).eq('user_id', userId);
    if (error) {
      throw new Error(`Failed to update organiser profile: ${error.message}`);
    }

    return true;
  },

  // ==========================================================================
  // ADMIN PLATFORM GOVERNANCE & SAFETY
  // ==========================================================================

  /**
   * Get all registered users for administration
   */
  async getUsers(): Promise<UserAccount[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data.map((p: any) => ({
        id: p.id,
        name: p.full_name || 'User',
        email: p.email || '',
        phone: p.phone,
        role: p.role as 'crew' | 'organiser' | 'admin',
        status: p.is_active ? 'Active' : 'Suspended',
        city: p.city || 'Surat',
        createdAt: new Date(p.created_at).toISOString().split('T')[0],
        verificationBadge: p.role === 'admin' ? 'Superadmin' : p.role === 'organiser' ? 'Verified Organiser' : 'Verified Crew',
      }));
    } catch (err) {
      console.error('getUsers failure:', err);
      return [];
    }
  },

  /**
   * Update a user's role.
   * ADMIN SAFETY: Demoting the last remaining active administrator is strictly forbidden.
   */
  async updateUserRole(userId: string, newRole: 'crew' | 'organiser' | 'admin'): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    // Check target user's current role
    const { data: targetUser, error: targetErr } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', userId)
      .single();

    if (targetErr || !targetUser) {
      throw new Error('User not found.');
    }

    // If attempting to demote an admin, verify there are other active admins
    if (targetUser.role === 'admin' && newRole !== 'admin') {
      const { count, error: countErr } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin')
        .eq('is_active', true)
        .neq('id', userId);

      if (countErr) {
        throw new Error('Failed to verify administrator safety condition.');
      }

      if ((count ?? 0) === 0) {
        throw new Error('Admin Safety Protection: Cannot demote the last remaining active administrator.');
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to change role: ${error.message}`);
    }

    return true;
  },

  /**
   * Toggle user account active / suspended status.
   * ADMIN SAFETY: Deactivating the last remaining active administrator is strictly forbidden.
   */
  async toggleUserStatus(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    const { data: targetUser, error: targetErr } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', userId)
      .single();

    if (targetErr || !targetUser) {
      throw new Error('User not found.');
    }

    const nextStatus = !targetUser.is_active;

    // If deactivating an active admin, enforce safety
    if (targetUser.role === 'admin' && targetUser.is_active && !nextStatus) {
      const { count, error: countErr } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin')
        .eq('is_active', true)
        .neq('id', userId);

      if (countErr) {
        throw new Error('Failed to verify administrator safety condition.');
      }

      if ((count ?? 0) === 0) {
        throw new Error('Admin Safety Protection: Cannot deactivate the last remaining active administrator.');
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to toggle account status: ${error.message}`);
    }

    return true;
  },

  /**
   * Delete a user profile permanently.
   * ADMIN SAFETY: Deleting the last remaining active administrator is strictly forbidden.
   */
  async deleteUser(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required.');
    }

    const { data: targetUser, error: targetErr } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (targetErr || !targetUser) {
      throw new Error('User not found.');
    }

    if (targetUser.role === 'admin') {
      const { count, error: countErr } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'admin')
        .eq('is_active', true)
        .neq('id', userId);

      if (countErr) {
        throw new Error('Failed to verify administrator safety condition.');
      }

      if ((count ?? 0) === 0) {
        throw new Error('Admin Safety Protection: Cannot delete the last remaining active administrator.');
      }
    }

    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return true;
  },

  // ==========================================================================
  // NOTIFICATIONS
  // ==========================================================================

  /**
   * Fetch notifications for current authenticated user
   */
  async getNotifications(): Promise<AppNotification[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: n.type as AppNotification['type'],
        read: Boolean(n.is_read),
      }));
    } catch (err) {
      console.error('getNotifications error:', err);
      return [];
    }
  },

  /**
   * Mark all notifications as read for current authenticated user
   */
  async markAllNotificationsRead(): Promise<void> {
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);
    } catch (err) {
      console.error('markAllNotificationsRead error:', err);
    }
  },

  // ==========================================================================
  // AVATAR STORAGE
  // ==========================================================================

  /**
   * Upload user avatar to Supabase Storage 'avatars' bucket
   */
  async uploadAvatar(file: File): Promise<string> {
    if (!isSupabaseConfigured()) {
      throw new Error('Database connection required to upload files.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required.');
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadErr } = await supabase.storage.from('avatars').upload(filePath, file, {
      upsert: true,
    });

    if (uploadErr) {
      throw new Error(`Avatar upload failed: ${uploadErr.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update avatar_url in profiles
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);

    return publicUrl;
  },
};
