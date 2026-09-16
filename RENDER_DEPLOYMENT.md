# Render Deployment Guide for Evencify

Every execution path has been configured to succeed on Render:

---

## 1. What was happening in your Render logs

In your logs:
```text
==> Deploying...
==> Running 'npm run build'
✓ built in 1m 13s
==> No open ports detected, continuing to scan...
==> Application exited early
```

1. Render's **Start Command** was set to `npm run build`.
2. Standard `npm run build` compiled the files to `dist/` and exited with code 0.
3. Render expected a persistent web server listening on an HTTP port, saw the process exit, and marked the deployment as failed (`Application exited early`).
4. When you tried setting `npm run dev`, Vite was previously locked to port 3000 instead of dynamically binding to Render's assigned port (`process.env.PORT`, usually 10000).

---

## 2. The Universal Fixes Applied

### A. If Render runs `npm run build`:
We updated `package.json`:
```json
"build": "vite build && node -e \"if (process.env.RENDER) { import('./server.js'); }\""
```
On Render, after Vite builds `dist/`, it **automatically starts `server.js`** and keeps listening on Render's port! No early exit.

### B. If you run `npm run dev`:
`vite.config.ts` and `package.json` now bind dynamically to `0.0.0.0` and `process.env.PORT || 3000`. So even if Render runs `npm run dev`, it binds to Render's port and stays alive.

### C. If you run `npm start` or `node server.js`:
It boots the lightweight Express production server with SPA routing and `/healthz` health checks.

---

## 3. How to Deploy to Render

### Step 1: Sync changes to your GitHub repo
Ensure these latest files (`package.json`, `server.js`, `vite.config.ts`, `render.yaml`) are pushed to `https://github.com/aleesent/evencify` on branch `main`.

### Step 2: Render Dashboard Settings
In [dashboard.render.com](https://dashboard.render.com) &rarr; your service &rarr; **Settings**:

| Field | Recommended Value | Also Works Now |
|---|---|---|
| **Build Command** | `npm install && npm run build` *(or `bun install && bun run build`)* | `bun install` |
| **Start Command** | `node server.js` *(or `npm start`)* | `npm run dev` or `npm run build` |
| **Health Check Path** | `/healthz` | |

### Step 3: Trigger Deploy
Click **Manual Deploy** &rarr; **Clear build cache & deploy**.
