# Myen

A small earnings tracker: pick a date on a calendar, log entries (amount in
yen + category), and see a monthly dashboard — a stacked bar chart by
category, each category's best month, a breakdown of a selected month, and a
plain-language summary.

Categories: Main, Web Freelance, Misc, Translation.

## Data storage

Entries live behind a small repository interface
([src/lib/storage/types.ts](src/lib/storage/types.ts)) with three
implementations, picked by env vars (see [.env.example](.env.example)):

- **Sample data** — `VITE_USE_DUMMY_DATA=true` serves generated data for the
  past 6 months ([src/data/dummyEntries.ts](src/data/dummyEntries.ts)) so
  you can see what the dashboard looks like. Edits during the session are
  in-memory only and reset on reload.
- **Browser local storage** (default when the above is unset/false and no
  Supabase vars are set) — no setup, works the moment you open the page,
  including on GitHub Pages. Data stays in that one browser.
- **Supabase** — set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and
  the app switches to it automatically, no code changes. This mode is
  gated behind email/password login ([src/hooks/useAuth.ts](src/hooks/useAuth.ts),
  [src/components/Auth/LoginScreen.tsx](src/components/Auth/LoginScreen.tsx)) —
  each account only sees its own entries, enforced by Postgres Row Level
  Security ([supabase/schema.sql](supabase/schema.sql)), not just app code.
  See [SUPABASE_DEPLOY_GUIDE.md](SUPABASE_DEPLOY_GUIDE.md) for the full
  step-by-step (creating the project, running the schema, creating your
  account, and deploying to Vercel).

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
- **GitHub Pages** — a workflow at
  [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)
  builds and publishes `dist/` on every push to `main`, using repo secrets
  for the Supabase env vars if you've set them up. See
  [GITHUB_PAGES_DEPLOY_GUIDE.md](GITHUB_PAGES_DEPLOY_GUIDE.md) for setup.
- **AWS** — upload `dist/` to an S3 bucket (static website hosting) or an
  Amplify app connected to the repo.
