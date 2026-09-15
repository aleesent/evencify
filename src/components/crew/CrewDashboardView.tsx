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
  SlidersHorizontal,
  Star,
  ChevronRight,
  ShieldCheck,
  Bell,
  Settings as SettingsIcon,
  User,
  Briefcase,
  TrendingUp,
  AlertCircle,
  FileText,
  ArrowRight,
  Filter,
  MessageSquare,
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
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);

  // KPIs
  const myApplications = applications.filter(
    (a) => a.crewId === crewProfile.id || a.crewEmail === crewProfile.email
  );
  const pendingApps = myApplications.filter((a) => a.status === 'Pending').length;
  const shortlistedApps = myApplications.filter((a) => a.status === 'Shortlisted').length;
  const acceptedApps = myApplications.filter((a) => a.status === 'Accepted').length;
  const profileCompletion = 100;

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (ev.status === 'Paused' || ev.status === 'Closed') return false;
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
    if (selectedEventType !== 'All' && ev.eventType !== selectedEventType) return false;
    if (selectedCategory !== 'All' && ev.requiredCategory !== selectedCategory) return false;
    if (
      selectedExperience !== 'All' &&
      !ev.experienceRequirement.toLowerCase().includes(selectedExperience.toLowerCase())
    )
      return false;
    if (
      selectedGender !== 'All' &&
      ev.genderRequirement !== selectedGender &&
      ev.genderRequirement !== 'Any'
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={crewProfile.photoUrl}
                alt={crewProfile.name}
                referrerPolicy="no-referrer"
                className="h-16 w-16 rounded-xl object-cover border border-neutral-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                    <ShieldCheck className="h-3 w-3 text-amber-700" />
                    Verified Crew Member
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span>{crewProfile.systemRating} System Rating</span>
                  </div>
                </div>
                <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                  Welcome back, {crewProfile.name}
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-neutral-500">
                  {crewProfile.city} • {crewProfile.categories.join(', ')} • {crewProfile.completedEventsCount} Shifts Completed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('find-events')}
                className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Find Shifts</span>
              </button>
            </div>
          </div>

          {/* KPI Dashboard Overview Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-neutral-100">
            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Upcoming Events
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{acceptedApps}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Applications
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{myApplications.length}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Shortlisted
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-600">{shortlistedApps}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Accepted Shifts
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-600">{acceptedApps}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Profile Complete
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{profileCompletion}%</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Rating
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900 flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                <span>{crewProfile.systemRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crew Portal Navigation Tabs */}
        <div className="mt-6 flex overflow-x-auto rounded-xl border border-neutral-200/80 bg-white p-1.5 scrollbar-none gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'find-events', label: `Find Events (${events.length})` },
            { id: 'applications', label: `My Applications (${myApplications.length})` },
            { id: 'profile', label: 'My Profile' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Confirmed Shifts */}
              <div className="lg:col-span-2 rounded-2xl border border-neutral-200/80 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-neutral-900">Your Confirmed Event Shifts</h3>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    View applications →
                  </button>
                </div>

                {acceptedApps === 0 ? (
                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-8 text-center">
                    <Calendar className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                    <h4 className="text-sm font-semibold text-neutral-900">No active shifts right now</h4>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                      Explore newly published opportunities matching your categories in {crewProfile.city}.
                    </p>
                    <button
                      onClick={() => setActiveTab('find-events')}
                      className="mt-4 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer transition-colors"
                    >
                      Browse Open Events
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myApplications
                      .filter((a) => a.status === 'Accepted')
                      .map((app) => {
                        const shiftGroup = eventGroups.find(
                          (g) =>
                            g.eventId === app.eventId &&
                            g.crewMembers.some((m) => m.crewId === crewProfile.id)
                        );

                        return (
                          <div
                            key={app.id}
                            className="rounded-xl border border-neutral-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                                  Shift Confirmed
                                </span>
                                {shiftGroup && (
                                  <span className="rounded-full bg-purple-50 border border-purple-200/80 px-2 py-0.5 text-[10px] font-semibold text-purple-800">
                                    Group Active
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-sm text-neutral-900 mt-1">{app.eventName}</h4>
                              <p className="text-xs text-neutral-500 mt-0.5">{app.eventDate} • {app.crewCategory}</p>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                              <div className="text-xs font-bold text-neutral-900">₹1,500 / Shift</div>
                              {shiftGroup ? (
                                <button
                                  type="button"
                                  onClick={() => onOpenGroupChat?.(shiftGroup)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 text-white px-3 py-1.5 text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                  <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
                                  <span>Shift Chat ({shiftGroup.messages.length})</span>
                                </button>
                              ) : (
                                <div className="text-[11px] font-medium text-neutral-400">Coordination group pending</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Profile Summary Card */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-3">Crew Profile Status</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-500 font-medium">Experience:</span>
                    <span className="font-semibold text-neutral-900">{crewProfile.experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-500 font-medium">Expected Pay:</span>
                    <span className="font-semibold text-neutral-900">{crewProfile.expectedPay}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-500 font-medium">City / Location:</span>
                    <span className="font-semibold text-neutral-900">{crewProfile.city}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-500 font-medium">Age:</span>
                    <span className="font-semibold text-neutral-900">{crewProfile.age} yrs ({crewProfile.gender})</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <button
                    onClick={onOpenOnboarding}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Edit Crew Details
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB: FIND EVENTS ================= */}
        {activeTab === 'find-events' && (
          <div className="mt-6 space-y-6">
            
            {/* Filter Bar */}
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search events by name, role, venue, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-400 focus:outline-hidden transition-all"
                  />
                </div>

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 focus:border-neutral-400 focus:outline-hidden transition-all"
                >
                  <option value="All">All Cities</option>
                  <option value="Surat">Surat</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Mumbai">Mumbai</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 focus:border-neutral-400 focus:outline-hidden transition-all"
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

            {/* Event Opportunity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((ev) => {
                const hasApplied = applications.some(
                  (a) => a.eventId === ev.id && (a.crewId === crewProfile.id || a.crewEmail === crewProfile.email)
                );

                return (
                  <div
                    key={ev.id}
                    className="rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all hover:border-neutral-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 uppercase tracking-wide">
                          {ev.eventType}
                        </span>
                        <span className="text-xs font-bold text-neutral-900 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                          ₹{ev.payAmount} {ev.payBasis}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base sm:text-lg font-bold text-neutral-900">{ev.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Organised by <span className="font-semibold text-neutral-800">{ev.organiserName}</span>
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-neutral-700 bg-neutral-50/70 p-3 rounded-xl border border-neutral-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{ev.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          <span>{ev.startTime} - {ev.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="truncate">{ev.venue}, {ev.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-neutral-400" />
                          <span>Role: <strong className="text-neutral-900">{ev.requiredCategory}</strong></span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-neutral-600">
                        <span>Experience: <strong className="text-neutral-900">{ev.experienceRequirement}</strong></span>
                        <span>Positions: <strong className="text-neutral-900">{ev.crewPositionsAvailable} available</strong></span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedEventForModal(ev)}
                        className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        View Details
                      </button>

                      {hasApplied ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-200">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => onApplyToEvent(ev.id)}
                          className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          Apply Instantly
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB: MY APPLICATIONS ================= */}
        {activeTab === 'applications' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">My Applications</h3>
              <p className="text-xs text-neutral-500">
                Track status updates from event organisers in real time.
              </p>
            </div>

            {myApplications.length === 0 ? (
              <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-8 text-center text-xs text-neutral-500">
                You have not applied to any events yet. Browse open events to submit applications.
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
                      className="rounded-xl border border-neutral-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-neutral-900">{app.eventName}</h4>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              app.status === 'Accepted'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : app.status === 'Shortlisted'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                : app.status === 'Rejected'
                                ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Role: {app.crewCategory} • Shift Date: {app.eventDate} • Applied on {app.appliedAt}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1.5 text-right text-xs">
                        {app.status === 'Accepted' && (
                          <>
                            <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">Shift Confirmed</span>
                            {shiftGroup && (
                              <button
                                type="button"
                                onClick={() => onOpenGroupChat?.(shiftGroup)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 text-white px-2.5 py-1 text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                              >
                                <MessageSquare className="h-3 w-3 text-amber-400" />
                                <span>Shift Chat ({shiftGroup.messages.length})</span>
                              </button>
                            )}
                          </>
                        )}
                        {app.status === 'Shortlisted' && (
                          <span className="text-blue-700 font-semibold bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-lg">Organiser reviewing shortlist</span>
                        )}
                        {app.status === 'Pending' && (
                          <span className="text-neutral-500 font-medium">Awaiting organiser review</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: PROFILE ================= */}
        {activeTab === 'profile' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Your Verified Crew Profile</h3>
                <p className="text-xs text-neutral-500">
                  Organisers see these verified credentials when you apply.
                </p>
              </div>
              <button
                onClick={onOpenOnboarding}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/70">
                <div className="text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">Contact Information</div>
                <div className="font-bold text-sm text-neutral-900 mt-1.5">{crewProfile.name}</div>
                <div className="font-medium text-neutral-600 mt-0.5">{crewProfile.email}</div>
                <div className="font-medium text-neutral-600">{crewProfile.phone}</div>
              </div>

              <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/70">
                <div className="text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">Location & Address</div>
                <div className="font-bold text-sm text-neutral-900 mt-1.5">{crewProfile.city} ({crewProfile.pincode})</div>
                <div className="font-medium text-neutral-600 mt-0.5">{crewProfile.address}</div>
              </div>

              <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/70">
                <div className="text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">Experience & Roles</div>
                <div className="font-bold text-sm text-neutral-900 mt-1.5">{crewProfile.experienceYears} Years Experience</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {crewProfile.categories.map((c) => (
                    <span key={c} className="rounded-md bg-white px-2 py-0.5 font-medium text-neutral-700 border border-neutral-200 text-[11px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: NOTIFICATIONS ================= */}
        {activeTab === 'notifications' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Shift Alerts & Notifications</h3>
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-4 flex items-start gap-3">
                <Bell className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-neutral-900">System Rating Recalculated</div>
                  <p className="text-neutral-600 mt-0.5">
                    Your rating is at a verified 4.9★ based on prompt shift attendance and feedback.
                  </p>
                  <span className="text-[10px] text-neutral-400 mt-1 block">Today, 10:30 AM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Account Preferences</h3>
            <div className="space-y-3 text-xs text-neutral-800">
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/70">
                <div>
                  <div className="font-semibold text-neutral-900">Instant Event Shift SMS Alerts</div>
                  <div className="text-neutral-500 mt-0.5">Receive SMS notifications when events matching your categories open</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-neutral-900 rounded cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50/70 border border-neutral-200/70">
                <div>
                  <div className="font-semibold text-neutral-900">Direct Bank Transfer Auto-Settlement</div>
                  <div className="text-neutral-500 mt-0.5">Enable automatic UPI disbursement upon organizer shift sign-off</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-neutral-900 rounded cursor-pointer" />
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
