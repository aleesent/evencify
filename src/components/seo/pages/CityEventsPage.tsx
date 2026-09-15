import React, { useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import { CitySEOContent } from '../CitySEOContent';
import { RelatedEvents } from '../RelatedEvents';
import {
  CITIES_DATABASE,
  CityData,
  getSEOData,
  normalizeCitySlug,
  slugify,
} from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import { MapPin, Calendar, Sparkles, PlusCircle } from 'lucide-react';

interface CityEventsPageProps {
  citySlug: string;
  events: EventItem[];
  onOpenCreateEvent?: () => void;
}

export const CityEventsPage: React.FC<CityEventsPageProps> = ({
  citySlug,
  events,
  onOpenCreateEvent,
}) => {
  const normalizedSlug = normalizeCitySlug(citySlug);
  const city: CityData =
    CITIES_DATABASE[normalizedSlug] || {
      slug: normalizedSlug,
      name: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
      state: 'India',
      stateSlug: 'india',
      tier: 2,
      priority: false,
      lat: 21.1702,
      lng: 72.8311,
      description: `Discover upcoming verified live events, exhibitions, concerts, and workshops in ${citySlug}.`,
    };

  // Filter events in this city
  const cityEvents = useMemo(() => {
    return events.filter(
      (e) => e.city.toLowerCase() === city.name.toLowerCase() || slugify(e.city) === city.slug
    );
  }, [events, city]);

  // Other regional events
  const otherEvents = useMemo(() => {
    return events.filter(
      (e) => e.city.toLowerCase() !== city.name.toLowerCase() && slugify(e.city) !== city.slug
    );
  }, [events, city]);

  const seo = useMemo(() => {
    return getSEOData({
      type: 'city',
      city,
      eventCount: cityEvents.length,
    });
  }, [city, cityEvents.length]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <MapPin className="h-4 w-4 text-[#FED000]" />
            <span>
              {city.name}, {city.state} • Event Hub
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {seo.h1}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
                Explore {cityEvents.length} verified upcoming events happening across {city.name}. Find live concerts, tech summits, trade expos, and cultural gatherings with verified crew support.
              </p>
            </div>

            {onOpenCreateEvent && (
              <button
                onClick={onOpenCreateEvent}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <PlusCircle className="h-4 w-4 text-[#FED000]" />
                <span>List Event in {city.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Date Pills for this City */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <span className="text-neutral-400 shrink-0 uppercase text-[11px] tracking-wider">When in {city.name}:</span>
          <button
            onClick={() => navigateTo('/events/near-me')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Events Near Me</span>
          </button>
          <button
            onClick={() => navigateTo('/events/today')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Today in {city.name}</span>
          </button>
          <button
            onClick={() => navigateTo('/events/this-weekend')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>This Weekend in {city.name}</span>
          </button>
          <button
            onClick={() => navigateTo(`/events/${city.slug}/concerts`)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Concerts in {city.name}</span>
          </button>
        </div>

        {/* Events Grid in this City */}
        {cityEvents.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
              <span>
                Showing <strong className="text-neutral-900 font-semibold">{cityEvents.length}</strong> upcoming events in{' '}
                <strong className="text-neutral-900 font-semibold">{city.name}</strong>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center my-6">
            <Calendar className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">
              No active events scheduled in {city.name} right now
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-md mx-auto">
              Organizing an event in {city.name}? List it on Evencify to hire background-verified crew and reach local attendees.
            </p>
            {onOpenCreateEvent && (
              <button
                onClick={onOpenCreateEvent}
                className="mt-4 inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
              >
                Create Event in {city.name}
              </button>
            )}
          </div>
        )}

        {/* City Rich SEO Content: Localities, Venues, FAQs, Categories */}
        <CitySEOContent city={city} eventCount={cityEvents.length} />

        {/* Regional Events Across India */}
        {otherEvents.length > 0 && (
          <RelatedEvents
            title={`More Events in ${city.state} & Across India`}
            description="Explore verified upcoming events happening in other cities."
            events={otherEvents}
            viewAllUrl="/events"
            viewAllLabel="Explore All Events"
            maxEvents={3}
          />
        )}
      </div>
    </div>
  );
};
