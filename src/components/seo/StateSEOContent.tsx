import React from 'react';
import { StateData, CITIES_DATABASE, slugify } from '../../services/seoData';
import { MapPin, Compass } from 'lucide-react';
import { navigateTo } from '../../services/router';
import { FaqAccordion } from './FaqAccordion';

interface StateSEOContentProps {
  state: StateData;
  eventCount: number;
}

export const StateSEOContent: React.FC<StateSEOContentProps> = ({ state, eventCount }) => {
  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    navigateTo(url);
  };

  const stateFaqs = [
    {
      q: `What are the top cities for events in ${state.name}?`,
      a: `Key event destinations in ${state.name} include ${state.priorityCities.slice(0, 4).join(', ')}, hosting trade shows, cultural festivals, tech conferences, and music concerts.`,
    },
    {
      q: `How do event organizers hire verified local crew across ${state.name}?`,
      a: `Through Evencify, event organizers in ${state.name} post staffing shifts and connect with local background-verified hospitality crew, security guards, promoters, and technical stage assistants.`,
    },
    {
      q: `How do I list an event happening in ${state.name}?`,
      a: `Log in to Evencify as an Organizer, tap "Create Event", specify the venue city and address in ${state.name}, and publish to reach thousands of attendees and qualified crew.`,
    },
  ];

  return (
    <div className="space-y-10 my-10">
      {/* State Overview */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
          <Compass className="h-4 w-4 text-[#FED000]" />
          <span>Statewide Event Network</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
          Events & Workforce in {state.name}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-4xl">
          {state.description} Currently featuring {eventCount} active events across key urban centers.
        </p>

        {/* Priority Cities in State */}
        <div className="mt-6 pt-6 border-t border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-neutral-400" />
            <span>Key Event Hubs in {state.name}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {state.priorityCities.map((cityName) => {
              const citySlug = slugify(cityName);
              const cityUrl = `/events/${citySlug}`;
              return (
                <a
                  key={cityName}
                  href={cityUrl}
                  onClick={(e) => handleLinkClick(e, cityUrl)}
                  className="flex flex-col items-center justify-center text-center rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-xs font-bold text-neutral-900">{cityName}</span>
                  <span className="text-[11px] text-neutral-500">Explore →</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* State FAQs */}
      <FaqAccordion
        title={`Frequently Asked Questions About Events in ${state.name}`}
        description={`Everything you need to know about attending and organizing events in ${state.name}.`}
        faqs={stateFaqs}
      />
    </div>
  );
};
