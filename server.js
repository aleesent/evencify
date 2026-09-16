import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Render and Cloud platforms supply the PORT environment variable
const PORT = Number(process.env.PORT) || 3000;

// Health check endpoint for Render / Cloud monitoring
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Fallback safeguard: If dist/ has not been built yet during deploy, build it automatically
if (!fs.existsSync(indexPath)) {
  console.log('Notice: dist/ not found. Running build automatically...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('Automatic build finished successfully.');
  } catch (err) {
    console.error('Failed to compile static assets:', err);
  }
}

// Dedicated Sitemap & Robots endpoints with proper content types
app.get('/sitemap.xml', (req, res) => {
  const distSitemap = path.join(distPath, 'sitemap.xml');
  const publicSitemap = path.join(__dirname, 'public', 'sitemap.xml');
  const target = fs.existsSync(distSitemap) ? distSitemap : publicSitemap;
  if (fs.existsSync(target)) {
    let content = fs.readFileSync(target, 'utf8');
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
    if (host.includes('evencify.com') && !host.includes('www.')) {
      content = content.replaceAll('https://www.evencify.com', 'https://evencify.com');
    }
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.send(content);
  }
  res.status(404).send('Sitemap not found');
});

app.get('/robots.txt', (_req, res) => {
  const distRobots = path.join(distPath, 'robots.txt');
  const publicRobots = path.join(__dirname, 'public', 'robots.txt');
  const target = fs.existsSync(distRobots) ? distRobots : publicRobots;
  if (fs.existsSync(target)) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.sendFile(target);
  }
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: https://evencify.com/sitemap.xml');
});

// Serve static assets from the compiled Vite dist directory
app.use(express.static(distPath));

// Single Page Application (SPA) fallback: serve index.html for all client routes
app.get('*', (_req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Building application assets. Please reload in a moment.');
  }
});

// Host must be 0.0.0.0 for containerized platforms like Render to route ingress traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evencify server running on http://0.0.0.0:${PORT}`);
});
