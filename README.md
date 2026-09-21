# JEE TRACKER

Personal Class 11 JEE study command center.

## Current setup

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Capacitor Android wrapper
- Local persistence through IndexedDB with localStorage fallback

## Important

The Gemini API key is intentionally **not** stored in the frontend. The AI connection will be routed through a secure backend/proxy before production APK release.

## Build

```bash
npm install
npm run build
```

For Android, Capacitor can be added with:

```bash
npx cap add android
npx cap sync android
```
