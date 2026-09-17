import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'brevo-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            if (url.startsWith('/api')) {
              try {
                if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
                  const chunks: any[] = [];
                  req.on('data', (chunk) => chunks.push(chunk));
                  req.on('end', async () => {
                    const raw = Buffer.concat(chunks).toString();
                    try {
                      (req as any).body = raw ? JSON.parse(raw) : {};
                    } catch {
                      (req as any).body = {};
                    }
                    const { apiRouter } = await import('./server/apiRouter.js');
                    const origUrl = req.url;
                    req.url = req.url?.replace(/^\/api/, '') || '/';
                    apiRouter(req as any, res as any, (err: any) => {
                      req.url = origUrl;
                      next(err);
                    });
                  });
                  return;
                } else {
                  const { apiRouter } = await import('./server/apiRouter.js');
                  const origUrl = req.url;
                  req.url = req.url?.replace(/^\/api/, '') || '/';
                  apiRouter(req as any, res as any, (err: any) => {
                    req.url = origUrl;
                    next(err);
                  });
                  return;
                }
              } catch (apiErr) {
                console.error('API middleware error:', apiErr);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal API Server Error' }));
                return;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 3000,
      allowedHosts: true as const,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('motion')) {
                return 'vendor-react';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
            }
          },
        },
      },
    },
  };
});
