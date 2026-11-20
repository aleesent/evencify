import express from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/apiRouter.js';
import {
  createCanonicalRedirectMiddleware,
  buildDynamicSitemapXml,
  createSeoHtmlHandler,
  sendCompressedResponse,
} from './server/seoMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

// Body parser for JSON API requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Render and Cloud platforms supply the PORT environment variable
const PORT = Number(process.env.PORT) || 3000;

// Health check endpoint for Render / Cloud monitoring
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Mount Brevo SMTP and Auth API routes
app.use('/api', apiRouter);

// Canonical HTTPS, non-www, and trailing-slash 301 normalization
app.use(createCanonicalRedirectMiddleware());

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

// Dynamic Sitemap & Robots endpoints with proper content types, caching, and gzip
app.get('/sitemap.xml', async (req, res) => {
  try {
    const content = await buildDynamicSitemapXml(distPath, __dirname);
    if (content) {
      return sendCompressedResponse(
        req,
        res,
        200,
        'application/xml; charset=utf-8',
        content,
        { 'Cache-Control': 'public, max-age=3600' }
      );
    }
    res.status(404).send('Sitemap not found');
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Failed to generate sitemap');
  }
});

app.get('/robots.txt', (req, res) => {
  const distRobots = path.join(distPath, 'robots.txt');
  const publicRobots = path.join(__dirname, 'public', 'robots.txt');
  const target = fs.existsSync(distRobots) ? distRobots : publicRobots;
  const content = fs.existsSync(target)
    ? fs.readFileSync(target, 'utf8')
    : 'User-agent: *\nAllow: /\nSitemap: https://evencify.com/sitemap.xml\n';
  return sendCompressedResponse(
    req,
    res,
    200,
    'text/plain; charset=utf-8',
    content,
    { 'Cache-Control': 'public, max-age=3600' }
  );
});

// Serve hashed build assets and public static files with explicit Cache-Control
app.use(
  express.static(distPath, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (/\.(webp|png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  })
);

// Route-aware HTML response: injects dynamic <head>/JSON-LD, enforces 404 & X-Robots-Tag
app.get('*', createSeoHtmlHandler(distPath, indexPath));

// Host must be 0.0.0.0 for containerized platforms like Render to route ingress traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evencify server running on http://0.0.0.0:${PORT}`);
});
