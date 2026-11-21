import React, { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
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
import {
  checkEventOwnership,
  canEditEvent,
  canDeleteEvent,
  canManageEventStatus,
  canManageApplication,
  canCompleteAndRateEvent,
  canCreateEvent,
} from './utils/permissions';
import {
  hasUserCompletedOnboarding,
  markUserOnboardingCompleted,
} from './utils/onboarding';

// SEO Metadata & Public Routing
import { getSEOData, getSEODataFromRoute } from './services/seoData';
import {
  useAppRoute,
  navigateTo,
  AUTH_OR_PORTAL_SHORTCUT_ROUTES,
} from './services/router';
import { SEOHead } from './components/seo/SEOHead';

// Layout & Global Components (eager for immediate homepage render)
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Landing Page Components (Strictly Informational / Marketing)
import { HeroSection } from './components/landing/HeroSection';
import { ForCrewSection } from './components/landing/ForCrewSection';
import { ForOrganisersSection } from './components/landing/ForOrganisersSection';
import { TrustSection } from './components/landing/TrustSection';
import { FinalCtaSection } from './components/landing/FinalCtaSection';
import { FaqSection } from './components/landing/FaqSection';

// Lazy-loaded SEO Sub-pages (keeps initial mobile homepage bundle lean)
const EventsDiscoveryPage = lazy(() =>
  import('./components/seo/pages/EventsDiscoveryPage').then((m) => ({ default: m.EventsDiscoveryPage }))
);
const CityEventsPage = lazy(() =>
  import('./components/seo/pages/CityEventsPage').then((m) => ({ default: m.CityEventsPage }))
);
const StateEventsPage = lazy(() =>
  import('./components/seo/pages/StateEventsPage').then((m) => ({ default: m.StateEventsPage }))
);
const CategoryEventsPage = lazy(() =>
  import('./components/seo/pages/CategoryEventsPage').then((m) => ({ default: m.CategoryEventsPage }))
);
const CityCategoryEventsPage = lazy(() =>
  import('./components/seo/pages/CityCategoryEventsPage').then((m) => ({ default: m.CityCategoryEventsPage }))
);
const StateCategoryEventsPage = lazy(() =>
  import('./components/seo/pages/StateCategoryEventsPage').then((m) => ({ default: m.StateCategoryEventsPage }))
);
const SingleEventPage = lazy(() =>
  import('./components/seo/pages/SingleEventPage').then((m) => ({ default: m.SingleEventPage }))
);
const DateEventsPage = lazy(() =>
  import('./components/seo/pages/DateEventsPage').then((m) => ({ default: m.DateEventsPage }))
);
const NearMeEventsPage = lazy(() =>
  import('./components/seo/pages/NearMeEventsPage').then((m) => ({ default: m.NearMeEventsPage }))
);
const CrewJobsPage = lazy(() =>
  import('./components/seo/pages/CrewJobsPage').then((m) => ({ default: m.CrewJobsPage }))
);
const OrganiseEventPage = lazy(() =>
  import('./components/seo/pages/OrganiseEventPage').then((m) => ({ default: m.OrganiseEventPage }))
);
const StaticPage = lazy(() =>
  import('./components/seo/pages/StaticPages').then((m) => ({ default: m.StaticPage }))
);
const SitemapPage = lazy(() =>
  import('./components/seo/pages/SitemapPage').then((m) => ({ default: m.SitemapPage }))
);
const RobotsPage = lazy(() =>
  import('./components/seo/pages/RobotsPage').then((m) => ({ default: m.RobotsPage }))
);

// Lazy-loaded Modals (loaded on demand when triggered)
const RoleSelectorModal = lazy(() =>
  import('./components/RoleSelectorModal').then((m) => ({ default: m.RoleSelectorModal }))
);
const AuthModal = lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const DirectLinksModal = lazy(() =>
  import('./components/DirectLinksModal').then((m) => ({ default: m.DirectLinksModal }))
);
const NotificationDrawer = lazy(() =>
  import('./components/NotificationDrawer').then((m) => ({ default: m.NotificationDrawer }))
);
const EventCoordinationChatModal = lazy(() =>
  import('./components/EventCoordinationChatModal').then((m) => ({ default: m.EventCoordinationChatModal }))
);

// Lazy-loaded Authenticated Role Dashboards & Modals
const CrewDashboardView = lazy(() =>
  import('./components/crew/CrewDashboardView').then((m) => ({ default: m.CrewDashboardView }))
);
const CrewOnboardingModal = lazy(() =>
  import('./components/crew/CrewOnboardingModal').then((m) => ({ default: m.CrewOnboardingModal }))
);
const CrewProfileModal = lazy(() =>
  import('./components/crew/CrewProfileModal').then((m) => ({ default: m.CrewProfileModal }))
);
const OrganiserDashboard = lazy(() =>
  import('./components/organiser/OrganiserDashboard').then((m) => ({ default: m.OrganiserDashboard }))
);
const CreateEventModal = lazy(() =>
  import('./components/organiser/CreateEventModal').then((m) => ({ default: m.CreateEventModal }))
);
const OrganiserOnboardingModal = lazy(() =>
  import('./components/organiser/OrganiserOnboardingModal').then((m) => ({ default: m.OrganiserOnboardingModal }))
);
const AdminDashboard = lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

/**
 * Checks whether an event was created by or belongs to the specified organiser.
 * Evaluates organiser ID, profile email, active login email, and event metadata.
 */
export const isEventOwner = (
  event: EventItem | null | undefined,
  organiser: { id?: string; email?: string } | null | undefined,
  activeEmail?: string
): boolean => {
  if (!event) return false;
  const currentId = (organiser?.id || '').trim();
  const currentEmail = (organiser?.email || activeEmail || '').toLowerCase().trim();
  const activeUser = (activeEmail || '').toLowerCase().trim();

  const eventOrgId = (event.organiserId || '').trim();
  const eventOrgEmail = ((event as any).organiserEmail || '').toLowerCase().trim();

  // 1. Direct ID matching
  if (currentId && eventOrgId && currentId === eventOrgId) {
    return true;
  }

  // 2. Profile email matching
  if (currentEmail) {
    if (eventOrgEmail && eventOrgEmail === currentEmail) return true;
    if (eventOrgId && eventOrgId.toLowerCase() === currentEmail) return true;
  }

  // 3. Active session email matching
  if (activeUser) {
    if (eventOrgEmail && eventOrgEmail === activeUser) return true;
    if (eventOrgId && eventOrgId.toLowerCase() === activeUser) return true;
  }

  return false;
};

export default function App() {
  const { route } = useAppRoute();

  // Navigation & Role State (Only 3 active roles + visitor)
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');
  const [authenticatedRole, setAuthenticatedRole] = useState<UserRole>('visitor');
  const [activeUserEmail, setActiveUserEmail] = useState<string>('');
  const [activeUserName, setActiveUserName] = useState<string>('');

  const activeUserEmailRef = useRef<string>('');
  activeUserEmailRef.current = activeUserEmail;

  const currentRoleRef = useRef<UserRole>(currentRole);
  currentRoleRef.current = currentRole;

  const isLoggingOutRef = useRef<boolean>(false);

  // Domain State
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [crewList, setCrewList] = useState<CrewProfile[]>(INITIAL_CREW_PROFILES);
  const [applications, setApplications] = useState<CrewApplication[]>(INITIAL_APPLICATIONS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Active Profiles
  const [currentCrewProfile, setCurrentCrewProfile] = useState<CrewProfile>(EMPTY_CREW_PROFILE);
  const [currentOrganiserProfile, setCurrentOrganiserProfile] = useState<OrganiserProfile>(
    EMPTY_ORGANISER_PROFILE
  );
  const [currentAdminProfile, setCurrentAdminProfile] = useState<AdminProfile>(INITIAL_ADMIN_PROFILE);

  // Modals visibility
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTargetRole, setAuthTargetRole] = useState<UserRole | undefined>(undefined);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('signup');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Specific role modals
  const [crewOnboardingOpen, setCrewOnboardingOpen] = useState(false);
  const [crewOnboardingMandatory, setCrewOnboardingMandatory] = useState(false);
  const [organiserOnboardingOpen, setOrganiserOnboardingOpen] = useState(false);
  const [organiserOnboardingMandatory, setOrganiserOnboardingMandatory] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [pendingPostAuthAction, setPendingPostAuthAction] = useState<string | null>(null);
  const [directLinksOpen, setDirectLinksOpen] = useState(false);

  // Dynamic SEO Metadata reactively tuned to active view & route
  const currentSeo = useMemo(() => {
    if (authModalOpen) {
      if (authInitialMode === 'login') {
        if (authTargetRole === 'crew') return getSEOData({ type: 'crew-login' });
        if (authTargetRole === 'organiser') return getSEOData({ type: 'organiser-login' });
        return getSEOData({ type: 'login' });
      } else {
        if (authTargetRole === 'crew') return getSEOData({ type: 'crew-signup' });
        if (authTargetRole === 'organiser') return getSEOData({ type: 'organiser-signup' });
        return getSEOData({ type: 'signup' });
      }
    }
    if (createEventModalOpen) {
      return getSEOData({ type: 'create-event' });
    }
    if (directLinksOpen) {
      return getSEOData({ type: 'direct-links' });
    }
    if (currentRole === 'admin') {
      return getSEOData({ type: 'admin' });
    }
    if (currentRole === 'crew') {
      return getSEOData({ type: 'crew-portal' });
    }
    if (currentRole === 'organiser') {
      return getSEOData({ type: 'organiser-portal' });
    }
    return getSEODataFromRoute(route, events);
  }, [
    authModalOpen,
    authInitialMode,
    authTargetRole,
    createEventModalOpen,
    directLinksOpen,
    currentRole,
    route,
    events,
  ]);

  const hasLeafSeoHead =
    currentRole === 'visitor' &&
    !authModalOpen &&
    !createEventModalOpen &&
    !directLinksOpen &&
    route.type !== 'home' &&
    !AUTH_OR_PORTAL_SHORTCUT_ROUTES.has(route.type) &&
    route.type !== 'not-found';

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

  // Open authentication modal with targeted role and mode
  const handleOpenAuth = (role?: UserRole, initialMode: 'login' | 'signup' = 'signup') => {
    setAuthTargetRole(role);
    setAuthInitialMode(initialMode);
    setAuthModalOpen(true);
  };

  // Direct URL Links & Deep Linking Listener
  // Supports:
  // - Direct Crew Login: ?auth=login&role=crew, ?login=crew, #crew-login, /crew/login
  // - Direct Crew Signup / Create Account: ?auth=signup&role=crew, ?signup=crew, #crew-signup, /crew/signup
  // - Direct Event/Organiser Login: ?auth=login&role=organiser, ?login=event, #event-login, /event/login
  // - Direct Event/Organiser Signup / Create Account: ?auth=signup&role=organiser, ?signup=event, #event-signup, /event/signup
  // - Direct Create Event: ?action=create-event, ?create-event=true, #create-event, /create-event
  // - Direct Crew Portal: ?role=crew, #crew, /crew
  // - Direct Organiser Portal: ?role=organiser, #events, /events, /organiser
  // - Admin Portal: /admin, /admin-login, ?admin=true, #admin
  useEffect(() => {
    const handleUrlRouting = () => {
      if (isLoggingOutRef.current) return;

      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      // 1. Admin route: Admin can login from anywhere via standard auth
      if (
        path === '/admin' ||
        path === '/admin-login' ||
        path === '/operator' ||
        params.get('admin') === 'true' ||
        hash === '#admin' ||
        hash === '#admin-login'
      ) {
        if (activeUserEmail && authenticatedRole === 'admin') {
          setCurrentRole('admin');
        } else {
          handleOpenAuth(undefined, 'login');
        }
        return;
      }

      // Check Direct Links Modal
      if (
        path === '/direct-links' ||
        params.get('modal') === 'direct-links' ||
        params.get('links') === 'true' ||
        hash === '#links' ||
        hash === '#direct-links'
      ) {
        setDirectLinksOpen(true);
        return;
      }

      // 2. Direct Create Event Modal
      const actionParam = params.get('action')?.toLowerCase() || params.get('modal')?.toLowerCase();
      const isCreateEvent =
        actionParam === 'create-event' ||
        actionParam === 'new-event' ||
        params.get('create-event') === 'true' ||
        params.get('new-event') === 'true' ||
        hash === '#create-event' ||
        hash === '#new-event' ||
        path === '/create-event' ||
        path === '/events/new';

      if (isCreateEvent) {
        if (activeUserEmail && authenticatedRole === 'organiser') {
          setCurrentRole('organiser');
          setCreateEventModalOpen(true);
        } else {
          setPendingPostAuthAction('create-event');
          handleOpenAuth('organiser', 'login');
          showToast('Sign in or register as an Organiser to create your event.');
        }
        return;
      }

      // 3. Resolve Target Role & Mode
      const authParam = params.get('auth')?.toLowerCase() || params.get('mode')?.toLowerCase();
      const roleParam = params.get('role')?.toLowerCase() || params.get('type')?.toLowerCase();
      const loginParam = params.get('login')?.toLowerCase();
      const signupParam = params.get('signup')?.toLowerCase();
      const viewParam = params.get('view')?.toLowerCase() || params.get('portal')?.toLowerCase();

      let targetRole: UserRole | undefined = undefined;
      let targetMode: 'login' | 'signup' | undefined = undefined;

      // URL Query: ?auth=...
      if (authParam === 'login' || authParam === 'signup') {
        targetMode = authParam;
      }

      if (roleParam === 'crew' || roleParam === 'worker') {
        targetRole = 'crew';
      } else if (
        roleParam === 'organiser' ||
        roleParam === 'organizer' ||
        roleParam === 'event' ||
        roleParam === 'host'
      ) {
        targetRole = 'organiser';
      }

      // URL Query: ?login=crew / ?login=organiser / ?login=event
      if (loginParam !== null) {
        targetMode = 'login';
        if (loginParam === 'crew') targetRole = 'crew';
        if (loginParam === 'organiser' || loginParam === 'organizer' || loginParam === 'event') targetRole = 'organiser';
      }

      // URL Query: ?signup=crew / ?signup=organiser / ?signup=event
      if (signupParam !== null) {
        targetMode = 'signup';
        if (signupParam === 'crew') targetRole = 'crew';
        if (signupParam === 'organiser' || signupParam === 'organizer' || signupParam === 'event') targetRole = 'organiser';
      }

      // Hash Shortcuts
      if (hash === '#crew-login' || hash === '#login-crew') {
        targetRole = 'crew';
        targetMode = 'login';
      } else if (hash === '#crew-signup' || hash === '#signup-crew') {
        targetRole = 'crew';
        targetMode = 'signup';
      } else if (
        hash === '#event-login' ||
        hash === '#organiser-login' ||
        hash === '#login-organiser' ||
        hash === '#login-event'
      ) {
        targetRole = 'organiser';
        targetMode = 'login';
      } else if (
        hash === '#event-signup' ||
        hash === '#organiser-signup' ||
        hash === '#signup-organiser' ||
        hash === '#signup-event'
      ) {
        targetRole = 'organiser';
        targetMode = 'signup';
      } else if (hash === '#login') {
        targetMode = 'login';
      } else if (hash === '#signup') {
        targetMode = 'signup';
      } else if (hash === '#crew' || hash === '#crew-portal') {
        if (activeUserEmail && authenticatedRole === 'crew') {
          setCurrentRole('crew');
        } else {
          targetRole = 'crew';
          targetMode = 'login';
        }
      } else if (hash === '#organiser' || hash === '#events' || hash === '#organiser-portal') {
        if (activeUserEmail && authenticatedRole === 'organiser') {
          setCurrentRole('organiser');
        } else {
          targetRole = 'organiser';
          targetMode = 'login';
        }
      }

      // Pathname Shortcuts (SPA routes)
      if (path === '/crew/login' || path === '/crew-login' || path === '/login/crew') {
        targetRole = 'crew';
        targetMode = 'login';
      } else if (path === '/crew/signup' || path === '/crew-signup' || path === '/signup/crew') {
        targetRole = 'crew';
        targetMode = 'signup';
      } else if (
        path === '/organiser/login' ||
        path === '/organizer/login' ||
        path === '/event/login' ||
        path === '/event-login' ||
        path === '/login/organiser'
      ) {
        targetRole = 'organiser';
        targetMode = 'login';
      } else if (
        path === '/organiser/signup' ||
        path === '/organizer/signup' ||
        path === '/event/signup' ||
        path === '/event-signup' ||
        path === '/signup/organiser'
      ) {
        targetRole = 'organiser';
        targetMode = 'signup';
      } else if (path === '/login') {
        targetMode = 'login';
      } else if (path === '/signup') {
        targetMode = 'signup';
      } else if (path === '/crew' || path === '/crew-dashboard') {
        if (activeUserEmail && authenticatedRole === 'crew') {
          setCurrentRole('crew');
        } else {
          targetRole = 'crew';
          targetMode = 'login';
        }
      } else if (path === '/organiser' || path === '/organizer') {
        if (activeUserEmail && authenticatedRole === 'organiser') {
          setCurrentRole('organiser');
        } else {
          targetRole = 'organiser';
          targetMode = 'login';
        }
      }

      // Dispatch modal or view update
      if (targetMode) {
        handleOpenAuth(targetRole, targetMode);
      } else if (targetRole && !activeUserEmail) {
        handleOpenAuth(targetRole, 'login');
      } else if (viewParam === 'crew' || roleParam === 'crew') {
        if (activeUserEmail && authenticatedRole === 'crew') {
          setCurrentRole('crew');
        } else {
          handleOpenAuth('crew', 'login');
        }
      } else if (
        viewParam === 'organiser' ||
        viewParam === 'organizer' ||
        roleParam === 'organiser' ||
        roleParam === 'organizer' ||
        roleParam === 'event'
      ) {
        if (activeUserEmail && authenticatedRole === 'organiser') {
          setCurrentRole('organiser');
        } else {
          handleOpenAuth('organiser', 'login');
        }
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);

    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, [activeUserEmail, authenticatedRole]);

  const verifyCrewProfileCompleteness = (profile: CrewProfile | null) => {
    // Only updates completeness indicator state; does NOT force open modal
    setCrewOnboardingMandatory(false);
  };

  const verifyOrganiserProfileCompleteness = (profile: OrganiserProfile | null) => {
    // Only updates completeness indicator state; does NOT force open modal
    setOrganiserOnboardingMandatory(false);
  };

  // Live Supabase auto-sync, polling timer, focus sync, & real-time Postgres updates
  useEffect(() => {
    let isMounted = true;

    // Helper to safely apply verified session user & load profile
    const applySessionUser = (sessionUser: any) => {
      if (!sessionUser || !isMounted || isLoggingOutRef.current) return;
      setActiveUserEmail(sessionUser.email);
      setActiveUserName(sessionUser.name);
      setAuthenticatedRole(sessionUser.role);
      setCurrentRole(sessionUser.role);

      if (sessionUser.role === 'organiser') {
        EvencifyApi.getOrganiserProfile(sessionUser.email).then((org) => {
          if (isMounted && !isLoggingOutRef.current) {
            if (org) setCurrentOrganiserProfile(org);
            verifyOrganiserProfileCompleteness(org);
          }
        });
      } else if (sessionUser.role === 'crew') {
        EvencifyApi.getCrewProfile(sessionUser.email).then((cr) => {
          if (isMounted && !isLoggingOutRef.current) {
            if (cr) setCurrentCrewProfile(cr);
            verifyCrewProfileCompleteness(cr);
          }
        });
      }
    };

    // 1. Immediately check cached session to prevent UI flash
    try {
      const cached = localStorage.getItem('evencify_active_user');
      if (cached) {
        const u = JSON.parse(cached);
        if (u?.email && u?.role) {
          applySessionUser(u);
        }
      }
    } catch {
      // ignore parse error
    }

    // 2. Perform initial background database sync
    syncDatabase();

    // 3. Verify session against database
    EvencifyApi.getCurrentSession().then((sessionUser) => {
      if (isLoggingOutRef.current || !isMounted) return;
      if (sessionUser) {
        applySessionUser(sessionUser);
      }
    });

    if (!isSupabaseConfigured()) {
      return () => {
        isMounted = false;
      };
    }

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
        const targetEmail = activeUserEmailRef.current || (() => {
          try {
            return JSON.parse(localStorage.getItem('evencify_active_user') || '{}')?.email || '';
          } catch { return ''; }
        })();

        if (targetEmail && isMounted && !isLoggingOutRef.current) {
          const updated = payload.new as any;
          if (updated && updated.email?.toLowerCase() === targetEmail.toLowerCase()) {
            if (updated.full_name) setActiveUserName(updated.full_name);
          }
          const role = currentRoleRef.current;
          if (role === 'crew') {
            const freshCrew = await EvencifyApi.getCrewProfile(targetEmail);
            if (freshCrew && isMounted && !isLoggingOutRef.current) setCurrentCrewProfile(freshCrew);
          } else if (role === 'organiser') {
            const freshOrg = await EvencifyApi.getOrganiserProfile(targetEmail);
            if (freshOrg && isMounted && !isLoggingOutRef.current) setCurrentOrganiserProfile(freshOrg);
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crew_profiles' }, async () => {
        const freshCrew = await EvencifyApi.getCrewProfiles();
        if (freshCrew.length > 0 && isMounted) setCrewList(freshCrew);

        const targetEmail = activeUserEmailRef.current || (() => {
          try {
            return JSON.parse(localStorage.getItem('evencify_active_user') || '{}')?.email || '';
          } catch { return ''; }
        })();

        if (targetEmail && isMounted && !isLoggingOutRef.current) {
          const freshCrewProf = await EvencifyApi.getCrewProfile(targetEmail);
          if (freshCrewProf && isMounted && !isLoggingOutRef.current) setCurrentCrewProfile(freshCrewProf);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organiser_profiles' }, async () => {
        const freshUsers = await EvencifyApi.getUsers();
        if (freshUsers.length > 0 && isMounted) setUsers(freshUsers);

        const targetEmail = activeUserEmailRef.current || (() => {
          try {
            return JSON.parse(localStorage.getItem('evencify_active_user') || '{}')?.email || '';
          } catch { return ''; }
        })();

        if (targetEmail && isMounted && !isLoggingOutRef.current) {
          const freshOrgProf = await EvencifyApi.getOrganiserProfile(targetEmail);
          if (freshOrgProf && isMounted && !isLoggingOutRef.current) setCurrentOrganiserProfile(freshOrgProf);
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

    // Listen to real-time auth state changes using full session resolution
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isLoggingOutRef.current || _event === 'SIGNED_OUT' || !session?.user) {
        return;
      }
      if (isMounted) {
        const verifiedUser = await EvencifyApi.getCurrentSession();
        if (verifiedUser && isMounted && !isLoggingOutRef.current) {
          applySessionUser(verifiedUser);
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

  const handleAuthenticated = (
    role: UserRole,
    email: string,
    name?: string,
    isNewRegistration: boolean = false
  ) => {
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
      } else {
        const freshCrew: CrewProfile = {
          ...EMPTY_CREW_PROFILE,
          id: `crew-${Date.now()}`,
          name: finalName,
          email: email,
        };
        setCurrentCrewProfile(freshCrew);
      }
      EvencifyApi.getCrewProfile(email).then((cr) => {
        if (cr) {
          setCurrentCrewProfile(cr);
        }
      });
      showToast(`Welcome! Signed in as ${finalName} (Crew)`);

      // Show onboarding ONLY for first-time registered users if onboarding is not already completed
      if (isNewRegistration && !hasUserCompletedOnboarding(email, 'crew', existingCrew)) {
        setCrewOnboardingMandatory(false);
        setCrewOnboardingOpen(true);
      }
    } else if (role === 'organiser') {
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === 'organiser');
      const finalName = name || existing?.name || defaultName;
      setActiveUserName(finalName);
      const initialOrg: OrganiserProfile = {
        ...EMPTY_ORGANISER_PROFILE,
        id: `org-${Date.now()}`,
        name: finalName,
        companyName: finalName,
        email: email,
      };
      setCurrentOrganiserProfile(initialOrg);
      EvencifyApi.getOrganiserProfile(email).then((org) => {
        if (org) {
          setCurrentOrganiserProfile(org);
        }
      });
      showToast(`Welcome! Signed in as ${finalName} (Organiser)`);

      // Show onboarding ONLY for first-time registered users if onboarding is not already completed
      if (isNewRegistration && !hasUserCompletedOnboarding(email, 'organiser', initialOrg)) {
        setOrganiserOnboardingMandatory(false);
        setOrganiserOnboardingOpen(true);
      }

      if (pendingPostAuthAction === 'create-event') {
        setTimeout(() => {
          setCreateEventModalOpen(true);
        }, 350);
        setPendingPostAuthAction(null);
      }
    } else if (role === 'admin') {
      setActiveUserName(currentAdminProfile.name);
      showToast(`Admin Console Unlocked: ${email}`);
    }

    // Refresh latest user accounts and synced real credentials
    syncDatabase();
  };

  const handleLogout = async () => {
    isLoggingOutRef.current = true;

    // 1. Immediately reset browser address to root '/'
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', '/');
      } catch (err) {
        console.error('URL reset error:', err);
      }
    }

    // 2. Immediately remove localStorage and session data synchronously
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('evencify_active_user');
        localStorage.removeItem('evencify_user_role');
        sessionStorage.clear();
      } catch (err) {
        console.error('Storage clear error:', err);
      }
    }

    // 3. Immediately reset state synchronously to unauthenticated visitor
    setCurrentRole('visitor');
    setActiveUserEmail('');
    setActiveUserName('');
    setAuthenticatedRole('visitor');
    setCurrentCrewProfile(EMPTY_CREW_PROFILE);
    setCurrentOrganiserProfile(EMPTY_ORGANISER_PROFILE);
    setCrewOnboardingMandatory(false);
    setCrewOnboardingOpen(false);
    setOrganiserOnboardingMandatory(false);
    setOrganiserOnboardingOpen(false);
    setAuthModalOpen(false);
    setNotificationDrawerOpen(false);
    setCreateEventModalOpen(false);
    setSelectedCrewForDetail(null);
    setActiveChatGroup(null);

    // 4. Terminate active sessions in Supabase
    try {
      await EvencifyApi.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setTimeout(() => {
        isLoggingOutRef.current = false;
      }, 1000);
    }

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
  // Organiser actions
  const handleEventCreated = (newEvent: EventItem) => {
    if (!canCreateEvent(authenticatedRole)) {
      showToast('Access Denied: Only registered Organisers and Admins can create events.');
      return;
    }

    const resolvedEvent: EventItem = {
      ...newEvent,
      organiserId: currentOrganiserProfile.id || activeUserEmail || newEvent.organiserId || 'org-1',
      organiserEmail: activeUserEmail || currentOrganiserProfile.email || newEvent.organiserEmail,
      organiserName: currentOrganiserProfile.companyName || currentOrganiserProfile.name || newEvent.organiserName || 'Singhania Live Events',
    };

    setEvents([resolvedEvent, ...events]);
    showToast(`Event "${resolvedEvent.name}" published!`);

    // Auto store to Supabase
    EvencifyApi.createEvent(resolvedEvent, resolvedEvent.requirements).catch((err) =>
      console.error('Supabase createEvent error:', err)
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Event Live',
      message: `"${resolvedEvent.name}" is now open for crew applications in ${resolvedEvent.city}.`,
      time: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleUpdateAppStatus = (appId: string, status: CrewApplication['status']) => {
    const app = applications.find((a) => a.id === appId);
    const event = events.find((e) => e.id === app?.eventId);

    if (app && !canManageApplication(app, event, authenticatedRole, currentOrganiserProfile, activeUserEmail)) {
      showToast('Access Denied: Only the creating Organiser can manage applicants for this event.');
      return;
    }

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
    const event = events.find((e) => e.id === eventId);
    if (event && !canManageEventStatus(event, authenticatedRole, currentOrganiserProfile, activeUserEmail)) {
      showToast('Access Denied: Only the creator of this event or an Administrator can modify its status.');
      return;
    }

    setEvents(events.map((e) => (e.id === eventId ? { ...e, status } : e)));
    showToast(`Event status set to ${status}.`);

    // Auto update status in Supabase
    EvencifyApi.updateEvent(eventId, { status }).catch((err) =>
      console.error('Supabase updateEvent status error:', err)
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event && !canDeleteEvent(event, authenticatedRole, currentOrganiserProfile, activeUserEmail)) {
      showToast('Access Denied: Only the creator of this event or an Administrator can delete it.');
      return;
    }

    setEvents(events.filter((e) => e.id !== eventId));
    showToast('Event removed.');

    // Auto delete from Supabase
    EvencifyApi.deleteEvent(eventId).catch((err) =>
      console.error('Supabase deleteEvent error:', err)
    );
  };

  // Organiser: Complete event and rate event crew
  const handleCompleteEventAndRateCrew = async (
    eventId: string,
    ratings: { crewId: string; rating: number; feedback?: string; tags?: string[] }[]
  ) => {
    const event = events.find((e) => e.id === eventId);
    if (event && !canCompleteAndRateEvent(event, authenticatedRole, currentOrganiserProfile, activeUserEmail)) {
      showToast('Access Denied: Only the creating Organiser can complete this event and submit reviews.');
      return;
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'completed' } : e))
    );
    EvencifyApi.updateEvent(eventId, { status: 'completed' }).catch((err) =>
      console.error('Supabase updateEvent status error:', err)
    );

    for (const r of ratings) {
      try {
        const res = await EvencifyApi.rateCrewMember(r.crewId, r.rating, r.feedback, eventId);
        const newRating = res.newRating;
        const newReviews = res.newReviewsCount;

        setCrewList((prev) =>
          prev.map((crew) => {
            if (crew.id === r.crewId) {
              const updatedCrew: CrewProfile = {
                ...crew,
                systemRating: newRating,
                reviewsCount: newReviews,
                completedEventsCount: (crew.completedEventsCount || 0) + 1,
              };
              if (currentCrewProfile.id === r.crewId) {
                setCurrentCrewProfile(updatedCrew);
              }
              return updatedCrew;
            }
            return crew;
          })
        );

        setApplications((prev) =>
          prev.map((app) => {
            if (app.crewId === r.crewId) {
              return {
                ...app,
                systemRating: newRating,
              };
            }
            return app;
          })
        );
      } catch (err) {
        console.error('Error rating crew member:', err);
      }
    }

    showToast('Event marked completed & crew evaluated successfully!');
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
              systemRating: updatedData.systemRating || 0,
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
          systemRating: newUser.systemRating || 0,
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

  // Edit event (Organiser or Admin)
  const handleEditEvent = (updatedEvent: EventItem) => {
    const originalEvent = events.find((e) => e.id === updatedEvent.id);
    if (
      originalEvent &&
      !canEditEvent(originalEvent, authenticatedRole, currentOrganiserProfile, activeUserEmail)
    ) {
      showToast('Access Denied: You do not have permission to edit this event.');
      return;
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
    showToast(`Event "${updatedEvent.name}" updated.`);

    // Auto store to Supabase
    EvencifyApi.updateEvent(updatedEvent.id, updatedEvent).catch((err) =>
      console.error('Supabase updateEvent error:', err)
    );
  };

  // Delete application
  const handleDeleteApplication = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    const event = events.find((e) => e.id === app?.eventId);
    if (
      app &&
      !canManageApplication(app, event, authenticatedRole, currentOrganiserProfile, activeUserEmail)
    ) {
      showToast('Access Denied: You do not have permission to delete this applicant.');
      return;
    }

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
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      navigateTo(`/#${targetId}`);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderVisitorRouteContent = () => {
    if (route.type === 'home' || AUTH_OR_PORTAL_SHORTCUT_ROUTES.has(route.type)) {
      return (
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
      );
    }

    switch (route.type) {
      case 'all-events':
        return <EventsDiscoveryPage events={events} />;
      case 'near-me':
        return <NearMeEventsPage events={events} />;
      case 'date':
        return <DateEventsPage dateKey={route.dateKey || 'upcoming'} events={events} />;
      case 'city':
        return (
          <CityEventsPage
            citySlug={route.citySlug || 'surat'}
            events={events}
            onOpenCreateEvent={() => {
              setPendingPostAuthAction('create-event');
              handleOpenAuth('organiser', 'login');
            }}
          />
        );
      case 'state':
        return <StateEventsPage stateSlug={route.stateSlug || 'gujarat'} events={events} />;
      case 'category':
        return <CategoryEventsPage categorySlug={route.categorySlug || 'concerts'} events={events} />;
      case 'city-category':
        return (
          <CityCategoryEventsPage
            citySlug={route.citySlug || 'surat'}
            categorySlug={route.categorySlug || 'concerts'}
            events={events}
          />
        );
      case 'state-category':
        return (
          <StateCategoryEventsPage
            stateSlug={route.stateSlug || 'gujarat'}
            categorySlug={route.categorySlug || 'concerts'}
            events={events}
          />
        );
      case 'event':
        return (
          <SingleEventPage
            eventSlug={route.eventSlug || ''}
            citySlug={route.citySlug}
            events={events}
            currentRole={currentRole}
            onApplyAsCrew={handleApplyToEvent}
            onOpenAuthModal={handleOpenAuth}
          />
        );
      case 'crew-jobs':
        return <CrewJobsPage onOpenAuthModal={handleOpenAuth} />;
      case 'organiser-solution':
        return (
          <OrganiseEventPage
            onOpenCreateEvent={() => {
              setPendingPostAuthAction('create-event');
              handleOpenAuth('organiser', 'login');
            }}
            onOpenAuthModal={handleOpenAuth}
          />
        );
      case 'about':
        return <StaticPage pageType="about" />;
      case 'contact':
        return <StaticPage pageType="contact" />;
      case 'privacy':
        return <StaticPage pageType="privacy" />;
      case 'terms':
        return <StaticPage pageType="terms" />;
      case 'faq':
        return <StaticPage pageType="faq" />;
      case 'sitemap':
        return <SitemapPage events={events} />;
      case 'robots':
        return <RobotsPage />;
      case 'not-found':
      default:
        return (
          <div className="min-h-[75vh] bg-[#FDFDFD] pt-28 pb-16 px-4">
            <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-white p-8 sm:p-12 text-center shadow-xs">
              <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">404</div>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                Page Not Found
              </h1>
              <p className="mt-3 text-sm sm:text-base text-neutral-600">
                The page you requested does not exist or may have moved. Browse active events across Surat and India or return to the Evencify homepage.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/events"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/events');
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors"
                >
                  Browse Events
                </a>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/');
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-colors"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-black selection:bg-[#FED000] selection:text-black">
      {/* Production-Grade Technical SEO Head (Meta, Title, JSON-LD Schemas, Open Graph, Twitter) */}
      {!hasLeafSeoHead && <SEOHead seo={currentSeo} />}

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
        <Suspense fallback={<div className="min-h-[60vh] bg-[#FAFAFB]" aria-busy="true" />}>
          {/* VIEW 1: VISITOR / PUBLIC WEBSITE & SEO PAGES (NO LOGIN REQUIRED) */}
          {currentRole === 'visitor' && renderVisitorRouteContent()}

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
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onCompleteEventAndRateCrew={handleCompleteEventAndRateCrew}
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
        </Suspense>
      </main>

      {/* Global Footer (Marketing & Governance Links) */}
      <Footer
        onSelectRole={handleSelectRole}
        onNavigateSection={handleScrollToSection}
        onOpenDirectLinks={() => setDirectLinksOpen(true)}
      />

      {/* Global Modals (loaded lazily on demand) */}
      <Suspense fallback={null}>
        {roleModalOpen && (
          <RoleSelectorModal
            isOpen={roleModalOpen}
            onClose={() => setRoleModalOpen(false)}
            onSelectRole={handleSelectRole}
          />
        )}

        {directLinksOpen && (
          <DirectLinksModal
            isOpen={directLinksOpen}
            onClose={() => {
              setDirectLinksOpen(false);
              if (
                window.location.search.includes('direct-links') ||
                window.location.search.includes('links=') ||
                window.location.hash.includes('links')
              ) {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
          />
        )}

        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => {
              setAuthModalOpen(false);
              if (
                window.location.search.includes('auth=') ||
                window.location.search.includes('login=') ||
                window.location.search.includes('signup=') ||
                window.location.search.includes('role=') ||
                window.location.hash.includes('login') ||
                window.location.hash.includes('signup')
              ) {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
            targetRole={authTargetRole}
            initialMode={authInitialMode}
            onModeChange={(mode) => {
              setAuthInitialMode(mode);
              if (typeof window !== 'undefined') {
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.set('auth', mode);
                  window.history.replaceState({}, '', url.toString());
                } catch (e) {}
              }
            }}
            onRoleChange={(role) => {
              setAuthTargetRole(role);
              if (typeof window !== 'undefined') {
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.set('role', role);
                  window.history.replaceState({}, '', url.toString());
                } catch (e) {}
              }
            }}
            onAuthenticated={handleAuthenticated}
          />
        )}

        {notificationDrawerOpen && (
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
        )}

        {/* Crew Onboarding Modal */}
        {crewOnboardingOpen && (
          <CrewOnboardingModal
            isOpen={crewOnboardingOpen}
            isMandatory={crewOnboardingMandatory}
            onClose={() => {
              setCrewOnboardingOpen(false);
              setCrewOnboardingMandatory(false);
              markUserOnboardingCompleted(activeUserEmail || currentCrewProfile.email);
            }}
            initialProfile={currentCrewProfile}
            onSaveProfile={async (updated) => {
              const merged = { ...currentCrewProfile, ...updated };
              setCurrentCrewProfile(merged);
              if (updated.name) setActiveUserName(updated.name);
              if (updated.email) setActiveUserEmail(updated.email);

              const targetId = currentCrewProfile.id || activeUserEmail || updated.email || 'crew-1';
              const targetEmail = activeUserEmail || currentCrewProfile.email || updated.email;
              try {
                await EvencifyApi.updateCrewProfile(targetId, updated);
                await syncDatabase();
                markUserOnboardingCompleted(targetEmail);
                setCrewOnboardingMandatory(false);
                setCrewOnboardingOpen(false);
                showToast('Crew profile saved & verified!');
              } catch (err) {
                console.error('Failed to save crew profile to Supabase:', err);
                markUserOnboardingCompleted(targetEmail);
                setCrewOnboardingMandatory(false);
                setCrewOnboardingOpen(false);
                showToast('Crew profile updated.');
              }
            }}
          />
        )}

        {/* Organiser Onboarding Modal */}
        {organiserOnboardingOpen && (
          <OrganiserOnboardingModal
            isOpen={organiserOnboardingOpen}
            isMandatory={organiserOnboardingMandatory}
            onClose={() => {
              setOrganiserOnboardingOpen(false);
              setOrganiserOnboardingMandatory(false);
              markUserOnboardingCompleted(activeUserEmail || currentOrganiserProfile.email);
            }}
            initialProfile={currentOrganiserProfile}
            onSaveProfile={async (updated) => {
              const merged = { ...currentOrganiserProfile, ...updated };
              setCurrentOrganiserProfile(merged);
              if (updated.companyName) setActiveUserName(updated.companyName);
              else if (updated.name) setActiveUserName(updated.name);
              if (updated.email) setActiveUserEmail(updated.email);

              const targetId = currentOrganiserProfile.id || activeUserEmail || updated.email || 'org-1';
              const targetEmail = activeUserEmail || currentOrganiserProfile.email || updated.email;
              try {
                await EvencifyApi.updateOrganiserProfile(targetId, updated);
                await syncDatabase();
                markUserOnboardingCompleted(targetEmail);
                setOrganiserOnboardingMandatory(false);
                setOrganiserOnboardingOpen(false);
                showToast('Organiser profile saved & verified!');
              } catch (err) {
                console.error('Failed to save organiser profile to Supabase:', err);
                markUserOnboardingCompleted(targetEmail);
                setOrganiserOnboardingMandatory(false);
                setOrganiserOnboardingOpen(false);
                showToast('Organiser profile updated.');
              }
            }}
          />
        )}

        {/* Create Event Modal (Organiser) */}
        {createEventModalOpen && (
          <CreateEventModal
            isOpen={createEventModalOpen}
            onClose={() => {
              setCreateEventModalOpen(false);
              if (
                window.location.search.includes('create-event') ||
                window.location.search.includes('new-event') ||
                window.location.hash.includes('create-event')
              ) {
                window.history.replaceState({}, '', window.location.pathname);
              }
            }}
            onEventCreated={handleEventCreated}
            organiserName={currentOrganiserProfile.companyName || currentOrganiserProfile.name || 'Organiser'}
            organiserId={currentOrganiserProfile.id || activeUserEmail}
            organiserEmail={activeUserEmail || currentOrganiserProfile.email}
          />
        )}

        {/* Crew Profile Inspector Modal */}
        {!!selectedCrewForDetail && (
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
        )}

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
      </Suspense>
    </div>
  );
}
