import { CITIES_DATABASE, CATEGORIES_DATABASE, STATES_DATABASE, slugify } from './seoData';
import { EventItem } from '../types';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  title?: string;
  section?: string;
}

export function generateAllSitemapEntries(
  events: EventItem[],
  baseUrl: string = 'https://evencify.com'
): SitemapUrlEntry[] {
  const BASE_URL = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const entries: SitemapUrlEntry[] = [];

  // 1. Homepage & Discovery Core
  entries.push({
    loc: `${BASE_URL}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    title: 'Evencify – Event Platform in Surat | Hire Event Crew & Find Event Jobs',
    section: 'Core',
  });
  entries.push({
    loc: `${BASE_URL}/events`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
    title: 'Upcoming Events in Surat & India | Evencify',
    section: 'Discovery',
  });
  entries.push({
    loc: `${BASE_URL}/events/near-me`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
    title: 'Events Near Me Today & This Weekend',
    section: 'Discovery',
  });
  entries.push({
    loc: `${BASE_URL}/events/today`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
    title: 'Events Today in India',
    section: 'Discovery',
  });
  entries.push({
    loc: `${BASE_URL}/events/tomorrow`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8',
    title: 'Events Tomorrow in India',
    section: 'Discovery',
  });
  entries.push({
    loc: `${BASE_URL}/events/this-weekend`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
    title: 'Events This Weekend in India',
    section: 'Discovery',
  });
  entries.push({
    loc: `${BASE_URL}/events/this-month`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8',
    title: 'Events This Month in India',
    section: 'Discovery',
  });

  // 2. Primary Local SEO Focus: Surat & Gujarat
  entries.push({
    loc: `${BASE_URL}/events/surat`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    title: 'Events in Surat & Event Crew Jobs | Evencify',
    section: 'Local Focus',
  });
  entries.push({
    loc: `${BASE_URL}/events/gujarat`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.95',
    title: 'Events in Gujarat | Event Platform & Crew Hiring | Evencify',
    section: 'Local Focus',
  });

  // 3. Surat Category Pages: /events/surat/[category]
  Object.values(CATEGORIES_DATABASE).forEach((cat) => {
    entries.push({
      loc: `${BASE_URL}/events/surat/${cat.slug}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
      title: `${cat.name} Events in Surat | Evencify`,
      section: 'Surat Categories',
    });
  });

  // 4. Gujarat Category Pages: /events/gujarat/[category]
  Object.values(CATEGORIES_DATABASE).forEach((cat) => {
    entries.push({
      loc: `${BASE_URL}/events/gujarat/${cat.slug}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
      title: `${cat.name} Events in Gujarat | Evencify`,
      section: 'Gujarat Categories',
    });
  });

  // 5. City Pages
  Object.values(CITIES_DATABASE).forEach((city) => {
    if (city.slug !== 'surat') {
      const isGujaratCity = city.stateSlug === 'gujarat';
      entries.push({
        loc: `${BASE_URL}/events/${city.slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: isGujaratCity ? '0.9' : city.priority ? '0.85' : '0.8',
        title: `Events in ${city.name} | Upcoming Events | Evencify`,
        section: isGujaratCity ? 'Gujarat Cities' : 'Cities',
      });
    }
  });

  // 6. Category Pages across India
  Object.values(CATEGORIES_DATABASE).forEach((cat) => {
    entries.push({
      loc: `${BASE_URL}/events/${cat.slug}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.8',
      title: `${cat.name} Events in India`,
      section: 'Categories',
    });
  });

  // 7. City + Category Combinations for key Gujarat and Priority Cities
  const keyCities = Object.values(CITIES_DATABASE).filter(
    (c) => c.slug !== 'surat' && (c.stateSlug === 'gujarat' || c.priority)
  );
  const priorityCategories = Object.values(CATEGORIES_DATABASE).slice(0, 6);

  keyCities.forEach((city) => {
    priorityCategories.forEach((cat) => {
      entries.push({
        loc: `${BASE_URL}/events/${city.slug}/${cat.slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: city.stateSlug === 'gujarat' ? '0.85' : '0.8',
        title: `${cat.name} Events in ${city.name} | Evencify`,
        section: 'City Categories',
      });
    });
  });

  // 8. Other State Pages
  Object.values(STATES_DATABASE).forEach((state) => {
    if (state.slug !== 'gujarat') {
      entries.push({
        loc: `${BASE_URL}/events/${state.slug}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8',
        title: `Events in ${state.name} | Upcoming Events | Evencify`,
        section: 'States',
      });
    }
  });

  // 9. Public Upcoming Events Only (exclude expired, draft, paused, closed, cancelled, completed)
  events.forEach((evt) => {
    if (!evt?.name || !evt?.city || !evt?.date) return;
    const statusLower = String(evt.status || '').toLowerCase();
    const isPublicStatus =
      statusLower === 'open' || statusLower === 'published' || statusLower === 'in-progress';
    const isUpcoming = evt.date >= today;
    if (!isPublicStatus || !isUpcoming) return;

    const citySlug = slugify(evt.city);
    const eventSlug = slugify(evt.name);
    if (!citySlug || !eventSlug) return;

    entries.push({
      loc: `${BASE_URL}/events/${citySlug}/${eventSlug}`,
      lastmod: evt.createdAt || today,
      changefreq: 'daily',
      priority: '0.85',
      title: `${evt.name} in ${evt.city} | Evencify`,
      section: 'Individual Events',
    });
  });

  // 10. Crew & Organiser Public Solution Pages
  entries.push({
    loc: `${BASE_URL}/crew-jobs`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.85',
    title: 'Event Crew Jobs & Event Staffing in Surat & India | Evencify',
    section: 'Careers',
  });
  entries.push({
    loc: `${BASE_URL}/event-staffing`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8',
    title: 'Event Staffing Platform & Crew Shifts | Evencify',
    section: 'Careers',
  });
  entries.push({
    loc: `${BASE_URL}/organise-event`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85',
    title: 'Hire Event Crew & Manage Events | Evencify',
    section: 'Organisers',
  });
  entries.push({
    loc: `${BASE_URL}/event-management`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
    title: 'Event Management Platform India | Evencify',
    section: 'Organisers',
  });

  // 11. Public Informational & Legal Pages
  entries.push({
    loc: `${BASE_URL}/about`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.5',
    title: 'About Evencify',
    section: 'Company',
  });
  entries.push({
    loc: `${BASE_URL}/contact`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.5',
    title: 'Contact Evencify',
    section: 'Company',
  });
  entries.push({
    loc: `${BASE_URL}/faq`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.6',
    title: 'Frequently Asked Questions',
    section: 'Company',
  });
  entries.push({
    loc: `${BASE_URL}/privacy`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.3',
    title: 'Privacy Policy',
    section: 'Legal',
  });
  entries.push({
    loc: `${BASE_URL}/terms`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.3',
    title: 'Terms of Service',
    section: 'Legal',
  });

  return entries;
}

export function generateSitemapXml(entries: SitemapUrlEntry[]): string {
  const xmlItems = entries
    .map(
      (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;
}
