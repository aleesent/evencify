import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, DollarSign, Users, Clock, AlertCircle } from 'lucide-react';
import { EventItem, EVENT_TYPES, EventType, CREW_CATEGORIES, CrewCategory, EventStatus } from '../../types';

interface AdminEventEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onSave: (updatedEvent: EventItem) => void;
  onDelete?: (eventId: string) => void;
}

export const AdminEventEditModal: React.FC<AdminEventEditModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<EventItem | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({ ...event });
      setError('');
    }
  }, [event, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Event name is required.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Admin: Edit Event Details
            </h3>
            <p className="text-xs text-neutral-500">
              Update event status, remuneration, dates, or positions needed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventType })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 font-medium focus:border-neutral-400 focus:outline-hidden"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Moderation Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 font-medium focus:border-neutral-400 focus:outline-hidden"
              >
                <option value="Open">Open (Active Applications)</option>
                <option value="Paused">Paused</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Venue Location
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Pay Amount (₹)
              </label>
              <input
                type="number"
                value={formData.payAmount}
                onChange={(e) => setFormData({ ...formData, payAmount: parseInt(e.target.value) || 0 })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Pay Basis
              </label>
              <select
                value={formData.payBasis}
                onChange={(e) => setFormData({ ...formData, payBasis: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 font-medium focus:border-neutral-400 focus:outline-hidden"
              >
                <option value="Per Day">Per Day</option>
                <option value="Per Shift">Per Shift</option>
                <option value="Per Hour">Per Hour</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Total Positions
              </label>
              <input
                type="number"
                value={formData.crewPositionsTotal}
                onChange={(e) => setFormData({ ...formData, crewPositionsTotal: parseInt(e.target.value) || 1 })}
                className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 focus:border-neutral-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Permanently delete event "${formData.name}"?`)) {
                    onDelete(formData.id);
                    onClose();
                  }
                }}
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              >
                Delete Event
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Save Event
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
