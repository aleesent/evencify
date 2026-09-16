import React from 'react';
import { CITIES_DATABASE, CATEGORIES_DATABASE, STATES_DATABASE } from '../../services/seoData';
import { navigateTo } from '../../services/router';
import { MapPin, Sparkles, Calendar, Briefcase, Building2, Globe, Compass } from 'lucide-react';

export const SEOFooterLinks: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    navigateTo(url);
  };

  const gujaratCities = [
    { name: 'Surat (HQ)', url: '/events/surat' },
    { name: 'Ahmedabad', url: '/events/ahmedabad' },
    { name: 'Vadodara', url: '/events/vadodara' },
    { name: 'Rajkot', url: '/events/rajkot' },
    { name: 'Gandhinagar', url: '/events/gandhinagar' },
    { name: 'Bharuch', url: '/events/bharuch' },
    { name: 'Bhavnagar', url: '/events/bhavnagar' },
    { name: 'Jamnagar', url: '/events/jamnagar' },
    { name: 'Anand', url: '/events/anand' },
    { name: 'Navsari', url: '/events/navsari' },
    { name: 'Vapi', url: '/events/vapi' },
    { name: 'Valsad', url: '/events/valsad' },
    { name: 'Mehsana', url: '/events/mehsana' },
    { name: 'Morbi', url: '/events/morbi' },
    { name: 'Junagadh', url: '/events/junagadh' },
    { name: 'Bhuj', url: '/events/bhuj' },
    { name: 'Somnath', url: '/events/somnath' },
  ];

  const suratAndGujaratFocus = [
    { name: 'Events in Surat', url: '/events/surat' },
    { name: 'Events in Gujarat', url: '/events/gujarat' },
    { name: 'Concerts in Surat', url: '/events/surat/concerts' },
    { name: 'Exhibitions in Surat', url: '/events/surat/exhibitions' },
    { name: 'Conferences in Surat', url: '/events/surat/conferences' },
    { name: 'Festivals in Surat', url: '/events/surat/festivals' },
    { name: 'Business Meets in Surat', url: '/events/surat/business' },
    { name: 'Workshops in Surat', url: '/events/surat/workshops' },
    { name: 'Concerts in Gujarat', url: '/events/gujarat/concerts' },
    { name: 'Business Events Gujarat', url: '/events/gujarat/business' },
  ];

  const topCategories = [
    { name: 'Concerts & Live Music', url: '/events/concerts' },
    { name: 'Workshops & Training', url: '/events/workshops' },
    { name: 'Conferences & Summits', url: '/events/conferences' },
    { name: 'Exhibitions & Trade Expos', url: '/events/exhibitions' },
    { name: 'Festivals & Cultural', url: '/events/festivals' },
    { name: 'Business & Investor Meets', url: '/events/business' },
    { name: 'Professional Networking', url: '/events/networking' },
    { name: 'Corporate Conclaves', url: '/events/corporate' },
    { name: 'Technology & AI Summits', url: '/events/technology' },
    { name: 'College & Youth Fests', url: '/events/college' },
  ];

  const quickDates = [
    { name: 'Events Near Me', url: '/events/near-me' },
    { name: 'Events Today', url: '/events/today' },
    { name: 'Events Tomorrow', url: '/events/tomorrow' },
    { name: 'Events This Weekend', url: '/events/this-weekend' },
    { name: 'Events This Month', url: '/events/this-month' },
    { name: 'All Upcoming Events', url: '/events' },
  ];

  const crewLinks = [
    { name: 'Event Crew Jobs in Surat', url: '/crew-jobs' },
    { name: 'Event Crew Jobs in Gujarat', url: '/crew-jobs' },
    { name: 'Event Staffing Shifts', url: '/event-staffing' },
    { name: 'Hospitality Crew Openings', url: '/crew-jobs' },
    { name: 'Registration Desk Shifts', url: '/crew-jobs' },
    { name: 'Same-Day Escrow Payouts', url: '/crew-jobs' },
  ];

  const organiserLinks = [
    { name: 'Organise Event on Evencify', url: '/organise-event' },
    { name: 'Surat Event Staffing Solutions', url: '/events/surat' },
    { name: 'Gujarat Event Workforce OS', url: '/events/gujarat' },
    { name: 'Hire Verified Event Crew', url: '/organise-event' },
    { name: 'Escrow Security Guarantee', url: '/organise-event' },
    { name: 'Event Management Platform', url: '/organise-event' },
  ];

  return (
    <div className="pt-12 pb-8 border-t border-neutral-800 text-xs text-neutral-400">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Column 1: Surat & Gujarat Local SEO Focus */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Compass className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Surat & Gujarat Focus</span>
          </div>
          <ul className="space-y-2">
            {suratAndGujaratFocus.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  onClick={(e) => handleLinkClick(e, item.url)}
                  className="hover:text-[#FED000] transition-colors block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Gujarat Cities */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <MapPin className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Gujarat Cities</span>
          </div>
          <ul className="space-y-2">
            {gujaratCities.slice(0, 10).map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  onClick={(e) => handleLinkClick(e, item.url)}
                  className="hover:text-white transition-colors block"
                >
                  Events in {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Event Categories */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Categories</span>
          </div>
          <ul className="space-y-2">
            {topCategories.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  onClick={(e) => handleLinkClick(e, item.url)}
                  className="hover:text-white transition-colors block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Quick Discovery & Dates */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Calendar className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Find Events</span>
          </div>
          <ul className="space-y-2">
            {quickDates.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  onClick={(e) => handleLinkClick(e, item.url)}
                  className="hover:text-white transition-colors block font-medium"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Crew Careers */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Briefcase className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Crew Jobs</span>
          </div>
          <ul className="space-y-2">
            {crewLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  onClick={(e) => handleLinkClick(e, item.url)}
                  className="hover:text-white transition-colors block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 6: Organisers */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Building2 className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Organisers</span>
          </div>
          <ul className="space-y-2">
            {organiserLinks.map((item) => (
              <li key={item.name}>
                <a
                  href={item.url}
                  onClick={(e) => handleLinkClick(e, item.url)}
                  className="hover:text-white transition-colors block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gujarat Sub-Hub Bar */}
      <div className="mt-8 pt-6 border-t border-neutral-900/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-neutral-400">
        <span className="text-neutral-200 font-semibold">More Gujarat Cities:</span>
        {gujaratCities.slice(10).map((city) => (
          <a
            key={city.name}
            href={city.url}
            onClick={(e) => handleLinkClick(e, city.url)}
            className="hover:text-white transition-colors"
          >
            {city.name}
          </a>
        ))}
        <span className="text-neutral-600">•</span>
        <a
          href="/sitemap"
          onClick={(e) => handleLinkClick(e, '/sitemap')}
          className="text-[#FED000] hover:underline"
        >
          HTML Sitemap
        </a>
        <span className="text-neutral-600">•</span>
        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FED000] hover:underline"
        >
          XML Sitemap
        </a>
      </div>
    </div>
  );
};
