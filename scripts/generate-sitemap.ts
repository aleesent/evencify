import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAllSitemapEntries, generateSitemapXml } from '../src/services/sitemapGenerator';
import { INITIAL_EVENTS } from '../src/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Generating complete sitemap entries with Surat & Gujarat priority and published database events...');
const entries = generateAllSitemapEntries(INITIAL_EVENTS, 'https://evencify.com');
const xml = generateSitemapXml(entries);

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`Successfully generated ${entries.length} URLs in ${sitemapPath}`);
