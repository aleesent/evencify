import { useState, useEffect } from 'react';
import {
  CITIES_DATABASE,
  STATES_DATABASE,
  CATEGORIES_DATABASE,
  normalizeCitySlug,
  normalizeCategorySlug,
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
  | 'state-category'
  | 'event'
  | 'crew-jobs'
  | 'organiser-solution'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'faq'
  | 'sitemap'
  | 'robots'
  | 'login'
  | 'crew-login'
  | 'organiser-login'
  | 'signup'
  | 'crew-signup'
  | 'organiser-signup'
  | 'create-event'
  | 'crew-portal'
  | 'organiser-portal'
  | 'direct-links'
  | 'admin'
  | 'not-found';

export interface ParsedRoute {
  type: RouteType;
  path: string;
  citySlug?: string;
  stateSlug?: string;
  categorySlug?: string;
  dateKey?: string;
  eventSlug?: string;
}

export const AUTH_OR_PORTAL_SHORTCUT_ROUTES = new Set<RouteType>([
  'login',
  'crew-login',
  'organiser-login',
  'signup',
  'crew-signup',
  'organiser-signup',
  'create-event',
  'crew-portal',
  'organiser-portal',
  'direct-links',
  'admin',
]);

// ----------------------------------------------------
// Path Parser
// ----------------------------------------------------
export function parseRoute(pathname: string): ParsedRoute {
  let clean = pathname.toLowerCase().trim();
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // Exact Root
  if (clean === '' || clean === '/') {
    return { type: 'home', path: '/' };
  }

  // Public Crew Jobs & Recruitment Routes
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

  // Private / Auth / Portal / Admin Shortcuts (Rendered with noindex, nofollow)
  if (clean === '/admin' || clean === '/admin-login' || clean === '/operator') {
    return { type: 'admin', path: clean };
  }
  if (clean === '/login') {
    return { type: 'login', path: clean };
  }
  if (clean === '/signup') {
    return { type: 'signup', path: clean };
  }
  if (clean === '/crew/login' || clean === '/crew-login' || clean === '/login/crew') {
    return { type: 'crew-login', path: clean };
  }
  if (clean === '/crew/signup' || clean === '/crew-signup' || clean === '/signup/crew') {
    return { type: 'crew-signup', path: clean };
  }
  if (
    clean === '/organiser/login' ||
    clean === '/organizer/login' ||
    clean === '/event/login' ||
    clean === '/event-login' ||
    clean === '/login/organiser'
  ) {
    return { type: 'organiser-login', path: clean };
  }
  if (
    clean === '/organiser/signup' ||
    clean === '/organizer/signup' ||
    clean === '/event/signup' ||
    clean === '/event-signup' ||
    clean === '/signup/organiser'
  ) {
    return { type: 'organiser-signup', path: clean };
  }
  if (clean === '/create-event' || clean === '/events/new') {
    return { type: 'create-event', path: clean };
  }
  if (clean === '/crew' || clean === '/crew-dashboard') {
    return { type: 'crew-portal', path: clean };
  }
  if (clean === '/organiser' || clean === '/organizer') {
    return { type: 'organiser-portal', path: clean };
  }
  if (clean === '/direct-links') {
    return { type: 'direct-links', path: clean };
  }

  // Legacy/Shortcut Single Event Route: /event/:slug
  if (clean.startsWith('/event/')) {
    const eventSlug = clean.slice('/event/'.length).trim();
    if (eventSlug && !eventSlug.includes('/')) {
      return { type: 'event', path: clean, eventSlug };
    }
    return { type: 'not-found', path: clean };
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
      const seg = parts[0].toLowerCase();
      const normalizedCat = normalizeCategorySlug(seg);
      const normalizedCity = normalizeCitySlug(seg);

      // 1. Known Category (e.g. /events/concerts, /events/business)
      if (CATEGORIES_DATABASE[normalizedCat]) {
        return { type: 'category', path: clean, categorySlug: normalizedCat };
      }

      // 2. Known State (e.g. /events/gujarat)
      if (STATES_DATABASE[seg]) {
        return { type: 'state', path: clean, stateSlug: seg };
      }

      // 3. Known City or alias (e.g. /events/surat, /events/bangalore)
      if (CITIES_DATABASE[normalizedCity]) {
        return { type: 'city', path: clean, citySlug: normalizedCity };
      }

      // Unknown single segment under /events/ -> 404 (prevents thin/duplicate junk URLs)
      return { type: 'not-found', path: clean };
    }

    // Two segments: /events/:part1/:part2
    if (parts.length === 2) {
      const rawSeg1 = parts[0].toLowerCase();
      const normalizedCity = normalizeCitySlug(rawSeg1);
      const rawSeg2 = parts[1].toLowerCase();
      const normalizedCat = normalizeCategorySlug(rawSeg2);

      // 1. /events/:state/:category
      if (STATES_DATABASE[rawSeg1] && CATEGORIES_DATABASE[normalizedCat]) {
        return {
          type: 'state-category',
          path: clean,
          stateSlug: rawSeg1,
          categorySlug: normalizedCat,
        };
      }

      // 2. /events/:knownCity/:category
      if (CITIES_DATABASE[normalizedCity] && CATEGORIES_DATABASE[normalizedCat]) {
        return {
          type: 'city-category',
          path: clean,
          citySlug: normalizedCity,
          categorySlug: normalizedCat,
        };
      }

      // 3. Individual event: /events/:city/:eventSlug
      return {
        type: 'event',
        path: clean,
        citySlug: normalizedCity,
        eventSlug: parts[1],
      };
    }
  }

  return { type: 'not-found', path: clean };
}

// ----------------------------------------------------
// Navigation & History Helper
// ----------------------------------------------------
export function navigateTo(url: string, replace = false): void {
  if (typeof window === 'undefined') return;

  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  if (currentPath === url) return;

  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }

  window.dispatchEvent(new Event('popstate'));
  if (!url.includes('#')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
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
