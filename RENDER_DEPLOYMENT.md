# Deploying Evencify on Render

You can deploy this project to Render in either of two ways:

---

## Method 1: Render Web Service (Recommended with server.js)

When creating or updating your **Web Service** on Render:

| Field | Value |
|---|---|
| **Runtime / Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node server.js` (or `npm start`) |
| **Health Check Path** | `/healthz` |

> **Crucial note:** In your Render Web Service dashboard, make sure **Start Command** is **NOT** set to `npm run build`. `npm run build` is only a build command; running it as a start command causes Render to say *"No open ports detected / Application exited early"*.

---

## Method 2: Render Static Site (Free Tier)

Because this application is a Vite React Single Page Application (SPA), you can also host it on Render as a **Static Site**:

| Field | Value |
|---|---|
| **Type** | `Static Site` |
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |

### SPA Routing Rule (Rewrites)
To prevent 404s when refreshing subpages:
1. In your Render Dashboard, go to **Redirects / Rewrites**.
2. Add a rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
