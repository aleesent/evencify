import React from 'react';
import { EventItem } from '../../types';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Briefcase,
  ArrowRight,
  Sparkles,
  Building,
} from 'lucide-react';
import { getEventCanonicalUrl, slugify } from '../../services/seoData';
import { navigateTo } from '../../services/router';

interface EventCardProps {
  event: EventItem;
  variant?: 'grid' | 'compact';
  showCrewRoles?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  variant = 'grid',
  showCrewRoles = true,
}) => {
  const citySlug = slugify(event.city || 'india');
  const eventSlug = slugify(event.name);
  const eventUrl = `/events/${citySlug}/${eventSlug}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(eventUrl);
  };

  const totalCrewPositions = event.crewRequirements?.reduce((sum, req) => sum + req.count, 0) || 0;
  const filledCrewPositions = event.crewRequirements?.reduce((sum, req) => sum + req.filled, 0) || 0;

  // Pretty Category Badge
  const categoryBadge = (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/5 px-2.5 py-0.5 text-xs font-semibold text-neutral-800 border border-neutral-200">
      <Sparkles className="h-3 w-3 text-[#FED000]" />
      <span>{event.eventType || 'Event'}</span>
    </span>
  );

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {categoryBadge}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
              event.status === 'Open'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : event.status === 'In-Progress'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
            }`}
          >
            {event.status}
          </span>
        </div>

        {/* Title Link with Real Href for SEO Crawlers */}
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors line-clamp-2">
          <a
            href={eventUrl}
            onClick={handleClick}
            className="focus:outline-none focus:underline"
            title={`${event.name} in ${event.city}`}
          >
            {event.name}
          </a>
        </h3>

        {/* Organiser */}
        <p className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
          <Building className="h-3 w-3 text-neutral-400" />
          <span>By {event.organiserName}</span>
        </p>

        {/* Date, Time & Venue */}
        <div className="mt-4 space-y-2 text-xs sm:text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#FED000] shrink-0" />
            <span className="font-medium text-neutral-900">{event.date}</span>
            <span className="text-neutral-300">•</span>
            <Clock className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
            <span>
              {event.startTime} – {event.endTime}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
            <span className="truncate">
              <strong className="text-neutral-900 font-medium">{event.venue}</strong>, {event.city}
            </span>
          </div>

          {event.expectedAttendance && (
            <div className="flex items-center gap-2 text-neutral-500">
              <Users className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span>~{event.expectedAttendance.toLocaleString()} Expected Attendees</span>
            </div>
          )}
        </div>

        {/* Crew Staffing Highlight */}
        {showCrewRoles && totalCrewPositions > 0 && (
          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-500 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-neutral-400" />
                <span>Crew Positions:</span>
              </span>
              <span className="font-semibold text-neutral-900">
                {filledCrewPositions}/{totalCrewPositions} Staffed
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {event.crewRequirements?.slice(0, 3).map((req) => (
                <span
                  key={req.role}
                  className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700"
                >
                  {req.role} ({req.count - req.filled} left)
                </span>
              ))}
              {(event.crewRequirements?.length || 0) > 3 && (
                <span className="text-[11px] text-neutral-400 self-center">
                  +{(event.crewRequirements?.length || 0) - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Button */}
      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">Verified Event</span>
        <a
          href={eventUrl}
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};
