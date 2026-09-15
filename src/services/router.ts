import { useState, useEffect } from 'react';
import {
  CITIES_DATABASE,
  STATES_DATABASE,
  CATEGORIES_DATABASE,
  CITY_ALIASES,
  normalizeCitySlug,
  slugify,
} from './seoData';

export type RouteType =
  | 'home'
  | 'all-events'
  | 'near-me'
  | 'date'
  | 'city'
  | 'state'
  | 'category'
  | 'city-category'
  | 'event'
  | 'organiser'
  | 'crew-jobs'
  | 'organiser-solution'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'faq'
  | 'sitemap'
  | 'robots'
  | 'not-found';

export interface ParsedRoute {
  type: RouteType;
  path: string;
  citySlug?: string;
  stateSlug?: string;
  categorySlug?: string;
  dateKey?: string;
  eventSlug?: string;
  organiserSlug?: string;
}

// ----------------------------------------------------
// Path Parser
// ----------------------------------------------------
export function parseRoute(pathname: string): ParsedRoute {
  // Normalize: lowercasing and trim trailing slash
  let clean = pathname.toLowerCase().trim();
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // Exact Root
  if (clean === '' || clean === '/') {
    return { type: 'home', path: '/' };
  }

  // Public Jobs & Recruitment Routes
  if (clean === '/crew-jobs' || clean === '/event-jobs' || clean === '/event-staffing') {
    return { type: 'crew-jobs', path: clean };
  }

  // Organiser Solutions Routes
  if (clean === '/organise-event' || clean === '/event-organisers' || clean === '/event-management') {
    return { type: 'organiser-solution', path: clean };
  }

  // Static trust, help, and legal pages
  if (clean === '/about' || clean === '/about-us') {
    return { type: 'about', path: clean };
  }
  if (clean === '/contact' || clean === '/contact-us') {
    return { type: 'contact', path: clean };
  }
  if (clean === '/privacy' || clean === '/privacy-policy') {
    return { type: 'privacy', path: clean };
  }
  if (clean === '/terms' || clean === '/terms-of-service') {
    return { type: 'terms', path: clean };
  }
  if (clean === '/faq' || clean === '/help') {
    return { type: 'faq', path: clean };
  }
  if (clean === '/sitemap' || clean === '/sitemap.xml') {
    return { type: 'sitemap', path: clean };
  }
  if (clean === '/robots.txt' || clean === '/robots') {
    return { type: 'robots', path: clean };
  }

  // Organiser Public Profile Route: /organiser/:slug
  if (clean.startsWith('/organiser/')) {
    const orgSlug = clean.replace('/organiser/', '').trim();
    if (orgSlug) {
      return { type: 'organiser', path: clean, organiserSlug: orgSlug };
    }
  }

  // Legacy/Shortcut Single Event Route: /event/:slug
  if (clean.startsWith('/event/')) {
    const eventSlug = clean.replace('/event/', '').trim();
    if (eventSlug) {
      return { type: 'event', path: clean, eventSlug };
    }
  }

  // Events Subtree: /events
  if (clean === '/events') {
    return { type: 'all-events', path: '/events' };
  }

  if (clean === '/events/near-me') {
    return { type: 'near-me', path: clean };
  }

  // Date-based routes
  const dateKeys = ['today', 'tomorrow', 'this-weekend', 'this-week', 'this-month', 'upcoming'];
  for (const dk of dateKeys) {
    if (clean === `/events/${dk}`) {
      return { type: 'date', path: clean, dateKey: dk };
    }
  }

  // Under /events/...
  if (clean.startsWith('/events/')) {
    const parts = clean.slice('/events/'.length).split('/').filter(Boolean);

    // Single segment: /events/:segment
    if (parts.length === 1) {
      const seg = parts[0];
      const normalizedCity = normalizeCitySlug(seg);

      // 1. Is it a known Category? (e.g. /events/concerts)
      if (CATEGORIES_DATABASE[seg]) {
        return { type: 'category', path: clean, categorySlug: seg };
      }

      // 2. Is it a known State? (e.g. /events/gujarat)
      if (STATES_DATABASE[seg]) {
        return { type: 'state', path: clean, stateSlug: seg };
      }

      // 3. Is it a known City or alias? (e.g. /events/surat, /events/bangalore)
      if (CITIES_DATABASE[normalizedCity]) {
        return { type: 'city', path: clean, citySlug: normalizedCity };
      }

      // 4. Default fallback as potential city or category
      return { type: 'city', path: clean, citySlug: normalizedCity };
    }

    // Two segments: /events/:part1/:part2
    if (parts.length === 2) {
      const seg1 = normalizeCitySlug(parts[0]);
      const seg2 = parts[1];

      // Is seg2 a category? (e.g. /events/surat/concerts)
      if (CATEGORIES_DATABASE[seg2]) {
        return {
          type: 'city-category',
          path: clean,
          citySlug: seg1,
          categorySlug: seg2,
        };
      }

      // Otherwise, assume it's an individual event: /events/:city/:eventSlug
      return {
        type: 'event',
        path: clean,
        citySlug: seg1,
        eventSlug: seg2,
      };
    }
  }

  // Unrecognized
  return { type: 'not-found', path: clean };
}

// ----------------------------------------------------
// Navigation & History Helper
// ----------------------------------------------------
export function navigateTo(url: string, replace = false): void {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search;
  if (currentPath === url) return;

  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }

  // Dispatch custom navigation event so reactive hook updates
  window.dispatchEvent(new Event('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------
// React Hook for Router
// ----------------------------------------------------
export function useAppRoute(): {
  route: ParsedRoute;
  navigate: (url: string, replace?: boolean) => void;
} {
  const [route, setRoute] = useState<ParsedRoute>(() =>
    typeof window !== 'undefined'
      ? parseRoute(window.location.pathname)
      : { type: 'home', path: '/' }
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return { route, navigate: navigateTo };
}
