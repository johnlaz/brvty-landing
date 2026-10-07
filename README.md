# BRVTY Landing Page

Marketing page for BRVTY at **https://brvty.net**. The app itself lives in a separate repo (`brvty-app`) at **https://app.brvty.net**.

## Layout

```
index.html                     the page
manifest.json  sw.js           lightweight PWA files (display: browser)
icon-180.png icon-192.png icon-512.png  lazlab-96.png
art-of-the-pause-summary.mp3   audio sample played on the page
BRVTY.apk                      Android build (hidden: tap the footer logo 3 times)
CNAME                          brvty.net
```

## Update the page

1. Edit `index.html`.
2. If you changed anything the service worker caches, bump `CACHE_NAME` in `sw.js`.
3. Push. GitHub Pages deploys automatically.

## Replace the Android build

Drop the new file in as `BRVTY.apk` (same name) and push. It is excluded from the service-worker cache, so visitors always get the latest.

---

© 2026 LAZLAB Creations. All Rights Reserved. · lazlab.io@gmail.com
