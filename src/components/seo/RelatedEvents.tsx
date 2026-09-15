import React from 'react';
import { EventItem } from '../../types';
import { EventCard } from './EventCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { navigateTo } from '../../services/router';
import { slugify } from '../../services/seoData';

interface RelatedEventsProps {
  title: string;
  description?: string;
  events: EventItem[];
  viewAllUrl?: string;
  viewAllLabel?: string;
  maxEvents?: number;
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({
  title,
  description,
  events,
  viewAllUrl,
  viewAllLabel = 'View All',
  maxEvents = 3,
}) => {
  if (!events || events.length === 0) return null;

  const displayedEvents = events.slice(0, maxEvents);

  const handleViewAll = (e: React.MouseEvent) => {
    if (viewAllUrl) {
      e.preventDefault();
      navigateTo(viewAllUrl);
    }
  };

  return (
    <section className="my-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <Sparkles className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Discover More</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{title}</h2>
          {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
        </div>

        {viewAllUrl && (
          <a
            href={viewAllUrl}
            onClick={handleViewAll}
            className="inline-flex items-center gap-1 text-sm font-bold text-neutral-900 hover:text-black hover:underline shrink-0"
          >
            <span>{viewAllLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedEvents.map((evt) => (
          <EventCard key={evt.id} event={evt} />
        ))}
      </div>
    </section>
  );
};
