import React from 'react';
import { CITIES_DATABASE, CATEGORIES_DATABASE, STATES_DATABASE } from '../../services/seoData';
import { navigateTo } from '../../services/router';
import { MapPin, Sparkles, Calendar, Briefcase, Building2, Globe } from 'lucide-react';

export const SEOFooterLinks: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    navigateTo(url);
  };

  const topCities = [
    { name: 'Surat', url: '/events/surat' },
    { name: 'Ahmedabad', url: '/events/ahmedabad' },
    { name: 'Vadodara', url: '/events/vadodara' },
    { name: 'Rajkot', url: '/events/rajkot' },
    { name: 'Gandhinagar', url: '/events/gandhinagar' },
    { name: 'Mumbai', url: '/events/mumbai' },
    { name: 'Pune', url: '/events/pune' },
    { name: 'Bengaluru', url: '/events/bengaluru' },
    { name: 'Delhi NCR', url: '/events/delhi' },
    { name: 'Hyderabad', url: '/events/hyderabad' },
    { name: 'Chennai', url: '/events/chennai' },
    { name: 'Kolkata', url: '/events/kolkata' },
    { name: 'Jaipur', url: '/events/jaipur' },
    { name: 'Goa', url: '/events/goa' },
  ];

  const topCategories = [
    { name: 'Concerts & Gigs', url: '/events/concerts' },
    { name: 'Workshops & Training', url: '/events/workshops' },
    { name: 'Conferences & Summits', url: '/events/conferences' },
    { name: 'Exhibitions & Trade Expos', url: '/events/exhibitions' },
    { name: 'Cultural Festivals', url: '/events/festivals' },
    { name: 'Business & Investor Meets', url: '/events/business' },
    { name: 'Professional Networking', url: '/events/networking' },
    { name: 'Corporate Conclaves', url: '/events/corporate' },
    { name: 'Sports & Tournaments', url: '/events/sports' },
    { name: 'Technology & AI Summits', url: '/events/technology' },
    { name: 'Comedy & Entertainment', url: '/events/entertainment' },
  ];

  const quickDates = [
    { name: 'Events Near Me', url: '/events/near-me' },
    { name: 'Events Today', url: '/events/today' },
    { name: 'Events Tomorrow', url: '/events/tomorrow' },
    { name: 'Events This Weekend', url: '/events/this-weekend' },
    { name: 'Events This Week', url: '/events/this-week' },
    { name: 'Events This Month', url: '/events/this-month' },
    { name: 'All Upcoming Events', url: '/events' },
  ];

  const crewLinks = [
    { name: 'Event Crew Jobs in India', url: '/crew-jobs' },
    { name: 'Event Staffing Shifts', url: '/event-staffing' },
    { name: 'Hospitality Crew Openings', url: '/crew-jobs' },
    { name: 'Registration Desk Roles', url: '/crew-jobs' },
    { name: 'Security & Bouncer Shifts', url: '/crew-jobs' },
    { name: 'Same-Day Escrow Payouts', url: '/crew-jobs' },
  ];

  const organiserLinks = [
    { name: 'Organise Event on Evencify', url: '/organise-event' },
    { name: 'Event Management Platform', url: '/event-management' },
    { name: 'Hire Verified Event Crew', url: '/event-organisers' },
    { name: 'Surat Event Staffing Solutions', url: '/events/surat' },
    { name: 'Gujarat Event Workforce', url: '/events/gujarat' },
    { name: 'Escrow Security Guarantee', url: '/organise-event' },
  ];

  const stateHubs = [
    { name: 'Events in Gujarat', url: '/events/gujarat' },
    { name: 'Events in Maharashtra', url: '/events/maharashtra' },
    { name: 'Events in Karnataka', url: '/events/karnataka' },
    { name: 'Events in Delhi NCR', url: '/events/delhi' },
    { name: 'Events in Rajasthan', url: '/events/rajasthan' },
    { name: 'Events in Tamil Nadu', url: '/events/tamil-nadu' },
    { name: 'Events in Telangana', url: '/events/telangana' },
    { name: 'Events in West Bengal', url: '/events/west-bengal' },
  ];

  return (
    <div className="pt-12 pb-8 border-t border-neutral-800 text-xs text-neutral-400">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Column 1: Top Cities */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <MapPin className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Top Cities</span>
          </div>
          <ul className="space-y-2">
            {topCities.map((item) => (
              <li key={item.url}>
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

        {/* Column 2: Categories */}
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

        {/* Column 3: Quick Discovery & Dates */}
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

        {/* Column 4: For Crew */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Briefcase className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Crew Careers</span>
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

        {/* Column 5: For Organisers */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Building2 className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Organiser Hub</span>
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

        {/* Column 6: State Hubs */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-neutral-200 font-bold uppercase tracking-wider text-[11px]">
            <Globe className="h-3.5 w-3.5 text-[#FED000]" />
            <span>State Networks</span>
          </div>
          <ul className="space-y-2">
            {stateHubs.map((item) => (
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
      </div>
    </div>
  );
};
