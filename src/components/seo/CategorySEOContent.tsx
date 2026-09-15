import React from 'react';
import { CategoryData, CITIES_DATABASE } from '../../services/seoData';
import { Sparkles, MapPin } from 'lucide-react';
import { navigateTo } from '../../services/router';
import { FaqAccordion } from './FaqAccordion';

interface CategorySEOContentProps {
  category: CategoryData;
  eventCount: number;
}

export const CategorySEOContent: React.FC<CategorySEOContentProps> = ({ category, eventCount }) => {
  const topCities = [
    CITIES_DATABASE.surat,
    CITIES_DATABASE.ahmedabad,
    CITIES_DATABASE.mumbai,
    CITIES_DATABASE.bengaluru,
    CITIES_DATABASE.delhi,
    CITIES_DATABASE.pune,
  ].filter(Boolean);

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    navigateTo(url);
  };

  const categoryFaqs = [
    {
      q: `How do I book tickets for upcoming ${category.name.toLowerCase()}?`,
      a: `On Evencify, each ${category.name.toLowerCase()} listing provides verified venue directions, entry guidelines, schedule timings, and official organizer booking links.`,
    },
    {
      q: `Can event crew apply to work at ${category.name.toLowerCase()}?`,
      a: `Yes! Registered crew members on Evencify can view shift details, hourly/daily payout rates, and apply directly to work at ${category.name.toLowerCase()} in their city.`,
    },
    {
      q: `How can organizers list their upcoming ${category.name.toLowerCase()} on Evencify?`,
      a: `Event organizers can create a verified organizer profile on Evencify, list their event in minutes, and instantly broadcast staffing requirements to local qualified crew.`,
    },
  ];

  return (
    <div className="space-y-10 my-10">
      {/* Category Overview Card */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          <Sparkles className="h-4 w-4 text-[#FED000]" />
          <span>Category Spotlight</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
          About {category.name} on Evencify
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-4xl">
          {category.description} Currently featuring {eventCount} verified events across India.
        </p>

        {/* Top Cities Hosting this Category */}
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-neutral-400" />
            <span>Top Cities for {category.name}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {topCities.map((city) => {
              const url = `/events/${city.slug}/${category.slug}`;
              return (
                <a
                  key={city.slug}
                  href={url}
                  onClick={(e) => handleLinkClick(e, url)}
                  className="flex flex-col items-center justify-center text-center rounded-xl border border-neutral-200 bg-neutral-50/60 p-3 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-xs font-bold text-neutral-900">{city.name}</span>
                  <span className="text-[11px] text-neutral-500">{category.name} →</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category FAQs */}
      <FaqAccordion
        title={`Frequently Asked Questions About ${category.name}`}
        description={`Common questions regarding discovering and staffing ${category.name.toLowerCase()} in India.`}
        faqs={categoryFaqs}
      />
    </div>
  );
};
