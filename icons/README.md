# App icons

Place your icon files here (from [favicon.io](https://favicon.io), RealFaviconGenerator, etc.), then sync to the app:

```bash
npm run icons:sync
```

Files are copied into `public/icons/`, which Vite serves and bundles into the PWA.

Expected files:

- `android-chrome-192x192.png` / `android-chrome-512x512.png` — PWA & install
- `apple-touch-icon.png` — iPhone home screen
- `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` — browser tab

After syncing, rebuild or redeploy. On iPhone, remove the old home-screen shortcut and add again to see the new icon.
