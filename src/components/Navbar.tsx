import React, { useState, useEffect, useRef } from 'react';
import { UserRole, AppNotification } from '../types';
import { AuthSessionUser } from '../services/api';
import {
  Bell,
  Menu,
  X,
  LogOut,
  ArrowRight,
  User,
  Calendar,
  Users,
  FileCheck,
  Shield,
  Search,
  ChevronDown,
  LayoutDashboard,
  Globe,
  Database,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentUser?: AuthSessionUser | null;
  authenticatedRole?: UserRole | null;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  onSelectRole: (role: UserRole) => void;
  onOpenAuthModal: (role?: UserRole, initialMode?: 'login' | 'signup') => void;
  onOpenAdminLogin: () => void;
  onLogout: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onNavigateSection: (sectionId: string) => void;
  onNavigateCrewTab?: (tab: 'overview' | 'find-events' | 'applications' | 'profile') => void;
  onNavigateOrganiserTab?: (tab: 'overview' | 'events' | 'crew' | 'applications' | 'profile') => void;
  onOpenProfile?: () => void;
  onOpenDatabaseConfig?: () => void;
  isDatabaseConfigured?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  authenticatedRole,
  userEmail,
  userName,
  userAvatar,
  onSelectRole,
  onOpenAuthModal,
  onOpenAdminLogin,
  onLogout,
  notifications,
  onOpenNotifications,
  onNavigateSection,
  onNavigateCrewTab,
  onNavigateOrganiserTab,
  onOpenProfile,
  onOpenDatabaseConfig,
  isDatabaseConfigured = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const effectiveRole: UserRole =
    currentUser?.role || authenticatedRole || (currentRole !== 'visitor' ? currentRole : 'crew');
  const displayName = currentUser?.name || userName || 'Ananya Sharma';
  const displayEmail = currentUser?.email || userEmail || 'ananya.sharma@example.com';
  const isAuthenticated = Boolean(
    currentUser?.email || (userEmail && userEmail.trim().length > 0) || currentRole !== 'visitor'
  );

  // Non-blocking scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 28);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on Escape or Click Outside
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentRole !== 'visitor') {
      onSelectRole('visitor');
      setTimeout(() => onNavigateSection(sectionId), 100);
    } else {
      onNavigateSection(sectionId);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] px-3 sm:px-4">
      {/* Floating Glass Pill Container */}
      <header
        className={`pointer-events-auto relative w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isScrolled
            ? 'mt-3 sm:mt-4 h-[62px] sm:h-[66px] w-[96%] md:w-[86%] lg:w-[80%] max-w-6xl rounded-[32px] sm:rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-neutral-200/90 px-4 sm:px-6'
            : 'mt-4 sm:mt-5 h-[72px] sm:h-[76px] w-[97%] sm:w-[95%] max-w-7xl rounded-[36px] sm:rounded-full bg-white/95 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.05)] border border-neutral-200/80 px-4 sm:px-7'
        }`}
      >
        <div className="flex h-full w-full items-center justify-between">
          {/* LEFT: Evencify Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setUserMenuOpen(false);
                setMobileMenuOpen(false);
                onSelectRole('visitor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-xl transition-transform hover:opacity-95 cursor-pointer"
              aria-label="Evencify Home - View Public Site"
              title="Return to Public View"
            >
              <div
                className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isScrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-9'
                } flex items-center`}
              >
                <img
                  src="/evencify.logo.png"
                  alt="Evencify — Events Made Easy"
                  className="h-full w-auto object-contain select-none transition-transform duration-200 hover:scale-[1.02]"
                  style={{
                    filter:
                      'drop-shadow(0 0 1.2px rgba(0, 0, 0, 0.85)) drop-shadow(0 1.5px 3.5px rgba(0, 0, 0, 0.28)) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.14))',
                  }}
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {!isDatabaseConfigured && onOpenDatabaseConfig && (
              <button
                onClick={onOpenDatabaseConfig}
                className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                title="Connect Supabase Database"
              >
                <Database className="h-3 w-3 text-amber-600" />
                <span>Connect Database</span>
              </button>
            )}
          </div>

          {/* ================= CENTER NAVIGATION ================= */}

          {/* 1. PUBLIC VIEW (Visitor role or viewing marketing site) */}
          {currentRole === 'visitor' && (
            <nav
              className={`hidden md:flex items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isScrolled ? 'gap-4 lg:gap-6' : 'gap-6 lg:gap-8'
              }`}
              aria-label="Main Navigation"
            >
              <button
                onClick={() => handleNavClick('for-crew')}
                className="text-xs sm:text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-lg px-2 py-1 cursor-pointer"
              >
                For Crew
              </button>
              <button
                onClick={() => handleNavClick('for-organisers')}
                className="text-xs sm:text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-lg px-2 py-1 cursor-pointer"
              >
                For Organisers
              </button>
              <button
                onClick={() => handleNavClick('trust')}
                className="text-xs sm:text-sm font-semibold text-neutral-600 transition-colors hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-lg px-2 py-1 cursor-pointer"
              >
                Trust & Escrow
              </button>
            </nav>
          )}

          {/* 2. CREW LOGGED IN: Find Shifts | Applications */}
          {isAuthenticated && currentRole === 'crew' && (
            <nav className="hidden md:flex items-center gap-2 sm:gap-3" aria-label="Crew Navigation">
              <button
                onClick={() => onNavigateCrewTab?.('find-events')}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 shadow-xs transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5 text-neutral-500" />
                <span>Find Shifts</span>
              </button>
              <button
                onClick={() => onNavigateCrewTab?.('applications')}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 shadow-xs transition-colors cursor-pointer"
              >
                <FileCheck className="h-3.5 w-3.5 text-neutral-500" />
                <span>Applications</span>
              </button>
            </nav>
          )}

          {/* 3. ORGANISER LOGGED IN: Events | Crew | Applications */}
          {isAuthenticated && currentRole === 'organiser' && (
            <nav className="hidden md:flex items-center gap-2 sm:gap-3" aria-label="Organiser Navigation">
              <button
                onClick={() => onNavigateOrganiserTab?.('events')}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                <span>Events</span>
              </button>
              <button
                onClick={() => onNavigateOrganiserTab?.('crew')}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 shadow-xs transition-colors cursor-pointer"
              >
                <Users className="h-3.5 w-3.5 text-neutral-500" />
                <span>Crew</span>
              </button>
              <button
                onClick={() => onNavigateOrganiserTab?.('applications')}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950 shadow-xs transition-colors cursor-pointer"
              >
                <FileCheck className="h-3.5 w-3.5 text-neutral-500" />
                <span>Applications</span>
              </button>
            </nav>
          )}

          {/* 4. ADMIN LOGGED IN: Console Badge */}
          {isAuthenticated && currentRole === 'admin' && (
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-xs">
                <Shield className="h-3.5 w-3.5 text-neutral-700" />
                <span>Admin Console</span>
              </span>
              <button
                onClick={() => onSelectRole('visitor')}
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-2 py-1 cursor-pointer transition-colors"
              >
                View Public Site
              </button>
            </div>
          )}

          {/* ================= RIGHT CONTROLS: DYNAMIC AUTH STATE ================= */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. NOT LOGGED IN: SHOW ONLY 'GET STARTED' */}
            {!isAuthenticated ? (
              <div className="flex items-center">
                <button
                  onClick={() => onOpenAuthModal(undefined, 'signup')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#FED000] hover:bg-neutral-800 shadow-xs transition-all cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              /* 2. LOGGED IN: NOTIFICATIONS + PROFILE MENU (Clean header without separate dashboard button) */
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Notifications Button */}
                <button
                  onClick={onOpenNotifications}
                  className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-black text-[10px] font-black text-[#FED000] border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Integrated Profile Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-xs cursor-pointer ${
                      isScrolled
                        ? 'h-[38px] sm:h-[40px] px-2.5 sm:px-3 text-xs sm:text-sm'
                        : 'h-[42px] sm:h-[44px] px-3 sm:px-3.5 text-xs sm:text-sm'
                    }`}
                    aria-expanded={userMenuOpen}
                    aria-label={`User menu for ${displayName}`}
                  >
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={displayName}
                        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full object-cover border border-neutral-200"
                      />
                    ) : (
                      <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-black text-[#FED000] flex items-center justify-center text-xs font-bold">
                        {(displayName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-neutral-900 whitespace-nowrap hidden sm:inline">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180 text-neutral-900' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-72 sm:w-80 rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                      {/* User Profile Info Card */}
                      <div className="p-3 rounded-xl border border-neutral-100 bg-neutral-50 mb-2">
                        <div className="flex items-center gap-3">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={displayName}
                              className="h-10 w-10 rounded-full object-cover border border-neutral-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-black text-[#FED000] flex items-center justify-center text-sm font-bold">
                              {displayName[0].toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-neutral-950 text-sm truncate">{displayName}</div>
                            <div className="text-[11px] font-medium text-neutral-500 truncate">
                              {displayEmail}
                            </div>
                            <span className="inline-block mt-1 rounded-full bg-[#FED000] px-2 py-0.5 text-[10px] font-black text-black uppercase tracking-wide">
                              {effectiveRole === 'crew'
                                ? 'Verified Crew Member'
                                : effectiveRole === 'organiser'
                                ? 'Event Organiser'
                                : 'Superadmin'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Navigation Actions */}
                      <div className="space-y-1.5">
                        {/* 1. MY DASHBOARD BUTTON - INSIDE USER PROFILE */}
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onSelectRole(effectiveRole);
                            if (effectiveRole === 'crew') onNavigateCrewTab?.('overview');
                            if (effectiveRole === 'organiser') onNavigateOrganiserTab?.('overview');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-black text-black bg-[#FED000] hover:bg-[#E5BB00] transition-all text-left cursor-pointer shadow-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="h-4 w-4 text-black shrink-0" />
                            <span>My Dashboard</span>
                          </div>
                          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-black text-[#FED000]">
                            {effectiveRole}
                          </span>
                        </button>

                        {/* 2. USER PROFILE & ACCOUNT */}
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onOpenProfile) {
                              onOpenProfile();
                            } else {
                              onSelectRole(effectiveRole);
                              if (effectiveRole === 'crew') onNavigateCrewTab?.('profile');
                              if (effectiveRole === 'organiser') onNavigateOrganiserTab?.('profile');
                            }
                          }}
                          className="w-full flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <User className="h-4 w-4 text-neutral-800 shrink-0" />
                            <span>Profile & Account</span>
                          </div>
                          <span className="text-[10px] text-neutral-600 font-semibold">Edit</span>
                        </button>

                        {/* 3. Role-specific quick links */}
                        {effectiveRole === 'crew' && (
                          <>
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                onSelectRole('crew');
                                onNavigateCrewTab?.('find-events');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                            >
                              <Search className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                              <span>Find Shifts</span>
                            </button>
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                onSelectRole('crew');
                                onNavigateCrewTab?.('applications');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                            >
                              <FileCheck className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                              <span>My Applications</span>
                            </button>
                          </>
                        )}

                        {effectiveRole === 'organiser' && (
                          <>
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                onSelectRole('organiser');
                                onNavigateOrganiserTab?.('events');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                            >
                              <Calendar className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                              <span>Manage Events</span>
                            </button>
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                onSelectRole('organiser');
                                onNavigateOrganiserTab?.('crew');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                            >
                              <Users className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                              <span>Browse Crew</span>
                            </button>
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                onSelectRole('organiser');
                                onNavigateOrganiserTab?.('applications');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                            >
                              <FileCheck className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                              <span>Review Applications</span>
                            </button>
                          </>
                        )}

                        {/* Public view toggle */}
                        {currentRole !== 'visitor' && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              onSelectRole('visitor');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                          >
                            <Globe className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                            <span>View Public Website</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenNotifications();
                          }}
                          className="w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-colors text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Bell className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
                            <span>Notifications</span>
                          </div>
                          {unreadCount > 0 && (
                            <span className="rounded-full bg-black text-[#FED000] px-2 py-0.2 text-[10px] font-black">
                              {unreadCount}
                            </span>
                          )}
                        </button>

                        <div className="my-1 border-t border-neutral-100" />

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 text-red-600 shrink-0" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE DROPDOWN MENU ================= */}
        {mobileMenuOpen && (
          <div className="absolute top-[calc(100%+10px)] left-0 right-0 rounded-[24px] border border-neutral-200 bg-white/98 backdrop-blur-md p-5 shadow-2xl md:hidden space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
            {isAuthenticated ? (
              <>
                <div className="p-3.5 rounded-2xl border border-neutral-100 bg-neutral-50 text-xs">
                  <div className="font-bold text-neutral-950 text-sm">{displayName}</div>
                  <div className="text-[11px] text-neutral-500">{displayEmail}</div>
                  <div className="capitalize font-bold text-black bg-[#FED000] inline-block px-2.5 py-0.5 rounded-full mt-2 text-[11px]">
                    {effectiveRole}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSelectRole(effectiveRole);
                    if (effectiveRole === 'crew') onNavigateCrewTab?.('overview');
                    if (effectiveRole === 'organiser') onNavigateOrganiserTab?.('overview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FED000] py-3 text-sm font-black text-black shadow-xs cursor-pointer hover:bg-[#E5BB00] transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-black" />
                  <span>My Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenProfile) {
                      onOpenProfile();
                    } else {
                      onSelectRole(effectiveRole);
                      if (effectiveRole === 'crew') onNavigateCrewTab?.('profile');
                      if (effectiveRole === 'organiser') onNavigateOrganiserTab?.('profile');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white py-2.5 text-xs font-bold text-black hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <User className="h-4 w-4 text-black" />
                  <span>Profile & Account</span>
                </button>
              </>
            ) : (
              <div className="pb-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal(undefined, 'signup');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-bold text-[#FED000] shadow-xs cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Public nav links */}
            <div className="flex flex-col space-y-1 pt-1 border-t border-neutral-100">
              <button
                onClick={() => handleNavClick('for-crew')}
                className="rounded-xl px-4 py-2 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                For Crew
              </button>
              <button
                onClick={() => handleNavClick('for-organisers')}
                className="rounded-xl px-4 py-2 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                For Event Organisers
              </button>
              <button
                onClick={() => handleNavClick('trust')}
                className="rounded-xl px-4 py-2 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Trust & Escrow
              </button>
            </div>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-neutral-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 text-red-600 py-2.5 text-xs font-bold cursor-pointer transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-neutral-100 text-center">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="text-[11px] font-bold text-neutral-500 hover:text-black"
                >
                  Operator Console
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

