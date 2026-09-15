import React, { useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import { CategorySEOContent } from '../CategorySEOContent';
import { RelatedEvents } from '../RelatedEvents';
import {
  CATEGORIES_DATABASE,
  CategoryData,
  getSEOData,
  slugify,
} from '../../../services/seoData';
import { Sparkles, Calendar } from 'lucide-react';

interface CategoryEventsPageProps {
  categorySlug: string;
  events: EventItem[];
}

export const CategoryEventsPage: React.FC<CategoryEventsPageProps> = ({
  categorySlug,
  events,
}) => {
  const catKey = categorySlug.toLowerCase();
  const category: CategoryData =
    CATEGORIES_DATABASE[catKey] || {
      slug: catKey,
      name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
      iconName: 'Sparkles',
      headline: `Upcoming ${categorySlug} Events Across India`,
      description: `Discover upcoming verified ${categorySlug} events across major Indian cities on Evencify.`,
      keywords: [`${categorySlug} near me`, `${categorySlug} in India`],
      relatedCategorySlugs: ['conferences', 'workshops', 'festivals'],
    };

  // Filter events in this category (flexible matching on eventType)
  const categoryEvents = useMemo(() => {
    return events.filter((e) => {
      const typeSlug = slugify(e.eventType);
      return (
        typeSlug === category.slug ||
        typeSlug.includes(category.slug) ||
        category.slug.includes(typeSlug)
      );
    });
  }, [events, category]);

  const otherEvents = useMemo(() => {
    return events.filter((e) => {
      const typeSlug = slugify(e.eventType);
      return (
        typeSlug !== category.slug &&
        !typeSlug.includes(category.slug) &&
        !category.slug.includes(typeSlug)
      );
    });
  }, [events, category]);

  const seo = useMemo(() => {
    return getSEOData({
      type: 'category',
      category,
      eventCount: categoryEvents.length,
    });
  }, [category, categoryEvents.length]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Sparkles className="h-4 w-4 text-[#FED000]" />
            <span>Category Hub • {category.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Category Events Grid */}
        {categoryEvents.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
              <span>
                Showing <strong className="text-neutral-900 font-semibold">{categoryEvents.length}</strong> upcoming{' '}
                <strong className="text-neutral-900 font-semibold">{category.name}</strong> across India
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center my-6">
            <Calendar className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">
              No upcoming {category.name.toLowerCase()} found at the moment
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-md mx-auto">
              New {category.name.toLowerCase()} are added daily by verified event planners. Check back shortly or browse other active categories.
            </p>
          </div>
        )}

        {/* Category SEO Content: Top Cities, FAQs, Guide */}
        <CategorySEOContent category={category} eventCount={categoryEvents.length} />

        {/* Other Categories Events */}
        {otherEvents.length > 0 && (
          <RelatedEvents
            title="Explore Other Event Categories"
            description="Discover other exciting event types happening across India."
            events={otherEvents}
            viewAllUrl="/events"
            viewAllLabel="Explore All Categories"
            maxEvents={3}
          />
        )}
      </div>
    </div>
  );
};
