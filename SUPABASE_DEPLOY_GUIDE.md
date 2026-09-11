# Connecting to Supabase & Deploying

Right now the app is showing generated sample data (the "Storage: Sample
data" badge, top right) so you can see what the dashboard looks like. This
guide walks through swapping that for a real Supabase database, pushing the
code to GitHub, and deploying it on Vercel.

The app gates access behind email/password login (via Supabase Auth) as
soon as Supabase is configured — each account only ever sees its own
entries, enforced by the database itself (Row Level Security), not just
app code. Local storage and sample data modes stay login-free since
they're already private to your browser.

You don't have to do this all in one sitting — Part 1-6 get real data
working on your own machine; Part 7-8 put it on the internet.

## Part 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or sign up — the
   free tier is enough for this).
2. Click **New project**.
3. Fill in a name (e.g. `earnings-tracker`), a database password (save it
   somewhere — you likely won't need it again, but just in case), and pick
   a region close to you.
4. Click **Create new project** and wait a minute or two while it
   provisions.

## Part 2 — Create the database table

1. Once the project's dashboard loads, click the **SQL Editor** icon in the
   left sidebar.
2. Click **New query**.
3. Open [`supabase/schema.sql`](supabase/schema.sql) in this repo and copy
   its entire contents.
4. Paste it into the SQL editor and click **Run** (or Cmd/Ctrl+Enter).
5. You should see "Success. No rows returned" — that means the `entries`
   table now exists, with each row tied to the account that created it.
   Email/password sign-up is on by default in a new Supabase project, so
   there's nothing else to enable here.

## Part 3 — Get your API credentials

1. In the left sidebar, click the gear icon (**Project Settings**), then
   **API** (or **Data API**, depending on the version).
2. You'll see two things you need:
   - **Project URL** — looks like `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key** — a long string, under "Project API keys"
3. Keep this page open — you'll copy these into two places below.

## Part 4 — Allow your app's URL

Supabase only sends confirmation and password-reset email links back to
URLs you've explicitly allowed. By default that's `http://localhost:3000`,
which isn't where this app actually runs (`5173`) — skipping this step
means the "create your account" email link in Part 6 will redirect
somewhere that isn't your app.

1. In the left sidebar, go to **Authentication → URL Configuration**.
2. Set **Site URL** to `http://localhost:5173`.
3. Under **Redirect URLs**, add `http://localhost:5173/**`.
4. Click **Save**.

(You'll come back here after Part 8 to add your live Vercel URL too.)

## Part 5 — Point the app at Supabase (on your machine)

1. In the project folder, open the `.env.local` file. (It already exists
   with `VITE_USE_DUMMY_DATA=true` — that's what's showing the sample
   data.) If it's missing, create a new file named exactly `.env.local`
   next to `package.json`.
2. Replace its contents with:
   ```
   VITE_USE_DUMMY_DATA=false
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
   ```
   (using your real values from Part 3)
3. Save the file. If `npm run dev` is currently running, stop it
   (Ctrl+C) and start it again — Vite only reads `.env.local` at startup.
4. The app should now show a sign-in screen instead of the dashboard.

## Part 6 — Create your account

1. On the sign-in screen, click **Create an account**, enter your email
   and a password (6+ characters), and submit.
2. Supabase sends a confirmation email by default. Open it and click the
   confirmation link, then come back and sign in with the same email and
   password.
3. Once signed in, the badge should say **"Storage: Supabase"**. Add an
   entry, then check Supabase's dashboard → **Table Editor** → `entries` —
   you should see the row you just added, with your account's id in its
   `user_id` column.

   **Optional — lock the app to just you:** since anyone with your app's
   URL could otherwise create their own account (they'd only ever see
   their own entries, never yours, but it's still your infra), you can
   turn off further sign-ups once yours exists: in Supabase, go to
   **Authentication → Sign In / Providers** (or **Authentication →
   Settings**, depending on the version) and disable "Allow new users to
   sign up".

## Part 7 — Push the code to GitHub

1. On [github.com](https://github.com), click **New repository**. Give it
   a name (e.g. `earnings-tracker`); public or private is up to you. Don't
   check "Add a README" — this repo already has one.
2. GitHub will show commands under "…or push an existing repository from
   the command line". They look like this (yours will have your username
   and repo name):
   ```
   git remote add origin https://github.com/<you>/earnings-tracker.git
   git branch -M main
   git push -u origin main
   ```
3. Run those commands from this project's folder in your terminal.

## Part 8 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub
   account.
2. Click **Add New…** → **Project**, then select the repo you just pushed.
3. Vercel auto-detects this as a Vite app — you don't need to change the
   build settings.
4. Before clicking **Deploy**, expand **Environment Variables** and add
   three rows:
   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | the Project URL from Part 3 |
   | `VITE_SUPABASE_ANON_KEY` | the anon key from Part 3 |
   | `VITE_USE_DUMMY_DATA` | `false` |
5. Click **Deploy**. After about a minute you'll get a live URL like
   `earnings-tracker.vercel.app`.
6. Back in Supabase (**Authentication → URL Configuration**, from Part 4):
   - Change **Site URL** to your Vercel URL, e.g.
     `https://earnings-tracker.vercel.app`.
   - Add `https://earnings-tracker.vercel.app/**` to **Redirect URLs**
     (you can leave the `localhost:5173` one too, so local dev keeps
     working).
   - Click **Save**.
7. Open your Vercel URL and sign in with the same account from Part 6 —
   it's the same Supabase project, so the same login works.

## Switching between modes later

All three modes (sample data / Supabase / local browser storage) are
controlled by the same two settings — locally in `.env.local`, or on
Vercel under **Project Settings → Environment Variables** (redeploy after
changing them there):

| You want | `VITE_USE_DUMMY_DATA` | `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` |
|---|---|---|
| Sample data (what you see now) | `true` | (ignored either way) |
| Real data in Supabase | `false` | both set |
| Real data in browser storage only | `false` | both blank |

## Troubleshooting

- **Badge doesn't change after editing `.env.local`** → restart `npm run
  dev`; Vite only reads env files on startup.
- **Deployed on Vercel but still showing sample/local data** → env var
  changes on Vercel only take effect on the *next* deployment — go to the
  Deployments tab and redeploy, or push a new commit.
- **Entries don't show up in Supabase's Table Editor** → double-check the
  URL and anon key were copied in full (no missing characters or extra
  spaces), and that Part 2's SQL ran without an error.
- **"Email not confirmed" when signing in** → click the confirmation link
  Supabase emailed you first (Part 6, step 2), then try again.
- **Confirmation/reset email link leads to an error page or the wrong
  address** → Part 4's Site URL / Redirect URLs don't match where you're
  running the app right now — e.g. you deployed (Part 8) but Site URL is
  still set to `localhost:5173`, or vice versa. Update it to match, then
  request a new email (old links are stale).
- **Sign-up says an account already exists but you never made one** →
  someone (maybe a bot) may have signed up with that email. Use **Forgot
  password?** to claim it, or use a different email.
