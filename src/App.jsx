import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient.js";
import { SITE, VIDEOS } from "./lib/seedPosts.js";
import { listPublishedPosts, getPublishedPost, getSiteSettings, listVideos } from "./lib/posts.js";
import RichText from "./components/RichText.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { CSS } from "./styles.js";

const ADMIN_ALLOWLIST = ["you@yourdomain.com"];

/* Falls back to seed defaults until site_settings is populated. */
const DEFAULTS = {
  brand: SITE.brand,
  hero_headline: SITE.hero.headline,
  hero_sub: SITE.hero.sub,
  hero_eyebrow: "Deep-dive tutorials · Prompt architecture · Clean code",
  about_body: "Prompt & Packet sits at the seam between the prompts that steer modern AI systems and the packets that carry everything underneath. Most content covers one and hand-waves the other. We go deep on both.",
  youtube_url: SITE.youtubeUrl,
  github_url: "#", x_url: "#",
  footer_tagline: "Signal over noise. One email a week.",
};

/* logo mark: gradient tile with stacked signal bars */
function Logo() {
  return (
    <span className="logo">
      <span className="logo-mark" aria-hidden="true" />
      <span><b>Prompt</b> <em>&amp;</em> <b>Packet</b></span>
    </span>
  );
}

function NewsletterInput() { return null; }

/* A settings link counts as "set" only if it's a real URL, not the "#" placeholder. */
const hasLink = (url) => !!url && url !== "#" && url.trim() !== "";

function Nav({ route, go, settings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = (item) => {
    const map = { Home: "", Blogs: "blogs", Tutorials: "tutorials", About: "about" };
    return route === map[item];
  };
  const nav = (item) => { go(item === "Home" ? "" : item.toLowerCase()); setMenuOpen(false); };
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <button onClick={() => { go(""); setMenuOpen(false); }} aria-label="Prompt & Packet home"><Logo /></button>
        <nav className="nav-links" aria-label="Main">
          {SITE.nav.map((item) => (
            <button key={item} className={active(item) ? "on" : ""} onClick={() => nav(item)}>{item}</button>
          ))}
        </nav>
        <div className="nav-right">
          {hasLink(settings.youtube_url) && (
            <a className="btn-yt" href={settings.youtube_url} target="_blank" rel="noreferrer" aria-label="Subscribe on YouTube">
              <span className="yt-dot" aria-hidden="true"></span> Subscribe
            </a>
          )}
          <button className="nav-burger" aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <span className={"burger" + (menuOpen ? " open" : "")}><i /><i /><i /></span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile">
          <div className="wrap">
            {SITE.nav.map((item) => (
              <button key={item} className={active(item) ? "on" : ""} onClick={() => nav(item)}>{item}</button>
            ))}
            {hasLink(settings.youtube_url) && (
              <a className="mm-sub" href={settings.youtube_url} target="_blank" rel="noreferrer">
                <span className="yt-dot" aria-hidden="true"></span> Subscribe on YouTube
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function VideoGrid({ settings, videos }) {
  const yt = settings.youtube_url;
  const linked = hasLink(yt);
  // Use admin-managed videos; fall back to seed demo videos only if none exist yet.
  const items = (videos && videos.length > 0)
    ? videos.map((v) => ({
        id: v.id,
        title: v.title || "Untitled video",
        thumb: v.thumbnail_url,
        duration: v.duration,
        href: `https://www.youtube.com/watch?v=${v.youtube_id}`,
      }))
    : VIDEOS.map((v) => ({ id: v.id, title: v.title, thumb: null, duration: v.length, tag: v.tag, views: v.views, href: linked ? yt : null }));

  if (items.length === 0) return null;

  return (
    <section className="sect alt" aria-label="Latest videos">
      <div className="wrap">
        <div className="sect-head">
          <div><div className="eyebrow">CHANNEL <b>· latest uploads</b></div><h2>On the channel</h2></div>
          {linked && <a className="see-all" href={yt} target="_blank" rel="noreferrer">View channel →</a>}
        </div>
        <div className="vgrid">
          {items.map((v) => {
            const inner = (
              <>
                <div className="thumb" style={v.thumb ? { backgroundImage: `url(${v.thumb})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                  {v.tag && <span className="thumb-tag">{v.tag}</span>}
                  <span className="play" aria-hidden="true"></span>
                  {v.duration && <span className="vlen">{v.duration}</span>}
                </div>
                <div className="vbody"><h3>{v.title}</h3>{v.views && <span>{v.views}</span>}</div>
              </>
            );
            return v.href ? (
              <a key={v.id} className="vcard" href={v.href} target="_blank" rel="noreferrer">{inner}</a>
            ) : (
              <div key={v.id} className="vcard vcard-static">{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, go }) {
  return (
    <button className="bcard" onClick={() => go("post/" + post.slug)}>
      <div className="bphoto">
        {post.cover_image_url
          ? <img src={post.cover_image_url} alt="" />
          : <span className="ph-mono">/{post.slug}</span>}
      </div>
      <div className="bbody">
        <div className="tags">
          {(post.tags || []).map((t) => <span key={t} className={"tag" + (t === "AI" ? " hi" : "")}>{t}</span>)}
        </div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="meta">{post.read_mins} min read</div>
      </div>
    </button>
  );
}

function Home({ go, posts, settings, videos }) {
  // Split headline so the last two words get the gradient accent.
  const words = settings.hero_headline.trim().split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  // Render the editable eyebrow: split on "·" and accent the tail segments.
  const eyebrowParts = (settings.hero_eyebrow || "").split("·").map((s) => s.trim()).filter(Boolean);
  return (
    <>
      <section className="hero">
        <div className="aurora" aria-hidden="true" />
        <div className="wrap hero-in">
          <span className="hero-badge"><span className="dot" aria-hidden="true" /> <b>New</b> weekly deep-dives</span>
          {eyebrowParts.length > 0 && (
            <div className="hero-eyebrow">
              {eyebrowParts.map((seg, i) => (
                <span key={i}>{i > 0 && <b> · </b>}{seg}</span>
              ))}
            </div>
          )}
          <h1>{head} <em>{tail}</em></h1>
          <p>{settings.hero_sub}</p>
          <div className="hero-cta">
            <button className="btn-solid" onClick={() => go("blogs")}>Read the blog</button>
            {hasLink(settings.youtube_url) && (
              <a className="btn-outline" href={settings.youtube_url} target="_blank" rel="noreferrer">Watch on YouTube →</a>
            )}
          </div>
        </div>
      </section>
      <section className="sect" aria-label="Featured writing">
        <div className="wrap">
          <div className="sect-head">
            <div><div className="eyebrow">WRITING <b>· featured</b></div><h2>Recently published</h2></div>
            <button className="see-all" onClick={() => go("blogs")}>All posts →</button>
          </div>
          <div className="bgrid">
            {posts.slice(0, 3).map((p) => <PostCard key={p.id} post={p} go={go} />)}
          </div>
        </div>
      </section>
      <VideoGrid settings={settings} videos={videos} />
    </>
  );
}

function ListPage({ title, eyebrow, posts, go }) {
  return (
    <div className="list-sect">
      <div className="wrap">
        <div className="list-head">
          <div className="eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        {posts.length === 0
          ? <p style={{ color: "var(--muted)" }}>Nothing published here yet.</p>
          : <div className="bgrid">{posts.map((p) => <PostCard key={p.id} post={p} go={go} />)}</div>}
      </div>
    </div>
  );
}

function PostPage({ slug, go }) {
  const [post, setPost] = useState(undefined);
  useEffect(() => { getPublishedPost(slug).then(setPost); }, [slug]);
  if (post === undefined) return <div className="page"><p>Loading…</p></div>;
  if (post === null) return <div className="page"><h1>Post not found</h1></div>;
  return (
    <article className="article wrap">
      <button className="back" onClick={() => go("blogs")}>← cd ../blogs</button>
      <div className="tags" style={{ marginBottom: 14 }}>
        {(post.tags || []).map((t) => <span key={t} className={"tag" + (t === "AI" ? " hi" : "")}>{t}</span>)}
      </div>
      <h1>{post.title}</h1>
      <div className="art-meta"><span className="meta">{post.read_mins} min read</span></div>
      {post.cover_image_url && (
        <div className="art-cover"><img src={post.cover_image_url} alt="" /></div>
      )}
      <RichText html={post.body_html} />
    </article>
  );
}

function About({ settings }) {
  return (
    <div className="page wrap">
      <div className="eyebrow" style={{ marginBottom: 12 }}>ABOUT <b>· readme</b></div>
      <h1>About Prompt &amp; Packet</h1>
      {settings.about_body.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
    </div>
  );
}

function Footer({ go, settings }) {
  const Icon = {
    youtube: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 4 12 4 12 4s-4.6 0-7.7.2c-.5.1-1.5.1-2.4 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.4c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.9.2 7.6.2 7.6.2s4.6 0 7.7-.2c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.4c0-1.9-.2-3.8-.2-3.8zM9.8 15V8.9l6 3-6 3.1z"/></svg>,
    github: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C19.3 5 20.3 5.3 20.3 5.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>,
    x: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.2h3.7l-8.1 9.3L24 22.8h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L-.1 1.2h7.7l5.3 7 6-7zm-1.3 19.5h2L6.5 3.3h-2.2l13.3 17.4z"/></svg>,
  };
  const socials = { youtube: settings.youtube_url, github: settings.github_url, x: settings.x_url };
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo />
            <p>{settings.footer_tagline}</p>
            <div className="soc">
              {Object.entries(socials)
                .filter(([, href]) => href && href !== "#")
                .map(([k, href]) => (
                  <a key={k} href={href} target="_blank" rel="noreferrer" aria-label={k}>{Icon[k]}</a>
                ))}
            </div>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <h4>Explore</h4>
              <button onClick={() => go("")}>Home</button>
              <button onClick={() => go("blogs")}>Blogs</button>
              <button onClick={() => go("tutorials")}>Tutorials</button>
              <button onClick={() => go("about")}>About</button>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <small>© {new Date().getFullYear()} Prompt &amp; Packet</small>
          <small>Built for engineers, by engineers.</small>
        </div>
      </div>
    </footer>
  );
}

function Admin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecked(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAllowed = (s) => s && ADMIN_ALLOWLIST.includes(s.user.email);

  const signIn = async () => {
    setErr(""); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    if (!ADMIN_ALLOWLIST.includes(data.user.email)) {
      await supabase.auth.signOut();
      setErr("This account isn't authorized for the dashboard.");
    }
  };
  const signOut = async () => { await supabase.auth.signOut(); };

  if (!checked) return <div className="admin"><div className="admin-card"><p>Checking session…</p></div></div>;

  if (isAllowed(session)) {
    return <AdminDashboard userEmail={session.user.email} onSignOut={signOut} />;
  }

  if (session && !isAllowed(session)) {
    return (
      <div className="admin"><div className="admin-card">
        <div className="brandline"><span className="logo-mark" aria-hidden="true" /><b>Prompt &amp; Packet</b></div>
        <h1>Not authorized</h1>
        <p>{session.user.email} is signed in but isn't on the admin allowlist.</p>
        <button className="btn-solid" style={{ width: "100%" }} onClick={signOut}>Sign out</button>
      </div></div>
    );
  }

  return (
    <div className="admin"><div className="admin-card">
      <div className="brandline"><span className="logo-mark" aria-hidden="true" /><b>Prompt &amp; Packet</b></div>
      <h1>Content dashboard</h1>
      <p>Sign in to manage posts and site content.</p>
      <div className="field">
        <label htmlFor="a-em">Email</label>
        <input id="a-em" type="email" autoComplete="off" value={email}
          onChange={(e) => setEmail(e.target.value)} placeholder="you@yourdomain.com" />
      </div>
      <div className="field">
        <label htmlFor="a-pw">Password</label>
        <input id="a-pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="••••••••••" onKeyDown={(e) => e.key === "Enter" && signIn()} />
      </div>
      <button className="btn-solid" style={{ width: "100%", marginTop: 6 }} disabled={loading} onClick={signIn}>
        {loading ? "Signing in…" : "Sign in"}
      </button>
      {err && <div className="admin-err">{err}</div>}
      <div className="admin-note">
        Route <b>#/admin</b> is unlinked from public navigation. Only emails in
        <b> ADMIN_ALLOWLIST</b> (top of App.jsx) can reach the dashboard.
      </div>
    </div></div>
  );
}

export default function App() {
  const [route, setRoute] = useState(() =>
    (typeof window !== "undefined" ? window.location.hash : "").replace(/^#\/?/, ""));
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState(DEFAULTS);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace(/^#\/?/, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => { listPublishedPosts().then(setPosts); }, [route]);
  useEffect(() => {
    getSiteSettings().then((s) => { if (s) setSettings({ ...DEFAULTS, ...s }); });
    listVideos().then(setVideos);
  }, []);

  const go = (r) => { window.location.hash = "/" + r; setRoute(r); window.scrollTo({ top: 0 }); };

  let page;
  if (route === "") page = <Home go={go} posts={posts} settings={settings} videos={videos} />;
  else if (route === "blogs") page = <ListPage title="All writing" eyebrow={<>BLOGS <b>· all posts</b></>} posts={posts} go={go} />;
  else if (route === "tutorials") page = <ListPage title="Tutorials" eyebrow={<>TUTORIALS <b>· step by step</b></>} posts={posts.filter((p) => p.category === "tutorial")} go={go} />;
  else if (route === "about") page = <About settings={settings} />;
  else if (route === "admin") page = <Admin />;
  else if (route.startsWith("post/")) page = <PostPage slug={route.slice(5)} go={go} />;
  else page = <Home go={go} posts={posts} settings={settings} videos={videos} />;

  return (
    <div className="pp">
      <style>{CSS}</style>
      <Nav route={route} go={go} settings={settings} />
      <main>{page}</main>
      {route !== "admin" && <Footer go={go} settings={settings} />}
    </div>
  );
}
