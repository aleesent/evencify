import express from 'express';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
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
app.set('trust proxy', true);
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

// Safe trailing-slash normalization (HTTPS & www/apex handled by hosting edge)
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

// Dynamic Sitemap, Robots & LLMs.txt endpoints with proper content types, caching, and compression
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

app.get('/llms.txt', (req, res) => {
  const distLlms = path.join(distPath, 'llms.txt');
  const publicLlms = path.join(__dirname, 'public', 'llms.txt');
  const target = fs.existsSync(distLlms) ? distLlms : publicLlms;
  if (!fs.existsSync(target)) {
    return res.status(404).send('Not found');
  }
  const content = fs.readFileSync(target, 'utf8');
  return sendCompressedResponse(
    req,
    res,
    200,
    'text/plain; charset=utf-8',
    content,
    { 'Cache-Control': 'public, max-age=3600' }
  );
});

// Zero-dependency Brotli/Gzip static asset compression with in-memory cache for hashed build assets
const COMPRESSIBLE_MIME = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const compressedAssetCache = new Map();

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }
  const ext = path.extname(req.path).toLowerCase();
  const mimeType = COMPRESSIBLE_MIME[ext];
  if (!mimeType) {
    return next();
  }

  const acceptEncoding = String(req.headers['accept-encoding'] || '');
  const useBr = acceptEncoding.includes('br');
  const useGzip = !useBr && acceptEncoding.includes('gzip');
  if (!useBr && !useGzip) {
    return next();
  }

  const resolved = path.resolve(distPath, '.' + req.path);
  if (!resolved.startsWith(distPath + path.sep) || !fs.existsSync(resolved)) {
    return next();
  }

  const stat = fs.statSync(resolved);
  if (!stat.isFile() || stat.size < 512) {
    return next();
  }

  const encoding = useBr ? 'br' : 'gzip';
  const isImmutableAsset = resolved.includes(`${path.sep}assets${path.sep}`);
  const cacheKey = `${resolved}:${stat.mtimeMs}:${encoding}`;
  let compressed = compressedAssetCache.get(cacheKey);

  if (!compressed) {
    const raw = fs.readFileSync(resolved);
    compressed = useBr
      ? zlib.brotliCompressSync(raw, {
          params: { [zlib.constants.BROTLI_PARAM_QUALITY]: isImmutableAsset ? 6 : 4 },
        })
      : zlib.gzipSync(raw, { level: 6 });

    if (compressedAssetCache.size > 200) {
      compressedAssetCache.clear();
    }
    compressedAssetCache.set(cacheKey, compressed);
  }

  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Encoding', encoding);
  res.setHeader('Vary', 'Accept-Encoding');
  res.setHeader(
    'Cache-Control',
    isImmutableAsset
      ? 'public, max-age=31536000, immutable'
      : ext === '.svg'
      ? 'public, max-age=2592000'
      : 'public, max-age=3600'
  );
  res.setHeader('Content-Length', String(compressed.length));
  return req.method === 'HEAD' ? res.status(200).end() : res.status(200).send(compressed);
});

// Serve hashed build assets and public static files with explicit Cache-Control
app.use(
  express.static(distPath, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (/\.(webp|png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
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
