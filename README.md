# Bondarenko Home Photography

A mobile-first marketing site for Ben Bondarenko, a Seattle real estate photographer. Built with Next.js 15 + Tailwind v4 + Motion.

## Concept

**Light is the Architect.** The site is structured around the hours of light a house lives through — daylight, golden hour, twilight, blue hour, interior glow. Twilight is Ben's signature.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind v4 (CSS-first via `@theme`)
- Motion (animations)
- IBM Plex Sans + Plex Mono + Fraunces (Google Fonts)
- Unsplash for placeholder photography

## Getting started

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/` — App Router pages and components
- `data/` — content data (portfolio, services, pricing, testimonials, coverage)
- `lib/` — utilities (light-hours computation, motion variants)
- `public/` — static assets
