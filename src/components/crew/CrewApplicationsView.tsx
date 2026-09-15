import React from 'react';
import { Application, EventListing } from '../../types';
import { CheckCircle2, Clock, XCircle, Clock3, Calendar } from 'lucide-react';

interface CrewApplicationsViewProps {
  applications: Application[];
  events: EventListing[];
}

export const CrewApplicationsView: React.FC<CrewApplicationsViewProps> = ({
  applications,
  events,
}) => {
  const getEvent = (id: string) => events.find((e) => e.id === id);

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-[#FED000] border-2 border-black px-3 py-1 text-xs font-black text-black">
            <CheckCircle2 className="h-3.5 w-3.5 text-black" />
            Accepted • Ready for Shift
          </span>
        );
      case 'Shortlisted':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-white border-2 border-black px-3 py-1 text-xs font-black text-black">
            <Clock3 className="h-3.5 w-3.5 text-black" />
            Shortlisted by Organiser
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-black text-white border-2 border-black px-3 py-1 text-xs font-bold">
            <XCircle className="h-3.5 w-3.5" />
            Slots Filled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 rounded-full bg-[#FFFDE6] border-2 border-black px-3 py-1 text-xs font-black text-black">
            <Clock className="h-3.5 w-3.5 text-black" />
            Under Review
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <div className="text-xs font-black tracking-wider text-black uppercase">
            MY SHIFT PIPELINE
          </div>
          <h1 className="mt-1 text-3xl font-black text-black">My Shift Applications</h1>
          <p className="text-sm font-semibold text-black">
            Track status, shortlisted notifications, and payout settlements.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-3xl border-2 border-black bg-white p-12 text-center">
            <Calendar className="h-10 w-10 text-black mx-auto" />
            <h3 className="mt-3 text-lg font-black text-black">No applications yet</h3>
            <p className="mt-1 text-xs font-semibold text-black">
              Head over to "Find Shifts" to explore open gigs in your city.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const event = getEvent(app.eventId);
              if (!event) return null;

              return (
                <div
                  key={app.id}
                  className="rounded-2xl border-2 border-black bg-white p-5 sm:p-6 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/15 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-black text-white px-2 py-0.5 text-xs font-bold">
                          {event.eventType}
                        </span>
                        <span className="text-xs font-bold text-black">
                          Applied on {app.appliedAt}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-lg font-black text-black">{event.name}</h3>
                      <div className="text-xs font-bold text-black">
                        Organiser: <span className="underline font-black">{event.organiserName}</span>
                      </div>
                    </div>

                    <div>{getStatusBadge(app.status)}</div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold text-black">
                    <div>
                      <span className="text-black">Date</span>
                      <div className="font-black text-black mt-0.5">{event.date}</div>
                    </div>
                    <div>
                      <span className="text-black">Shift Timing</span>
                      <div className="font-black text-black mt-0.5">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                    <div>
                      <span className="text-black">Pay</span>
                      <div className="font-black text-black mt-0.5">
                        ₹{event.payAmount.toLocaleString()} ({event.payBasis})
                      </div>
                    </div>
                    <div>
                      <span className="text-black">Venue</span>
                      <div className="font-semibold text-black truncate mt-0.5">
                        {event.venue}, {event.city}
                      </div>
                    </div>
                  </div>

                  {app.note && (
                    <div className="mt-3 rounded-xl bg-[#FFFDE6] border border-black p-2.5 text-xs text-black">
                      <span className="font-black text-black">Your note:</span> {app.note}
                    </div>
                  )}

                  {app.status === 'Accepted' && (
                    <div className="mt-4 rounded-xl bg-[#FED000] border-2 border-black p-3 text-xs text-black flex items-center justify-between font-black">
                      <span>
                        Reporting time: <strong>30 mins before shift start</strong> at Gate 2
                      </span>
                      <span className="font-black underline">Payout: Same day UPI</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
