import React, { useState } from 'react';
import { EventItem, CrewProfile, CrewApplication } from '../../types';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Banknote,
  Users,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface CrewDiscoveryViewProps {
  events: EventItem[];
  crewProfile: CrewProfile;
  applications: CrewApplication[];
  onSelectEvent: (event: EventItem) => void;
  onOpenProfileModal: () => void;
}

export const CrewDiscoveryView: React.FC<CrewDiscoveryViewProps> = ({
  events,
  crewProfile,
  applications,
  onSelectEvent,
  onOpenProfileModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        ev.name.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.city.toLowerCase().includes(q) ||
        ev.requiredCategory.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCity !== 'All' && ev.city !== selectedCity) return false;
    if (selectedEventType !== 'All' && ev.eventType !== selectedEventType) return false;
    if (selectedRoleCategory !== 'All' && ev.requiredCategory !== selectedRoleCategory)
      return false;
    if (
      selectedExperience !== 'All' &&
      !ev.experienceRequirement.toLowerCase().includes(selectedExperience.toLowerCase())
    )
      return false;
    if (selectedGender !== 'All' && ev.genderRequirement !== selectedGender && ev.genderRequirement !== 'Any')
      return false;

    return true;
  });

  const getApplicationStatus = (eventId: string) => {
    const app = applications.find((a) => a.eventId === eventId && a.crewId === crewProfile.id);
    return app ? app.status : null;
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="rounded-[28px] border-2 border-black bg-white p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#FED000] px-3 py-1 text-[11px] font-black tracking-wider text-black uppercase">
                <span className="h-2 w-2 rounded-full bg-black" />
                CREW OPPORTUNITY PORTAL
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-black">
                Find your next <span className="underline decoration-4 decoration-[#FED000]">event.</span>
              </h1>
              <p className="mt-1 text-sm font-bold text-black">
                Browse verified shifts with guaranteed pay rates and same-day UPI payouts.
              </p>
            </div>

            {/* Profile Pill Snapshot */}
            <div
              onClick={onOpenProfileModal}
              className="cursor-pointer flex items-center gap-3.5 rounded-2xl border-2 border-black bg-[#FFFDE6] p-3 hover:bg-[#FFF9C4] transition-all"
            >
              <img
                src={crewProfile.photoUrl}
                alt={crewProfile.name}
                className="h-12 w-12 rounded-xl object-cover border-2 border-black"
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-sm font-black text-black">
                  <span>{crewProfile.name}</span>
                  <CheckCircle2 className="h-4 w-4 text-black fill-[#FED000]" />
                </div>
                <div className="text-xs font-bold text-black">
                  {crewProfile.city} • <span className="font-black bg-[#FED000] px-1 rounded border border-black">{crewProfile.systemRating} ★</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-black" />
            </div>
          </div>

          {/* Search Bar & Quick Filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event name, venue, city, or crew role..."
                className="w-full rounded-xl border-2 border-black py-3 pl-10 pr-4 text-sm font-semibold text-black placeholder:text-black/60 focus:bg-[#FFFDE6] focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-black text-black hover:bg-[#FFFDE6] transition-all cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-black" />
              <span>Filters</span>
              {(selectedCity !== 'All' ||
                selectedEventType !== 'All' ||
                selectedRoleCategory !== 'All') && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#FED000] border border-black" />
              )}
            </button>
          </div>

          {/* Collapsible Filter Row */}
          {filterDrawerOpen && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t-2 border-black/15 text-xs">
              <div>
                <label className="font-black text-black mb-1 block">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-lg border-2 border-black p-2 text-xs bg-white font-bold text-black"
                >
                  <option value="All">All Cities</option>
                  <option value="Surat">Surat</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              <div>
                <label className="font-black text-black mb-1 block">Event Type</label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="w-full rounded-lg border-2 border-black p-2 text-xs bg-white font-bold text-black"
                >
                  <option value="All">All Types</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Concert / Music Show">Concert / Music</option>
                  <option value="Exhibition / Trade Fair">Exhibition</option>
                </select>
              </div>

              <div>
                <label className="font-black text-black mb-1 block">Role Category</label>
                <select
                  value={selectedRoleCategory}
                  onChange={(e) => setSelectedRoleCategory(e.target.value)}
                  className="w-full rounded-lg border-2 border-black p-2 text-xs bg-white font-bold text-black"
                >
                  <option value="All">All Categories</option>
                  <option value="Hospitality Staff">Hospitality</option>
                  <option value="Registration Desk">Registration Desk</option>
                  <option value="Security & Bouncers">Security & Bouncers</option>
                  <option value="Event Helper">Event Helper</option>
                  <option value="Setup / Teardown">Setup / Teardown</option>
                </select>
              </div>

              <div>
                <label className="font-black text-black mb-1 block">Experience</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full rounded-lg border-2 border-black p-2 text-xs bg-white font-bold text-black"
                >
                  <option value="All">Any Experience</option>
                  <option value="Fresher">Fresher OK</option>
                  <option value="Experienced">Experienced</option>
                  <option value="1">1+ Year</option>
                </select>
              </div>

              <div>
                <label className="font-black text-black mb-1 block">Gender Preference</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full rounded-lg border-2 border-black p-2 text-xs bg-white font-bold text-black"
                >
                  <option value="All">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Opportunities List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-black uppercase tracking-wider">
              {filteredEvents.length} Shifts Available Matching Your Profile
            </span>
            <span className="text-xs font-bold text-black">Priced in INR (₹)</span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const status = getApplicationStatus(event.id);
              return (
                <div
                  key={event.id}
                  className="group flex flex-col justify-between rounded-[24px] border-2 border-black bg-white p-6 transition-all duration-200"
                >
                  <div>
                    {/* Event Type & Pay */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-[#FED000] border border-black px-2.5 py-1 text-xs font-black text-black">
                        {event.eventType}
                      </span>
                      <div className="text-right">
                        <div className="text-base font-black text-black">
                          ₹{event.payAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-bold text-black">{event.payBasis}</div>
                      </div>
                    </div>

                    <h3 className="mt-3 text-lg font-black text-black group-hover:underline">
                      {event.name}
                    </h3>

                    <div className="mt-2 space-y-1.5 text-xs text-black font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-black shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-black shrink-0" />
                        <span>
                          {event.startTime} to {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-black shrink-0" />
                        <span className="truncate">
                          {event.venue}, {event.city}
                        </span>
                      </div>
                    </div>

                    {/* Role & Requirements Pill */}
                    <div className="mt-4 rounded-xl bg-[#FFFDE6] border-2 border-black p-3 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-black font-bold">Role:</span>
                        <span className="font-black text-black">{event.requiredCategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black font-bold">Slots Open:</span>
                        <span className="font-black text-black bg-[#FED000] border border-black px-1.5 py-0.2 rounded">
                          {event.crewPositionsAvailable} positions
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-black font-bold">Payout:</span>
                        <span className="font-black text-black">{event.paymentTimeline}</span>
                      </div>
                    </div>

                    {event.dressCode && (
                      <div className="mt-3 text-[11px] text-black font-medium italic">
                        Dress code: {event.dressCode}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t-2 border-black/15 flex items-center gap-2">
                    {status ? (
                      <div className="w-full rounded-xl bg-[#FED000] border-2 border-black py-2.5 text-center text-xs font-black text-black uppercase tracking-wider shadow-xs">
                        Applied • {status}
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectEvent(event)}
                          className="flex-1 rounded-xl border-2 border-black py-2.5 text-xs font-black text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => onSelectEvent(event)}
                          className="flex-1 rounded-xl bg-[#FED000] border-2 border-black py-2.5 text-xs font-black text-black hover:bg-[#E5BB00] transition-all cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
