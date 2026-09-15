import React, { useState, useEffect, useMemo } from 'react';
import { EventItem } from '../../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';
import { EventCard } from '../EventCard';
import {
  getSEOData,
  CITIES_DATABASE,
  CityData,
  normalizeCitySlug,
  slugify,
} from '../../../services/seoData';
import { navigateTo } from '../../../services/router';
import {
  MapPin,
  Compass,
  Navigation,
  Sparkles,
  Sliders,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface NearMeEventsPageProps {
  events: EventItem[];
}

// Haversine distance formula in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const NearMeEventsPage: React.FC<NearMeEventsPageProps> = ({ events }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'prompt' | 'loading' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [detectedCity, setDetectedCity] = useState<string>('Surat');
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(50); // 25, 50, 100, 300, all

  const seo = useMemo(() => {
    return getSEOData({
      type: 'near-me',
      eventCount: events.length,
    });
  }, [events.length]);

  // Request browser geolocation with explicit user permission
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('unsupported');
      return;
    }

    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGeoStatus('granted');

        // Find closest city in our database
        let closestCity = 'Surat';
        let minDistance = Infinity;

        Object.values(CITIES_DATABASE).forEach((c) => {
          const dist = calculateDistanceKm(latitude, longitude, c.lat, c.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = c.name;
          }
        });

        setDetectedCity(closestCity);
      },
      (error) => {
        console.warn('Geolocation denied or unavailable:', error.message);
        setGeoStatus('denied');
        // Graceful fallback to default hub Surat
        setDetectedCity('Surat');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Compute distances for events
  const eventsWithDistance = useMemo(() => {
    return events.map((event) => {
      const citySlug = normalizeCitySlug(event.city || 'surat');
      const cityData = CITIES_DATABASE[citySlug];

      let distanceKm: number | null = null;
      if (userLocation && cityData) {
        distanceKm = calculateDistanceKm(
          userLocation.lat,
          userLocation.lng,
          cityData.lat,
          cityData.lng
        );
      }

      return {
        ...event,
        distanceKm,
        isSameCity: event.city.toLowerCase() === detectedCity.toLowerCase(),
      };
    });
  }, [events, userLocation, detectedCity]);

  // Sorted and filtered events
  const sortedEvents = useMemo(() => {
    const list = [...eventsWithDistance];

    if (userLocation) {
      // Filter by radius if selected
      const filtered =
        selectedRadiusKm === 9999
          ? list
          : list.filter((e) => e.distanceKm === null || e.distanceKm <= selectedRadiusKm);

      // Sort by proximity
      return filtered.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    // Default crawler/fallback sort: priority to detected city, then rest
    return list.sort((a, b) => {
      if (a.isSameCity && !b.isSameCity) return -1;
      if (!a.isSameCity && b.isSameCity) return 1;
      return a.date.localeCompare(b.date);
    });
  }, [eventsWithDistance, userLocation, selectedRadiusKm]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 pb-16">
      <SEOHead seo={seo} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={seo.breadcrumbItems} />

        {/* Hero Section */}
        <div className="mt-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            <Compass className="h-4 w-4 text-[#FED000]" />
            <span>Hyper-Local Event Radar</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {seo.h1}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            Discover live concerts, exhibitions, workshops, food festivals, and corporate summits happening around your current location today and this weekend.
          </p>
        </div>

        {/* Geolocation Trigger & Control Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                <Navigation className="h-5 w-5 text-[#FED000]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900">
                    Location: {geoStatus === 'granted' ? `Detected Near ${detectedCity}` : detectedCity}
                  </span>
                  {geoStatus === 'granted' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>GPS Enabled</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {geoStatus === 'granted'
                    ? 'Sorting all verified events by exact road proximity.'
                    : 'Showing events for our primary hub. Click below for exact GPS radar.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {geoStatus !== 'granted' ? (
                <button
                  onClick={requestLocation}
                  disabled={geoStatus === 'loading'}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  <MapPin className="h-3.5 w-3.5 text-[#FED000]" />
                  <span>{geoStatus === 'loading' ? 'Locating...' : 'Use My Current Location'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500 font-medium">Radius:</span>
                  <select
                    value={selectedRadiusKm}
                    onChange={(e) => setSelectedRadiusKm(Number(e.target.value))}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-900 cursor-pointer focus:outline-none"
                  >
                    <option value={25}>Within 25 km</option>
                    <option value={50}>Within 50 km</option>
                    <option value={100}>Within 100 km</option>
                    <option value={300}>Within 300 km</option>
                    <option value={9999}>All India</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Quick City Switcher Fallback for Crawlers and Users */}
          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-400 shrink-0 font-medium text-[11px]">Or select city:</span>
            {['Surat', 'Ahmedabad', 'Vadodara', 'Mumbai', 'Bengaluru', 'Delhi'].map((c) => (
              <button
                key={c}
                onClick={() => setDetectedCity(c)}
                className={`px-2.5 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                  detectedCity.toLowerCase() === c.toLowerCase()
                    ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => navigateTo('/events/today')}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-[#FED000]" />
            <span>Events Near Me Today</span>
          </button>
          <button
            onClick={() => navigateTo('/events/this-weekend')}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Events Near Me This Weekend</span>
          </button>
          <button
            onClick={() => navigateTo('/events/this-month')}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-neutral-700 hover:border-neutral-900 transition-colors shrink-0 cursor-pointer"
          >
            <span>Events Near Me This Month</span>
          </button>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-sm text-neutral-500">
          <span>
            Found <strong className="text-neutral-900 font-semibold">{sortedEvents.length}</strong> upcoming events near{' '}
            <strong className="text-neutral-900 font-semibold">{detectedCity}</strong>
          </span>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((evt) => (
            <div key={evt.id} className="relative">
              {/* Proximity Pill if distance is known */}
              {evt.distanceKm !== null && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 shadow-sm">
                    <MapPin className="h-2.5 w-2.5 text-[#FED000]" />
                    <span>{evt.distanceKm} km away</span>
                  </span>
                </div>
              )}
              <EventCard event={evt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
