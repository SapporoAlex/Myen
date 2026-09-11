# Deploying to GitHub Pages (deploy-on-push)

This repo already includes a workflow —
[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) —
that builds the app and publishes it to GitHub Pages every time you push to
`main`. You don't need to write any CI config yourself; you just need to
turn a few things on in GitHub and (if you're using Supabase) tell GitHub
your Supabase credentials so the build can use them.

If you haven't set up Supabase yet, that's fine — the app will fall back to
browser local storage on Pages. You can add Supabase later by following
[SUPABASE_DEPLOY_GUIDE.md](SUPABASE_DEPLOY_GUIDE.md) and then just doing
Part 2 below (adding the secrets) and pushing again.

## Part 1 — Create the GitHub repo and push

Skip this if you've already pushed this project to GitHub.

1. On [github.com](https://github.com), click **New repository**. Give it
   a name (e.g. `myen`); public or private is up to you. Don't check "Add a
   README" — this repo already has one.
2. GitHub will show commands under "…or push an existing repository from
   the command line". Run those from this project's folder, e.g.:
   ```
   git remote add origin https://github.com/<you>/myen.git
   git branch -M main
   git push -u origin main
   ```

## Part 2 — Add your Supabase credentials as repo secrets

Only needed if you want the deployed site to use Supabase (real accounts,
shared database) instead of local-storage-only mode.

1. In your GitHub repo, go to **Settings → Secrets and variables →
   Actions**.
2. Click **New repository secret** and add:
   - Name: `VITE_SUPABASE_URL` — Value: your Project URL from Supabase
     (Project Settings → API).
   - Name: `VITE_SUPABASE_ANON_KEY` — Value: your anon/public key from the
     same page.
3. Save both. The workflow reads these automatically on the next build —
   nothing else to configure.

(If you skip this, the deployed build just runs with local browser storage
— no error, just a different `Storage:` badge.)

## Part 3 — Turn on GitHub Pages

1. In your GitHub repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not
   "Deploy from a branch" — the workflow handles that itself).
3. That's it — no branch or folder to pick, since the workflow uploads the
   build directly.

## Part 4 — Trigger the first deploy

1. Push any commit to `main` (or go to the **Actions** tab, select "Deploy
   to GitHub Pages" in the sidebar, and click **Run workflow** to trigger
   it manually without a new commit).
2. Watch it run under the **Actions** tab — it takes about a minute.
3. Once it finishes, your site is live at:
   ```
   https://<you>.github.io/<repo-name>/
   ```
   GitHub also shows this URL on the **Settings → Pages** page once the
   first deploy succeeds.

## Part 5 — If you're using Supabase, allow the Pages URL

Same reasoning as local dev and Vercel (see
[SUPABASE_DEPLOY_GUIDE.md](SUPABASE_DEPLOY_GUIDE.md) Part 4): Supabase only
sends confirmation/reset email links back to URLs you've explicitly
allowed.

1. In Supabase, go to **Authentication → URL Configuration**.
2. Set **Site URL** to your Pages URL, e.g.
   `https://<you>.github.io/<repo-name>/`.
3. Add `https://<you>.github.io/<repo-name>/**` to **Redirect URLs** (you
   can leave `localhost:5173` and any Vercel URL there too — all three can
   coexist).
4. Click **Save**.

## From now on

Every push to `main` rebuilds and redeploys automatically — nothing further
to do. If you rotate your Supabase anon key or switch projects, just update
the two repo secrets in Part 2 and push again (or re-run the workflow
manually from the Actions tab).

## Troubleshooting

- **Workflow fails on `npm ci`** → make sure `package-lock.json` is
  committed (it should already be).
- **Site loads but shows local-storage mode instead of Supabase** → check
  the two secret names match exactly (`VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`) and re-run the workflow — env vars are baked in
  at build time, so a secret added after the last build won't take effect
  until the next one.
- **404 at your Pages URL right after first deploy** → GitHub Pages can
  take a minute or two to go live even after the workflow succeeds; wait
  and refresh.
- **Confirmation/reset email link leads to an error page** → Part 5 above
  wasn't done, or the URL doesn't match exactly (check for a missing/extra
  trailing slash).

OK
