# BRVTY PWA Integration Guide

## Files to Add

### 1. **sw.js** (Service Worker)
Place in the root of your `brvty.net` domain (or `/brvty/` subdirectory if using GitHub Pages).

- Handles offline caching with cache-first for static assets, network-first for APIs
- Automatically cleans up old cache versions on activation
- Supports background cache management via message passing
- Critical resources are cached on install

### 2. **manifest.json** (Web App Manifest)
Place in the same directory as `sw.js`.

- Defines app name, colors, icons, and display mode
- Uses your Dark Luxury theme: `#080a0d` background, `#c9a227` gold accent
- Includes SVG icons at 192px and 512px (both regular and maskable)
- Defines app shortcuts for Library and Search
- Includes share target for native sharing

### 3. **HTML Head Integration**
Add the snippet from `html-head-snippet.html` to your `<head>` tag in `index.html`.

Key elements:
- Meta tags for mobile web app
- Apple-specific tags for iOS support
- Manifest link
- Service Worker registration script with update detection

## File Paths (GitHub Pages)

If your repo is `johnlaz/brvty.net`:

```
your-repo/
├── index.html                 (add head snippet here)
├── manifest.json              (same level as index.html)
├── sw.js                       (same level as index.html)
├── style.css
├── script.js
└── ... other files
```

Adjust manifest and SW scope/start_url if using subdirectory:
```json
// If at /brvty/ subdirectory
"start_url": "/brvty/",
"scope": "/brvty/",
```

And register SW as:
```javascript
navigator.serviceWorker.register('/brvty/sw.js', { scope: '/brvty/' })
```

## What This Enables

✅ **Offline Mode** – App works without internet (cached content)
✅ **Install to Home Screen** – "Add to Home Screen" prompt on mobile
✅ **Standalone Display** – Runs full-screen like a native app
✅ **Custom Splash Screen** – App icon and theme color on launch
✅ **Cache Management** – Network-first for fresh data, cache-first for assets
✅ **Update Detection** – Notifies user when new version is available
✅ **Share Target** – Can receive shared content from other apps (iOS/Android)

## Testing Checklist

1. **Service Worker Registration**
   - Open DevTools > Application > Service Workers
   - Should show registered and active

2. **Cache Storage**
   - DevTools > Application > Cache Storage
   - Should see `brvty-v1` and `brvty-runtime-v1`

3. **Offline Testing**
   - DevTools > Network > Offline
   - Static pages/assets should load
   - API calls should show cached responses or error gracefully

4. **Install Prompt** (Chrome/Edge)
   - Should see "Install" prompt in address bar
   - Or right-click app and select "Install"

5. **iOS** (Safari)
   - Tap Share > Add to Home Screen
   - Should use manifest icon and theme color

## SVG Icons

The manifest includes embedded SVG icons:
- **192x192 & 512x512** – Standard app icons (gold background with "B")
- **Maskable variants** – For adaptive icons on modern Android
- **Screenshots** – 540x720 for app store listings

To replace with custom images, change the `src` fields to file paths:
```json
"src": "/brvty/icon-192.png",
```

## Cache Invalidation

When you deploy updates:
1. Increment `CACHE_NAME` in `sw.js` (e.g., `'brvty-v2'`)
2. Users will see "update available" notification on next visit
3. Old cache automatically cleaned up on SW activation

## Optional: Update Notification

Add this to your app to show update prompts:

```javascript
window.addEventListener('swupdate', () => {
  // Show toast/banner prompting user to reload
  console.log('New version available - reload to update');
});
```

## Notes

- Audio files are stored in **IndexedDB**, not Service Worker cache
- API calls (Gemini TTS, Open Library, etc.) use network-first strategy
- Falls back gracefully if offline (no network) – shows cached or error message
- PWA works on Chrome, Edge, Firefox, Safari (iOS 16.4+), Samsung Internet

---

Ready to deploy! Push `sw.js` and `manifest.json` to your GitHub repo.
