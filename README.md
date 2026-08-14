# Stephen Addo – Portfolio

Personal portfolio for Stephen Addo, built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Three.js / React Three Fiber**, and **anime.js**.

## Features

- Dark (deep space) and light (Frutiger Aero glass) themes
- WebGL orbital globe with glass materials, paused off-screen and simplified on low-end devices
- Cursor-reactive dot grid background
- Expandable project gallery with image carousel
- Academic dissertation section
- Responsive layout with reduced-motion-aware scroll reveals

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Stack notes

- Tailwind configuration lives in `app/globals.css` (`@theme`). There is no `tailwind.config.ts`.
- Lint with `eslint .` (Next.js 16 removed `next lint`).
- Third-party fonts, photos, and WebGL environment lighting are listed in [CREDITS.md](CREDITS.md).

## Deploy on Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Vercel will auto-detect Next.js and deploy
