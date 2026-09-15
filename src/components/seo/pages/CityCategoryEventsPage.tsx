import React, { useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import { RelatedEvents } from '../RelatedEvents';
import { FaqAccordion } from '../FaqAccordion';
import {
  CITIES_DATABASE,
  CATEGORIES_DATABASE,
  CityData,
  CategoryData,
  getSEOData,
  normalizeCitySlug,
  slugify,
} from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import { MapPin, Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface CityCategoryEventsPageProps {
  citySlug: string;
  categorySlug: string;
  events: EventItem[];
}

export const CityCategoryEventsPage: React.FC<CityCategoryEventsPageProps> = ({
  citySlug,
  categorySlug,
  events,
}) => {
  const normalizedCity = normalizeCitySlug(citySlug);
  const city: CityData =
    CITIES_DATABASE[normalizedCity] || {
      slug: normalizedCity,
      name: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
      state: 'India',
      stateSlug: 'india',
      tier: 2,
      priority: false,
      lat: 21.1702,
      lng: 72.8311,
      description: `Events in ${citySlug}`,
    };

  const catKey = categorySlug.toLowerCase();
  const category: CategoryData =
    CATEGORIES_DATABASE[catKey] || {
      slug: catKey,
      name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      iconName: 'Sparkles',
      headline: `${categorySlug} in ${city.name}`,
      description: `Upcoming ${categorySlug} in ${city.name}`,
      keywords: [`${categorySlug} in ${city.name}`],
      relatedCategorySlugs: [],
    };

  // Filter events that match BOTH city and category
  const matchedEvents = useMemo(() => {
    return events.filter((e) => {
      const matchCity =
        e.city.toLowerCase() === city.name.toLowerCase() || slugify(e.city) === city.slug;
      const typeSlug = slugify(e.eventType);
      const matchCat =
        typeSlug === category.slug ||
        typeSlug.includes(category.slug) ||
        category.slug.includes(typeSlug);

      return matchCity && matchCat;
    });
  }, [events, city, category]);

  // Other events in the same city
  const otherCityEvents = useMemo(() => {
    return events.filter((e) => {
      const matchCity =
        e.city.toLowerCase() === city.name.toLowerCase() || slugify(e.city) === city.slug;
      const typeSlug = slugify(e.eventType);
      const matchCat =
        typeSlug === category.slug ||
        typeSlug.includes(category.slug) ||
        category.slug.includes(typeSlug);

      return matchCity && !matchCat;
    });
  }, [events, city, category]);

  const seo = useMemo(() => {
    return getSEOData({
      type: 'city-category',
      city,
      category,
      eventCount: matchedEvents.length,
    });
  }, [city, category, matchedEvents.length]);

  const otherCategories = Object.values(CATEGORIES_DATABASE)
    .filter((c) => c.slug !== category.slug)
    .slice(0, 6);

  const otherCities = [
    CITIES_DATABASE.surat,
    CITIES_DATABASE.ahmedabad,
    CITIES_DATABASE.mumbai,
    CITIES_DATABASE.bengaluru,
    CITIES_DATABASE.delhi,
  ].filter((c) => c && c.slug !== city.slug);

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    navigateTo(url);
  };

  const comboFaqs = [
    {
      q: `Where are ${category.name.toLowerCase()} typically held in ${city.name}?`,
      a: `In ${city.name}, popular venues for ${category.name.toLowerCase()} include ${
        city.popularVenues?.slice(0, 2).join(' and ') || 'leading convention halls and auditoriums'
      }.`,
    },
    {
      q: `How can I attend upcoming ${category.name.toLowerCase()} in ${city.name}?`,
      a: `Select any event from the verified listings above to view event schedules, entry terms, parking details, and book passes directly.`,
    },
    {
      q: `Can event crew apply for shifts at ${category.name.toLowerCase()} in ${city.name}?`,
      a: `Yes, registered Evencify crew in ${city.name} can view open crew positions, daily wages, and apply for shift assignments.`,
    },
  ];

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
              {city.name} • {category.name} Directory
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            Discover verified upcoming {category.name.toLowerCase()} in {city.name}, {city.state}. Verified venue schedules, artist lineups, and professional event crew support on Evencify.
          </p>
        </div>

        {/* Matched Events Grid */}
        {matchedEvents.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
              <span>
                Showing <strong className="text-neutral-900 font-semibold">{matchedEvents.length}</strong> upcoming{' '}
                <strong className="text-neutral-900 font-semibold">{category.name}</strong> in{' '}
                <strong className="text-neutral-900 font-semibold">{city.name}</strong>
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
              No scheduled {category.name.toLowerCase()} in {city.name} right now
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-md mx-auto">
              Check out other active categories in {city.name} below or discover {category.name.toLowerCase()} across other Indian cities.
            </p>
          </div>
        )}

        {/* Cross-linking Section: Other Categories in this City */}
        <section className="my-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Sparkles className="h-4 w-4 text-[#FED000]" />
            <span>More in {city.name}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4">
            Other Event Categories in {city.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {otherCategories.map((c) => {
              const url = `/events/${city.slug}/${c.slug}`;
              return (
                <a
                  key={c.slug}
                  href={url}
                  onClick={(e) => handleLinkClick(e, url)}
                  className="flex flex-col items-center justify-center text-center rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-xs font-bold text-neutral-900">{c.name}</span>
                  <span className="text-[11px] text-neutral-500">In {city.name} →</span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Cross-linking Section: Same Category in Other Cities */}
        <section className="my-10 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <MapPin className="h-4 w-4 text-[#FED000]" />
            <span>National Circuit</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-4">
            {category.name} in Other Major Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {otherCities.map((c) => {
              const url = `/events/${c.slug}/${category.slug}`;
              return (
                <a
                  key={c.slug}
                  href={url}
                  onClick={(e) => handleLinkClick(e, url)}
                  className="flex flex-col items-center justify-center text-center rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-xs font-bold text-neutral-900">{c.name}</span>
                  <span className="text-[11px] text-neutral-500">{category.name} →</span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Combination FAQ */}
        <FaqAccordion
          title={`FAQs: ${category.name} in ${city.name}`}
          description={`Answers to common questions regarding attending and organizing ${category.name.toLowerCase()} in ${city.name}.`}
          faqs={comboFaqs}
        />

        {/* Other Events in this City */}
        {otherCityEvents.length > 0 && (
          <RelatedEvents
            title={`More Upcoming Events in ${city.name}`}
            description={`Explore other verified productions and gatherings happening in ${city.name}.`}
            events={otherCityEvents}
            viewAllUrl={`/events/${city.slug}`}
            viewAllLabel={`View All Events in ${city.name}`}
            maxEvents={3}
          />
        )}
      </div>
    </div>
  );
};
