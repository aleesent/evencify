# Fixing Render Deployment: "Application exited early"

## Why the Error Occurs

In your Render service settings:
- **Build Command** is currently set to: `bun install`
- **Start Command** is currently set to: `npm run build`

When Render deploys:
1. It runs the Start Command: `npm run build`.
2. Vite builds the static assets in `dist/` and terminates with exit code 0.
3. Because a Web Service requires a long-running process listening on a port, Render sees the process close and prints:
   ```text
   ==> No open ports detected, continuing to scan...
   ==> Application exited early
   ```

---

## The 2-Step Fix in Render Dashboard

1. Go to your service on [dashboard.render.com](https://dashboard.render.com)
2. In the left navigation, click **Settings**
3. Scroll down to the **Build & Deploy** section
4. Update the two fields:

### Field 1: Build Command
```bash
bun install && bun run build
```
*(or `npm install && npm run build`)*

### Field 2: Start Command (CRITICAL)
```bash
node server.js
```
*(or `npm start`)*

5. Click **Save Changes**, then click **Manual Deploy > Deploy latest commit**.

---

## Alternative: Free Render Static Site (No Server Needed)

If you don't need a Node backend and want 100% free hosting without cold starts:
1. In Render Dashboard, click **New + > Static Site**
2. Connect `https://github.com/aleesent/evencify`
3. Configure:
   - **Build Command**: `bun run build` (or `npm run build`)
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**, add:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
