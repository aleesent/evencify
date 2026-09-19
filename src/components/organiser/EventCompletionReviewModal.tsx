import React, { useState } from 'react';
import { EventItem, CrewApplication, CrewProfile } from '../../types';
import { X, Star, CheckCircle2, Award, Sparkles, MessageSquare, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventCompletionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  applications: CrewApplication[];
  crewList: CrewProfile[];
  onSubmitRatings: (
    eventId: string,
    ratings: { crewId: string; rating: number; feedback?: string; tags?: string[] }[]
  ) => void;
}

const REVIEW_TAGS = [
  'Punctual & On Time',
  'Polite & Professional',
  'Hardworking',
  'Followed Instructions',
  'Great Team Player',
  'Well Groomed',
];

export const EventCompletionReviewModal: React.FC<EventCompletionReviewModalProps> = ({
  isOpen,
  onClose,
  event,
  applications,
  crewList,
  onSubmitRatings,
}) => {
  if (!isOpen || !event) return null;

  // Filter accepted crew applications for this event
  const hiredApplications = applications.filter(
    (app) => app.eventId === event.id && (app.status === 'Accepted' || app.status === 'Shortlisted')
  );

  // Initialize rating state for each hired crew member
  const [crewRatings, setCrewRatings] = useState<
    Record<string, { rating: number; hoverRating: number; feedback: string; tags: string[] }>
  >(() => {
    const initial: Record<string, { rating: number; hoverRating: number; feedback: string; tags: string[] }> = {};
    hiredApplications.forEach((app) => {
      initial[app.crewId] = {
        rating: 5,
        hoverRating: 0,
        feedback: '',
        tags: ['Punctual & On Time', 'Hardworking'],
      };
    });
    return initial;
  });

  const handleStarClick = (crewId: string, starValue: number) => {
    setCrewRatings((prev) => ({
      ...prev,
      [crewId]: {
        ...(prev[crewId] || { hoverRating: 0, feedback: '', tags: [] }),
        rating: starValue,
      },
    }));
  };

  const handleStarHover = (crewId: string, starValue: number) => {
    setCrewRatings((prev) => ({
      ...prev,
      [crewId]: {
        ...(prev[crewId] || { rating: 5, feedback: '', tags: [] }),
        hoverRating: starValue,
      },
    }));
  };

  const handleTagToggle = (crewId: string, tag: string) => {
    setCrewRatings((prev) => {
      const current = prev[crewId] || { rating: 5, hoverRating: 0, feedback: '', tags: [] };
      const exists = current.tags.includes(tag);
      const newTags = exists ? current.tags.filter((t) => t !== tag) : [...current.tags, tag];
      return {
        ...prev,
        [crewId]: {
          ...current,
          tags: newTags,
        },
      };
    });
  };

  const handleFeedbackChange = (crewId: string, feedback: string) => {
    setCrewRatings((prev) => ({
      ...prev,
      [crewId]: {
        ...(prev[crewId] || { rating: 5, hoverRating: 0, tags: [] }),
        feedback,
      },
    }));
  };

  const handleSubmit = () => {
    const ratingsToSubmit = hiredApplications.map((app) => {
      const entry = crewRatings[app.crewId] || { rating: 5, feedback: '', tags: [] };
      return {
        crewId: app.crewId,
        rating: entry.rating || 5,
        feedback: entry.feedback.trim(),
        tags: entry.tags,
      };
    });

    onSubmitRatings(event.id, ratingsToSubmit);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-200/80 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b border-neutral-100 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Event Completion</span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Rate & Review Event Crew
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                {event.title} • {event.date}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
            {hiredApplications.length === 0 ? (
              <div className="rounded-2xl bg-neutral-50 border border-neutral-200/80 p-6 text-center">
                <Sparkles className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                <h3 className="font-bold text-neutral-900 text-base">No registered crew applications</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                  No crew members were formally accepted through the platform for this event. You can still mark the event as completed.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
                  <Award className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Verified Post-Event Rating System:</strong>
                    <p className="mt-0.5 text-amber-900/90 leading-relaxed">
                      Crew members only earn ratings and reviews after successfully working an event. Your evaluation directly establishes their verified rating.
                    </p>
                  </div>
                </div>

                {hiredApplications.map((app) => {
                  const ratingData = crewRatings[app.crewId] || {
                    rating: 5,
                    hoverRating: 0,
                    feedback: '',
                    tags: [],
                  };
                  const activeStars = ratingData.hoverRating || ratingData.rating;
                  const crewMember = crewList.find((c) => c.id === app.crewId);

                  return (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-5 space-y-4 hover:border-neutral-300 transition-colors"
                    >
                      {/* Crew Info & Star Rating */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={app.crewPhoto || crewMember?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={app.crewName}
                            referrerPolicy="no-referrer"
                            className="h-12 w-12 rounded-xl object-cover border border-neutral-200"
                          />
                          <div>
                            <h4 className="font-bold text-base text-neutral-900">{app.crewName}</h4>
                            <p className="text-xs text-neutral-500 font-medium">
                              {app.crewCategory} • {app.city}
                            </p>
                          </div>
                        </div>

                        {/* Interactive 5-Star Selector */}
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-neutral-200 shadow-2xs self-start sm:self-auto">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((starVal) => {
                              const isFilled = starVal <= activeStars;
                              return (
                                <button
                                  key={starVal}
                                  type="button"
                                  onClick={() => handleStarClick(app.crewId, starVal)}
                                  onMouseEnter={() => handleStarHover(app.crewId, starVal)}
                                  onMouseLeave={() => handleStarHover(app.crewId, 0)}
                                  className="p-1 hover:scale-115 transition-transform cursor-pointer"
                                  title={`${starVal} Star`}
                                >
                                  <Star
                                    className={`h-5 w-5 ${
                                      isFilled
                                        ? 'fill-amber-400 text-amber-500'
                                        : 'text-neutral-300 hover:text-neutral-400'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-xs font-bold text-neutral-800 min-w-[28px] text-center">
                            {ratingData.rating}.0
                          </span>
                        </div>
                      </div>

                      {/* Praise Tags */}
                      <div>
                        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide block mb-1.5">
                          What went well?
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {REVIEW_TAGS.map((tag) => {
                            const isSelected = ratingData.tags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagToggle(app.crewId, tag)}
                                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-neutral-900 text-white shadow-2xs'
                                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                                }`}
                              >
                                {isSelected && <ThumbsUp className="inline h-3 w-3 mr-1 text-amber-300" />}
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Optional Note */}
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>Review feedback for {app.crewName.split(' ')[0]} (optional)</span>
                        </div>
                        <input
                          type="text"
                          value={ratingData.feedback}
                          onChange={(e) => handleFeedbackChange(app.crewId, e.target.value)}
                          placeholder="e.g. Excellent communication, managed registration line smoothly."
                          className="w-full text-xs rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>
                {hiredApplications.length > 0 ? 'Submit Ratings & Complete Event' : 'Mark Event Completed'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
