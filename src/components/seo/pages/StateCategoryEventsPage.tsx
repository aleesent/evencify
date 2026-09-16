import React, { useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import { RelatedEvents } from '../RelatedEvents';
import {
  STATES_DATABASE,
  CATEGORIES_DATABASE,
  CITIES_DATABASE,
  StateData,
  CategoryData,
  getSEOData,
  normalizeCitySlug,
  slugify,
} from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import { Compass, Sparkles, Calendar, ArrowRight, MapPin } from 'lucide-react';

interface StateCategoryEventsPageProps {
  stateSlug: string;
  categorySlug: string;
  events: EventItem[];
}

export const StateCategoryEventsPage: React.FC<StateCategoryEventsPageProps> = ({
  stateSlug,
  categorySlug,
  events,
}) => {
  const cleanStateSlug = stateSlug.toLowerCase();
  const state: StateData =
    STATES_DATABASE[cleanStateSlug] || {
      slug: cleanStateSlug,
      name: stateSlug.charAt(0).toUpperCase() + stateSlug.slice(1),
      capital: 'Capital',
      description: `Discover upcoming events across ${stateSlug}.`,
      priorityCities: ['Surat', 'Ahmedabad', 'Vadodara', 'Rajkot'],
    };

  const cleanCatSlug = categorySlug.toLowerCase();
  const category: CategoryData =
    CATEGORIES_DATABASE[cleanCatSlug] || {
      slug: cleanCatSlug,
      name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      iconName: 'Sparkles',
      headline: `${categorySlug} Events in ${state.name}`,
      description: `Discover upcoming ${categorySlug} across ${state.name}.`,
      keywords: [`${categorySlug} in ${state.name}`],
      relatedCategorySlugs: [],
    };

  // Filter events matching both state and category
  const matchedEvents = useMemo(() => {
    return events.filter((e) => {
      const citySlug = normalizeCitySlug(e.city);
      const cityData = CITIES_DATABASE[citySlug];
      const matchState =
        cityData?.stateSlug === state.slug ||
        state.priorityCities.some((pc) => pc.toLowerCase() === e.city.toLowerCase());

      const typeSlug = slugify(e.eventType);
      const matchCat =
        typeSlug === category.slug ||
        typeSlug.includes(category.slug) ||
        category.slug.includes(typeSlug);

      return matchState && matchCat;
    });
  }, [events, state, category]);

  const seo = useMemo(() => {
    return getSEOData({
      type: 'state-category',
      state,
      category,
      eventCount: matchedEvents.length,
    });
  }, [state, category, matchedEvents.length]);

  const otherCategories = Object.values(CATEGORIES_DATABASE)
    .filter((c) => c.slug !== category.slug)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Compass className="h-4 w-4 text-[#FED000]" />
            <span>
              {state.name} • {category.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            Discover verified upcoming {category.name.toLowerCase()} happening across {state.name}, including major hubs like Surat, Ahmedabad, Vadodara, and Rajkot.
          </p>
        </div>

        {/* City Filter Pills within this State for this category */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <span className="text-neutral-400 shrink-0 uppercase text-[11px] tracking-wider">
            Explore by City in {state.name}:
          </span>
          {state.priorityCities.map((cityName) => {
            const citySlug = slugify(cityName);
            return (
              <button
                key={citySlug}
                onClick={() => navigateTo(`/events/${citySlug}/${category.slug}`)}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
              >
                <MapPin className="h-3 w-3 text-neutral-400" />
                <span>
                  {cityName} {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Events Grid */}
        {matchedEvents.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
              <span>
                Showing <strong className="text-neutral-900 font-semibold">{matchedEvents.length}</strong> upcoming{' '}
                <strong className="text-neutral-900 font-semibold">{category.name}</strong> across{' '}
                <strong className="text-neutral-900 font-semibold">{state.name}</strong>
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center my-6">
            <Calendar className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">
              No active {category.name.toLowerCase()} scheduled across {state.name} right now
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-md mx-auto">
              Organizing an event in {state.name}? List it on Evencify to hire background-verified crew and reach attendees.
            </p>
            <button
              onClick={() => navigateTo('/events')}
              className="mt-4 inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
            >
              Browse All Events in India
            </button>
          </div>
        )}

        {/* Other Categories in this State */}
        <div className="mt-16 pt-8 border-t border-neutral-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">
            More Event Categories in {state.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {otherCategories.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigateTo(`/events/${state.slug}/${c.slug}`)}
                className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-white hover:border-black transition-colors text-left text-xs font-semibold text-neutral-800 cursor-pointer group"
              >
                <span>{c.name}</span>
                <ArrowRight className="h-3 w-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
