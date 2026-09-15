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
  ArrowRight,
  TrendingUp,
  MapPin,
  Star,
  ExternalLink,
  Sliders,
  Trash2,
  PauseCircle,
  PlayCircle,
  Eye,
  XCircle,
  UserCheck,
  ShieldCheck,
  MessageSquare,
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

  // Organiser Dashboard Metrics
  const activeEventsCount = events.filter((e) => e.status === 'Open').length;
  const upcomingEventsCount = events.filter(
    (e) => new Date(e.date) >= new Date() && e.status !== 'Closed'
  ).length;
  const crewRequiredCount = events.reduce((acc, e) => acc + e.crewPositionsTotal, 0);
  const totalApplicationsCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const confirmedCrewCount = applications.filter((a) => a.status === 'Accepted').length;

  const filteredApps = applications.filter((a) => {
    if (applicationFilter === 'all') return true;
    return a.status === applicationFilter;
  });

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Command Bar */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-0.5 text-[11px] font-semibold text-neutral-800">
                  <Building2 className="h-3.5 w-3.5 text-neutral-600" />
                  Organiser Command Center
                </span>
                {organiserProfile.hasUdyam && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Business Verified
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                {organiserProfile.companyName}
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-500">
                Lead Organiser: <span className="font-semibold text-neutral-800">{organiserProfile.name}</span> •{' '}
                {organiserProfile.city}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCreateEvent}
                className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </button>
            </div>
          </div>

          {/* 6 Requested Metric Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-neutral-100">
            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Active Events
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{activeEventsCount}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Upcoming Events
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{upcomingEventsCount}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Crew Required
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{crewRequiredCount}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Applications
              </div>
              <div className="mt-2 text-2xl font-bold text-neutral-900">{totalApplicationsCount}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Shortlisted
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-600">{shortlistedCount}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Confirmed Crew
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-600">{confirmedCrewCount}</div>
            </div>
          </div>
        </div>

        {/* Organiser Navigation Tabs */}
        <div className="mt-6 flex overflow-x-auto rounded-xl border border-neutral-200/80 bg-white p-1.5 scrollbar-none gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'events', label: `Events (${events.length})` },
            { id: 'applications', label: `Applications (${applications.length})` },
            { id: 'crew', label: `Crew Roster (${crewList.length})` },
            { id: 'profile', label: 'Profile & Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedEventForDetail(null);
              }}
              className={`shrink-0 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={onOpenCreateEvent}
            className="ml-auto shrink-0 flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Event</span>
          </button>
        </div>

        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Event Quick View Card */}
              <div className="lg:col-span-2 rounded-2xl border border-neutral-200/80 bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-neutral-900">Your Active Events</h3>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    View all events ({events.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {events.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="rounded-xl border border-neutral-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 uppercase tracking-wide">
                            {e.eventType}
                          </span>
                          <h4 className="font-bold text-sm text-neutral-900">{e.name}</h4>
                        </div>
                        <div className="mt-1 text-xs text-neutral-500">
                          {e.date} • {e.venue}, {e.city}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs">
                          <div className="font-semibold text-neutral-900">
                            {e.crewPositionsTotal - e.crewPositionsAvailable}/{e.crewPositionsTotal} Crew Confirmed
                          </div>
                          <div className="text-neutral-500 font-medium mt-0.5">₹{e.payAmount} {e.payBasis}</div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedEventForDetail(e);
                            setActiveTab('events');
                          }}
                          className="rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals Card */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6">
                <h3 className="text-base font-bold text-neutral-900 mb-0.5">Pending Applications</h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Candidates waiting for your review.
                </p>

                <div className="space-y-3">
                  {applications.filter((a) => a.status === 'Pending').length === 0 ? (
                    <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-6 text-center text-xs text-neutral-500">
                      No pending applications right now.
                    </div>
                  ) : (
                    applications
                      .filter((a) => a.status === 'Pending')
                      .slice(0, 3)
                      .map((app) => (
                        <div
                          key={app.id}
                          className="rounded-xl border border-neutral-200/80 bg-white p-3 flex items-center justify-between hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={app.crewPhoto}
                              alt={app.crewName}
                              referrerPolicy="no-referrer"
                              className="h-9 w-9 rounded-lg object-cover border border-neutral-200"
                            />
                            <div>
                              <div className="text-xs font-bold text-neutral-900">{app.crewName}</div>
                              <div className="text-[10px] text-neutral-500">{app.crewCategory}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                              className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                              className="rounded-lg bg-neutral-900 px-2 py-1 text-[11px] font-semibold text-white hover:bg-neutral-800 cursor-pointer"
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="w-full text-center text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    View All Applications ({applications.length}) →
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB: EVENTS (MANAGEMENT) ================= */}
        {activeTab === 'events' && (
          <div className="mt-6 space-y-6">
            {selectedEventForDetail ? (
              /* Event Detail View */
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <button
                    onClick={() => setSelectedEventForDetail(null)}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    ← Back to All Events
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800">
                      Status: {selectedEventForDetail.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                      {selectedEventForDetail.eventType}
                    </span>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">
                      {selectedEventForDetail.name}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
                      {selectedEventForDetail.date} • {selectedEventForDetail.startTime} -{' '}
                      {selectedEventForDetail.endTime} • {selectedEventForDetail.venue},{' '}
                      {selectedEventForDetail.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Event Shift Coordination Group Button */}
                    {(() => {
                      const eventGroup = eventGroups.find((g) => g.eventId === selectedEventForDetail.id);
                      if (eventGroup) {
                        return (
                          <button
                            type="button"
                            onClick={() => onOpenGroupChat?.(eventGroup)}
                            className="flex items-center gap-1.5 rounded-xl bg-purple-600 text-white px-3.5 py-2 text-xs font-semibold hover:bg-purple-700 cursor-pointer transition-colors shadow-xs"
                          >
                            <MessageSquare className="h-4 w-4 text-purple-200" />
                            <span>Event Crew Chat ({eventGroup.messages.length})</span>
                          </button>
                        );
                      }
                      return null;
                    })()}

                    {selectedEventForDetail.status === 'Open' ? (
                      <button
                        onClick={() => {
                          onUpdateEventStatus(selectedEventForDetail.id, 'Paused');
                          setSelectedEventForDetail({
                            ...selectedEventForDetail,
                            status: 'Paused',
                          });
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                      >
                        <PauseCircle className="h-4 w-4" />
                        <span>Pause Applications</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onUpdateEventStatus(selectedEventForDetail.id, 'Open');
                          setSelectedEventForDetail({
                            ...selectedEventForDetail,
                            status: 'Open',
                          });
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Publish Event</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onDeleteEvent(selectedEventForDetail.id);
                        setSelectedEventForDetail(null);
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Event Information & Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-4">
                    <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                      Crew Requirements
                    </div>
                    <div className="text-base font-bold text-neutral-900 mt-1">
                      {selectedEventForDetail.crewPositionsTotal} × {selectedEventForDetail.requiredCategory}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium mt-1">
                      Experience: {selectedEventForDetail.experienceRequirement}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium">
                      Gender: {selectedEventForDetail.genderRequirement}
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-4">
                    <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                      Compensation
                    </div>
                    <div className="text-base font-bold text-neutral-900 mt-1">
                      ₹{selectedEventForDetail.payAmount} {selectedEventForDetail.payBasis}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium mt-1">
                      Timeline: {selectedEventForDetail.paymentTimeline}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium">
                      Method: {selectedEventForDetail.paymentMethod || 'UPI / Direct Bank'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-4">
                    <div className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                      Dress Code & Brief
                    </div>
                    <div className="text-xs font-semibold text-neutral-900 mt-1">
                      {selectedEventForDetail.dressCode || 'Standard formal attire'}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {selectedEventForDetail.specialRequirements || 'No special requirements'}
                    </div>
                  </div>
                </div>

                {/* Applications for this Event */}
                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="text-base font-bold text-neutral-900 mb-3">
                    Applications for this Event (
                    {applications.filter((a) => a.eventId === selectedEventForDetail.id).length}
                    )
                  </h3>

                  <div className="space-y-2.5">
                    {applications.filter((a) => a.eventId === selectedEventForDetail.id).length ===
                    0 ? (
                      <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-6 text-center text-xs text-neutral-500">
                        No applications received yet for this event.
                      </div>
                    ) : (
                      applications
                        .filter((a) => a.eventId === selectedEventForDetail.id)
                        .map((app) => (
                          <div
                            key={app.id}
                            className="rounded-xl border border-neutral-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={app.crewPhoto}
                                alt={app.crewName}
                                referrerPolicy="no-referrer"
                                className="h-10 w-10 rounded-xl object-cover border border-neutral-200"
                              />
                              <div>
                                <div className="font-bold text-sm text-neutral-900">
                                  {app.crewName}
                                </div>
                                <div className="text-xs text-neutral-500 mt-0.5">
                                  {app.crewCategory} • {app.experienceYears} yrs exp • <span className="font-semibold text-neutral-800">{app.systemRating} ★</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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

                              {app.status !== 'Accepted' && (
                                <button
                                  onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                                  className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                  Accept
                                </button>
                              )}
                              {app.status === 'Pending' && (
                                <button
                                  onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                                  className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
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
              /* Events List with Controls */
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Your Created Events</h3>
                    <p className="text-xs text-neutral-500">
                      Organisers can only view and manage events created under their profile.
                    </p>
                  </div>
                  <button
                    onClick={onOpenCreateEvent}
                    className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Event</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="rounded-xl border border-neutral-200/80 bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 uppercase tracking-wide">
                            {evt.eventType}
                          </span>
                          <h4 className="text-base font-bold text-neutral-900">{evt.name}</h4>
                        </div>
                        <div className="text-xs text-neutral-500">
                          {evt.date} • {evt.startTime} - {evt.endTime} • {evt.venue}, {evt.city}
                        </div>
                        <div className="text-xs text-neutral-600">
                          Positions: <strong className="text-neutral-900">{evt.crewPositionsTotal} {evt.requiredCategory}</strong> • Pay: ₹{evt.payAmount} {evt.payBasis}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Coordination Chat Button / Status */}
                        {(() => {
                          const eventGroup = eventGroups.find((g) => g.eventId === evt.id);
                          const acceptedApps = applications.filter(
                            (a) => a.eventId === evt.id && a.status === 'Accepted'
                          ).length;
                          const isStaffed =
                            acceptedApps >= evt.crewPositionsTotal || evt.crewPositionsAvailable === 0;

                          if (eventGroup) {
                            return (
                              <button
                                type="button"
                                onClick={() => onOpenGroupChat?.(eventGroup)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1.5 text-xs font-semibold hover:bg-purple-100 cursor-pointer transition-colors"
                              >
                                <MessageSquare className="h-3.5 w-3.5 text-purple-700" />
                                <span>Shift Chat ({eventGroup.messages.length})</span>
                              </button>
                            );
                          }

                          if (isStaffed) {
                            return (
                              <span
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-[11px] font-medium"
                                title="All crew positions filled. Admin can provision the event coordination group."
                              >
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>Staffed ({acceptedApps}/{evt.crewPositionsTotal}) • Awaiting Admin Group</span>
                              </span>
                            );
                          }

                          return null;
                        })()}

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            evt.status === 'Open'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : evt.status === 'Paused'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                          }`}
                        >
                          {evt.status}
                        </span>

                        <button
                          onClick={() => setSelectedEventForDetail(evt)}
                          className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Details</span>
                        </button>

                        {evt.status === 'Open' ? (
                          <button
                            onClick={() => onUpdateEventStatus(evt.id, 'Paused')}
                            className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 cursor-pointer transition-colors"
                            title="Pause Event"
                          >
                            <PauseCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateEventStatus(evt.id, 'Open')}
                            className="rounded-xl bg-neutral-900 p-2 text-white hover:bg-neutral-800 cursor-pointer transition-colors"
                            title="Publish Event"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteEvent(evt.id)}
                          className="rounded-xl border border-neutral-200 bg-white p-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: APPLICATIONS ================= */}
        {activeTab === 'applications' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Crew Application Management</h3>
                <p className="text-xs text-neutral-500">
                  Review applicant profile photos, ratings, experience, and update statuses.
                </p>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-1 rounded-xl border border-neutral-200/80 bg-neutral-50 p-1">
                {(['all', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setApplicationFilter(filter)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                      applicationFilter === filter
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Applicant Cards */}
            <div className="space-y-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-neutral-200/80 bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={app.crewPhoto}
                      alt={app.crewName}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-xl object-cover border border-neutral-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-neutral-900">{app.crewName}</h4>
                        <div className="flex items-center gap-1 text-xs font-semibold text-neutral-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded-full">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          <span>{app.systemRating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Role: <strong className="text-neutral-800">{app.crewCategory}</strong> • Experience: {app.experienceYears} Years • City: {app.city}
                      </p>
                      {app.note && (
                        <p className="text-[11px] font-medium text-neutral-600 italic mt-1">"{app.note}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                    {app.status !== 'Accepted' && (
                      <button
                        onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                        className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        Accept
                      </button>
                    )}

                    {app.status !== 'Shortlisted' && app.status !== 'Accepted' && (
                      <button
                        onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        Shortlist
                      </button>
                    )}

                    {app.status !== 'Rejected' && (
                      <button
                        onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                        className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: CREW ================= */}
        {activeTab === 'crew' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Your Selected Event Crew Roster</h3>
              <p className="text-xs text-neutral-500">
                Confirmed personnel for your active and upcoming event operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crewList.map((crew) => (
                <div
                  key={crew.id}
                  className="rounded-xl border border-neutral-200/80 bg-white p-4 space-y-3 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={crew.photoUrl}
                      alt={crew.name}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-xl object-cover border border-neutral-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">{crew.name}</h4>
                      <p className="text-xs text-neutral-500">{crew.city} • {crew.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {crew.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800">{crew.systemRating} ★ Rating</span>
                    <span className="text-neutral-500">{crew.completedEventsCount} Shifts Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: PROFILE & SETTINGS ================= */}
        {activeTab === 'profile' && (
          <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Organiser Business Profile</h3>
              <p className="text-xs text-neutral-500">
                Manage company credentials, business verification, and address details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/70">
                <div className="text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">Company Name</div>
                <div className="text-base font-bold text-neutral-900 mt-1">{organiserProfile.companyName}</div>
              </div>

              <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/70">
                <div className="text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">Authorized Lead</div>
                <div className="text-base font-bold text-neutral-900 mt-1">{organiserProfile.name}</div>
              </div>

              <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/70">
                <div className="text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">Business Verification Status</div>
                <div className="flex items-center gap-2 mt-1">
                  {organiserProfile.hasUdyam ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Verified Business
                    </span>
                  ) : (
                    <span className="text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded text-xs font-medium">Pending Verification</span>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/70">
                <div className="text-neutral-500 font-semibold uppercase text-[11px] tracking-wider">City & Address</div>
                <div className="text-neutral-900 font-medium mt-1">
                  {organiserProfile.address}, {organiserProfile.city} ({organiserProfile.pincode})
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button
                onClick={onOpenOnboarding}
                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Edit Organiser Details
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
