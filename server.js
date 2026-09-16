import express from 'express';
import path from 'path';
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

// Serve static assets from the compiled Vite dist directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Single Page Application (SPA) fallback: serve index.html for client routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Host must be 0.0.0.0 for containerized platforms like Render to route ingress traffic
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Evencify server running on http://0.0.0.0:${PORT}`);
});
