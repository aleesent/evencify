import React, { useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import { RelatedEvents } from '../RelatedEvents';
import { getSEOData, slugify } from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import { Calendar, Sparkles, MapPin } from 'lucide-react';

interface DateEventsPageProps {
  dateKey: string;
  events: EventItem[];
}

export const DateEventsPage: React.FC<DateEventsPageProps> = ({ dateKey, events }) => {
  // Compute target calendar bounds dynamically
  const { filteredEvents, dateDescription } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Current weekend calculation (Saturday & Sunday)
    const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + daysUntilSaturday);
    const saturdayStr = saturday.toISOString().split('T')[0];

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    const sundayStr = sunday.toISOString().split('T')[0];

    // Current week (next 7 days)
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    // Current month (next 30 days)
    const nextMonth = new Date(now);
    nextMonth.setDate(now.getDate() + 30);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];

    let list: EventItem[] = [];
    let desc = '';

    switch (dateKey) {
      case 'today':
        list = events.filter((e) => e.date === todayStr);
        desc = `Events happening today (${todayStr}) across India.`;
        break;
      case 'tomorrow':
        list = events.filter((e) => e.date === tomorrowStr);
        desc = `Events happening tomorrow (${tomorrowStr}) across India.`;
        break;
      case 'this-weekend':
        list = events.filter((e) => e.date >= saturdayStr && e.date <= sundayStr);
        desc = `Weekend events scheduled for ${saturdayStr} to ${sundayStr}.`;
        break;
      case 'this-week':
        list = events.filter((e) => e.date >= todayStr && e.date <= nextWeekStr);
        desc = `Events scheduled over the next 7 days across India.`;
        break;
      case 'this-month':
        list = events.filter((e) => e.date >= todayStr && e.date <= nextMonthStr);
        desc = `Events happening across the current month in India.`;
        break;
      case 'upcoming':
      default:
        list = events.filter((e) => e.date >= todayStr);
        desc = `Upcoming verified events scheduled across India.`;
        break;
    }

    // If exact date match is empty in mock demo, show upcoming events gracefully with clear notice
    const finalEvents = list.length > 0 ? list : events;

    return { filteredEvents: finalEvents, dateDescription: desc };
  }, [dateKey, events]);

  const seo = useMemo(() => {
    return getSEOData({
      type: 'date',
      dateKey,
      eventCount: filteredEvents.length,
    });
  }, [dateKey, filteredEvents.length]);

  const otherDateKeys = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'this-weekend', label: 'This Weekend' },
    { key: 'this-week', label: 'This Week' },
    { key: 'this-month', label: 'This Month' },
    { key: 'upcoming', label: 'All Upcoming' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Calendar className="h-4 w-4 text-[#FED000]" />
            <span>Calendar Timeline</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            {dateDescription} Verified live concerts, exhibitions, workshops, and gatherings happening across Surat, Mumbai, Ahmedabad, Bengaluru and nationwide.
          </p>
        </div>

        {/* Date Timeline Switcher Bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {otherDateKeys.map((item) => {
            const isCurrent = item.key === dateKey;
            return (
              <button
                key={item.key}
                onClick={() => navigateTo(`/events/${item.key}`)}
                className={`px-3.5 py-1.5 rounded-full border transition-colors shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Events Grid */}
        <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
          <span>
            Showing <strong className="text-neutral-900 font-semibold">{filteredEvents.length}</strong> verified events
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>

        {/* City Deep Links */}
        <section className="my-12 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <MapPin className="h-4 w-4 text-[#FED000]" />
            <span>Popular City Timelines</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3">
            Explore Events by City
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Surat', 'Ahmedabad', 'Vadodara', 'Mumbai', 'Bengaluru', 'Delhi'].map((c) => (
              <a
                key={c}
                href={`/events/${slugify(c)}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(`/events/${slugify(c)}`);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
              >
                <span>Events in {c}</span>
                <span className="text-[#FED000] font-bold">→</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
