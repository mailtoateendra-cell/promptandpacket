import React, { useEffect, useState } from "react";
import Editor from "../components/Editor.jsx";
import {
  listAllPosts, upsertPost, deletePost, uploadImage, slugify,
  getSiteSettings, saveSiteSettings,
  listVideos, addVideo, deleteVideo, parseYouTubeId, fetchYouTubeMeta,
} from "../lib/posts.js";

const emptyPost = () => ({
  id: undefined, slug: "", title: "", excerpt: "", tags: [], category: "blog",
  cover_image_url: "", body_html: "<p></p>", read_mins: 5, published: false,
});

function PostList({ posts, onEdit, onNew, onDelete }) {
  return (
    <div>
      <div className="dash-head">
        <div>
          <div className="eyebrow">CONTENT <b>· posts &amp; tutorials</b></div>
          <h1>Posts</h1>
        </div>
        <button className="btn-solid" onClick={onNew}>+ New post</button>
      </div>
      {posts.length === 0
        ? <div className="dash-empty">No posts yet. Create your first one — it goes live the moment you publish.</div>
        : (
          <div className="dash-list">
            {posts.map((p) => (
              <div key={p.id} className="dash-row">
                <div>
                  <div className="dash-row-title">
                    {p.title || "(untitled)"}
                    <span className={p.published ? "pill-live" : "pill-draft"}>{p.published ? "live" : "draft"}</span>
                  </div>
                  <div className="dash-row-meta">/{p.slug} · {p.category} · {p.read_mins} min</div>
                </div>
                <div className="dash-row-actions">
                  <button className="btn-ghost" onClick={() => onEdit(p)}>Edit</button>
                  <button className="btn-ghost danger" onClick={() => onDelete(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

const DEFAULT_SETTINGS = {
  brand: "Prompt & Packet",
  hero_headline: "Decoding AI and Core Engineering",
  hero_sub: "Deep-dive tutorials, prompt architecture, and clean code.",
  hero_eyebrow: "Deep-dive tutorials · Prompt architecture · Clean code",
  about_body: "Prompt & Packet sits at the seam between the prompts that steer modern AI systems and the packets that carry everything underneath.",
  youtube_url: "#", github_url: "#", x_url: "#",
  footer_tagline: "Signal over noise. One email a week.",
};

function SiteSettings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setOk(false); };

  useEffect(() => {
    getSiteSettings().then((s) => setForm(s || DEFAULT_SETTINGS));
  }, []);

  const save = async () => {
    setSaving(true); setErr(""); setOk(false);
    try { await saveSiteSettings(form); setOk(true); }
    catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  if (!form) return <p>Loading settings…</p>;

  return (
    <div>
      <div className="dash-head">
        <div>
          <div className="eyebrow">SITE <b>· banner, about, links</b></div>
          <h1>Site content</h1>
        </div>
        <button className="btn-solid" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="field">
        <label>Hero headline (homepage banner)</label>
        <input value={form.hero_headline} onChange={(e) => set("hero_headline", e.target.value)} />
        <p className="field-hint">The last two words get the colored gradient automatically.</p>
      </div>
      <div className="field">
        <label>Hero eyebrow (small line above headline)</label>
        <input value={form.hero_eyebrow || ""} onChange={(e) => set("hero_eyebrow", e.target.value)}
          placeholder="Deep-dive tutorials · Prompt architecture · Clean code" />
        <p className="field-hint">Separate segments with " · " (a middot). Leave blank to hide it.</p>
      </div>
      <div className="field">
        <label>Hero subheadline</label>
        <textarea value={form.hero_sub} onChange={(e) => set("hero_sub", e.target.value)} />
      </div>
      <div className="field">
        <label>About page text</label>
        <textarea style={{ minHeight: 140 }} value={form.about_body} onChange={(e) => set("about_body", e.target.value)} />
      </div>
      <div className="ed-grid">
        <div className="field">
          <label>YouTube URL</label>
          <input value={form.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtube.com/@you" />
        </div>
        <div className="field">
          <label>GitHub URL</label>
          <input value={form.github_url} onChange={(e) => set("github_url", e.target.value)} placeholder="https://github.com/you" />
        </div>
      </div>
      <div className="ed-grid">
        <div className="field">
          <label>X / Twitter URL</label>
          <input value={form.x_url} onChange={(e) => set("x_url", e.target.value)} placeholder="https://x.com/you" />
        </div>
        <div className="field">
          <label>Footer tagline</label>
          <input value={form.footer_tagline} onChange={(e) => set("footer_tagline", e.target.value)} />
        </div>
      </div>
      {err && <div className="admin-err">{err}</div>}
      {ok && <div className="save-ok">✓ Saved. Refresh the public site to see changes.</div>}
    </div>
  );
}

function PostEditor({ post, onSaved, onCancel, categoryOptions }) {
  const [form, setForm] = useState(post);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (publishOverride) => {
    setSaving(true); setErr("");
    try {
      const row = { ...form, published: publishOverride ?? form.published };
      const saved = await upsertPost(row);
      onSaved(saved);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      set("cover_image_url", url);
    } catch (e) {
      setErr("Cover upload failed: " + e.message);
    }
    e.target.value = "";
  };

  return (
    <div>
      <button className="back" onClick={onCancel}>← Back to posts</button>
      <div className="eyebrow" style={{ marginBottom: 18 }}>EDITING <b>· {form.title || "untitled"}</b></div>

      <div className="ed-grid">
        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => {
            set("title", e.target.value);
            if (!form.id) set("slug", slugify(e.target.value));
          }} placeholder="Post title" />
        </div>
        <div className="field">
          <label>Slug</label>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="post-slug" />
        </div>
      </div>

      <div className="ed-grid">
        <div className="field">
          <label>Category</label>
          <input list="category-options" value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Pick one or type your own" />
          <datalist id="category-options">
            {categoryOptions.map((c) => <option key={c} value={c} />)}
          </datalist>
          <p className="field-hint">Choose an existing category or type a brand-new one. "Tutorial" posts also appear under the Tutorials tab.</p>
        </div>
        <div className="field">
          <label>Read time (min)</label>
          <input type="number" min="1" value={form.read_mins}
            onChange={(e) => set("read_mins", Number(e.target.value))} />
        </div>
      </div>

      <div className="field">
        <label>Tags (comma separated)</label>
        <input value={form.tags.join(", ")}
          onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          placeholder="AI, DevOps" />
      </div>

      <div className="field">
        <label>Excerpt</label>
        <input value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)}
          placeholder="One or two sentence summary" />
      </div>

      <div className="field">
        <label>Cover image</label>
        <div className="cover-row">
          {form.cover_image_url && <img className="cover-preview" src={form.cover_image_url} alt="" />}
          <input type="file" accept="image/*" onChange={onCover} />
        </div>
      </div>

      <div className="field">
        <label>Body</label>
        <Editor value={form.body_html} onChange={(html) => set("body_html", html)} />
      </div>

      {err && <div className="admin-err">{err}</div>}

      <div className="ed-actions">
        <button className="btn-ghost" disabled={saving} onClick={() => save(false)}>Save draft</button>
        <button className="btn-solid" disabled={saving} onClick={() => save(true)}>
          {saving ? "Publishing…" : "Publish"}
        </button>
      </div>
    </div>
  );
}

function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    listVideos().then(setVideos).catch(() => setVideos([])).finally(() => setLoading(false));
  };
  useEffect(refresh, []);

  const add = async () => {
    setErr("");
    const ytId = parseYouTubeId(url);
    if (!ytId) { setErr("That doesn't look like a YouTube link. Paste a full watch/share URL."); return; }
    setBusy(true);
    try {
      const meta = await fetchYouTubeMeta(ytId);
      await addVideo({
        youtube_id: ytId,
        title: meta.title,
        thumbnail_url: meta.thumbnail_url,
        duration: duration.trim(),
        sort_order: 0,
      });
      setUrl(""); setDuration("");
      refresh();
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const remove = async (v) => {
    if (!window.confirm(`Remove "${v.title || v.youtube_id}"?`)) return;
    await deleteVideo(v.id);
    refresh();
  };

  return (
    <div>
      <div className="dash-head">
        <div>
          <div className="eyebrow">CHANNEL <b>· manage videos</b></div>
          <h1>Videos</h1>
        </div>
      </div>

      <div className="video-add">
        <div className="field" style={{ marginBottom: 10 }}>
          <label>YouTube link</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…  (or youtu.be/…)"
            onKeyDown={(e) => e.key === "Enter" && add()} />
          <p className="field-hint">Paste any YouTube video URL — the title and thumbnail are pulled in automatically.</p>
        </div>
        <div className="video-add-row">
          <div className="field" style={{ margin: 0, flex: 1 }}>
            <label>Duration (optional)</label>
            <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="18:42" />
          </div>
          <button className="btn-solid" disabled={busy} onClick={add} style={{ alignSelf: "flex-end" }}>
            {busy ? "Adding…" : "Add video"}
          </button>
        </div>
        {err && <div className="admin-err">{err}</div>}
      </div>

      {loading ? <p>Loading…</p> : videos.length === 0 ? (
        <div className="dash-empty">No videos yet. Paste a YouTube link above to add your first one.</div>
      ) : (
        <div className="dash-list" style={{ marginTop: 20 }}>
          {videos.map((v) => (
            <div key={v.id} className="dash-row">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="vm-thumb" />}
                <div>
                  <div className="dash-row-title">{v.title || "(untitled)"}</div>
                  <div className="dash-row-meta">{v.youtube_id}{v.duration ? ` · ${v.duration}` : ""}</div>
                </div>
              </div>
              <div className="dash-row-actions">
                <button className="btn-ghost danger" onClick={() => remove(v)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ userEmail, onSignOut }) {
  const [tab, setTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    listAllPosts().then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
  };
  useEffect(refresh, []);

  const onDelete = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    await deletePost(p.id);
    refresh();
  };

  // Build the category suggestion list: sensible defaults + any categories the
  // user has already created, de-duplicated. Typing a new one just works.
  const categoryOptions = Array.from(
    new Set(["blog", "tutorial", ...posts.map((p) => p.category).filter(Boolean)])
  );

  // Editing a post takes over the whole panel (hides tabs for focus).
  if (editing) {
    return (
      <div className="dash">
        <PostEditor
          post={editing}
          categoryOptions={categoryOptions}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh(); }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="dash-topbar">
        <div className="dash-tabs">
          <button className={tab === "posts" ? "on" : ""} onClick={() => setTab("posts")}>Posts</button>
          <button className={tab === "videos" ? "on" : ""} onClick={() => setTab("videos")}>Videos</button>
          <button className={tab === "site" ? "on" : ""} onClick={() => setTab("site")}>Site content</button>
        </div>
        {onSignOut && (
          <button className="btn-ghost" onClick={onSignOut} title={userEmail}>Sign out</button>
        )}
      </div>
      <div className="dash">
        {tab === "posts" && (
          loading
            ? <p>Loading posts…</p>
            : <PostList posts={posts} onNew={() => setEditing(emptyPost())} onEdit={setEditing} onDelete={onDelete} />
        )}
        {tab === "videos" && <VideoManager />}
        {tab === "site" && <SiteSettings />}
      </div>
    </>
  );
}
