# Prompt & Packet

A minimalist tech/AI blog with a full CMS: rich-text post editor, image uploads,
and editable site content (hero banner, About text, social links, footer) — all
behind a secure, allowlisted admin login. Built with Vite + React + Supabase.

## ⚠️ If you see "Could not find the table 'public.site_settings'"
You haven't run the latest `supabase/schema.sql` yet. Fix in 30 seconds:
Supabase → SQL Editor → New query → paste all of `supabase/schema.sql` → Run.
Safe to re-run anytime. This creates the `site_settings` table the Site content tab needs.

## 1. Supabase setup
1. Create a project at supabase.com.
2. SQL Editor → New query → paste **all** of `supabase/schema.sql` → Run.
   (Safe to re-run anytime — it uses `if not exists` / `on conflict`.)
   This creates the `posts` table, the `site_settings` table, RLS policies, and
   the `media` storage bucket for images.
3. Authentication → Users → **Add user** — create your own login (email + password).
   This is your CMS login.
4. Settings → API → copy the **Project URL** and the **anon public** key.
5. Open `src/App.jsx`, set `ADMIN_ALLOWLIST` to your email (from step 3).
   Only emails in this list can reach the dashboard, even with a valid account.

## 2. Local development
```bash
npm install
cp .env.example .env      # fill in your Supabase URL + anon key
npm run dev
```
Visit http://localhost:5173 — admin at http://localhost:5173/#/admin

## 3. Deploy to Netlify
1. Push this repo to GitHub.
2. Netlify → Add new site → Import from Git → pick the repo.
3. Build command `npm run build`, publish dir `dist` (already set in `netlify.toml`).
4. Site settings → Environment variables → add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Live at `yoursite.netlify.app`. Share `/#/blogs` with readers.

## Using the CMS  (yoursite.netlify.app/#/admin)
Sign in with your Supabase login. Two tabs:

**Posts** — create, edit, delete, publish/unpublish.
Rich-text toolbar: bold, italic, inline code, H2/H3, bullet lists, code blocks,
quotes, links, and inline image upload. Plus cover image, tags, category
(Blog/Tutorial), excerpt, read time. **Save draft** keeps it private; **Publish**
makes it live immediately. Drafts never appear on the public site.

**Site content** — edit the homepage hero headline + subheadline, the About page
text, your YouTube/GitHub/X links, and the footer tagline. Save, then refresh the
public site to see changes.

## Troubleshooting "can't add post"
Almost always one of these — the app now surfaces the exact cause in a red box:
- **"table doesn't exist"** → you didn't run `supabase/schema.sql`. Run it.
- **"blocked by row-level security"** → schema.sql wasn't fully run (it creates the
  write policy), or you're not signed in.
- **"media bucket doesn't exist"** → re-run `supabase/schema.sql`; it creates the bucket.
- **"slug already used"** → change the slug field to something unique.

## Notes
- The site ships with 3 seed posts so it's never blank. As soon as you publish a
  real post, your posts replace the seed content.
- The anon key is safe to expose publicly — Row Level Security (set up by schema.sql)
  is what actually protects writes. Never commit your `.env` (it's gitignored).
