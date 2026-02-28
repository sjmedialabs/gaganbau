# Deployment troubleshooting

## 503 on static chunks (`/_next/static/chunks/*`) or favicon

**Symptoms:** "Application error: a client-side exception has occurred", browser console shows 503 for `/_next/static/chunks/…js` and/or `favicon.ico`.

**Cause:** The hosting platform is returning 503 (Service Unavailable) for those requests. This is usually a deployment or environment issue, not application code.

### What to do

1. **Redeploy with clean cache**
   - Vercel: Project → Deployments → ⋮ on latest deployment → Redeploy → check **Clear build cache**.
   - Other hosts: Trigger a new build and clear any build/cache options if available.

2. **Check deployment status**
   - Ensure the latest deployment is **Ready** (not Building, Failed, or Error).
   - Open the deployment URL (e.g. `xxx.vercel.app`) and see if the same 503 happens there (to rule out custom domain/DNS/proxy).

3. **Environment variables**
   - In production, set at least: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
   - If they are missing, the app still runs with default content, but some hosts may misbehave when server code fails; keeping them set avoids that.

4. **Custom domain / proxy**
   - If you use a proxy (e.g. Cloudflare) or custom domain (e.g. happyhomes-germany.de), ensure it is not returning 503 when the origin is slow or errors. Test directly on the platform URL (e.g. `*.vercel.app`).

5. **Host status**
   - Check status pages (e.g. status.vercel.com) for incidents.

The app is configured to avoid throwing when Firebase is missing (`isFirebaseConfigured()` checks) and to use the Node.js runtime for data routes so that server-side errors are less likely to cause 503s.
