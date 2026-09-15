import React, { useState } from 'react';
import { EventItem, CrewProfile } from '../../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Banknote,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CrewOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  crewProfile: CrewProfile;
  hasApplied: boolean;
  onApply: (eventId: string, note?: string) => void;
}

export const CrewOpportunityModal: React.FC<CrewOpportunityModalProps> = ({
  isOpen,
  onClose,
  event,
  crewProfile,
  hasApplied,
  onApply,
}) => {
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(hasApplied);

  if (!isOpen || !event) return null;

  const handleApplyClick = () => {
    onApply(event.id, note);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative my-8 w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 rounded-full p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Top category badges */}
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-800 uppercase tracking-wide">
              {event.eventType}
            </span>
            <span className="rounded-full bg-neutral-900 text-white px-3 py-1 text-xs font-semibold">
              {event.requiredCategory}
            </span>
            <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 px-3 py-1 text-xs font-semibold">
              {event.crewPositionsAvailable} Slots Open
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
            {event.name}
          </h2>

          <div className="mt-1 text-xs text-neutral-500">
            Organised by <span className="font-semibold text-neutral-800">{event.organiserName}</span>
          </div>

          {/* Event Key Details Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Date</span>
              </div>
              <div className="text-sm font-bold text-neutral-900">{event.date}</div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Shift Time</span>
              </div>
              <div className="text-sm font-bold text-neutral-900">
                {event.startTime} - {event.endTime}
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50/70 p-3.5 border border-neutral-200/60">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mb-1">
                <Banknote className="h-3.5 w-3.5" />
                <span>Pay Amount</span>
              </div>
              <div className="text-sm font-bold text-neutral-900">
                ₹{event.payAmount.toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-500 font-medium">{event.payBasis}</div>
            </div>

            <div className="rounded-xl bg-amber-50/80 p-3.5 border border-amber-200/60">
              <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Disbursement</span>
              </div>
              <div className="text-sm font-bold text-amber-900">{event.paymentTimeline}</div>
            </div>
          </div>

          {/* Venue & Location */}
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60">
            <MapPin className="h-5 w-5 text-neutral-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Venue & City</div>
              <div className="text-xs text-neutral-900 font-medium mt-0.5">
                {event.venue}, {event.city}
              </div>
            </div>
          </div>

          {/* Role Specifications & Requirements */}
          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Shift Specifications & Role Brief
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-neutral-200 p-3.5 bg-white">
                <span className="text-neutral-500 font-medium">Experience Requirement:</span>
                <div className="font-semibold text-neutral-900 mt-0.5">
                  {event.experienceRequirement}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 p-3.5 bg-white">
                <span className="text-neutral-500 font-medium">Gender Preference:</span>
                <div className="font-semibold text-neutral-900 mt-0.5">{event.genderRequirement}</div>
              </div>

              <div className="rounded-xl border border-neutral-200 p-3.5 bg-white">
                <span className="text-neutral-500 font-medium">Age Requirement:</span>
                <div className="font-semibold text-neutral-900 mt-0.5">{event.ageRequirement}</div>
              </div>

              <div className="rounded-xl border border-neutral-200 p-3.5 bg-white">
                <span className="text-neutral-500 font-medium">Expected Attendance:</span>
                <div className="font-semibold text-neutral-900 mt-0.5">
                  {event.expectedAttendance} Attendees
                </div>
              </div>
            </div>

            {/* Dress Code */}
            {event.dressCode && (
              <div className="rounded-xl bg-neutral-50/80 border border-neutral-200 text-neutral-800 p-3.5 text-xs">
                <span className="font-semibold text-neutral-900">Dress Code:</span>{' '}
                <span className="text-neutral-700">{event.dressCode}</span>
              </div>
            )}

            {/* Special Instructions */}
            {event.specialRequirements && (
              <div className="rounded-xl bg-white border border-neutral-200 p-3.5 text-xs text-neutral-800">
                <span className="font-semibold text-neutral-900">Special Instructions:</span>{' '}
                <span className="text-neutral-600">{event.specialRequirements}</span>
              </div>
            )}
          </div>

          {/* Application Section */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            {submitted ? (
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/60 p-5 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <h4 className="mt-2 text-base font-bold text-neutral-900">Application Submitted!</h4>
                <p className="mt-1 text-xs text-neutral-600">
                  Status: <span className="font-semibold text-emerald-700 uppercase tracking-wide">Pending Organiser Review</span>
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  You will receive an instant notification when the organiser shortlists or accepts your
                  profile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-neutral-50/70 p-4 border border-neutral-200/60 text-xs">
                  <div className="font-semibold text-neutral-900 mb-1.5">
                    Applying with your Evencify Profile:
                  </div>
                  <div className="flex flex-wrap gap-4 text-neutral-600">
                    <div>
                      Name: <span className="font-semibold text-neutral-900">{crewProfile.name}</span>
                    </div>
                    <div>
                      City: <span className="font-semibold text-neutral-900">{crewProfile.city}</span>
                    </div>
                    <div>
                      Rating:{' '}
                      <span className="font-semibold text-neutral-900">{crewProfile.systemRating} ★</span>
                    </div>
                    <div>
                      Phone:{' '}
                      <span className="font-semibold text-neutral-900">{crewProfile.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Short message / note to organiser (optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. 'I live 10 mins from venue and can arrive 30 mins early in black formal attire.'"
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-hidden transition-all"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleApplyClick}
                    className="flex-2 rounded-xl bg-neutral-900 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Confirm & Apply for Shift
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
