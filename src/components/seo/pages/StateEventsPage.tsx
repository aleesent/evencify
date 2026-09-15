import React, { useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import { StateSEOContent } from '../StateSEOContent';
import { RelatedEvents } from '../RelatedEvents';
import {
  STATES_DATABASE,
  StateData,
  CITIES_DATABASE,
  getSEOData,
  slugify,
  normalizeCitySlug,
} from '../../../services/seoData';
import { Compass, Calendar } from 'lucide-react';

interface StateEventsPageProps {
  stateSlug: string;
  events: EventItem[];
}

export const StateEventsPage: React.FC<StateEventsPageProps> = ({ stateSlug, events }) => {
  const cleanSlug = stateSlug.toLowerCase();
  const state: StateData =
    STATES_DATABASE[cleanSlug] || {
      slug: cleanSlug,
      name: stateSlug.charAt(0).toUpperCase() + stateSlug.slice(1),
      capital: 'Capital',
      description: `Discover upcoming verified events across ${stateSlug} on Evencify.`,
      priorityCities: ['Surat', 'Ahmedabad', 'Mumbai', 'Bengaluru'],
    };

  // Find all events located in cities in this state
  const stateEvents = useMemo(() => {
    return events.filter((e) => {
      const citySlug = normalizeCitySlug(e.city);
      const cityData = CITIES_DATABASE[citySlug];
      if (cityData && cityData.stateSlug === state.slug) {
        return true;
      }
      // Or if event city matches priority cities of state
      return state.priorityCities.some(
        (pc) => pc.toLowerCase() === e.city.toLowerCase()
      );
    });
  }, [events, state]);

  const otherEvents = useMemo(() => {
    return events.filter((e) => !stateEvents.includes(e));
  }, [events, stateEvents]);

  const seo = useMemo(() => {
    return getSEOData({
      type: 'state',
      state,
      eventCount: stateEvents.length,
    });
  }, [state, stateEvents.length]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Compass className="h-4 w-4 text-[#FED000]" />
            <span>State Network • {state.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            {state.description} Currently featuring {stateEvents.length} verified events with active crew recruitment and venue guides.
          </p>
        </div>

        {/* Events Grid in this State */}
        {stateEvents.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
              <span>
                Showing <strong className="text-neutral-900 font-semibold">{stateEvents.length}</strong> upcoming events across{' '}
                <strong className="text-neutral-900 font-semibold">{state.name}</strong>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stateEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center my-6">
            <Calendar className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">
              No scheduled events in {state.name} right now
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-md mx-auto">
              Event organizers in {state.name} are constantly scheduling new productions. Check back shortly.
            </p>
          </div>
        )}

        {/* State Rich Content */}
        <StateSEOContent state={state} eventCount={stateEvents.length} />

        {/* Other National Events */}
        {otherEvents.length > 0 && (
          <RelatedEvents
            title="More Events Across India"
            description="Discover verified productions and gatherings happening nationwide."
            events={otherEvents}
            viewAllUrl="/events"
            viewAllLabel="View All Events"
            maxEvents={3}
          />
        )}
      </div>
    </div>
  );
};
