import React, { useState, useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import { getSEOData, CITIES_DATABASE, CATEGORIES_DATABASE, slugify } from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  X,
} from 'lucide-react';

interface EventsDiscoveryPageProps {
  events: EventItem[];
}

export const EventsDiscoveryPage: React.FC<EventsDiscoveryPageProps> = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const seo = useMemo(() => {
    return getSEOData({
      type: 'all-events',
      eventCount: events.length,
    });
  }, [events.length]);

  const topCities = [
    { name: 'All Cities', value: 'all' },
    { name: 'Surat', value: 'Surat' },
    { name: 'Ahmedabad', value: 'Ahmedabad' },
    { name: 'Vadodara', value: 'Vadodara' },
    { name: 'Mumbai', value: 'Mumbai' },
    { name: 'Bengaluru', value: 'Bengaluru' },
    { name: 'Delhi', value: 'Delhi' },
  ];

  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Concerts', value: 'Concert' },
    { name: 'Exhibitions', value: 'Exhibition' },
    { name: 'Conferences', value: 'Conference' },
    { name: 'Workshops', value: 'Workshop' },
    { name: 'Weddings', value: 'Wedding' },
    { name: 'Corporate', value: 'Corporate' },
    { name: 'Cultural', value: 'Cultural' },
    { name: 'Networking', value: 'Networking' },
    { name: 'Sports', value: 'Sports' },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.organiserName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCity = selectedCity === 'all' || e.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory =
        selectedCategory === 'all' ||
        e.eventType.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCity && matchCategory;
    });
  }, [events, searchQuery, selectedCity, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Page Header */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Sparkles className="h-4 w-4 text-[#FED000]" />
            <span>Event Discovery Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            Discover verified upcoming concerts, exhibitions, workshops, conferences, and festivals across India. Powered by real-time venue schedules and verified event crew.
          </p>
        </div>

        {/* Quick Discovery Navigation Bar */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
          <span className="text-neutral-400 shrink-0 uppercase text-[11px] tracking-wider">Quick Links:</span>
          <button
            onClick={() => navigateTo('/events/near-me')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <MapPin className="h-3 w-3 text-[#FED000]" />
            <span>Events Near Me</span>
          </button>
          <button
            onClick={() => navigateTo('/events/today')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <Calendar className="h-3 w-3 text-[#FED000]" />
            <span>Events Today</span>
          </button>
          <button
            onClick={() => navigateTo('/events/this-weekend')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>This Weekend</span>
          </button>
          <button
            onClick={() => navigateTo('/events/surat')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Events in Surat</span>
          </button>
          <button
            onClick={() => navigateTo('/events/concerts')}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Concerts & Gigs</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event title, venue, area, or organizer..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 pl-10 pr-9 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* City Selector */}
            <div className="w-full md:w-52">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 px-3 py-2.5 text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors cursor-pointer"
              >
                {topCities.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="w-full md:w-52">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 px-3 py-2.5 text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-none transition-colors cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Pills */}
          {(selectedCity !== 'all' || selectedCategory !== 'all' || searchQuery) && (
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-neutral-400">Active filters:</span>
                {selectedCity !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-neutral-700">
                    City: {selectedCity}
                    <button onClick={() => setSelectedCity('all')} className="hover:text-black">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-neutral-700">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-black">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-neutral-700">
                    Keyword: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')} className="hover:text-black">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-neutral-500 hover:text-black transition-colors underline cursor-pointer"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
          <span>
            Showing <strong className="text-neutral-900 font-semibold">{filteredEvents.length}</strong> upcoming events
          </span>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-neutral-400 mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">No events matched your filters</h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-md mx-auto">
              Try adjusting your search query, or clear your filters to discover all upcoming events across India.
            </p>
            <button
              onClick={() => {
                setSelectedCity('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer"
            >
              Show All Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
