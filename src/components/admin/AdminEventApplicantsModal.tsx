import React, { useState } from 'react';
import {
  X,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Filter,
  Search,
  Trash2,
  Briefcase,
  MessageSquare,
  FileText,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { EventItem, CrewApplication, CrewProfile, EventCoordinationGroup } from '../../types';

interface AdminEventApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  applications: CrewApplication[];
  crewList: CrewProfile[];
  eventGroups?: EventCoordinationGroup[];
  onCreateEventGroup?: (eventId: string) => void;
  onOpenGroupChat?: (group: EventCoordinationGroup) => void;
  onUpdateApplicationStatus: (appId: string, status: CrewApplication['status']) => void;
  onDeleteApplication?: (appId: string) => void;
  onViewCrewProfile?: (crew: CrewProfile) => void;
}

export const AdminEventApplicantsModal: React.FC<AdminEventApplicantsModalProps> = ({
  isOpen,
  onClose,
  event,
  applications,
  crewList,
  eventGroups = [],
  onCreateEventGroup,
  onOpenGroupChat,
  onUpdateApplicationStatus,
  onDeleteApplication,
  onViewCrewProfile,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !event) return null;

  // Filter applications for this event
  const eventApplications = applications.filter((app) => app.eventId === event.id);

  const filteredApps = eventApplications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.crewName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.crewCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.crewPhone && app.crewPhone.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const acceptedCount = eventApplications.filter((a) => a.status === 'Accepted').length;
  const shortlistedCount = eventApplications.filter((a) => a.status === 'Shortlisted').length;
  const pendingCount = eventApplications.filter((a) => a.status === 'Pending').length;
  const rejectedCount = eventApplications.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-200/90 bg-white shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 bg-neutral-50/50 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  <Users className="h-3 w-3 text-amber-400" />
                  Admin Transparency Console
                </span>
                <span className="font-mono text-xs bg-neutral-200/80 text-neutral-700 px-2 py-0.5 rounded font-medium">
                  {event.id}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    event.status === 'Open'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <h2 className="mt-1.5 text-lg sm:text-xl font-bold text-neutral-900">
                {event.name}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                  Organiser: <strong className="text-neutral-800">{event.organiserName}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                  {event.date} ({event.startTime} - {event.endTime})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                  {event.venue}, {event.city}
                </span>
                <span className="flex items-center gap-1 font-semibold text-neutral-900">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  Pay: ₹{event.payAmount.toLocaleString('en-IN')} {event.payBasis} ({event.paymentTimeline})
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Metrics / Breakdown Banner */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3 border-t border-neutral-200/60">
            <div className="rounded-xl bg-white p-2.5 border border-neutral-200/80">
              <div className="text-[10px] uppercase font-semibold text-neutral-500">Total Positions</div>
              <div className="text-lg font-bold text-neutral-900 mt-0.5">{event.crewPositionsTotal} slots</div>
            </div>
            <div className="rounded-xl bg-white p-2.5 border border-neutral-200/80">
              <div className="text-[10px] uppercase font-semibold text-neutral-500">Total Applied</div>
              <div className="text-lg font-bold text-neutral-900 mt-0.5">{eventApplications.length} crew</div>
            </div>
            <div className="rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-200/80">
              <div className="text-[10px] uppercase font-semibold text-emerald-700">Accepted</div>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">{acceptedCount} hired</div>
            </div>
            <div className="rounded-xl bg-blue-50/70 p-2.5 border border-blue-200/80">
              <div className="text-[10px] uppercase font-semibold text-blue-700">Shortlisted</div>
              <div className="text-lg font-bold text-blue-700 mt-0.5">{shortlistedCount} candidates</div>
            </div>
            <div className="rounded-xl bg-amber-50/70 p-2.5 border border-amber-200/80">
              <div className="text-[10px] uppercase font-semibold text-amber-700">Pending Review</div>
              <div className="text-lg font-bold text-amber-700 mt-0.5">{pendingCount} awaiting</div>
            </div>
          </div>

          {/* Admin Shift Group Creation & Chat Option */}
          {(() => {
            const existingGroup = eventGroups.find((g) => g.eventId === event.id);
            const isRequirementMet =
              acceptedCount >= event.crewPositionsTotal || event.crewPositionsAvailable === 0;

            if (existingGroup) {
              return (
                <div className="mt-3.5 rounded-xl bg-neutral-900 text-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare className="h-5 w-5 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Event Coordination Group Active</span>
                        <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.2 border border-emerald-500/30">
                          {existingGroup.crewMembers.length} Crew + Organiser
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 truncate">
                        Restricted chat between {event.organiserName} and accepted crew.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenGroupChat?.(existingGroup)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-neutral-900 px-3.5 py-2 text-xs font-bold hover:bg-neutral-100 transition-colors shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-neutral-900" />
                    <span>Open Event Chat ({existingGroup.messages.length})</span>
                  </button>
                </div>
              );
            }

            if (isRequirementMet) {
              return (
                <div className="mt-3.5 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                        <span>Crew Requirement 100% Fulfilled ({acceptedCount}/{event.crewPositionsTotal} hired)</span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.2">
                          Ready for Coordination
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Admin Exclusive Action: Create an official shift group with only this event's organiser ({event.organiserName}) and the {acceptedCount} hired crew members to coordinate.
                      </p>
                    </div>
                  </div>
                  {onCreateEventGroup && (
                    <button
                      type="button"
                      onClick={() => onCreateEventGroup(event.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-200" />
                      <span>Create Event Group</span>
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div className="mt-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 p-3 flex items-center justify-between gap-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
                  <span>
                    Crew requirement progress: <strong>{acceptedCount}</strong> of <strong>{event.crewPositionsTotal}</strong> hired ({event.crewPositionsTotal - acceptedCount} slots remaining).
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  Admin can create event coordination group once requirements are fulfilled.
                </span>
              </div>
            );
          })()}
        </div>

        {/* Filter bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Applicants', count: eventApplications.length },
              { id: 'Pending', label: 'Pending', count: pendingCount },
              { id: 'Shortlisted', label: 'Shortlisted', count: shortlistedCount },
              { id: 'Accepted', label: 'Accepted', count: acceptedCount },
              { id: 'Rejected', label: 'Rejected', count: rejectedCount },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search applicant name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs rounded-lg border border-neutral-200 bg-neutral-50/60 pl-8 pr-3 py-1.5 text-neutral-900 focus:bg-white focus:outline-hidden focus:border-neutral-400"
            />
          </div>
        </div>

        {/* Applicants List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-10 w-10 text-neutral-300" />
              <h4 className="mt-2 text-sm font-semibold text-neutral-800">No applicants found</h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                {eventApplications.length === 0
                  ? 'No crew members have applied for this event yet.'
                  : 'No applicants match your active filter or search query.'}
              </p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const crewDetail = crewList.find((c) => c.id === app.crewId);

              return (
                <div
                  key={app.id}
                  className="rounded-xl border border-neutral-200/80 bg-white p-4.5 hover:border-neutral-300 transition-colors shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    {/* Left: Crew Information */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={app.crewPhoto}
                        alt={app.crewName}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-neutral-900">{app.crewName}</h4>
                          <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                            {app.crewId}
                          </span>
                          <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span>{app.systemRating}</span>
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                            {app.crewCategory}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-neutral-400" />
                            {app.crewPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-neutral-400" />
                            {app.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-neutral-400" />
                            {app.experienceYears} Years Exp
                          </span>
                          <span className="flex items-center gap-1 text-neutral-400">
                            <Clock className="h-3 w-3" />
                            Applied {app.appliedAt}
                          </span>
                        </div>

                        {/* Pitch / Cover Note Submitted by Crew */}
                        {app.note && (
                          <div className="mt-2.5 rounded-lg bg-neutral-50 p-2.5 border border-neutral-200/60 text-xs text-neutral-700">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-0.5 flex items-center gap-1">
                              <MessageSquare className="h-2.5 w-2.5" />
                              Applicant Pitch / Note:
                            </div>
                            <p className="italic text-neutral-800">"{app.note}"</p>
                          </div>
                        )}

                        {/* Transparency Financial details */}
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
                          <span>Payable upon check-out:</span>
                          <strong className="text-neutral-900 font-semibold">
                            ₹{event.payAmount.toLocaleString('en-IN')} {event.payBasis}
                          </strong>
                          <span>• Direct UPI/Bank via Organiser Escrow</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Admin Controls */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                      
                      {/* Current Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          app.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : app.status === 'Shortlisted'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : app.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.status === 'Accepted' && <CheckCircle2 className="h-3 w-3" />}
                        {app.status === 'Shortlisted' && <Star className="h-3 w-3" />}
                        {app.status}
                      </span>

                      {/* Admin Override Status Selector */}
                      <div className="flex items-center gap-1.5">
                        <label className="text-[10px] font-semibold text-neutral-400 hidden sm:block">Status:</label>
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateApplicationStatus(app.id, e.target.value as any)}
                          className="text-xs font-semibold rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-neutral-900 focus:outline-hidden focus:border-neutral-400 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        {crewDetail && onViewCrewProfile && (
                          <button
                            type="button"
                            onClick={() => onViewCrewProfile(crewDetail)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View Profile</span>
                          </button>
                        )}

                        {onDeleteApplication && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove application for ${app.crewName}?`)) {
                                onDeleteApplication(app.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between flex-shrink-0 text-xs text-neutral-500">
          <div>
            Showing <strong className="text-neutral-900">{filteredApps.length}</strong> of{' '}
            <strong className="text-neutral-900">{eventApplications.length}</strong> total applicants for this event.
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Done Viewing
          </button>
        </div>

      </div>
    </div>
  );
};
