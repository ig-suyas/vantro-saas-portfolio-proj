# Vantro (concept)

A five-page portfolio concept for a fictional AI revenue forecasting platform. Front end only: no backend, no database. The product, company, people and data are fictional.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start
```

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion (component animation), GSAP ScrollTrigger (pinned sequence, loaded on desktop only), Lenis (smooth scroll on fine pointers).

## Where things live

- `app/globals.css`: design tokens (palette, fluid type scale, radius, shadows, easing)
- `components/home/forecast-canvas.tsx`: hero signature animation (canvas, sample data, Replay button)
- `components/home/pinned-sequence.tsx`: "How it works" pinned scroll on desktop, stacked list below 1024px
- `components/product/scenario-planner.tsx`, `components/pricing/pricing-plans.tsx`, `components/demo/demo-form.tsx`: front-end-only interactions
- `lib/forecast.ts`: the shared sample forecast all charts read from

## Environment variables

None required. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` (set automatically) is used for canonical URLs, the sitemap and OG image URLs. Locally they fall back to `http://localhost:3000`.

## Deploy

```bash
vercel --prod
```
