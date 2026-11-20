import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const BASE_URL = 'https://evencify.com';
const DEFAULT_IMAGE = `${BASE_URL}/hero-banner.png`;
const SUPABASE_CACHE_TTL_MS = 5 * 60 * 1000;

const CITIES = {
  surat: { name: 'Surat', state: 'Gujarat' },
  ahmedabad: { name: 'Ahmedabad', state: 'Gujarat' },
  vadodara: { name: 'Vadodara', state: 'Gujarat' },
  rajkot: { name: 'Rajkot', state: 'Gujarat' },
  gandhinagar: { name: 'Gandhinagar', state: 'Gujarat' },
  mumbai: { name: 'Mumbai', state: 'Maharashtra' },
  pune: { name: 'Pune', state: 'Maharashtra' },
  delhi: { name: 'Delhi', state: 'Delhi' },
  bengaluru: { name: 'Bengaluru', state: 'Karnataka' },
  hyderabad: { name: 'Hyderabad', state: 'Telangana' },
  chennai: { name: 'Chennai', state: 'Tamil Nadu' },
  kolkata: { name: 'Kolkata', state: 'West Bengal' },
  jaipur: { name: 'Jaipur', state: 'Rajasthan' },
  lucknow: { name: 'Lucknow', state: 'Uttar Pradesh' },
  indore: { name: 'Indore', state: 'Madhya Pradesh' },
  chandigarh: { name: 'Chandigarh', state: 'Punjab' },
  noida: { name: 'Noida', state: 'Uttar Pradesh' },
  gurugram: { name: 'Gurugram', state: 'Haryana' },
  kochi: { name: 'Kochi', state: 'Kerala' },
  coimbatore: { name: 'Coimbatore', state: 'Tamil Nadu' },
  goa: { name: 'Goa', state: 'Goa' },
  bharuch: { name: 'Bharuch', state: 'Gujarat' },
  bhavnagar: { name: 'Bhavnagar', state: 'Gujarat' },
  jamnagar: { name: 'Jamnagar', state: 'Gujarat' },
  anand: { name: 'Anand', state: 'Gujarat' },
  navsari: { name: 'Navsari', state: 'Gujarat' },
  vapi: { name: 'Vapi', state: 'Gujarat' },
  valsad: { name: 'Valsad', state: 'Gujarat' },
  mehsana: { name: 'Mehsana', state: 'Gujarat' },
  morbi: { name: 'Morbi', state: 'Gujarat' },
  junagadh: { name: 'Junagadh', state: 'Gujarat' },
  bhuj: { name: 'Bhuj', state: 'Gujarat' },
  somnath: { name: 'Somnath', state: 'Gujarat' },
};

const CITY_ALIASES = {
  bangalore: 'bengaluru',
  bombay: 'mumbai',
  baroda: 'vadodara',
  gurgaon: 'gurugram',
  calcutta: 'kolkata',
  madras: 'chennai',
  benares: 'varanasi',
  banaras: 'varanasi',
  kashi: 'varanasi',
  mysore: 'mysuru',
  'surat-gujarat': 'surat',
  'ahmedabad-gujarat': 'ahmedabad',
  'vadodara-gujarat': 'vadodara',
  'rajkot-gujarat': 'rajkot',
  'gandhinagar-gujarat': 'gandhinagar',
  'bharuch-gujarat': 'bharuch',
  'bhavnagar-gujarat': 'bhavnagar',
  'jamnagar-gujarat': 'jamnagar',
  'anand-gujarat': 'anand',
  'navsari-gujarat': 'navsari',
  'vapi-gujarat': 'vapi',
  'valsad-gujarat': 'valsad',
  'mehsana-gujarat': 'mehsana',
  'morbi-gujarat': 'morbi',
  'junagadh-gujarat': 'junagadh',
  'bhuj-gujarat': 'bhuj',
  kutch: 'bhuj',
  'somnath-gujarat': 'somnath',
  veraval: 'somnath',
  'mumbai-maharashtra': 'mumbai',
  'delhi-ncr': 'delhi',
  newdelhi: 'delhi',
  'new-delhi': 'delhi',
  poona: 'pune',
  trichy: 'tiruchirappalli',
  cochint: 'kochi',
  cochin: 'kochi',
  vizag: 'visakhapatnam',
};

const STATES = {
  gujarat: { name: 'Gujarat' },
  maharashtra: { name: 'Maharashtra' },
  karnataka: { name: 'Karnataka' },
  'delhi-ncr': { name: 'Delhi' },
  rajasthan: { name: 'Rajasthan' },
  'tamil-nadu': { name: 'Tamil Nadu' },
  telangana: { name: 'Telangana' },
  'west-bengal': { name: 'West Bengal' },
  'uttar-pradesh': { name: 'Uttar Pradesh' },
  'madhya-pradesh': { name: 'Madhya Pradesh' },
  kerala: { name: 'Kerala' },
  punjab: { name: 'Punjab' },
  haryana: { name: 'Haryana' },
  goa: { name: 'Goa' },
};

const CATEGORIES = {
  concerts: { name: 'Concerts' },
  workshops: { name: 'Workshops' },
  conferences: { name: 'Conferences' },
  exhibitions: { name: 'Exhibitions' },
  festivals: { name: 'Festivals' },
  business: { name: 'Business' },
  networking: { name: 'Networking' },
  corporate: { name: 'Corporate' },
  sports: { name: 'Sports' },
  technology: { name: 'Technology' },
  entertainment: { name: 'Entertainment' },
  cultural: { name: 'Cultural' },
  college: { name: 'College' },
  startup: { name: 'Startup' },
};

const CATEGORY_ALIASES = {
  'business-events': 'business',
  'networking-events': 'networking',
  'technology-events': 'technology',
  'tech-events': 'technology',
  tech: 'technology',
  'startup-events': 'startup',
  startups: 'startup',
  'college-events': 'college',
  'campus-events': 'college',
  concert: 'concerts',
  music: 'concerts',
  workshop: 'workshops',
  conference: 'conferences',
  festival: 'festivals',
  exhibition: 'exhibitions',
  expo: 'exhibitions',
  expos: 'exhibitions',
};

const DATE_KEYS = ['today', 'tomorrow', 'this-weekend', 'this-week', 'this-month', 'upcoming'];

const NOINDEX_EXACT_ROUTES = new Set([
  '/login',
  '/signup',
  '/crew/login',
  '/crew-login',
  '/login/crew',
  '/crew/signup',
  '/crew-signup',
  '/signup/crew',
  '/organiser/login',
  '/organizer/login',
  '/event/login',
  '/event-login',
  '/login/organiser',
  '/organiser/signup',
  '/organizer/signup',
  '/event/signup',
  '/event-signup',
  '/signup/organiser',
  '/create-event',
  '/events/new',
  '/crew',
  '/crew-dashboard',
  '/organiser',
  '/organizer',
  '/direct-links',
  '/admin',
  '/admin-login',
  '/operator',
  '/robots.txt',
  '/robots',
]);

const NOINDEX_PREFIXES = ['/admin/', '/dashboard/', '/api/', '/auth/', '/chat/', '/account/'];

const FALLBACK_EVENTS = [
  {
    id: 'evt-singhania-1',
    name: 'Grand Royal Rajputana Wedding',
    eventType: 'Wedding',
    date: '2026-11-15',
    startTime: '16:00',
    endTime: '23:30',
    venue: 'Avadh Utopia Luxury Lawns',
    fullAddress: 'Dumas Road, Surat, Gujarat 395007',
    city: 'Surat',
    organiserName: 'Singhania Live Events',
    crewPositionsTotal: 8,
    crewPositionsAvailable: 6,
    requiredCategory: 'Hospitality Staff',
    payAmount: 1800,
    payBasis: 'Per Shift',
    status: 'Open',
  },
  {
    id: 'evt-rohan-1',
    name: 'Apex Music Fest & DJ Night',
    eventType: 'Concert',
    date: '2026-11-20',
    startTime: '17:00',
    endTime: '01:00',
    venue: 'Bandra Kurla Complex Arena',
    fullAddress: 'BKC, Mumbai, Maharashtra 400051',
    city: 'Mumbai',
    organiserName: 'Apex Event Productions',
    crewPositionsTotal: 12,
    crewPositionsAvailable: 10,
    requiredCategory: 'Support',
    payAmount: 2200,
    payBasis: 'Per Shift',
    status: 'Open',
  },
];

let cachedEvents = {
  data: FALLBACK_EVENTS,
  fetchedAt: 0,
};

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getTodayIsoDate() {
  return new Date().toISOString().split('T')[0];
}

async function getPublicEvents() {
  const now = Date.now();
  if (now - cachedEvents.fetchedAt < SUPABASE_CACHE_TTL_MS) {
    return cachedEvents.data;
  }

  const supabaseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '')
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
  const supabaseKey = (
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();

  if (!supabaseUrl || !supabaseKey || typeof fetch !== 'function') {
    cachedEvents.fetchedAt = now;
    return cachedEvents.data;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const endpoint = `${supabaseUrl}/rest/v1/events?select=id,name,event_type,date,start_time,end_time,venue,full_address,city,organiser_name,crew_positions_total,crew_positions_available,required_category,pay_amount,pay_basis,status&limit=200`;

    const res = await fetch(endpoint, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        cachedEvents = {
          fetchedAt: now,
          data: rows.map((r) => ({
            id: r.id,
            name: r.name,
            eventType: r.event_type || 'Event',
            date: r.date,
            startTime: r.start_time,
            endTime: r.end_time,
            venue: r.venue,
            fullAddress: r.full_address,
            city: r.city || 'India',
            organiserName: r.organiser_name || 'Verified Organiser',
            crewPositionsTotal: Number(r.crew_positions_total || 0),
            crewPositionsAvailable: Number(r.crew_positions_available || 0),
            requiredCategory: r.required_category || 'Event Crew',
            payAmount: Number(r.pay_amount || 0),
            payBasis: r.pay_basis || 'Per Shift',
            status: r.status || 'Open',
          })),
        };
        return cachedEvents.data;
      }
    }
  } catch {
    // Graceful fallback to initial public seed list on network timeout or offline dev
  }

  cachedEvents.fetchedAt = now;
  return cachedEvents.data;
}

function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function resolveRouteSeo(pathname, events) {
  let clean = String(pathname || '/').toLowerCase().trim();
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // Homepage uses static index.html head cleanly
  if (clean === '' || clean === '/') {
    return { statusCode: 200, isHomepage: true, robots: 'index, follow' };
  }

  // Restricted / Auth / Portal / Admin routes (HTTP 200 for SPA boot, strictly noindex)
  if (NOINDEX_EXACT_ROUTES.has(clean) || NOINDEX_PREFIXES.some((p) => clean.startsWith(p))) {
    const labelMap = {
      '/login': 'Sign In | Evencify',
      '/signup': 'Create Account | Evencify',
      '/crew': 'Crew Dashboard | Evencify',
      '/crew-dashboard': 'Crew Dashboard | Evencify',
      '/organiser': 'Organiser Dashboard | Evencify',
      '/organizer': 'Organiser Dashboard | Evencify',
      '/create-event': 'Post Event & Hire Crew | Evencify',
      '/admin': 'Admin Console | Evencify',
      '/admin-login': 'Admin Console | Evencify',
      '/robots': 'robots.txt | Evencify',
      '/robots.txt': 'robots.txt | Evencify',
    };
    const isRobotsViewer = clean === '/robots' || clean === '/robots.txt';
    const robots = isRobotsViewer ? 'noindex, follow' : 'noindex, nofollow';
    return {
      statusCode: 200,
      title: labelMap[clean] || 'Evencify Portal | Evencify',
      description: 'Private portal or authentication entry point on Evencify.',
      canonicalUrl: `${BASE_URL}${clean}`,
      robots,
      ogType: 'website',
      structuredData: [],
    };
  }

  // Public informational and workforce pages
  if (clean === '/events') {
    return {
      statusCode: 200,
      title: 'Upcoming Events in India & Event Staffing Opportunities | Evencify',
      description:
        'Explore verified concerts, exhibitions, conferences, workshops, and corporate events in Surat, Ahmedabad, Mumbai, Bengaluru, and across India on Evencify.',
      canonicalUrl: `${BASE_URL}/events`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Events', url: `${BASE_URL}/events` },
        ]),
      ],
    };
  }

  if (clean === '/events/near-me') {
    return {
      statusCode: 200,
      title: 'Events Near Me in Surat & India | Discover Live Events | Evencify',
      description:
        'Find live concerts, exhibitions, workshops, and event crew shifts near your location on Evencify.',
      canonicalUrl: `${BASE_URL}/events/near-me`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Events', url: `${BASE_URL}/events` },
          { name: 'Events Near Me', url: `${BASE_URL}/events/near-me` },
        ]),
      ],
    };
  }

  if (clean === '/crew-jobs' || clean === '/event-jobs' || clean === '/event-staffing') {
    return {
      statusCode: 200,
      title: 'Event Crew Jobs & Event Staffing Platform India | Evencify',
      description:
        'Find event jobs in Surat and across India. Apply as verified hospitality staff, event coordinators, promoters, and technical crew on Evencify.',
      canonicalUrl: `${BASE_URL}/crew-jobs`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Event Crew Jobs', url: `${BASE_URL}/crew-jobs` },
        ]),
      ],
    };
  }

  if (clean === '/organise-event' || clean === '/event-organisers' || clean === '/event-management') {
    return {
      statusCode: 200,
      title: 'Hire Event Crew & Manage Event Staffing Online | Evencify',
      description:
        'Post event requirements, hire verified event staff in Surat and India, manage crew shifts, and settle payouts with Evencify.',
      canonicalUrl: `${BASE_URL}/organise-event`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'For Event Organisers', url: `${BASE_URL}/organise-event` },
        ]),
      ],
    };
  }

  if (clean === '/about' || clean === '/about-us') {
    return {
      statusCode: 200,
      title: 'About Evencify | Event Crew & Organiser Platform in India',
      description:
        'Learn how Evencify connects event organisers with verified event crew in Surat and across India.',
      canonicalUrl: `${BASE_URL}/about`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'About', url: `${BASE_URL}/about` },
        ]),
      ],
    };
  }

  if (clean === '/contact' || clean === '/contact-us') {
    return {
      statusCode: 200,
      title: 'Contact Evencify | Event Crew & Organiser Support',
      description:
        'Contact the Evencify team for event organiser onboarding, crew verification, or partnership inquiries.',
      canonicalUrl: `${BASE_URL}/contact`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Contact', url: `${BASE_URL}/contact` },
        ]),
      ],
    };
  }

  if (clean === '/privacy' || clean === '/privacy-policy') {
    return {
      statusCode: 200,
      title: 'Privacy Policy | Evencify',
      description:
        'Read Evencify’s Privacy Policy covering user accounts, crew verification data, and platform security.',
      canonicalUrl: `${BASE_URL}/privacy`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Privacy Policy', url: `${BASE_URL}/privacy` },
        ]),
      ],
    };
  }

  if (clean === '/terms' || clean === '/terms-of-service') {
    return {
      statusCode: 200,
      title: 'Terms of Service | Evencify',
      description:
        'Review Evencify’s Terms of Service for event organisers, freelance event crew, and public visitors.',
      canonicalUrl: `${BASE_URL}/terms`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Terms of Service', url: `${BASE_URL}/terms` },
        ]),
      ],
    };
  }

  if (clean === '/faq' || clean === '/help') {
    return {
      statusCode: 200,
      title: 'Frequently Asked Questions | Evencify Help Center',
      description:
        'Answers to common questions about hiring event crew, finding event shifts in Surat and India, and using Evencify.',
      canonicalUrl: `${BASE_URL}/faq`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'FAQ', url: `${BASE_URL}/faq` },
        ]),
      ],
    };
  }

  if (clean === '/sitemap') {
    return {
      statusCode: 200,
      title: 'Sitemap | Evencify Directory',
      description:
        'Browse all public cities, states, event categories, and upcoming event pages indexed on Evencify.',
      canonicalUrl: `${BASE_URL}/sitemap`,
      robots: 'index, follow',
      ogType: 'website',
      structuredData: [
        buildBreadcrumbSchema([
          { name: 'Home', url: `${BASE_URL}/` },
          { name: 'Sitemap', url: `${BASE_URL}/sitemap` },
        ]),
      ],
    };
  }

  // Date discovery pages: /events/:dateKey
  for (const dk of DATE_KEYS) {
    if (clean === `/events/${dk}`) {
      const label = dk.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        statusCode: 200,
        title: `Events Happening ${label} in India | Evencify`,
        description: `Find upcoming verified concerts, expos, workshops, and crew opportunities happening ${label.toLowerCase()} across Surat and India.`,
        canonicalUrl: `${BASE_URL}/events/${dk}`,
        robots: 'index, follow',
        ogType: 'website',
        structuredData: [
          buildBreadcrumbSchema([
            { name: 'Home', url: `${BASE_URL}/` },
            { name: 'Events', url: `${BASE_URL}/events` },
            { name: label, url: `${BASE_URL}/events/${dk}` },
          ]),
        ],
      };
    }
  }

  // Legacy single event route: /event/:slug
  if (clean.startsWith('/event/')) {
    const eventSlug = clean.slice('/event/'.length);
    if (eventSlug && !eventSlug.includes('/')) {
      const matched = events.find(
        (e) => slugify(e.name) === slugify(eventSlug) || String(e.id).toLowerCase() === eventSlug
      );
      if (matched) {
        return buildEventSeo(matched);
      }
    }
  }

  // Nested /events/... routes
  if (clean.startsWith('/events/')) {
    const parts = clean.slice('/events/'.length).split('/').filter(Boolean);
    if (parts.length === 1) {
      const seg = parts[0];
      const normCat = CATEGORY_ALIASES[slugify(seg)] || slugify(seg);
      const normCity = CITY_ALIASES[slugify(seg)] || slugify(seg);

      if (CATEGORIES[normCat]) {
        const cat = CATEGORIES[normCat];
        return {
          statusCode: 200,
          title: `${cat.name} Events in India & Crew Opportunities | Evencify`,
          description: `Discover upcoming ${cat.name.toLowerCase()} across Surat, Mumbai, Bengaluru, Delhi, and India on Evencify.`,
          canonicalUrl: `${BASE_URL}/events/${normCat}`,
          robots: 'index, follow',
          ogType: 'website',
          structuredData: [
            buildBreadcrumbSchema([
              { name: 'Home', url: `${BASE_URL}/` },
              { name: 'Events', url: `${BASE_URL}/events` },
              { name: cat.name, url: `${BASE_URL}/events/${normCat}` },
            ]),
          ],
        };
      }

      if (STATES[seg]) {
        const st = STATES[seg];
        return {
          statusCode: 200,
          title: `Upcoming Events in ${st.name} | Event Staffing & Crew | Evencify`,
          description: `Discover events and hire event crew across ${st.name} on Evencify.`,
          canonicalUrl: `${BASE_URL}/events/${seg}`,
          robots: 'index, follow',
          ogType: 'website',
          structuredData: [
            buildBreadcrumbSchema([
              { name: 'Home', url: `${BASE_URL}/` },
              { name: 'Events', url: `${BASE_URL}/events` },
              { name: st.name, url: `${BASE_URL}/events/${seg}` },
            ]),
          ],
        };
      }

      if (CITIES[normCity]) {
        const city = CITIES[normCity];
        const isSurat = normCity === 'surat';
        return {
          statusCode: 200,
          title: isSurat
            ? 'Events in Surat & Hire Event Crew in Surat | Evencify'
            : `Upcoming Events in ${city.name}, ${city.state} | Evencify`,
          description: isSurat
            ? 'Explore upcoming events in Surat, hire verified event crew in Surat, or find event jobs across Vesu, Adajan, Dumas Road, and City Light on Evencify.'
            : `Discover upcoming events, conferences, concerts, and event staffing opportunities in ${city.name}, ${city.state} on Evencify.`,
          canonicalUrl: `${BASE_URL}/events/${normCity}`,
          robots: 'index, follow',
          ogType: 'website',
          structuredData: [
            buildBreadcrumbSchema([
              { name: 'Home', url: `${BASE_URL}/` },
              { name: 'Events', url: `${BASE_URL}/events` },
              { name: city.name, url: `${BASE_URL}/events/${normCity}` },
            ]),
          ],
        };
      }
    }

    if (parts.length === 2) {
      const seg1 = parts[0];
      const seg2 = parts[1];
      const normCity = CITY_ALIASES[slugify(seg1)] || slugify(seg1);
      const normCat = CATEGORY_ALIASES[slugify(seg2)] || slugify(seg2);

      if (STATES[seg1] && CATEGORIES[normCat]) {
        const st = STATES[seg1];
        const cat = CATEGORIES[normCat];
        return {
          statusCode: 200,
          title: `${cat.name} Events in ${st.name} | Evencify`,
          description: `Browse ${cat.name.toLowerCase()} across ${st.name} on Evencify.`,
          canonicalUrl: `${BASE_URL}/events/${seg1}/${normCat}`,
          robots: 'index, follow',
          ogType: 'website',
          structuredData: [
            buildBreadcrumbSchema([
              { name: 'Home', url: `${BASE_URL}/` },
              { name: st.name, url: `${BASE_URL}/events/${seg1}` },
              { name: cat.name, url: `${BASE_URL}/events/${seg1}/${normCat}` },
            ]),
          ],
        };
      }

      if (CITIES[normCity] && CATEGORIES[normCat]) {
        const city = CITIES[normCity];
        const cat = CATEGORIES[normCat];
        return {
          statusCode: 200,
          title: `${cat.name} in ${city.name} | Upcoming Events | Evencify`,
          description: `Discover verified ${cat.name.toLowerCase()} in ${city.name}, ${city.state} on Evencify.`,
          canonicalUrl: `${BASE_URL}/events/${normCity}/${normCat}`,
          robots: 'index, follow',
          ogType: 'website',
          structuredData: [
            buildBreadcrumbSchema([
              { name: 'Home', url: `${BASE_URL}/` },
              { name: city.name, url: `${BASE_URL}/events/${normCity}` },
              { name: cat.name, url: `${BASE_URL}/events/${normCity}/${normCat}` },
            ]),
          ],
        };
      }

      const matched = events.find(
        (e) =>
          (slugify(e.name) === slugify(seg2) || String(e.id).toLowerCase() === seg2) &&
          (CITY_ALIASES[slugify(e.city)] || slugify(e.city)) === normCity
      );
      if (matched) {
        return buildEventSeo(matched);
      }
    }
  }

  // Fallback 404 Not Found with strict HTTP 404 & noindex
  return {
    statusCode: 404,
    title: 'Page Not Found (404) | Evencify',
    description:
      'The requested event or page could not be found. Explore upcoming events and crew opportunities across Surat and India on Evencify.',
    canonicalUrl: `${BASE_URL}/404`,
    robots: 'noindex, nofollow',
    ogType: 'website',
    structuredData: [],
  };
}

function buildEventSeo(event) {
  const citySlug = slugify(event.city || 'india');
  const eventSlug = slugify(event.name);
  const canonicalUrl = `${BASE_URL}/events/${citySlug}/${eventSlug}`;
  const today = getTodayIsoDate();
  const isExpired = Boolean(event.date && event.date < today);
  const isCancelled = String(event.status || '').toLowerCase() === 'cancelled';
  const startIso = `${event.date}T${event.startTime || '10:00'}:00+05:30`;
  const endIso = `${event.date}T${event.endTime || '22:00'}:00+05:30`;

  const eventStatus = isCancelled
    ? 'https://schema.org/EventCancelled'
    : 'https://schema.org/EventScheduled';

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      startDate: startIso,
      endDate: endIso,
      eventStatus,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: event.venue,
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.fullAddress || event.venue,
          addressLocality: event.city,
          addressCountry: 'IN',
        },
      },
      organizer: {
        '@type': 'Organization',
        name: event.organiserName,
      },
      description: `${event.name} (${event.eventType}) at ${event.venue} in ${event.city} on ${event.date}.`,
    },
    buildBreadcrumbSchema([
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Events', url: `${BASE_URL}/events` },
      { name: event.city, url: `${BASE_URL}/events/${citySlug}` },
      { name: event.name, url: canonicalUrl },
    ]),
  ];

  const statusLower = String(event.status || '').toLowerCase();
  const isOpenForJob = statusLower === 'open' || statusLower === 'published' || statusLower === 'in-progress';
  if (!isExpired && isOpenForJob && event.crewPositionsAvailable > 0 && event.payAmount > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: `${event.requiredCategory} — ${event.name}`,
      description: `${event.crewPositionsAvailable} event crew positions for ${event.requiredCategory} at ${event.name} (${event.venue}, ${event.city}).`,
      employmentType: 'TEMPORARY',
      hiringOrganization: {
        '@type': 'Organization',
        name: event.organiserName,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.fullAddress || event.venue,
          addressLocality: event.city,
          addressCountry: 'IN',
        },
      },
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: {
          '@type': 'QuantitativeValue',
          value: event.payAmount,
          unitText: event.payBasis === 'Per Day' ? 'DAY' : 'SHIFT',
        },
      },
      validThrough: startIso,
    });
  }

  return {
    statusCode: 200,
    title: `${event.name} in ${event.city} | Event Schedule & Crew | Evencify`,
    description: `${event.name} (${event.eventType}) in ${event.city} on ${event.date} at ${event.venue}. View verified event schedule and open crew opportunities on Evencify.`,
    canonicalUrl,
    robots: isExpired ? 'noindex, follow' : 'index, follow',
    ogType: 'event',
    structuredData: schemas,
  };
}

function injectHeadMetadata(html, seo) {
  if (seo.isHomepage) {
    return html;
  }

  let out = html;
  const safeTitle = escapeHtml(seo.title);
  const safeDesc = escapeHtml(seo.description);
  const safeCanonical = escapeHtml(seo.canonicalUrl);
  const safeRobots = escapeHtml(seo.robots);
  const isNoIndex = String(seo.robots || '').startsWith('noindex');

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

  out = out.replace(
    /<meta\s+name="description"[^>]*content="[^"]*"[^>]*\/?>/i,
    `<meta name="description" content="${safeDesc}" />`
  );

  out = out.replace(
    /<meta\s+name="robots"[^>]*content="[^"]*"[^>]*\/?>/i,
    `<meta name="robots" content="${safeRobots}" />`
  );

  out = out.replace(
    /<link\s+rel="canonical"[^>]*href="[^"]*"[^>]*\/?>/i,
    `<link rel="canonical" href="${safeCanonical}" />`
  );

  if (isNoIndex) {
    out = out.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*\/?>\s*/gi, '');
  } else {
    out = out.replace(
      /<link\s+rel="alternate"\s+hreflang="en-IN"[^>]*\/?>/i,
      `<link rel="alternate" hreflang="en-IN" href="${safeCanonical}" />`
    );
    out = out.replace(
      /<link\s+rel="alternate"\s+hreflang="x-default"[^>]*\/?>/i,
      `<link rel="alternate" hreflang="x-default" href="${safeCanonical}" />`
    );
  }

  out = out.replace(
    /<meta\s+property="og:type"[^>]*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(seo.ogType || 'website')}" />`
  );
  out = out.replace(
    /<meta\s+property="og:url"[^>]*\/?>/i,
    `<meta property="og:url" content="${safeCanonical}" />`
  );
  out = out.replace(
    /<meta\s+property="og:title"[^>]*\/?>/i,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  out = out.replace(
    /<meta\s+property="og:description"[^>]*content="[^"]*"[^>]*\/?>/i,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:title"[^>]*\/?>/i,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  out = out.replace(
    /<meta\s+name="twitter:description"[^>]*content="[^"]*"[^>]*\/?>/i,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );

  // Replace existing JSON-LD block cleanly with route-specific schemas
  const jsonLdTags =
    seo.structuredData && seo.structuredData.length > 0
      ? seo.structuredData
          .map(
            (schema, idx) =>
              `<script type="application/ld+json" data-seo-jsonld="true" data-schema-index="${idx}">${JSON.stringify(schema)}</script>`
          )
          .join('\n    ')
      : '';

  out = out.replace(
    /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i,
    jsonLdTags
  );

  return out;
}

export function sendCompressedResponse(req, res, statusCode, contentType, bodyBuffer, extraHeaders = {}) {
  const buf = Buffer.isBuffer(bodyBuffer) ? bodyBuffer : Buffer.from(String(bodyBuffer), 'utf8');
  const acceptEncoding = String(req.headers['accept-encoding'] || '');

  Object.entries(extraHeaders).forEach(([key, val]) => {
    res.setHeader(key, val);
  });
  res.setHeader('Content-Type', contentType);
  res.setHeader('Vary', 'Accept-Encoding');

  if (acceptEncoding.includes('gzip') && buf.length > 512) {
    zlib.gzip(buf, (err, compressed) => {
      if (err) {
        res.status(statusCode).send(buf);
        return;
      }
      res.setHeader('Content-Encoding', 'gzip');
      res.status(statusCode).send(compressed);
    });
    return;
  }

  res.status(statusCode).send(buf);
}

export function createCanonicalRedirectMiddleware() {
  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    if (req.path.startsWith('/api/') || req.path === '/healthz') {
      return next();
    }

    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
    const proto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
    const queryIdx = req.originalUrl.indexOf('?');
    const search = queryIdx >= 0 ? req.originalUrl.slice(queryIdx) : '';

    // Enforce non-www + HTTPS on production domain evencify.com
    if (host.startsWith('www.evencify.com') || (host === 'evencify.com' && proto === 'http')) {
      let cleanPath = req.path;
      if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
      }
      return res.redirect(301, `https://evencify.com${cleanPath}${search}`);
    }

    // Remove trailing slash on non-root, non-file paths
    if (req.path.length > 1 && req.path.endsWith('/') && !path.extname(req.path)) {
      const targetPath = req.path.slice(0, -1);
      return res.redirect(301, `${targetPath}${search}`);
    }

    next();
  };
}

export async function buildDynamicSitemapXml(distPath, rootDir) {
  const distSitemap = path.join(distPath, 'sitemap.xml');
  const publicSitemap = path.join(rootDir, 'public', 'sitemap.xml');
  const target = fs.existsSync(distSitemap) ? distSitemap : publicSitemap;

  let baseXml = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  baseXml = baseXml.replaceAll('https://www.evencify.com', BASE_URL);

  const liveEvents = await getPublicEvents();
  const today = getTodayIsoDate();
  const activeEvents = liveEvents.filter((evt) => {
    const statusLower = String(evt.status || '').toLowerCase();
    const isPublicStatus =
      statusLower === 'open' || statusLower === 'published' || statusLower === 'in-progress';
    return isPublicStatus && evt.date >= today;
  });

  // Merge active live events into sitemap if they are not already present
  const existingLocs = new Set();
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(baseXml)) !== null) {
    existingLocs.add(match[1]);
  }

  const additions = [];
  for (const evt of activeEvents) {
    const loc = `${BASE_URL}/events/${slugify(evt.city || 'india')}/${slugify(evt.name)}`;
    if (!existingLocs.has(loc)) {
      additions.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(today)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>`);
      existingLocs.add(loc);
    }
  }

  if (additions.length > 0 && baseXml.includes('</urlset>')) {
    baseXml = baseXml.replace('</urlset>', `${additions.join('\n')}\n</urlset>`);
  }

  return baseXml;
}

export function createSeoHtmlHandler(distPath, indexPath) {
  return async (req, res) => {
    if (!fs.existsSync(indexPath)) {
      return res.status(503).send('Building application assets. Please reload in a moment.');
    }

    // Return actual 404 if client asks for a missing static asset file
    if (path.extname(req.path) && req.path !== '/robots.txt' && req.path !== '/sitemap.xml') {
      return res.status(404).send('Not found');
    }

    const events = await getPublicEvents();
    const seo = resolveRouteSeo(req.path, events);
    const htmlTemplate = fs.readFileSync(indexPath, 'utf8');
    const html = injectHeadMetadata(htmlTemplate, seo);

    const headers = {
      'Cache-Control': 'no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    };
    if (String(seo.robots || '').startsWith('noindex')) {
      headers['X-Robots-Tag'] = seo.robots;
    }

    return sendCompressedResponse(
      req,
      res,
      seo.statusCode || 200,
      'text/html; charset=utf-8',
      html,
      headers
    );
  };
}
