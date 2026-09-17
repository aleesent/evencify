import React, { useState } from 'react';
import {
  EventItem,
  CrewProfile,
  CrewApplication,
  EventCoordinationGroup,
} from '../../types';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Banknote,
  Users,
  CheckCircle2,
  Star,
  ShieldCheck,
  Bell,
  Settings as SettingsIcon,
  MessageSquare,
  Home,
  Briefcase,
  FileCheck,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  User,
  AlertCircle,
} from 'lucide-react';
import { CrewOpportunityModal } from './CrewOpportunityModal';

interface CrewDashboardViewProps {
  crewProfile: CrewProfile;
  events: EventItem[];
  applications: CrewApplication[];
  eventGroups?: EventCoordinationGroup[];
  onOpenGroupChat?: (group: EventCoordinationGroup) => void;
  onApplyToEvent: (eventId: string, note?: string) => void;
  onOpenProfileModal: () => void;
  onOpenOnboarding: () => void;
  onLogout: () => void;
  activeTab?: 'overview' | 'find-events' | 'applications' | 'profile' | 'notifications' | 'settings';
  onTabChange?: (tab: 'overview' | 'find-events' | 'applications' | 'profile' | 'notifications' | 'settings') => void;
}

export const CrewDashboardView: React.FC<CrewDashboardViewProps> = ({
  crewProfile,
  events,
  applications,
  eventGroups = [],
  onOpenGroupChat,
  onApplyToEvent,
  onOpenProfileModal,
  onOpenOnboarding,
  onLogout,
  activeTab: propActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<
    'overview' | 'find-events' | 'applications' | 'profile' | 'notifications' | 'settings'
  >('overview');

  const activeTab = propActiveTab || internalActiveTab;
  const setActiveTab = (tab: 'overview' | 'find-events' | 'applications' | 'profile' | 'notifications' | 'settings') => {
    setInternalActiveTab(tab);
    onTabChange?.(tab);
  };

  // Filters for Find Events
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);

  // Applications metrics
  const myApplications = applications.filter(
    (a) => a.crewId === crewProfile.id || a.crewEmail === crewProfile.email
  );
  const pendingApps = myApplications.filter((a) => a.status === 'Pending').length;
  const shortlistedApps = myApplications.filter((a) => a.status === 'Shortlisted').length;
  const acceptedApps = myApplications.filter((a) => a.status === 'Accepted').length;

  // Filter open events
  const openEvents = events.filter((ev) => ev.status !== 'Paused' && ev.status !== 'Closed');
  const filteredEvents = openEvents.filter((ev) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        ev.name.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.city.toLowerCase().includes(q) ||
        ev.requiredCategory.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCity !== 'All' && ev.city !== selectedCity) return false;
    if (selectedCategory !== 'All' && ev.requiredCategory !== selectedCategory) return false;
    return true;
  });

  const confirmedShifts = myApplications.filter((a) => a.status === 'Accepted');

  return (
    <div className="min-h-screen bg-neutral-100/60 pb-20 pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* ================= SIMPLIFIED USER HEADER CARD ================= */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={crewProfile.photoUrl}
                alt={crewProfile.name}
                referrerPolicy="no-referrer"
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-neutral-200 shadow-xs shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Verified ID
                  </span>
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span>{crewProfile.systemRating}</span>
                  </div>
                </div>

                <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                  Welcome, {crewProfile.name}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  {crewProfile.city} • {crewProfile.categories.join(', ')}
                </p>
              </div>
            </div>

            {/* Quick action button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('find-events')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
              >
                <Search className="h-4 w-4 text-amber-300" />
                <span>Find Shifts</span>
              </button>
            </div>
          </div>

          {/* 4 Simple, Clear Metric Cards */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-neutral-100">
            {/* 1. Confirmed Jobs */}
            <div
              onClick={() => setActiveTab('applications')}
              className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-200/80 cursor-pointer hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Confirmed Shifts
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700">
                {acceptedApps}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-emerald-800">
                {acceptedApps === 1 ? '1 job confirmed' : `${acceptedApps} jobs ready to work`}
              </p>
            </div>

            {/* 2. Applications Sent */}
            <div
              onClick={() => setActiveTab('applications')}
              className="rounded-xl bg-neutral-50 p-4 border border-neutral-200 cursor-pointer hover:bg-neutral-100/70 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                  Waiting For Reply
                </span>
                <Clock className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900">
                {pendingApps}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-neutral-500">
                Organisers reviewing
              </p>
            </div>

            {/* 3. Shortlisted */}
            <div
              onClick={() => setActiveTab('applications')}
              className="rounded-xl bg-blue-50/60 p-4 border border-blue-200/80 cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Shortlisted
                </span>
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-blue-700">
                {shortlistedApps}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-blue-800">
                Selected for final list
              </p>
            </div>

            {/* 4. Total Completed Shifts */}
            <div
              onClick={() => setActiveTab('profile')}
              className="rounded-xl bg-amber-50/60 p-4 border border-amber-200/80 cursor-pointer hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Past Shifts
                </span>
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-900">
                {crewProfile.completedEventsCount}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-amber-800">
                ⭐ {crewProfile.systemRating} Star Rating
              </p>
            </div>
          </div>
        </div>

        {/* ================= STRAIGHTFORWARD TAB NAVIGATION ================= */}
        <div className="mt-5 flex overflow-x-auto rounded-xl border border-neutral-200 bg-white p-1.5 scrollbar-none gap-1.5 shadow-xs">
          {[
            { id: 'overview', label: 'Home', icon: Home },
            {
              id: 'find-events',
              label: `Find Work (${openEvents.length})`,
              icon: Search,
            },
            {
              id: 'applications',
              label: `My Shifts (${myApplications.length})`,
              icon: FileCheck,
            },
            { id: 'profile', label: 'My ID Pass', icon: User },
            { id: 'notifications', label: 'Alerts', icon: Bell },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`shrink-0 flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-amber-300' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: HOME (OVERVIEW) ================= */}
        {activeTab === 'overview' && (
          <div className="mt-5 space-y-6">
            
            {/* 1. CONFIRMED SHIFTS SECTION (HIGH PRIORITY) */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-lg font-bold text-neutral-900">Your Confirmed Shifts</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('applications')}
                  className="text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  View All ({myApplications.length}) →
                </button>
              </div>

              {confirmedShifts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/80 p-8 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-neutral-400 mb-2" />
                  <h3 className="text-base font-bold text-neutral-900">No shifts confirmed yet</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-md mx-auto">
                    Apply to open event shifts in {crewProfile.city}. Organisers review applications quickly!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('find-events')}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <Search className="h-4 w-4 text-amber-300" />
                    <span>Browse Open Work</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {confirmedShifts.map((app) => {
                    const shiftGroup = eventGroups.find(
                      (g) =>
                        g.eventId === app.eventId &&
                        g.crewMembers.some((m) => m.crewId === crewProfile.id)
                    );

                    return (
                      <div
                        key={app.id}
                        className="rounded-xl border-2 border-emerald-300 bg-emerald-50/30 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-bold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              CONFIRMED JOB
                            </span>
                            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-800">
                              Role: {app.crewCategory}
                            </span>
                          </div>

                          <h3 className="text-lg font-extrabold text-neutral-900">{app.eventName}</h3>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-600 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                              {app.eventDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                              {app.city || crewProfile.city}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-100">
                          <div className="bg-white rounded-xl border border-emerald-200 px-4 py-2 text-left sm:text-right">
                            <div className="text-[10px] uppercase font-bold text-neutral-400">Shift Payout</div>
                            <div className="text-base font-extrabold text-emerald-700">₹1,500 – ₹2,500</div>
                          </div>

                          {shiftGroup ? (
                            <button
                              type="button"
                              onClick={() => onOpenGroupChat?.(shiftGroup)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 text-white px-4 py-2.5 text-xs font-bold hover:bg-purple-800 transition-colors shadow-xs cursor-pointer"
                            >
                              <MessageSquare className="h-4 w-4 text-purple-200" />
                              <span>Crew Chat ({shiftGroup.messages.length})</span>
                            </button>
                          ) : (
                            <div className="text-xs text-neutral-500 font-medium px-2 py-1 bg-white rounded-lg border border-neutral-200 text-center">
                              Chat opens before shift
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. QUICK FIND WORK PREVIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                      New Event Shifts in {crewProfile.city}
                    </h2>
                    <p className="text-xs text-neutral-500">Apply with 1 tap using your verified ID</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('find-events')}
                    className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                  >
                    See all ({openEvents.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {openEvents.slice(0, 3).map((ev) => {
                    const hasApplied = applications.some(
                      (a) =>
                        a.eventId === ev.id &&
                        (a.crewId === crewProfile.id || a.crewEmail === crewProfile.email)
                    );

                    return (
                      <div
                        key={ev.id}
                        className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 hover:border-neutral-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-neutral-200/80 px-2 py-0.5 text-[11px] font-bold text-neutral-800 uppercase">
                              {ev.eventType}
                            </span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                              ₹{ev.payAmount} {ev.payBasis}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-neutral-900 mt-1">{ev.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                            <span>{ev.date}</span>
                            <span>•</span>
                            <span>{ev.city}</span>
                            <span>•</span>
                            <span className="font-semibold text-neutral-700">{ev.requiredCategory}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedEventForModal(ev)}
                            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                          >
                            Details
                          </button>
                          {hasApplied ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Applied
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onApplyToEvent(ev.id)}
                              className="rounded-lg bg-neutral-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 cursor-pointer"
                            >
                              Apply
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. CREW PASS SUMMARY CARD */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-neutral-900">My Crew Pass</h2>
                    <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold">
                      Active
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-500 font-medium">Daily Pay Rate:</span>
                      <span className="font-bold text-neutral-900">{crewProfile.expectedPay}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-500 font-medium">Experience:</span>
                      <span className="font-bold text-neutral-900">{crewProfile.experienceYears} Years</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-500 font-medium">City:</span>
                      <span className="font-bold text-neutral-900">{crewProfile.city}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-500 font-medium">Phone:</span>
                      <span className="font-bold text-neutral-900">{crewProfile.phone}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenOnboarding}
                  className="mt-5 w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Edit My Details
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: FIND WORK (FIND EVENTS) ================= */}
        {activeTab === 'find-events' && (
          <div className="mt-5 space-y-5">
            {/* Simple Search & Filter Bar */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs space-y-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search shifts by event name, venue, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 py-2.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-400 focus:outline-hidden transition-all"
                />
              </div>

              {/* Quick City Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-neutral-500 mr-1">City:</span>
                {['All', 'Surat', 'Ahmedabad', 'Vadodara', 'Mumbai'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                      selectedCity === city
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {city === 'All' ? 'All Cities' : city}
                  </button>
                ))}

                {/* Role dropdown */}
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-500">Role:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1 text-xs font-bold text-neutral-800 focus:outline-hidden"
                  >
                    <option value="All">All Roles</option>
                    <option value="Hospitality Staff">Hospitality Staff</option>
                    <option value="Registration Desk">Registration Desk</option>
                    <option value="Event Helper">Event Helper</option>
                    <option value="Security">Security</option>
                    <option value="Promoter">Promoter</option>
                    <option value="Setup / Teardown">Setup / Teardown</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Event List */}
            {filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
                <Calendar className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                <h3 className="text-base font-bold text-neutral-900">No events found matching your search</h3>
                <p className="text-xs text-neutral-500 mt-1">Try choosing "All Cities" or clearing your search query.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('All');
                    setSelectedCategory('All');
                  }}
                  className="mt-3 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map((ev) => {
                  const hasApplied = applications.some(
                    (a) =>
                      a.eventId === ev.id &&
                      (a.crewId === crewProfile.id || a.crewEmail === crewProfile.email)
                  );

                  return (
                    <div
                      key={ev.id}
                      className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Top tag & pay */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-700 uppercase">
                            {ev.eventType}
                          </span>
                          <span className="text-sm font-extrabold text-neutral-900 bg-amber-100/70 border border-amber-200 px-3 py-0.5 rounded-full">
                            ₹{ev.payAmount} {ev.payBasis}
                          </span>
                        </div>

                        {/* Event title */}
                        <h3 className="mt-2.5 text-base sm:text-lg font-extrabold text-neutral-900">
                          {ev.name}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                          Host: <span className="font-semibold text-neutral-800">{ev.organiserName}</span>
                        </p>

                        {/* Shift details - minimal & uncongested */}
                        <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            {ev.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            {ev.city}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-neutral-800">{ev.requiredCategory}</span>
                        </div>

                        {/* Open slots */}
                        <div className="mt-2">
                          <span className="rounded-full bg-emerald-50 text-emerald-800 font-bold px-2.5 py-0.5 text-[11px]">
                            {ev.crewPositionsAvailable} Slots Open
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedEventForModal(ev)}
                          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>

                        {hasApplied ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700 border border-neutral-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Applied
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onApplyToEvent(ev.id)}
                            className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            Apply in 1 Tap
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: MY APPLICATIONS (MY SHIFTS) ================= */}
        {activeTab === 'applications' && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">My Shift Applications</h2>
              <p className="text-xs text-neutral-500">
                Track status updates from event organisers. When accepted, you get access to the shift chat.
              </p>
            </div>

            {myApplications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-xs text-neutral-500">
                <p className="text-sm font-bold text-neutral-800 mb-1">No applications yet</p>
                Browse open events to apply and get hired!
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => {
                  const shiftGroup = eventGroups.find(
                    (g) =>
                      g.eventId === app.eventId &&
                      g.crewMembers.some((m) => m.crewId === crewProfile.id)
                  );

                  return (
                    <div
                      key={app.id}
                      className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-base text-neutral-900">{app.eventName}</h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              app.status === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : app.status === 'Shortlisted'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : app.status === 'Rejected'
                                ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {app.status === 'Accepted'
                              ? '✓ You are Hired'
                              : app.status === 'Shortlisted'
                              ? '⭐ Shortlisted'
                              : app.status === 'Pending'
                              ? '⏳ Waiting For Response'
                              : 'Not Selected'}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-600 font-medium">
                          Role: <span className="font-bold text-neutral-800">{app.crewCategory}</span> • Date: {app.eventDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 sm:pt-0">
                        {app.status === 'Accepted' && shiftGroup && (
                          <button
                            type="button"
                            onClick={() => onOpenGroupChat?.(shiftGroup)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 text-white px-3.5 py-2 text-xs font-bold hover:bg-purple-800 cursor-pointer shadow-xs"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-amber-300" />
                            <span>Shift Chat</span>
                          </button>
                        )}
                        {app.status === 'Shortlisted' && (
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                            Host is finalizing roster
                          </span>
                        )}
                        {app.status === 'Pending' && (
                          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg">
                            Under review
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: MY PROFILE (MY ID PASS) ================= */}
        {activeTab === 'profile' && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Your Verified Crew ID Pass</h2>
                <p className="text-xs text-neutral-500">
                  Organisers see these verified credentials when you apply for shifts.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Card 1: Contact */}
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-2">
                  Personal Details
                </div>
                <div className="font-extrabold text-sm text-neutral-900">{crewProfile.name}</div>
                <div className="font-medium text-neutral-600 mt-1 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-neutral-400" />
                  {crewProfile.phone}
                </div>
                <div className="font-medium text-neutral-600 mt-0.5 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-neutral-400" />
                  {crewProfile.email}
                </div>
              </div>

              {/* Card 2: Location */}
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-2">
                  Location
                </div>
                <div className="font-extrabold text-sm text-neutral-900">{crewProfile.city}</div>
                <div className="font-medium text-neutral-600 mt-1">{crewProfile.address}</div>
                <div className="text-neutral-500 mt-0.5">PIN: {crewProfile.pincode}</div>
              </div>

              {/* Card 3: Experience & Skills */}
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider mb-2">
                  Experience & Roles
                </div>
                <div className="font-extrabold text-sm text-neutral-900">
                  {crewProfile.experienceYears} Years Experience
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {crewProfile.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-white px-2 py-0.5 font-bold text-neutral-800 border border-neutral-200 text-[11px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: ALERTS (NOTIFICATIONS) ================= */}
        {activeTab === 'notifications' && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">Shift Alerts</h2>
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex items-start gap-3">
                <Bell className="h-5 w-5 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-neutral-900">Verified Crew Rating: 4.9★</div>
                  <p className="text-neutral-600 mt-0.5">
                    Your rating is high because you attend shifts on time. Keep it up to get picked first!
                  </p>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Updated today</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">Account Settings</h2>
            <div className="space-y-3 text-xs text-neutral-800">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div>
                  <div className="font-bold text-neutral-900">SMS Alerts for New Shifts</div>
                  <div className="text-neutral-500 mt-0.5">Get a text message when events in your city need crew</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-neutral-900 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div>
                  <div className="font-bold text-neutral-900">Direct UPI Bank Payment</div>
                  <div className="text-neutral-500 mt-0.5">Direct deposit to your UPI ID right after event finishes</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 accent-neutral-900 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal for viewing event details */}
        {selectedEventForModal && (
          <CrewOpportunityModal
            isOpen={!!selectedEventForModal}
            onClose={() => setSelectedEventForModal(null)}
            event={selectedEventForModal}
            crewProfile={crewProfile}
            hasApplied={applications.some(
              (a) =>
                a.eventId === selectedEventForModal.id &&
                (a.crewId === crewProfile.id || a.crewEmail === crewProfile.email)
            )}
            onApply={(eventId, note) => {
              onApplyToEvent(eventId, note);
              setSelectedEventForModal(null);
            }}
          />
        )}

      </div>
    </div>
  );
};
