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

export function generateAllSitemapEntries(events: EventItem[], baseUrl: string = 'https://www.evencify.com'): SitemapUrlEntry[] {
  const BASE_URL = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const entries: SitemapUrlEntry[] = [];

  // 1. Homepage & Discovery Core
  entries.push({
    loc: `${BASE_URL}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    title: 'Evencify Home - Event Discovery & Crew Platform',
    section: 'Core',
  });
  entries.push({
    loc: `${BASE_URL}/events`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.9',
    title: 'All Upcoming Events in India',
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

  // 2. City Pages (0.9, daily)
  Object.values(CITIES_DATABASE).forEach((city) => {
    entries.push({
      loc: `${BASE_URL}/events/${city.slug}`,
      lastmod: today,
      changefreq: 'daily',
      priority: city.priority ? '0.9' : '0.8',
      title: `Events in ${city.name}, ${city.state}`,
      section: 'Cities',
    });
  });

  // 3. Category Pages (0.8, daily)
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

  // 4. City + Category Combinations (0.8, daily)
  const priorityCities = Object.values(CITIES_DATABASE).filter((c) => c.priority);
  const priorityCategories = Object.values(CATEGORIES_DATABASE).slice(0, 6);

  priorityCities.forEach((city) => {
    priorityCategories.forEach((cat) => {
      entries.push({
        loc: `${BASE_URL}/events/${city.slug}/${cat.slug}`,
        lastmod: today,
        changefreq: 'daily',
        priority: '0.8',
        title: `${cat.name} in ${city.name}`,
        section: 'City Categories',
      });
    });
  });

  // 5. State Pages (0.8, weekly)
  Object.values(STATES_DATABASE).forEach((state) => {
    entries.push({
      loc: `${BASE_URL}/events/${state.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
      title: `Events in ${state.name}`,
      section: 'States',
    });
  });

  // 6. Active Events (0.8, daily)
  events.forEach((evt) => {
    const citySlug = slugify(evt.city);
    const eventSlug = slugify(evt.name);
    entries.push({
      loc: `${BASE_URL}/events/${citySlug}/${eventSlug}`,
      lastmod: evt.createdAt || today,
      changefreq: 'daily',
      priority: '0.8',
      title: `${evt.name} (${evt.city})`,
      section: 'Individual Events',
    });
  });

  // 7. Crew & Organiser Pages
  entries.push({
    loc: `${BASE_URL}/crew-jobs`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8',
    title: 'Event Crew Jobs & Shift Work',
    section: 'Careers',
  });
  entries.push({
    loc: `${BASE_URL}/event-staffing`,
    lastmod: today,
    changefreq: 'daily',
    priority: '0.8',
    title: 'Event Staffing Shifts & Rates',
    section: 'Careers',
  });
  entries.push({
    loc: `${BASE_URL}/organise-event`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
    title: 'Organise Event & Hire Crew',
    section: 'Organisers',
  });
  entries.push({
    loc: `${BASE_URL}/event-management`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
    title: 'Event Management Platform',
    section: 'Organisers',
  });

  // 8. Static Pages
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
