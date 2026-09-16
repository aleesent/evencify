import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAllSitemapEntries, generateSitemapXml } from '../src/services/sitemapGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial event seeds or empty array for baseline indexing
const dummyEvents: any[] = [
  {
    id: 'evt-1',
    name: 'Sunburn Arena Mumbai 2026',
    city: 'Mumbai',
    category: 'Music & Concerts',
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'evt-2',
    name: 'India Tech Expo Bengaluru',
    city: 'Bengaluru',
    category: 'Conferences & Expos',
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'evt-3',
    name: 'Delhi Nightlife Gala',
    city: 'Delhi',
    category: 'Nightlife & Parties',
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'evt-4',
    name: 'Surat Diamond City Fest',
    city: 'Surat',
    category: 'Festivals & Cultural',
    createdAt: new Date().toISOString().split('T')[0],
  },
  {
    id: 'evt-5',
    name: 'Goa Beach Music Festival',
    city: 'Goa',
    category: 'Music & Concerts',
    createdAt: new Date().toISOString().split('T')[0],
  },
];

console.log('Generating complete sitemap entries...');
const entries = generateAllSitemapEntries(dummyEvents);
const xml = generateSitemapXml(entries);

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`Successfully generated ${entries.length} URLs in ${sitemapPath}`);
