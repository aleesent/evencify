import React, { useState, useMemo, useEffect } from 'react';
import {
  UserRole,
  EventItem,
  CrewProfile,
  CrewApplication,
  OrganiserProfile,
  AdminProfile,
  UserAccount,
  AppNotification,
  EventCoordinationGroup,
} from './types';
import {
  INITIAL_EVENTS,
  INITIAL_CREW_PROFILES,
  INITIAL_APPLICATIONS,
  INITIAL_ORGANISER_PROFILE,
  INITIAL_ADMIN_PROFILE,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EVENT_GROUPS,
} from './mockData';
import { EvencifyApi } from './services/api';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// SEO Metadata
import { getSEOData } from './services/seoData';
import { SEOHead } from './components/seo/SEOHead';

// Layout & Global Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RoleSelectorModal } from './components/RoleSelectorModal';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { EventCoordinationChatModal } from './components/EventCoordinationChatModal';

// Landing Page Components (Strictly Informational / Marketing)
import { HeroSection } from './components/landing/HeroSection';
import { ForCrewSection } from './components/landing/ForCrewSection';
import { ForOrganisersSection } from './components/landing/ForOrganisersSection';
import { TrustSection } from './components/landing/TrustSection';
import { FinalCtaSection } from './components/landing/FinalCtaSection';
import { FaqSection } from './components/landing/FaqSection';

// Authenticated Crew Component
import { CrewDashboardView } from './components/crew/CrewDashboardView';
import { CrewOnboardingModal } from './components/crew/CrewOnboardingModal';
import { CrewProfileModal } from './components/crew/CrewProfileModal';

// Authenticated Organiser Components
import { OrganiserDashboard } from './components/organiser/OrganiserDashboard';
import { CreateEventModal } from './components/organiser/CreateEventModal';
import { OrganiserOnboardingModal } from './components/organiser/OrganiserOnboardingModal';

// Authenticated Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

export default function App() {
  // Navigation & Role State (Only 3 active roles + visitor)
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');
  const [authenticatedRole, setAuthenticatedRole] = useState<UserRole>('crew');
  const [activeUserEmail, setActiveUserEmail] = useState<string>('as4820000@gmail.com');
  const [activeUserName, setActiveUserName] = useState<string>('Ananya Sharma');

  // Domain State
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [crewList, setCrewList] = useState<CrewProfile[]>(INITIAL_CREW_PROFILES);
  const [applications, setApplications] = useState<CrewApplication[]>(INITIAL_APPLICATIONS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // SEO Metadata
  const currentSeo = useMemo(() => getSEOData({ type: 'homepage' }), []);

  // Active Profiles
  const [currentCrewProfile, setCurrentCrewProfile] = useState<CrewProfile>(INITIAL_CREW_PROFILES[0]);
  const [currentOrganiserProfile, setCurrentOrganiserProfile] = useState<OrganiserProfile>(
    INITIAL_ORGANISER_PROFILE
  );
  const [currentAdminProfile, setCurrentAdminProfile] = useState<AdminProfile>(INITIAL_ADMIN_PROFILE);

  // Modals visibility
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTargetRole, setAuthTargetRole] = useState<UserRole | undefined>(undefined);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('signup');
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Specific role modals
  const [crewOnboardingOpen, setCrewOnboardingOpen] = useState(false);
  const [organiserOnboardingOpen, setOrganiserOnboardingOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  // Active subtabs for persistent navigation
  const [activeCrewTab, setActiveCrewTab] = useState<
    'overview' | 'find-events' | 'applications' | 'profile' | 'notifications' | 'settings'
  >('overview');
  const [activeOrganiserTab, setActiveOrganiserTab] = useState<
    'overview' | 'events' | 'crew' | 'applications' | 'profile'
  >('overview');

  // Detail modals
  const [selectedCrewForDetail, setSelectedCrewForDetail] = useState<CrewProfile | null>(null);

  // Event Coordination Groups (Admin-created communication channel for Organiser + Hired Crew)
  const [eventGroups, setEventGroups] = useState<EventCoordinationGroup[]>(INITIAL_EVENT_GROUPS);
  const [activeChatGroup, setActiveChatGroup] = useState<EventCoordinationGroup | null>(null);

  // Toast banner for feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Live Supabase auto-sync & real-time updates
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;
    const fetchSupabaseData = async () => {
      try {
        const [dbEvents, dbCrew, dbApps, dbGroups, dbUsers, dbNotifs] = await Promise.allSettled([
          EvencifyApi.getEvents(),
          EvencifyApi.getCrewProfiles(),
          EvencifyApi.getApplications(),
          EvencifyApi.getCoordinationGroups(),
          EvencifyApi.getUsers(),
          EvencifyApi.getNotifications(),
        ]);

        if (!isMounted) return;

        if (dbEvents.status === 'fulfilled' && dbEvents.value.length > 0) {
          setEvents(dbEvents.value);
        }
        if (dbCrew.status === 'fulfilled' && dbCrew.value.length > 0) {
          setCrewList(dbCrew.value);
          setCurrentCrewProfile(dbCrew.value[0]);
        }
        if (dbApps.status === 'fulfilled' && dbApps.value.length > 0) {
          setApplications(dbApps.value);
        }
        if (dbGroups.status === 'fulfilled' && dbGroups.value.length > 0) {
          setEventGroups(dbGroups.value);
        }
        if (dbUsers.status === 'fulfilled' && dbUsers.value.length > 0) {
          setUsers(dbUsers.value);
        }
        if (dbNotifs.status === 'fulfilled' && dbNotifs.value.length > 0) {
          setNotifications(dbNotifs.value);
        }
      } catch (err) {
        console.error('Initial Supabase load error:', err);
      }
    };

    fetchSupabaseData();

    // Setup Postgres realtime listeners
    const channel = supabase
      .channel('evencify-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, async () => {
        const freshEvents = await EvencifyApi.getEvents();
        if (freshEvents.length > 0 && isMounted) setEvents(freshEvents);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, async () => {
        const freshApps = await EvencifyApi.getApplications();
        if (freshApps.length > 0 && isMounted) setApplications(freshApps);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coordination_messages' }, async () => {
        const freshGroups = await EvencifyApi.getCoordinationGroups();
        if (freshGroups.length > 0 && isMounted) {
          setEventGroups(freshGroups);
          setActiveChatGroup((prev) => {
            if (!prev) return null;
            return freshGroups.find((g) => g.id === prev.id) || prev;
          });
        }
      })
      .subscribe();

    // Check for active Supabase Auth session (such as returning from OAuth redirect)
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user && isMounted) {
        const u = data.session.user;
        const userRole = (u.user_metadata?.role as UserRole) || 'crew';
        const userEmail = u.email || '';
        const userName =
          u.user_metadata?.full_name ||
          u.user_metadata?.name ||
          userEmail.split('@')[0];

        setActiveUserEmail(userEmail);
        setActiveUserName(userName);
        setAuthenticatedRole(userRole);
        setCurrentRole(userRole);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && isMounted) {
        const u = session.user;
        const userRole = (u.user_metadata?.role as UserRole) || 'crew';
        const userEmail = u.email || '';
        const userName =
          u.user_metadata?.full_name ||
          u.user_metadata?.name ||
          userEmail.split('@')[0];

        setActiveUserEmail(userEmail);
        setActiveUserName(userName);
        setAuthenticatedRole(userRole);
        setCurrentRole(userRole);
      }
    });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Role switching
  const handleSelectRole = (role: UserRole) => {
    if (role === 'visitor') {
      setCurrentRole('visitor');
      return;
    }

    // Role-based Access Control check: if not logged in, prompt authentication
    if (!activeUserEmail) {
      setAuthTargetRole(role);
      setAuthInitialMode('login');
      setAuthModalOpen(true);
      return;
    }

    setAuthenticatedRole(role);
    setCurrentRole(role);
  };

  const handleOpenAuth = (role?: UserRole, initialMode: 'login' | 'signup' = 'signup') => {
    setAuthTargetRole(role);
    setAuthInitialMode(initialMode);
    setAuthModalOpen(true);
  };

  const handleAuthenticated = (role: UserRole, email: string) => {
    setActiveUserEmail(email);
    setAuthenticatedRole(role);
    setCurrentRole(role);

    if (role === 'crew') {
      const existing = users.find((u) => u.email === email && u.role === 'crew');
      setActiveUserName(existing?.name || currentCrewProfile.name);
      showToast(`Welcome! Signed in as ${existing?.name || currentCrewProfile.name} (Crew)`);
    } else if (role === 'organiser') {
      const existing = users.find((u) => u.email === email && u.role === 'organiser');
      setActiveUserName(existing?.name || currentOrganiserProfile.companyName);
      showToast(`Welcome! Signed in as ${existing?.name || currentOrganiserProfile.name} (Organiser)`);
    } else if (role === 'admin') {
      setActiveUserName(currentAdminProfile.name);
      showToast(`Admin Console Unlocked: ${email}`);
    }
  };

  const handleAdminAuthenticated = (email: string) => {
    setActiveUserEmail(email);
    setActiveUserName(currentAdminProfile.name);
    setAuthenticatedRole('admin');
    setCurrentRole('admin');
    showToast(`Superadmin session active: ${email}`);
  };

  const handleLogout = async () => {
    setCurrentRole('visitor');
    setActiveUserEmail('');
    setActiveUserName('');
    setAuthenticatedRole('visitor');
    await EvencifyApi.signOut();
    showToast('Signed out successfully.');
  };

  // Crew actions
  const handleApplyToEvent = (eventId: string, note?: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    // Check if already applied
    const alreadyApplied = applications.some(
      (a) => a.eventId === eventId && (a.crewId === currentCrewProfile.id || a.crewEmail === currentCrewProfile.email)
    );
    if (alreadyApplied) {
      showToast('You have already applied for this event.');
      return;
    }

    const newApp: CrewApplication = {
      id: `app-${Date.now()}`,
      eventId,
      eventName: event.name,
      eventDate: event.date,
      crewId: currentCrewProfile.id,
      crewName: currentCrewProfile.name,
      crewEmail: currentCrewProfile.email,
      crewPhoto: currentCrewProfile.photoUrl,
      crewPhone: currentCrewProfile.phone,
      crewCategory: currentCrewProfile.categories[0] || event.requiredCategory,
      experienceYears: currentCrewProfile.experienceYears,
      systemRating: currentCrewProfile.systemRating,
      city: currentCrewProfile.city,
      status: 'Pending',
      appliedAt: 'Just now',
      note,
    };

    setApplications([newApp, ...applications]);
    showToast(`Application submitted for ${event.name}!`);

    // Auto store to Supabase
    EvencifyApi.applyForEvent(eventId, note, currentCrewProfile.categories[0] || event.requiredCategory, {
      crewId: currentCrewProfile.id,
      crewName: currentCrewProfile.name,
      crewEmail: currentCrewProfile.email,
      crewPhone: currentCrewProfile.phone,
      crewPhoto: currentCrewProfile.photoUrl,
      crewCategory: currentCrewProfile.categories[0] || event.requiredCategory,
      experienceYears: currentCrewProfile.experienceYears,
      systemRating: currentCrewProfile.systemRating,
      city: currentCrewProfile.city,
      eventName: event.name,
      eventDate: event.date,
    }).catch((err) => console.error('Supabase apply error:', err));

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Shift Application Received',
      message: `Your application for "${event.name}" was sent to ${event.organiserName}.`,
      time: 'Just now',
      read: false,
      type: 'application',
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Organiser actions
  const handleEventCreated = (newEvent: EventItem) => {
    setEvents([newEvent, ...events]);
    showToast(`Event "${newEvent.name}" published!`);

    // Auto store to Supabase
    EvencifyApi.createEvent(newEvent, newEvent.requirements).catch((err) =>
      console.error('Supabase createEvent error:', err)
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Event Live',
      message: `"${newEvent.name}" is now open for crew applications in ${newEvent.city}.`,
      time: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleUpdateAppStatus = (appId: string, status: CrewApplication['status']) => {
    setApplications(
      applications.map((a) => (a.id === appId ? { ...a, status } : a))
    );
    showToast(`Applicant marked as ${status}.`);

    // Auto update in Supabase
    EvencifyApi.updateApplicationStatus(appId, status).catch((err) =>
      console.error('Supabase updateApplicationStatus error:', err)
    );
  };

  const handleUpdateEventStatus = (eventId: string, status: EventItem['status']) => {
    setEvents(events.map((e) => (e.id === eventId ? { ...e, status } : e)));
    showToast(`Event status set to ${status}.`);

    // Auto update status in Supabase
    EvencifyApi.updateEvent(eventId, { status }).catch((err) =>
      console.error('Supabase updateEvent status error:', err)
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    showToast('Event removed.');

    // Auto delete from Supabase
    EvencifyApi.deleteEvent(eventId).catch((err) =>
      console.error('Supabase deleteEvent error:', err)
    );
  };

  // Admin user status toggle
  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
    showToast('User account status updated.');
  };

  // Admin: Toggle user verification status
  const handleToggleUserVerification = (userId: string) => {
    let nowVerified = false;
    let userName = '';
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          nowVerified = !u.isVerified;
          userName = u.name;
          const defaultBadge =
            u.role === 'organiser'
              ? 'Business Verified'
              : u.role === 'admin'
              ? 'Platform Superadmin'
              : 'Verified Pro';
          return {
            ...u,
            isVerified: nowVerified,
            verificationBadge: nowVerified
              ? u.verificationBadge && u.verificationBadge !== 'Unverified' && u.verificationBadge !== 'Pending Verification'
                ? u.verificationBadge
                : defaultBadge
              : 'Unverified',
          };
        }
        return u;
      })
    );

    const target = users.find((u) => u.id === userId);
    if (target?.role === 'organiser') {
      setCurrentOrganiserProfile((prev) => ({
        ...prev,
        hasUdyam: !target.isVerified,
      }));
    }

    showToast(`${userName || 'User'} marked as ${nowVerified ? 'Verified' : 'Unverified'}.`);
  };

  // Admin: Edit full user profile (ID, password, role, badges, credentials)
  const handleUpdateUser = (originalUserId: string, updatedData: UserAccount) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === originalUserId ? updatedData : u))
    );

    // Sync with crew directory
    if (updatedData.role === 'crew') {
      setCrewList((prev) => {
        const exists = prev.some((c) => c.id === originalUserId || c.email === updatedData.email);
        if (exists) {
          return prev.map((c) =>
            c.id === originalUserId || c.email === updatedData.email
              ? {
                  ...c,
                  id: updatedData.id,
                  name: updatedData.name,
                  email: updatedData.email,
                  phone: updatedData.phone || c.phone,
                  city: updatedData.city || c.city,
                  systemRating: updatedData.systemRating ?? c.systemRating,
                  completedEventsCount: updatedData.completedEventsCount ?? c.completedEventsCount,
                  expectedPay: updatedData.expectedPay ?? c.expectedPay,
                  categories: updatedData.categories ?? c.categories,
                }
              : c
          );
        } else {
          return [
            {
              id: updatedData.id,
              name: updatedData.name,
              email: updatedData.email,
              phone: updatedData.phone || '+91 98000 00000',
              city: updatedData.city || 'Surat',
              experienceYears: 2,
              experienceLevel: 'Experienced',
              categories: updatedData.categories || ['Event Helper'],
              age: 23,
              address: updatedData.city || 'Surat',
              photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              systemRating: updatedData.systemRating || 4.8,
              completedEventsCount: updatedData.completedEventsCount || 0,
              expectedPay: updatedData.expectedPay || '₹2,000 / shift',
            },
            ...prev,
          ];
        }
      });
    }

    // Sync with organiser profile
    if (updatedData.role === 'organiser') {
      setCurrentOrganiserProfile((prev) => ({
        ...prev,
        name: updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone || prev.phone,
        companyName: updatedData.companyName || prev.companyName,
        city: updatedData.city || prev.city,
        hasUdyam: updatedData.isVerified ?? prev.hasUdyam,
        udyamNumber: updatedData.udyamNumber ?? prev.udyamNumber,
        address: updatedData.address ?? prev.address,
      }));
    }

    showToast(`User account "${updatedData.name}" (${updatedData.id}) updated.`);
  };

  // Admin: Create new user
  const handleCreateUser = (newUser: UserAccount) => {
    setUsers((prev) => [newUser, ...prev]);

    if (newUser.role === 'crew') {
      setCrewList((prev) => [
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || '+91 98000 00000',
          city: newUser.city || 'Surat',
          experienceYears: 2,
          experienceLevel: 'Experienced',
          categories: newUser.categories || ['Event Helper'],
          age: 23,
          address: newUser.city || 'Surat',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          systemRating: newUser.systemRating || 4.8,
          completedEventsCount: newUser.completedEventsCount || 0,
          expectedPay: newUser.expectedPay || '₹2,000 / shift',
        },
        ...prev,
      ]);
    }

    showToast(`New user profile provisioned for ${newUser.name}.`);
  };

  // Admin: Edit event
  const handleEditEvent = (updatedEvent: EventItem) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    showToast(`Event "${updatedEvent.name}" updated.`);

    // Auto store to Supabase
    EvencifyApi.updateEvent(updatedEvent.id, updatedEvent).catch((err) =>
      console.error('Supabase updateEvent error:', err)
    );
  };

  // Admin: Delete application
  const handleDeleteApplication = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    showToast('Application deleted.');

    // Auto remove from Supabase
    supabase.from('applications').delete().eq('id', appId).then(({ error }) => {
      if (error) console.error('Supabase delete application error:', error);
    });
  };

  // Admin user role update
  const handleUpdateUserRole = (userId: string, newRole: 'crew' | 'organiser' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast(`User role updated to ${newRole}`);

    supabase.from('profiles').update({ role: newRole }).eq('id', userId).then(({ error }) => {
      if (error) console.error('Supabase update user role error:', error);
    });
  };

  // Admin user delete
  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setCrewList((prev) => prev.filter((c) => c.id !== userId));
    showToast('User account permanently deleted.');

    supabase.from('profiles').delete().eq('id', userId).then(({ error }) => {
      if (error) console.error('Supabase delete user error:', error);
    });
  };

  // Admin: Create official event coordination group (Admin-only feature when crew staffing requirements are met)
  const handleCreateEventGroup = (eventId: string) => {
    const existing = eventGroups.find((g) => g.eventId === eventId);
    if (existing) {
      setActiveChatGroup(existing);
      showToast('Shift coordination group already exists for this event.');
      return;
    }

    const event = events.find((e) => e.id === eventId);
    if (!event) {
      showToast('Event record not found.');
      return;
    }

    // Filter accepted applications for this specific event
    const acceptedApps = applications.filter(
      (a) => a.eventId === eventId && a.status === 'Accepted'
    );

    const crewMembers = acceptedApps.map((app) => ({
      crewId: app.crewId,
      crewName: app.crewName,
      crewCategory: app.crewCategory,
      crewPhone: app.crewPhone,
      crewPhoto: app.crewPhoto,
      status: 'Accepted' as const,
    }));

    const newGroupId = `grp-${Date.now()}`;
    const newGroup: EventCoordinationGroup = {
      id: newGroupId,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      eventVenue: `${event.venue}, ${event.city}`,
      organiserId: event.organiserId || 'org-1',
      organiserName: event.organiserName,
      organiserPhone: '+91 98200 11223',
      createdAt: 'Just now',
      createdByAdminId: currentAdminProfile.id,
      status: 'active',
      crewMembers,
      messages: [
        {
          id: `msg-${Date.now()}`,
          groupId: newGroupId,
          senderId: currentAdminProfile.id,
          senderName: 'Platform Administrator',
          senderRole: 'admin',
          content: `Official Coordination Group created for "${event.name}". Staffing requirements (100%) have been fulfilled. The Host (${event.organiserName}) and ${crewMembers.length} accepted crew members are connected for shift coordination.`,
          timestamp: 'Just now',
        },
      ],
    };

    setEventGroups((prev) => [newGroup, ...prev]);
    setActiveChatGroup(newGroup);
    showToast(`Official Shift Coordination Group created for "${event.name}"!`);

    // Auto store to Supabase
    EvencifyApi.createCoordinationGroup(newGroup).catch((err) =>
      console.error('Supabase createCoordinationGroup error:', err)
    );
  };

  // Send message in an event coordination group
  const handleSendMessageToGroup = (groupId: string, content: string) => {
    const senderId =
      currentRole === 'admin'
        ? currentAdminProfile.id
        : currentRole === 'organiser'
        ? currentOrganiserProfile.id || 'org-1'
        : currentCrewProfile.id;

    const senderName =
      currentRole === 'admin'
        ? 'Platform Administrator'
        : currentRole === 'organiser'
        ? currentOrganiserProfile.companyName || currentOrganiserProfile.name
        : currentCrewProfile.name;

    const newMessage = {
      id: `msg-${Date.now()}`,
      groupId,
      senderId,
      senderName,
      senderRole: currentRole as 'admin' | 'organiser' | 'crew',
      content,
      timestamp: 'Just now',
    };

    setEventGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            messages: [...g.messages, newMessage],
          };
        }
        return g;
      })
    );

    setActiveChatGroup((prev) => {
      if (prev && prev.id === groupId) {
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      }
      return prev;
    });

    // Auto store message in Supabase
    EvencifyApi.sendCoordinationMessage({
      id: newMessage.id,
      groupId: newMessage.groupId,
      senderId: newMessage.senderId,
      senderName: newMessage.senderName,
      senderRole: newMessage.senderRole,
      content: newMessage.content,
      timestamp: newMessage.timestamp,
    }).catch((err) => console.error('Supabase sendCoordinationMessage error:', err));
  };

  const handleScrollToSection = (sectionId: string) => {
    const targetId = sectionId === 'how-it-works' || sectionId === 'trust-safety' ? 'trust' : sectionId;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-black selection:bg-[#FED000] selection:text-black">
      {/* Production-Grade Technical SEO Head (Meta, Title, JSON-LD Schemas, Open Graph, Twitter) */}
      <SEOHead seo={currentSeo} />

      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-black px-5 py-3 text-xs font-black text-[#FED000] border-2 border-black flex items-center gap-2 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-[#FED000] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar
        currentRole={currentRole}
        authenticatedRole={authenticatedRole}
        userEmail={activeUserEmail}
        userName={activeUserName || 'Ananya Sharma'}
        currentUser={
          activeUserEmail
            ? {
                id: authenticatedRole === 'crew' ? currentCrewProfile.id : currentOrganiserProfile.id,
                email: activeUserEmail,
                name: activeUserName || 'Ananya Sharma',
                role: authenticatedRole,
              }
            : null
        }
        userAvatar={authenticatedRole === 'crew' ? currentCrewProfile.photoUrl : undefined}
        onSelectRole={handleSelectRole}
        onOpenAuthModal={(role, mode) => handleOpenAuth(role, mode)}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        onOpenNotifications={() => setNotificationDrawerOpen(true)}
        onNavigateSection={handleScrollToSection}
        onNavigateCrewTab={(tab) => {
          setActiveCrewTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateOrganiserTab={(tab) => {
          setActiveOrganiserTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenProfile={() => {
          const role = authenticatedRole || (currentRole !== 'visitor' ? currentRole : 'crew');
          if (role === 'crew') {
            setCrewOnboardingOpen(true);
          } else if (role === 'organiser') {
            setOrganiserOnboardingOpen(true);
          } else if (role === 'admin') {
            setCurrentRole('admin');
            showToast('Administrator profile: Console is active.');
          }
        }}
      />

      {/* Main Content Areas */}
      <main className={`flex-1 ${currentRole !== 'visitor' ? 'pt-24 sm:pt-28' : ''}`}>
        {/* VIEW 1: VISITOR / PUBLIC WEBSITE (NO LOGIN REQUIRED) */}
        {currentRole === 'visitor' && (
          <div>
            <HeroSection
              onJoinCrew={() => handleOpenAuth('crew', 'signup')}
              onHireCrew={() => handleOpenAuth('organiser', 'signup')}
              onScrollToHowItWorks={() => handleScrollToSection('trust')}
            />

            <ForCrewSection onJoinCrew={() => handleOpenAuth('crew', 'signup')} />

            <ForOrganisersSection onHireCrew={() => handleOpenAuth('organiser', 'signup')} />

            <TrustSection onCreateAccount={() => handleOpenAuth('crew', 'signup')} />

            <FinalCtaSection
              onJoinCrew={() => handleOpenAuth('crew', 'signup')}
              onHireCrew={() => handleOpenAuth('organiser', 'signup')}
            />

            <FaqSection />
          </div>
        )}

        {/* VIEW 2: CREW PORTAL (AUTHENTICATED ONLY) */}
        {currentRole === 'crew' && (
          <CrewDashboardView
            crewProfile={currentCrewProfile}
            events={events}
            applications={applications}
            eventGroups={eventGroups}
            onOpenGroupChat={(grp) => setActiveChatGroup(grp)}
            onApplyToEvent={handleApplyToEvent}
            onOpenProfileModal={() => setCrewOnboardingOpen(true)}
            onOpenOnboarding={() => setCrewOnboardingOpen(true)}
            onLogout={handleLogout}
            activeTab={activeCrewTab}
            onTabChange={setActiveCrewTab}
          />
        )}

        {/* VIEW 3: ORGANISER COMMAND CENTER (AUTHENTICATED ONLY) */}
        {currentRole === 'organiser' && (
          <OrganiserDashboard
            events={events}
            applications={applications}
            crewList={crewList}
            organiserProfile={currentOrganiserProfile}
            eventGroups={eventGroups}
            onOpenGroupChat={(grp) => setActiveChatGroup(grp)}
            onOpenCreateEvent={() => setCreateEventModalOpen(true)}
            onOpenOnboarding={() => setOrganiserOnboardingOpen(true)}
            onSelectEvent={() => {}}
            onViewCrewProfile={(crew) => setSelectedCrewForDetail(crew)}
            onUpdateApplicationStatus={handleUpdateAppStatus}
            onUpdateEventStatus={handleUpdateEventStatus}
            onDeleteEvent={handleDeleteEvent}
            activeTab={activeOrganiserTab}
            onTabChange={setActiveOrganiserTab}
          />
        )}

        {/* VIEW 4: ADMIN PLATFORM MANAGEMENT (AUTHENTICATED ONLY) */}
        {currentRole === 'admin' && (
          <AdminDashboard
            crewList={crewList}
            events={events}
            applications={applications}
            organiserProfile={currentOrganiserProfile}
            adminProfile={currentAdminProfile}
            users={users}
            eventGroups={eventGroups}
            onCreateEventGroup={handleCreateEventGroup}
            onOpenGroupChat={(grp) => setActiveChatGroup(grp)}
            onToggleUserStatus={handleToggleUserStatus}
            onToggleUserVerification={handleToggleUserVerification}
            onUpdateUser={handleUpdateUser}
            onCreateUser={handleCreateUser}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
            onUpdateEventStatus={handleUpdateEventStatus}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onUpdateApplicationStatus={handleUpdateAppStatus}
            onDeleteApplication={handleDeleteApplication}
            onViewCrewProfile={(crew) => setSelectedCrewForDetail(crew)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Global Footer (Strictly Marketing Links + Operator Portal) */}
      <Footer
        onSelectRole={handleSelectRole}
        onNavigateSection={handleScrollToSection}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* Global Modals */}
      <RoleSelectorModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSelectRole={handleSelectRole}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        targetRole={authTargetRole}
        initialMode={authInitialMode}
        onAuthenticated={handleAuthenticated}
      />

      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
          showToast('All notifications marked as read');
        }}
        onSelectNotification={(notif) => {
          setNotificationDrawerOpen(false);
          if (notif.type === 'application') handleSelectRole('organiser');
        }}
      />

      {/* Crew Onboarding Modal */}
      <CrewOnboardingModal
        isOpen={crewOnboardingOpen}
        onClose={() => setCrewOnboardingOpen(false)}
        initialProfile={currentCrewProfile}
        onSaveProfile={(updated) => {
          setCurrentCrewProfile({ ...currentCrewProfile, ...updated });
          if (updated.name) setActiveUserName(updated.name);
          if (updated.email) setActiveUserEmail(updated.email);
          showToast('Crew profile updated successfully!');
        }}
      />

      {/* Organiser Onboarding Modal */}
      <OrganiserOnboardingModal
        isOpen={organiserOnboardingOpen}
        onClose={() => setOrganiserOnboardingOpen(false)}
        initialProfile={currentOrganiserProfile}
        onSaveProfile={(updated) => {
          setCurrentOrganiserProfile({ ...currentOrganiserProfile, ...updated });
          if (updated.companyName) setActiveUserName(updated.companyName);
          else if (updated.name) setActiveUserName(updated.name);
          if (updated.email) setActiveUserEmail(updated.email);
          showToast('Organiser company profile updated successfully!');
        }}
      />

      {/* Create Event Modal (Organiser) */}
      <CreateEventModal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        onEventCreated={handleEventCreated}
        organiserName={currentOrganiserProfile.companyName}
      />

      {/* Crew Profile Inspector Modal */}
      <CrewProfileModal
        isOpen={!!selectedCrewForDetail}
        onClose={() => setSelectedCrewForDetail(null)}
        crew={selectedCrewForDetail}
        onInvite={(crew) => {
          showToast(`Direct invitation sent to ${crew.name}!`);
        }}
      />

      {/* Event Shift Coordination Chat Modal (Admin, Organiser, and Hired Crew) */}
      {activeChatGroup && (
        <EventCoordinationChatModal
          isOpen={!!activeChatGroup}
          onClose={() => setActiveChatGroup(null)}
          group={activeChatGroup}
          currentUser={{
            id:
              currentRole === 'admin'
                ? currentAdminProfile.id
                : currentRole === 'organiser'
                ? currentOrganiserProfile.id || 'org-1'
                : currentCrewProfile.id,
            name:
              currentRole === 'admin'
                ? 'Platform Administrator'
                : currentRole === 'organiser'
                ? currentOrganiserProfile.companyName || currentOrganiserProfile.name
                : currentCrewProfile.name,
            role: currentRole,
            photo: currentRole === 'crew' ? currentCrewProfile.photo : undefined,
          }}
          onSendMessage={handleSendMessageToGroup}
        />
      )}
    </div>
  );
}
