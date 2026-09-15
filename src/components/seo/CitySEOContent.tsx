import React from 'react';
import { CityData, CITIES_DATABASE, CATEGORIES_DATABASE, slugify } from '../../services/seoData';
import { MapPin, Building, Sparkles, Compass } from 'lucide-react';
import { navigateTo } from '../../services/router';
import { FaqAccordion } from './FaqAccordion';

interface CitySEOContentProps {
  city: CityData;
  eventCount: number;
}

export const CitySEOContent: React.FC<CitySEOContentProps> = ({ city, eventCount }) => {
  const nearbyCities = Object.values(CITIES_DATABASE)
    .filter((c) => c.stateSlug === city.stateSlug && c.slug !== city.slug)
    .slice(0, 6);

  const topCategories = Object.values(CATEGORIES_DATABASE).slice(0, 8);

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    navigateTo(url);
  };

  return (
    <div className="space-y-10 my-10">
      {/* About City Section */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          <MapPin className="h-4 w-4 text-[#FED000]" />
          <span>Local Event Ecosystem</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
          About Events in {city.name}, {city.state}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-4xl">
          {city.description} Evencify brings you direct access to {eventCount} verified upcoming events across {city.name}, offering verified crew recruitment, seamless venue discovery, and tickets.
        </p>

        {/* Priority Areas in City (Surat/Metro highlight) */}
        {city.areas && city.areas.length > 0 && (
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Popular Localities & Event Areas in {city.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {city.areas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FED000]" />
                  <span>{area}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Popular Venues */}
        {city.popularVenues && city.popularVenues.length > 0 && (
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building className="h-4 w-4 text-neutral-400" />
              <span>Key Exhibition Centres & Arenas in {city.name}</span>
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-neutral-600">
              {city.popularVenues.map((venue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-neutral-400">•</span>
                  <span>{venue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Explore Categories in City */}
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          <Sparkles className="h-4 w-4 text-[#FED000]" />
          <span>Category Directory</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
          Event Categories in {city.name}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 mb-5">
          Browse specialized events in {city.name} categorized by genre, industry, and interests.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {topCategories.map((cat) => {
            const catUrl = `/events/${city.slug}/${cat.slug}`;
            return (
              <a
                key={cat.slug}
                href={catUrl}
                onClick={(e) => handleLinkClick(e, catUrl)}
                className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3 hover:border-neutral-400 hover:shadow-xs transition-all text-xs font-semibold text-neutral-800"
              >
                <span>{cat.name} in {city.name}</span>
                <span className="text-[#FED000] font-bold">→</span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Nearby Cities in the same state */}
      {nearbyCities.length > 0 && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Compass className="h-4 w-4 text-[#FED000]" />
            <span>Regional Hubs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
            More Events Across {city.state}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mb-5">
            Discover verified events happening in other key cities across {city.state}.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {nearbyCities.map((nc) => {
              const cityUrl = `/events/${nc.slug}`;
              return (
                <a
                  key={nc.slug}
                  href={cityUrl}
                  onClick={(e) => handleLinkClick(e, cityUrl)}
                  className="flex flex-col items-center justify-center text-center rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-xs font-bold text-neutral-900">{nc.name}</span>
                  <span className="text-[11px] text-neutral-500">View Events →</span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* City FAQs */}
      {city.faqs && city.faqs.length > 0 && (
        <FaqAccordion
          title={`Frequently Asked Questions About Events in ${city.name}`}
          description={`Common queries regarding attending, discovering, and staffing events in ${city.name}.`}
          faqs={city.faqs}
        />
      )}
    </div>
  );
};
