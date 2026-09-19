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
  isCrewProfileComplete,
  isOrganiserProfileComplete,
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
  EMPTY_CREW_PROFILE,
  EMPTY_ORGANISER_PROFILE,
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
  const [authenticatedRole, setAuthenticatedRole] = useState<UserRole>('visitor');
  const [activeUserEmail, setActiveUserEmail] = useState<string>('');
  const [activeUserName, setActiveUserName] = useState<string>('');

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
  const [crewOnboardingMandatory, setCrewOnboardingMandatory] = useState(false);
  const [organiserOnboardingOpen, setOrganiserOnboardingOpen] = useState(false);
  const [organiserOnboardingMandatory, setOrganiserOnboardingMandatory] = useState(false);
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

  // Dedicated automatic database synchronizer (runs silently in the background)
  const syncDatabase = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const [dbEvents, dbCrew, dbApps, dbGroups, dbUsers, dbNotifs] = await Promise.allSettled([
        EvencifyApi.getEvents(),
        EvencifyApi.getCrewProfiles(),
        EvencifyApi.getApplications(),
        EvencifyApi.getCoordinationGroups(),
        EvencifyApi.getUsers(),
        EvencifyApi.getNotifications(),
      ]);

      if (dbEvents.status === 'fulfilled') {
        setEvents(dbEvents.value);
      }
      if (dbCrew.status === 'fulfilled' && dbCrew.value.length > 0) {
        setCrewList(dbCrew.value);
        setCurrentCrewProfile((prev) => {
          const match = dbCrew.value.find((c) => c.email === activeUserEmail || c.id === prev.id);
          return match || prev;
        });
      }
      const syncEmail = activeUserEmail || (() => {
        try {
          const u = JSON.parse(localStorage.getItem('evencify_active_user') || '{}');
          return u.email || '';
        } catch { return ''; }
      })();

      if (syncEmail) {
        try {
          const [dbOrg, dbCrewProf] = await Promise.all([
            EvencifyApi.getOrganiserProfile(syncEmail),
            EvencifyApi.getCrewProfile(syncEmail),
          ]);
          if (dbOrg) setCurrentOrganiserProfile(dbOrg);
          if (dbCrewProf) setCurrentCrewProfile(dbCrewProf);
        } catch {
          // ignore profile sync error
        }
      }
      if (dbApps.status === 'fulfilled') {
        setApplications(dbApps.value);
      }
      if (dbGroups.status === 'fulfilled') {
        setEventGroups(dbGroups.value);
        setActiveChatGroup((prev) => {
          if (!prev) return null;
          return dbGroups.value.find((g) => g.id === prev.id) || prev;
        });
      }
      if (dbUsers.status === 'fulfilled' && dbUsers.value.length > 0) {
        setUsers(dbUsers.value);
      }
      if (dbNotifs.status === 'fulfilled') {
        setNotifications(dbNotifs.value);
      }
    } catch (err) {
      console.error('Supabase background sync error:', err);
    }
  };

  // Secure Admin Access: via /admin or /admin-login URL or discrete shortcut (Ctrl+Shift+A / Cmd+Shift+A)
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (path === '/admin' || path === '/admin-login' || path === '/operator' || params.get('admin') === 'true') {
        setAdminLoginOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setAdminLoginOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const verifyCrewProfileCompleteness = (profile: CrewProfile | null) => {
    if (!profile || !isCrewProfileComplete(profile)) {
      setCrewOnboardingMandatory(true);
      setCrewOnboardingOpen(true);
    } else {
      setCrewOnboardingMandatory(false);
    }
  };

  const verifyOrganiserProfileCompleteness = (profile: OrganiserProfile | null) => {
    if (!profile || !isOrganiserProfileComplete(profile)) {
      setOrganiserOnboardingMandatory(true);
      setOrganiserOnboardingOpen(true);
    } else {
      setOrganiserOnboardingMandatory(false);
    }
  };

  // Live Supabase auto-sync, polling timer, focus sync, & real-time Postgres updates
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;
    syncDatabase();

    // Check active session immediately on mount
    EvencifyApi.getCurrentSession().then((sessionUser) => {
      if (sessionUser && isMounted) {
        setActiveUserEmail(sessionUser.email);
        setActiveUserName(sessionUser.name);
        setAuthenticatedRole(sessionUser.role);
        setCurrentRole(sessionUser.role);
        if (sessionUser.role === 'organiser') {
          EvencifyApi.getOrganiserProfile(sessionUser.email).then((org) => {
            if (isMounted) {
              if (org) setCurrentOrganiserProfile(org);
              verifyOrganiserProfileCompleteness(org);
            }
          });
        } else if (sessionUser.role === 'crew') {
          EvencifyApi.getCrewProfile(sessionUser.email).then((cr) => {
            if (isMounted) {
              if (cr) setCurrentCrewProfile(cr);
              verifyCrewProfileCompleteness(cr);
            }
          });
        }
      }
    });

    // Setup Postgres realtime listeners across all live public tables
    const channel = supabase
      .channel('evencify-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, async () => {
        const freshEvents = await EvencifyApi.getEvents();
        if (isMounted) setEvents(freshEvents);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, async () => {
        const freshApps = await EvencifyApi.getApplications();
        if (isMounted) setApplications(freshApps);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coordination_messages' }, async () => {
        const freshGroups = await EvencifyApi.getCoordinationGroups();
        if (isMounted) {
          setEventGroups(freshGroups);
          setActiveChatGroup((prev) => {
            if (!prev) return null;
            return freshGroups.find((g) => g.id === prev.id) || prev;
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async (payload) => {
        const freshUsers = await EvencifyApi.getUsers();
        if (isMounted && freshUsers && freshUsers.length > 0) setUsers(freshUsers);

        // Check if the changed profile belongs to the active user
        const targetEmail = activeUserEmail || (() => {
          try {
            return JSON.parse(localStorage.getItem('evencify_active_user') || '{}')?.email || '';
          } catch { return ''; }
        })();

        if (targetEmail && isMounted) {
          const updated = payload.new as any;
          if (updated && updated.email?.toLowerCase() === targetEmail.toLowerCase()) {
            if (updated.full_name) setActiveUserName(updated.full_name);
          }
          if (currentRole === 'crew') {
            const freshCrew = await EvencifyApi.getCrewProfile(targetEmail);
            if (freshCrew && isMounted) setCurrentCrewProfile(freshCrew);
          } else if (currentRole === 'organiser') {
            const freshOrg = await EvencifyApi.getOrganiserProfile(targetEmail);
            if (freshOrg && isMounted) setCurrentOrganiserProfile(freshOrg);
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crew_profiles' }, async () => {
        const freshCrew = await EvencifyApi.getCrewProfiles();
        if (freshCrew.length > 0 && isMounted) setCrewList(freshCrew);

        const targetEmail = activeUserEmail || (() => {
          try {
            return JSON.parse(localStorage.getItem('evencify_active_user') || '{}')?.email || '';
          } catch { return ''; }
        })();

        if (targetEmail && isMounted) {
          const freshCrewProf = await EvencifyApi.getCrewProfile(targetEmail);
          if (freshCrewProf && isMounted) setCurrentCrewProfile(freshCrewProf);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organiser_profiles' }, async () => {
        const freshUsers = await EvencifyApi.getUsers();
        if (freshUsers.length > 0 && isMounted) setUsers(freshUsers);

        const targetEmail = activeUserEmail || (() => {
          try {
            return JSON.parse(localStorage.getItem('evencify_active_user') || '{}')?.email || '';
          } catch { return ''; }
        })();

        if (targetEmail && isMounted) {
          const freshOrgProf = await EvencifyApi.getOrganiserProfile(targetEmail);
          if (freshOrgProf && isMounted) setCurrentOrganiserProfile(freshOrgProf);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, async () => {
        const freshNotifs = await EvencifyApi.getNotifications();
        if (isMounted) setNotifications(freshNotifs);
      })
      .subscribe();

    // Automatic periodic background sync (every 20 seconds)
    const syncInterval = setInterval(() => {
      if (isMounted) {
        syncDatabase();
      }
    }, 20000);

    // Automatic sync whenever tab/window regains focus or visibility
    const handleFocusSync = () => {
      if (document.visibilityState === 'visible' && isMounted) {
        syncDatabase();
      }
    };
    window.addEventListener('focus', handleFocusSync);
    document.addEventListener('visibilitychange', handleFocusSync);

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

        if (userEmail) {
          if (userRole === 'organiser') {
            EvencifyApi.getOrganiserProfile(userEmail).then((org) => {
              if (isMounted) {
                if (org) setCurrentOrganiserProfile(org);
                verifyOrganiserProfileCompleteness(org);
              }
            });
          } else if (userRole === 'crew') {
            EvencifyApi.getCrewProfile(userEmail).then((cr) => {
              if (isMounted) {
                if (cr) setCurrentCrewProfile(cr);
                verifyCrewProfileCompleteness(cr);
              }
            });
          }
        }
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

        if (userEmail) {
          if (userRole === 'organiser') {
            EvencifyApi.getOrganiserProfile(userEmail).then((org) => {
              if (isMounted) {
                if (org) setCurrentOrganiserProfile(org);
                verifyOrganiserProfileCompleteness(org);
              }
            });
          } else if (userRole === 'crew') {
            EvencifyApi.getCrewProfile(userEmail).then((cr) => {
              if (isMounted) {
                if (cr) setCurrentCrewProfile(cr);
                verifyCrewProfileCompleteness(cr);
              }
            });
          }
        }
      }
    });

    return () => {
      isMounted = false;
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocusSync);
      document.removeEventListener('visibilitychange', handleFocusSync);
      supabase.removeChannel(channel);
      authListener?.subscription?.unsubscribe();
    };
  }, [activeUserEmail]);

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

  const handleAuthenticated = (role: UserRole, email: string, name?: string) => {
    setActiveUserEmail(email);
    setAuthenticatedRole(role);
    setCurrentRole(role);

    const emailName = email.split('@')[0];
    const defaultName = name || (emailName ? emailName.charAt(0).toUpperCase() + emailName.slice(1) : 'User');

    if (role === 'crew') {
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === 'crew');
      const existingCrew = crewList.find((c) => c.email.toLowerCase() === email.toLowerCase());
      const finalName = name || existing?.name || existingCrew?.name || defaultName;
      setActiveUserName(finalName);
      if (existingCrew) {
        setCurrentCrewProfile(existingCrew);
        verifyCrewProfileCompleteness(existingCrew);
      } else {
        const freshCrew: CrewProfile = {
          ...EMPTY_CREW_PROFILE,
          id: `crew-${Date.now()}`,
          name: finalName,
          email: email,
        };
        setCurrentCrewProfile(freshCrew);
        verifyCrewProfileCompleteness(freshCrew);
      }
      EvencifyApi.getCrewProfile(email).then((cr) => {
        if (cr) {
          setCurrentCrewProfile(cr);
          verifyCrewProfileCompleteness(cr);
        }
      });
      showToast(`Welcome! Signed in as ${finalName} (Crew)`);
    } else if (role === 'organiser') {
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === 'organiser');
      const finalName = name || existing?.name || currentOrganiserProfile.companyName || defaultName;
      setActiveUserName(finalName);
      const initialOrg: OrganiserProfile = {
        ...EMPTY_ORGANISER_PROFILE,
        id: `org-${Date.now()}`,
        name: finalName,
        companyName: finalName,
        email: email,
      };
      setCurrentOrganiserProfile(initialOrg);
      verifyOrganiserProfileCompleteness(initialOrg);
      EvencifyApi.getOrganiserProfile(email).then((org) => {
        if (org) {
          setCurrentOrganiserProfile(org);
          verifyOrganiserProfileCompleteness(org);
        }
      });
      showToast(`Welcome! Signed in as ${finalName} (Organiser)`);
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
    setCrewOnboardingMandatory(false);
    setCrewOnboardingOpen(false);
    setOrganiserOnboardingMandatory(false);
    setOrganiserOnboardingOpen(false);
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

    // Persist to Supabase
    EvencifyApi.toggleUserStatus(userId).catch((err) => {
      console.error('Supabase toggleUserStatus error:', err);
      showToast(err instanceof Error ? err.message : 'Failed to update user status in DB');
    });
  };

  // Admin: Toggle user verification status
  const handleToggleUserVerification = (userId: string) => {
    let nowVerified = false;
    let userName = '';
    let targetRole: string = 'crew';
    let chosenBadge = '';

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          nowVerified = !u.isVerified;
          userName = u.name;
          targetRole = u.role;
          const defaultBadge =
            u.role === 'organiser'
              ? 'Business Verified'
              : u.role === 'admin'
              ? 'Platform Superadmin'
              : 'Verified Pro';
          chosenBadge = nowVerified
            ? u.verificationBadge && u.verificationBadge !== 'Unverified' && u.verificationBadge !== 'Pending Verification'
              ? u.verificationBadge
              : defaultBadge
            : 'Unverified';

          return {
            ...u,
            isVerified: nowVerified,
            verificationBadge: chosenBadge,
          };
        }
        return u;
      })
    );

    if (targetRole === 'organiser') {
      setCurrentOrganiserProfile((prev) => ({
        ...prev,
        hasUdyam: nowVerified,
      }));
    }

    showToast(`${userName || 'User'} marked as ${nowVerified ? 'Verified' : 'Unverified'}.`);

    // Persist to Supabase
    EvencifyApi.updateUserVerification(userId, nowVerified, chosenBadge).catch((err) => {
      console.error('Supabase updateUserVerification error:', err);
    });
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
              photoUrl: updatedData.avatarUrl || '',
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

    // Persist to Supabase
    EvencifyApi.updateUserAccount(originalUserId, updatedData).catch((err) => {
      console.error('Supabase updateUserAccount error:', err);
    });
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
          photoUrl: newUser.avatarUrl || '',
          systemRating: newUser.systemRating || 4.8,
          completedEventsCount: newUser.completedEventsCount || 0,
          expectedPay: newUser.expectedPay || '₹2,000 / shift',
        },
        ...prev,
      ]);
    }

    showToast(`New user profile provisioned for ${newUser.name}.`);

    // Persist to Supabase
    EvencifyApi.createUserAccount(newUser).catch((err) => {
      console.error('Supabase createUserAccount error:', err);
    });
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
    EvencifyApi.deleteApplication(appId).catch((err) => {
      console.error('Supabase delete application error:', err);
    });
  };

  // Admin user role update
  const handleUpdateUserRole = (userId: string, newRole: 'crew' | 'organiser' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast(`User role updated to ${newRole}`);

    EvencifyApi.updateUserRole(userId, newRole).catch((err) => {
      console.error('Supabase update user role error:', err);
      showToast(err instanceof Error ? err.message : 'Role update failed');
    });
  };

  // Admin user delete
  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setCrewList((prev) => prev.filter((c) => c.id !== userId));
    showToast('User account permanently deleted.');

    EvencifyApi.deleteUser(userId).catch((err) => {
      console.error('Supabase delete user error:', err);
      showToast(err instanceof Error ? err.message : 'Delete failed');
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
  const handleSendMessageToGroup = (
    groupId: string,
    messagePayload: { content: string; isAnnouncement?: boolean } | string
  ) => {
    const content =
      typeof messagePayload === 'string'
        ? messagePayload
        : messagePayload?.content || '';
    const isAnnouncement =
      typeof messagePayload === 'object' && !!messagePayload?.isAnnouncement;

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
      isAnnouncement,
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
      isAnnouncement: newMessage.isAnnouncement,
    }).catch((err) => console.error('Supabase sendCoordinationMessage error:', err));
  };

  // Discreate / delete an event coordination group (Admin action)
  const handleDiscreateGroup = (groupId: string) => {
    setEventGroups((prev) => prev.filter((g) => g.id !== groupId));
    setActiveChatGroup((prev) => (prev?.id === groupId ? null : prev));
    showToast('Event coordination group has been discreated and removed.');

    EvencifyApi.deleteCoordinationGroup(groupId).catch((err) =>
      console.error('Supabase deleteCoordinationGroup error:', err)
    );
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
        userName={activeUserName}
        currentUser={
          activeUserEmail
            ? {
                id: authenticatedRole === 'crew' ? currentCrewProfile.id : currentOrganiserProfile.id,
                email: activeUserEmail,
                name: activeUserName || (authenticatedRole === 'crew' ? 'Crew Member' : 'Organiser'),
                role: authenticatedRole,
              }
            : null
        }
        userAvatar={authenticatedRole === 'crew' ? currentCrewProfile.photoUrl : undefined}
        onSelectRole={handleSelectRole}
        onOpenAuthModal={(role, mode) => handleOpenAuth(role, mode)}
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
              onGetStarted={() => handleOpenAuth(undefined, 'signup')}
              onJoinCrew={() => handleOpenAuth(undefined, 'signup')}
              onHireCrew={() => handleOpenAuth(undefined, 'signup')}
              onScrollToHowItWorks={() => handleScrollToSection('trust')}
            />

            <ForCrewSection onJoinCrew={() => handleOpenAuth(undefined, 'signup')} />

            <ForOrganisersSection onHireCrew={() => handleOpenAuth(undefined, 'signup')} />

            <TrustSection onCreateAccount={() => handleOpenAuth(undefined, 'signup')} />

            <FinalCtaSection
              onJoinCrew={() => handleOpenAuth(undefined, 'signup')}
              onHireCrew={() => handleOpenAuth(undefined, 'signup')}
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
            onDiscreateEventGroup={handleDiscreateGroup}
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

      {/* Global Footer (Marketing & Governance Links) */}
      <Footer
        onSelectRole={handleSelectRole}
        onNavigateSection={handleScrollToSection}
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
        isMandatory={crewOnboardingMandatory}
        onClose={() => {
          if (!crewOnboardingMandatory || isCrewProfileComplete(currentCrewProfile)) {
            setCrewOnboardingOpen(false);
            setCrewOnboardingMandatory(false);
          } else {
            showToast('Please complete your profile to continue.');
          }
        }}
        initialProfile={currentCrewProfile}
        onSaveProfile={async (updated) => {
          const merged = { ...currentCrewProfile, ...updated };
          setCurrentCrewProfile(merged);
          if (updated.name) setActiveUserName(updated.name);
          if (updated.email) setActiveUserEmail(updated.email);

          const targetId = currentCrewProfile.id || activeUserEmail || updated.email || 'crew-1';
          try {
            await EvencifyApi.updateCrewProfile(targetId, updated);
            await syncDatabase();
            if (isCrewProfileComplete(merged)) {
              setCrewOnboardingMandatory(false);
              setCrewOnboardingOpen(false);
              showToast('Crew profile saved & verified!');
            } else {
              showToast('Profile updated. Please complete remaining required fields.');
            }
          } catch (err) {
            console.error('Failed to save crew profile to Supabase:', err);
            showToast('Crew profile updated.');
          }
        }}
      />

      {/* Organiser Onboarding Modal */}
      <OrganiserOnboardingModal
        isOpen={organiserOnboardingOpen}
        isMandatory={organiserOnboardingMandatory}
        onClose={() => {
          if (!organiserOnboardingMandatory || isOrganiserProfileComplete(currentOrganiserProfile)) {
            setOrganiserOnboardingOpen(false);
            setOrganiserOnboardingMandatory(false);
          } else {
            showToast('Please complete your profile to continue.');
          }
        }}
        initialProfile={currentOrganiserProfile}
        onSaveProfile={async (updated) => {
          const merged = { ...currentOrganiserProfile, ...updated };
          setCurrentOrganiserProfile(merged);
          if (updated.companyName) setActiveUserName(updated.companyName);
          else if (updated.name) setActiveUserName(updated.name);
          if (updated.email) setActiveUserEmail(updated.email);

          const targetId = currentOrganiserProfile.id || activeUserEmail || updated.email || 'org-1';
          try {
            await EvencifyApi.updateOrganiserProfile(targetId, updated);
            await syncDatabase();
            if (isOrganiserProfileComplete(merged)) {
              setOrganiserOnboardingMandatory(false);
              setOrganiserOnboardingOpen(false);
              showToast('Organiser profile saved & verified!');
            } else {
              showToast('Profile updated. Please complete remaining required fields.');
            }
          } catch (err) {
            console.error('Failed to save organiser profile to Supabase:', err);
            showToast('Organiser profile updated.');
          }
        }}
      />

      {/* Create Event Modal (Organiser) */}
      <CreateEventModal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        onEventCreated={handleEventCreated}
        organiserName={currentOrganiserProfile.companyName}
        organiserId={currentOrganiserProfile.id}
      />

      {/* Crew Profile Inspector Modal */}
      <CrewProfileModal
        isOpen={!!selectedCrewForDetail}
        onClose={() => setSelectedCrewForDetail(null)}
        crew={selectedCrewForDetail}
        onInvite={(crew) => {
          showToast(`Direct invitation sent to ${crew.name}!`);
        }}
        currentUserRole={currentRole}
        currentUserId={
          currentRole === 'admin'
            ? 'admin-1'
            : currentRole === 'crew'
            ? currentCrewProfile.id
            : currentOrganiserProfile.id
        }
        currentUserEmail={
          currentRole === 'admin'
            ? 'admin@apexevents.com'
            : currentRole === 'crew'
            ? currentCrewProfile.email
            : currentOrganiserProfile.email
        }
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
          onDiscreateGroup={handleDiscreateGroup}
        />
      )}
    </div>
  );
}
