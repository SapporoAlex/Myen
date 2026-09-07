# Earnings Tracker

A small earnings tracker: pick a date on a calendar, log entries (amount in
yen + category), and see a monthly dashboard — a stacked bar chart by
category, each category's best month, a breakdown of a selected month, and a
plain-language summary.

Categories: Main, Web Freelance, Misc, Translation.

## Data storage

Entries live behind a small repository interface
([src/lib/storage/types.ts](src/lib/storage/types.ts)) with two
implementations:

- **Browser local storage** (default) — no setup, works the moment you open
  the page, including on GitHub Pages. Data stays in that one browser.
- **Supabase** — set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see
  [.env.example](.env.example)) and the app switches to it automatically,
  with no code changes. Run [supabase/schema.sql](supabase/schema.sql) in a
  new Supabase project's SQL editor first to create the `entries` table.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploy

The build is a fully static site (`vite.config.ts` uses a relative `base`),
so the same `dist/` folder works unmodified on:

- **Vercel** — import the repo; framework preset "Vite" is auto-detected.
  Add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` as project env vars if
  and when you set up Supabase.
- **GitHub Pages** — build, then publish `dist/` (e.g. via the
  `actions/deploy-pages` GitHub Action, or `gh-pages` branch push). Local
  storage only, since Pages can't hold secrets for a build-time env var
  without a CI step.
- **AWS** — upload `dist/` to an S3 bucket (static website hosting) or an
  Amplify app connected to the repo.
