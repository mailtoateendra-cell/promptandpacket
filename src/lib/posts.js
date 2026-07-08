import { supabase } from "./supabaseClient.js";
import { SEED_POSTS } from "./seedPosts.js";

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Public site: only published posts. Falls back to seed content
   if Supabase isn't configured yet or the table is empty, so the
   site is never blank on first deploy. */
export async function listPublishedPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return SEED_POSTS;
  return data;
}

export async function getPublishedPost(slug) {
  const { data, error } = await supabase
    .from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error || !data) return SEED_POSTS.find((p) => p.slug === slug) || null;
  return data;
}

/* Admin: everything, including drafts. Requires an authenticated session
   (enforced server-side by the RLS policy in supabase/schema.sql). */
export async function listAllPosts() {
  const { data, error } = await supabase
    .from("posts").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPostById(id) {
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function upsertPost(post) {
  const row = {
    ...post,
    slug: post.slug ? slugify(post.slug) : slugify(post.title || "untitled"),
    updated_at: new Date().toISOString(),
  };
  // A new post has no id yet. Sending id: undefined/"" makes Postgres reject the
  // upsert (invalid uuid / null primary key), so drop the key entirely and let
  // the DB default (gen_random_uuid()) fill it in.
  if (!row.id) delete row.id;

  const { data, error } = await supabase.from("posts").upsert(row).select().single();
  if (error) {
    // Turn the most common setup mistakes into plain-language guidance.
    if (/relation .*posts.* does not exist/i.test(error.message))
      throw new Error("The 'posts' table doesn't exist yet. Run supabase/schema.sql in the Supabase SQL Editor.");
    if (/row-level security|violates row-level/i.test(error.message))
      throw new Error("Blocked by row-level security. Make sure you're signed in and that schema.sql was run (it creates the write policy).");
    if (/duplicate key.*slug/i.test(error.message))
      throw new Error("That slug is already used by another post. Change the slug and try again.");
    throw new Error(error.message);
  }
  return data;
}

export async function deletePost(id) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

/* Uploads a File to the public `media` bucket, returns its public URL.
   Used for cover images and inline images dropped into the editor. */
export async function uploadImage(file) {
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) {
    if (/bucket not found/i.test(error.message))
      throw new Error("The 'media' storage bucket doesn't exist. Run supabase/schema.sql — it creates the bucket and its policies.");
    throw new Error(error.message);
  }
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

/* ── Site settings: editable hero, about, socials, footer ──
   Stored as a single row (id = 1) in the site_settings table. */
export async function getSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null; // caller falls back to defaults
  return data;
}

export async function saveSiteSettings(settings) {
  const row = { ...settings, id: 1, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from("site_settings").upsert(row).select().single();
  if (error) {
    if (/relation .*site_settings.* does not exist/i.test(error.message))
      throw new Error("The 'site_settings' table doesn't exist yet. Re-run supabase/schema.sql.");
    throw new Error(error.message);
  }
  return data;
}

/* ── Channel videos ── */

/* Extract the 11-char YouTube ID from any common URL form. */
export function parseYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) { const m = url.match(re); if (m) return m[1]; }
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

/* Fetch title via YouTube's public oEmbed endpoint (no API key needed).
   Thumbnail is derived directly from the video id. */
export async function fetchYouTubeMeta(youtubeId) {
  const thumbnail_url = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  let title = "";
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
    );
    if (res.ok) { const data = await res.json(); title = data.title || ""; }
  } catch { /* offline / blocked — title stays blank, editable by hand */ }
  return { thumbnail_url, title };
}

export async function listVideos() {
  const { data, error } = await supabase
    .from("videos").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function addVideo(video) {
  const { data, error } = await supabase.from("videos").insert(video).select().single();
  if (error) {
    if (/relation .*videos.* does not exist/i.test(error.message))
      throw new Error("The 'videos' table doesn't exist yet. Re-run supabase/schema.sql.");
    throw new Error(error.message);
  }
  return data;
}

export async function deleteVideo(id) {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export { slugify };
