import React, { useState } from 'react';
import {
  EventItem,
  CrewApplication,
  CrewProfile,
  OrganiserProfile,
  EventCoordinationGroup,
} from '../../types';
import {
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Banknote,
  FileCheck,
  Search,
  Building2,
  MapPin,
  Star,
  Trash2,
  PauseCircle,
  PlayCircle,
  Eye,
  ShieldCheck,
  MessageSquare,
  Home,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Filter,
  Sparkles,
  XCircle,
} from 'lucide-react';

interface OrganiserDashboardProps {
  events: EventItem[];
  applications: CrewApplication[];
  crewList: CrewProfile[];
  organiserProfile: OrganiserProfile;
  eventGroups?: EventCoordinationGroup[];
  onOpenGroupChat?: (group: EventCoordinationGroup) => void;
  onOpenCreateEvent: () => void;
  onOpenOnboarding: () => void;
  onSelectEvent: (event: EventItem) => void;
  onViewCrewProfile: (crew: CrewProfile) => void;
  onUpdateApplicationStatus: (appId: string, status: CrewApplication['status']) => void;
  onUpdateEventStatus: (eventId: string, status: EventItem['status']) => void;
  onDeleteEvent: (eventId: string) => void;
  activeTab?: 'overview' | 'events' | 'crew' | 'applications' | 'profile';
  onTabChange?: (tab: 'overview' | 'events' | 'crew' | 'applications' | 'profile') => void;
}

export const OrganiserDashboard: React.FC<OrganiserDashboardProps> = ({
  events,
  applications,
  crewList,
  organiserProfile,
  eventGroups = [],
  onOpenGroupChat,
  onOpenCreateEvent,
  onOpenOnboarding,
  onSelectEvent,
  onViewCrewProfile,
  onUpdateApplicationStatus,
  onUpdateEventStatus,
  onDeleteEvent,
  activeTab: propActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<
    'overview' | 'events' | 'crew' | 'applications' | 'profile'
  >('overview');

  const activeTab = propActiveTab || internalActiveTab;
  const setActiveTab = (tab: 'overview' | 'events' | 'crew' | 'applications' | 'profile') => {
    setInternalActiveTab(tab);
    onTabChange?.(tab);
  };

  const [applicationFilter, setApplicationFilter] = useState<
    'all' | 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected'
  >('all');

  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);

  const toggleCardExpansion = (id: string) => {
    setExpandedCardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // High-level Metrics
  const activeEventsCount = events.filter((e) => e.status === 'Open').length;
  const crewRequiredCount = events.reduce((acc, e) => acc + e.crewPositionsTotal, 0);
  const totalApplicationsCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const confirmedCrewCount = applications.filter((a) => a.status === 'Accepted').length;

  const filteredApps = applications.filter((a) => {
    if (applicationFilter === 'all') return true;
    return a.status === applicationFilter;
  });

  return (
    <div className="min-h-screen bg-neutral-100/60 pb-20 pt-4 sm:pt-6">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* ================= SIMPLIFIED TOP HEADER CARD ================= */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {organiserProfile.photoUrl ? (
                <img
                  src={organiserProfile.photoUrl}
                  alt={organiserProfile.companyName || organiserProfile.name}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-neutral-200 shadow-xs shrink-0 bg-neutral-100"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-black text-[#FED000] border-2 border-black flex items-center justify-center text-xl sm:text-2xl font-black shrink-0 shadow-xs">
                  {(organiserProfile.companyName || organiserProfile.name || 'O')[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-bold text-neutral-800">
                    <Building2 className="h-3.5 w-3.5 text-neutral-600" />
                    Organiser Dashboard
                  </span>
                  {organiserProfile.hasUdyam && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Verified Business
                    </span>
                  )}
                </div>

                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                  {organiserProfile.companyName || organiserProfile.name}
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-neutral-500 font-medium">
                  Host: <span className="font-bold text-neutral-800">{organiserProfile.name}</span> • {organiserProfile.city || 'Location Pending'}
                </p>
              </div>
            </div>

            {/* Quick action button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenCreateEvent}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
              >
                <Plus className="h-4 w-4 text-amber-300" />
                <span>Post New Event</span>
              </button>
            </div>
          </div>

          {/* 4 Clear Stat Tiles */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-neutral-100">
            {/* 1. Active Events */}
            <div
              onClick={() => {
                setSelectedEventForDetail(null);
                setActiveTab('events');
              }}
              className="rounded-xl bg-neutral-50 p-4 border border-neutral-200 cursor-pointer hover:bg-neutral-100/70 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                  Active Events
                </span>
                <Calendar className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900">
                {activeEventsCount}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-neutral-500">
                Events currently accepting crew
              </p>
            </div>

            {/* 2. Crew Needed */}
            <div
              onClick={() => {
                setSelectedEventForDetail(null);
                setActiveTab('events');
              }}
              className="rounded-xl bg-amber-50/60 p-4 border border-amber-200/80 cursor-pointer hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Crew Positions
                </span>
                <Users className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-900">
                {crewRequiredCount}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-amber-800">
                Total staff positions
              </p>
            </div>

            {/* 3. Applications Received */}
            <div
              onClick={() => setActiveTab('applications')}
              className="rounded-xl bg-blue-50/60 p-4 border border-blue-200/80 cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Applications
                </span>
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-blue-700">
                {totalApplicationsCount}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-blue-800">
                {pendingCount} waiting for your review
              </p>
            </div>

            {/* 4. Confirmed Crew */}
            <div
              onClick={() => setActiveTab('crew')}
              className="rounded-xl bg-emerald-50/60 p-4 border border-emerald-200/80 cursor-pointer hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Hired Crew
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-700">
                {confirmedCrewCount}
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-emerald-800">
                Confirmed for event shifts
              </p>
            </div>
          </div>
        </div>

        {/* ================= TAB NAVIGATION ================= */}
        <div className="mt-5 flex overflow-x-auto rounded-xl border border-neutral-200 bg-white p-1.5 scrollbar-none gap-1.5 shadow-xs">
          {[
            { id: 'overview', label: 'Dashboard', icon: Home },
            { id: 'events', label: `My Events (${events.length})`, icon: Calendar },
            { id: 'applications', label: `Applicants (${applications.length})`, icon: Users },
            { id: 'crew', label: `Hired Crew (${crewList.length})`, icon: CheckCircle2 },
            { id: 'profile', label: 'Company Profile', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedEventForDetail(null);
                }}
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

        {/* ================= TAB 1: DASHBOARD (OVERVIEW) ================= */}
        {activeTab === 'overview' && (
          <div className="mt-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Active Events Overview Card */}
              <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900">Your Active Events</h2>
                    <p className="text-xs text-neutral-500">Events open for crew applications</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEventForDetail(null);
                      setActiveTab('events');
                    }}
                    className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                  >
                    View All ({events.length}) →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {events.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
                      <Calendar className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-neutral-800">No active events yet</p>
                      <p className="text-xs text-neutral-500 mt-1 mb-4">Post your first event to start hiring verified crew.</p>
                      <button
                        type="button"
                        onClick={onOpenCreateEvent}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-amber-300" />
                        <span>Create Your First Event</span>
                      </button>
                    </div>
                  ) : (
                    events.slice(0, 3).map((e) => {
                    const filledSlots = e.crewPositionsTotal - e.crewPositionsAvailable;

                    return (
                      <div
                        key={e.id}
                        className="rounded-xl border border-neutral-200 bg-white p-3.5 sm:p-4 hover:border-neutral-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-neutral-900 truncate">{e.name}</h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                e.status === 'Open'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {e.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                            <span>{e.date}</span>
                            <span>•</span>
                            <span>{e.city}</span>
                            <span>•</span>
                            <span className="font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md">
                              {filledSlots}/{e.crewPositionsTotal} Hired
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEventForDetail(e);
                              setActiveTab('events');
                            }}
                            className="rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            Manage →
                          </button>
                        </div>
                      </div>
                    );
                  }))}
                </div>
              </div>

              {/* Pending Applicants Quick Action Card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-neutral-900">New Applicants</h2>
                    <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 text-[11px] font-bold">
                      {pendingCount} waiting
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-4">
                    Review and hire verified crew for your upcoming events.
                  </p>

                  <div className="space-y-3">
                    {applications.filter((a) => a.status === 'Pending').length === 0 ? (
                      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
                        No pending applications right now.
                      </div>
                    ) : (
                      applications
                        .filter((a) => a.status === 'Pending')
                        .slice(0, 3)
                        .map((app) => (
                          <div
                            key={app.id}
                            className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={app.crewPhoto}
                                alt={app.crewName}
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                              />
                              <div>
                                <div className="text-xs font-bold text-neutral-900">{app.crewName}</div>
                                <div className="text-[11px] text-neutral-500">{app.crewCategory}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                                className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                              >
                                Shortlist
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                              >
                                Hire
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('applications')}
                    className="w-full text-center text-xs font-bold text-neutral-800 hover:underline cursor-pointer py-1"
                  >
                    See All Applicants ({applications.length}) →
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: EVENTS ================= */}
        {activeTab === 'events' && (
          <div className="mt-5 space-y-5">
            {selectedEventForDetail ? (
              /* EVENT DETAIL & MANAGEMENT VIEW */
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedEventForDetail(null)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-700 hover:text-neutral-900 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back to all events</span>
                  </button>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      selectedEventForDetail.status === 'Open'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedEventForDetail.status === 'Paused'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                    }`}
                  >
                    {selectedEventForDetail.status === 'Open' ? 'Active • Accepting Crew' : selectedEventForDetail.status}
                  </span>
                </div>

                {/* Event header & actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-800 uppercase">
                      {selectedEventForDetail.eventType}
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900">
                      {selectedEventForDetail.name}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
                      {selectedEventForDetail.date} • {selectedEventForDetail.startTime} - {selectedEventForDetail.endTime} • {selectedEventForDetail.venue}, {selectedEventForDetail.city}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Shift Group Chat */}
                    {(() => {
                      const eventGroup = eventGroups.find((g) => g.eventId === selectedEventForDetail.id);
                      if (eventGroup) {
                        return (
                          <button
                            type="button"
                            onClick={() => onOpenGroupChat?.(eventGroup)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 text-white px-4 py-2.5 text-xs font-bold hover:bg-purple-800 cursor-pointer shadow-xs"
                          >
                            <MessageSquare className="h-4 w-4 text-purple-200" />
                            <span>Shift Chat ({eventGroup.messages.length})</span>
                          </button>
                        );
                      }
                      return null;
                    })()}

                    {selectedEventForDetail.status === 'Open' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateEventStatus(selectedEventForDetail.id, 'Paused');
                          setSelectedEventForDetail({
                            ...selectedEventForDetail,
                            status: 'Paused',
                          });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                      >
                        <PauseCircle className="h-4 w-4" />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateEventStatus(selectedEventForDetail.id, 'Open');
                          setSelectedEventForDetail({
                            ...selectedEventForDetail,
                            status: 'Open',
                          });
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 cursor-pointer"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Resume</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onDeleteEvent(selectedEventForDetail.id);
                        setSelectedEventForDetail(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* 3 Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] text-neutral-500 font-bold uppercase">Crew Needed</div>
                    <div className="text-lg font-extrabold text-neutral-900 mt-1">
                      {selectedEventForDetail.crewPositionsTotal} × {selectedEventForDetail.requiredCategory}
                    </div>
                    <div className="text-xs text-neutral-600 mt-0.5">
                      Experience: {selectedEventForDetail.experienceRequirement}
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] text-neutral-500 font-bold uppercase">Pay Per Shift</div>
                    <div className="text-lg font-extrabold text-neutral-900 mt-1">
                      ₹{selectedEventForDetail.payAmount} {selectedEventForDetail.payBasis}
                    </div>
                    <div className="text-xs text-neutral-600 mt-0.5">
                      Timeline: {selectedEventForDetail.paymentTimeline}
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="text-[11px] text-neutral-500 font-bold uppercase">Dress Code & Instructions</div>
                    <div className="text-xs font-bold text-neutral-900 mt-1">
                      {selectedEventForDetail.dressCode || 'Formal black attire'}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {selectedEventForDetail.specialRequirements || 'No special requirements'}
                    </div>
                  </div>
                </div>

                {/* Applicants for this Event */}
                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-base font-bold text-neutral-900 mb-3">
                    Applicants for this Event ({applications.filter((a) => a.eventId === selectedEventForDetail.id).length})
                  </h3>

                  <div className="space-y-2.5">
                    {applications.filter((a) => a.eventId === selectedEventForDetail.id).length === 0 ? (
                      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-xs text-neutral-500">
                        No applications received yet for this event.
                      </div>
                    ) : (
                      applications
                        .filter((a) => a.eventId === selectedEventForDetail.id)
                        .map((app) => (
                          <div
                            key={app.id}
                            className="rounded-xl border border-neutral-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={app.crewPhoto}
                                alt={app.crewName}
                                referrerPolicy="no-referrer"
                                className="h-11 w-11 rounded-xl object-cover border border-neutral-200 shrink-0"
                              />
                              <div>
                                <div className="font-extrabold text-sm text-neutral-900">
                                  {app.crewName}
                                </div>
                                <div className="text-xs text-neutral-500 mt-0.5">
                                  {app.crewCategory} • {app.experienceYears} yrs exp • ⭐ {app.systemRating}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                  app.status === 'Accepted'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.status === 'Shortlisted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : app.status === 'Rejected'
                                    ? 'bg-neutral-100 text-neutral-600'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {app.status === 'Accepted'
                                  ? 'Hired'
                                  : app.status === 'Shortlisted'
                                  ? 'Shortlisted'
                                  : app.status === 'Pending'
                                  ? 'Waiting'
                                  : 'Declined'}
                              </span>

                              {app.status !== 'Accepted' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                                >
                                  Hire
                                </button>
                              )}
                              {app.status === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                                >
                                  Shortlist
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* EVENTS LIST WITH CONTROLS */
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900">Your Created Events</h2>
                    <p className="text-xs text-neutral-500">Manage staffing, applications, and shift dates</p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCreateEvent}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-amber-300" />
                    <span>Create Event</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {events.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
                      <Calendar className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-neutral-900">You haven't posted any events yet</h3>
                      <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto mb-5">
                        Create and publish an event to start receiving applications from verified event crew with skill verification and direct hiring.
                      </p>
                      <button
                        type="button"
                        onClick={onOpenCreateEvent}
                        className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
                      >
                        <Plus className="h-4 w-4 text-amber-300" />
                        <span>Create New Event</span>
                      </button>
                    </div>
                  ) : (
                    events.map((evt) => {
                    const filledSlots = evt.crewPositionsTotal - evt.crewPositionsAvailable;
                    const eventGroup = eventGroups.find((g) => g.eventId === evt.id);
                    const isExpanded = expandedCardIds.includes(evt.id);

                    return (
                      <div
                        key={evt.id}
                        className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 hover:border-neutral-300 transition-colors shadow-2xs"
                      >
                        {/* Summary View (Uncongested: only minimal, clear data shown first) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-neutral-900 truncate">
                                {evt.name}
                              </h3>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                  evt.status === 'Open'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : evt.status === 'Paused'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {evt.status}
                              </span>
                            </div>

                            <div className="mt-1 flex items-center gap-2.5 text-xs text-neutral-500 flex-wrap">
                              <span>{evt.date}</span>
                              <span>•</span>
                              <span>{evt.city}</span>
                              <span>•</span>
                              <span className="font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md">
                                {filledSlots}/{evt.crewPositionsTotal} Hired
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleCardExpansion(evt.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors"
                            >
                              <span>{isExpanded ? 'Less' : 'Details'}</span>
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedEventForDetail(evt)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 cursor-pointer transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5 text-amber-300" />
                              <span>Manage</span>
                            </button>
                          </div>
                        </div>

                        {/* Full Details (Only visible when expanded or clicked to open) */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                              <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                                <div className="text-neutral-400 font-bold uppercase text-[10px]">Time & Venue</div>
                                <div className="font-bold text-neutral-800 mt-0.5">{evt.startTime} - {evt.endTime}</div>
                                <div className="text-neutral-600 mt-0.5">{evt.venue}, {evt.city}</div>
                              </div>

                              <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                                <div className="text-neutral-400 font-bold uppercase text-[10px]">Staffing & Pay</div>
                                <div className="font-bold text-neutral-800 mt-0.5">
                                  {filledSlots} of {evt.crewPositionsTotal} {evt.requiredCategory} hired
                                </div>
                                <div className="text-neutral-600 mt-0.5">₹{evt.payAmount} {evt.payBasis}</div>
                              </div>

                              <div className="rounded-xl bg-neutral-50 p-3 border border-neutral-100">
                                <div className="text-neutral-400 font-bold uppercase text-[10px]">Category & Payment</div>
                                <div className="font-bold text-neutral-800 mt-0.5">{evt.eventType}</div>
                                <div className="text-neutral-600 mt-0.5">Payment: {evt.paymentTimeline}</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <div className="flex flex-wrap items-center gap-2">
                                {eventGroup && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenGroupChat?.(eventGroup)}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-700 text-white px-3 py-1.5 text-xs font-bold hover:bg-purple-800 cursor-pointer shadow-xs"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5 text-purple-200" />
                                    <span>Shift Chat</span>
                                  </button>
                                )}

                                {evt.status === 'Open' ? (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateEventStatus(evt.id, 'Paused')}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                                  >
                                    <PauseCircle className="h-3.5 w-3.5 text-neutral-500" />
                                    <span>Pause</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onUpdateEventStatus(evt.id, 'Open')}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 cursor-pointer"
                                  >
                                    <PlayCircle className="h-3.5 w-3.5" />
                                    <span>Resume</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => onDeleteEvent(evt.id)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedEventForDetail(evt)}
                                className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer ml-auto"
                              >
                                Full Event Management & Applicants →
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: APPLICANTS ================= */}
        {activeTab === 'applications' && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">Review Crew Applicants</h2>
                <p className="text-xs text-neutral-500">
                  Tap 'Hire' to confirm crew members for your events.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-1">
                {(['all', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'] as const).map((filter) => {
                  const label =
                    filter === 'all'
                      ? 'All'
                      : filter === 'Pending'
                      ? 'Waiting'
                      : filter === 'Shortlisted'
                      ? 'Shortlisted'
                      : filter === 'Accepted'
                      ? 'Hired'
                      : 'Declined';

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setApplicationFilter(filter)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                        applicationFilter === filter
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Applicant Cards */}
            <div className="space-y-3">
              {filteredApps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-xs text-neutral-500">
                  No applicants matching this filter.
                </div>
              ) : (
                filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={app.crewPhoto}
                        alt={app.crewName}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-neutral-900">{app.crewName}</h3>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/70 border border-amber-200 px-2 py-0.2 rounded-md">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                            <span>{app.systemRating}</span>
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                          Role: <strong className="text-neutral-900">{app.crewCategory}</strong> • {app.experienceYears} Years Exp • {app.city}
                        </p>
                        {app.note && (
                          <p className="text-xs font-medium text-neutral-600 italic mt-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200 inline-block">
                            "{app.note}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Rejected'
                            ? 'bg-neutral-100 text-neutral-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status === 'Accepted'
                          ? '✓ Hired'
                          : app.status === 'Shortlisted'
                          ? '⭐ Shortlisted'
                          : app.status === 'Pending'
                          ? '⏳ Waiting Review'
                          : 'Declined'}
                      </span>

                      {app.status !== 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                          className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Hire Crew
                        </button>
                      )}

                      {app.status !== 'Shortlisted' && app.status !== 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                          className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Shortlist
                        </button>
                      )}

                      {app.status !== 'Rejected' && (
                        <button
                          type="button"
                          onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: CREW ROSTER ================= */}
        {activeTab === 'crew' && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">Your Confirmed Crew Roster</h2>
              <p className="text-xs text-neutral-500">
                Staff members confirmed for your upcoming event shifts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crewList.map((crew) => (
                <div
                  key={crew.id}
                  className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3 hover:border-neutral-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={crew.photoUrl}
                      alt={crew.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-neutral-900">{crew.name}</h3>
                      <p className="text-xs text-neutral-500">{crew.city} • Verified Staff</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {crew.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-bold text-neutral-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800">⭐ {crew.systemRating} Rating</span>
                    <button
                      type="button"
                      onClick={() => onViewCrewProfile(crew)}
                      className="text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: COMPANY PROFILE ================= */}
        {activeTab === 'profile' && (
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">Organiser Business Profile</h2>
              <p className="text-xs text-neutral-500">
                Company credentials and address details visible on event shift listings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider">Company Name</div>
                <div className="text-base font-extrabold text-neutral-900 mt-1">{organiserProfile.companyName}</div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider">Authorized Lead</div>
                <div className="text-base font-extrabold text-neutral-900 mt-1">{organiserProfile.name}</div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider">Business Verification</div>
                <div className="flex items-center gap-2 mt-1">
                  {organiserProfile.hasUdyam ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Verified Business
                    </span>
                  ) : (
                    <span className="text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full text-xs font-medium">Pending Verification</span>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider">Location & Address</div>
                <div className="text-neutral-900 font-medium mt-1">
                  {organiserProfile.address}, {organiserProfile.city} ({organiserProfile.pincode})
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="text-neutral-500 font-bold uppercase text-[11px] tracking-wider">Your Contact Details</div>
                  <span className="text-[11px] text-neutral-500 bg-neutral-200/80 px-2 py-0.5 rounded-md font-medium">Private (Only you & Admin)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
                  <div>
                    <span className="text-neutral-500">Email:</span>{' '}
                    <span className="font-semibold text-neutral-900">{organiserProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Phone:</span>{' '}
                    <span className="font-semibold text-neutral-900">{organiserProfile.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
