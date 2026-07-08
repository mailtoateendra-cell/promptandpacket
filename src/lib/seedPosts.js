export const SITE = {
  brand: "Prompt & Packet",
  nav: ["Home", "Blogs", "Tutorials", "About"],
  hero: {
    headline: "Decoding AI and Core Engineering",
    sub: "Deep-dive tutorials, prompt architecture, and clean code.",
  },
  youtubeUrl: "https://youtube.com/@promptandpacket",
  socials: { youtube: "#", github: "#", x: "#" },
};

export const VIDEOS = [
  { id: "v1", title: "Prompt Architecture 101: System vs. User Space", length: "18:42", tag: "SEQ 014", views: "42K views · 2 wk ago" },
  { id: "v2", title: "Reading a TCP Handshake Like a Story", length: "12:07", tag: "SEQ 013", views: "31K views · 3 wk ago" },
  { id: "v3", title: "RAG Pipelines Without the Framework Bloat", length: "24:19", tag: "SEQ 012", views: "58K views · 1 mo ago" },
];

const html = (s) => s.trim();

export const SEED_POSTS = [
  {
    id: "seed-1",
    slug: "context-window-budgeting",
    title: "Context Window Budgeting: Treat Tokens Like Memory Pages",
    excerpt: "Your prompt is a memory allocator. Here's how to budget system, retrieval, and history segments before they fight each other.",
    tags: ["AI", "Prompting"], category: "blog",
    read_mins: 8, created_at: "2026-06-28T00:00:00Z", published: true,
    cover_image_url: null,
    body_html: html(`
      <p>Every long-running agent eventually hits the same wall: the context window fills, retrieval gets noisy, and the model starts <em>forgetting on purpose</em>. The fix isn't a bigger window — it's a <strong>budget</strong>.</p>
      <h2>Think in segments, not strings</h2>
      <p>Split the window into fixed-ratio segments the way an OS splits RAM into pages: system instructions, tool schemas, retrieved chunks, and rolling history. Give each a hard ceiling and enforce it with a <code>token_budget</code> check before every call.</p>
      <pre><code>BUDGET = {
    "system": 0.10,
    "tools":  0.15,
    "rag":    0.35,
    "history":0.30,
    "reserve":0.10,
}

def fits(segment, tokens, window=200_000):
    return tokens <= BUDGET[segment] * window</code></pre>
      <h3>Evict oldest, summarize evicted</h3>
      <p>When <code>history</code> overflows, don't truncate — <strong>summarize the evicted turns</strong> into a compact digest and pin it to the top of the segment. You trade fidelity for recall, which is almost always the right trade.</p>
    `),
  },
  {
    id: "seed-2",
    slug: "idempotent-deploys",
    title: "Idempotent Deploys: The Only Rollback Strategy That Sleeps",
    excerpt: "If running your deploy twice changes anything, it isn't done. A field guide to convergent pipelines.",
    tags: ["DevOps"], category: "blog",
    read_mins: 6, created_at: "2026-06-14T00:00:00Z", published: true,
    cover_image_url: null,
    body_html: html(`
      <p>A deploy script that can't be re-run safely is a <strong>loaded gun on the desk</strong>. Idempotency — same input, same end state, every time — is what lets you redeploy at 3 a.m. without thinking.</p>
      <h2>Converge, don't mutate</h2>
      <p>Write every step as <em>desired state</em>, not as an action: <code>ensure_container(v42)</code> instead of <code>restart_container()</code>.</p>
      <pre><code>kubectl apply -f deploy.yaml
kubectl rollout status deploy/api --timeout=120s</code></pre>
    `),
  },
  {
    id: "seed-3",
    slug: "build-a-minimal-rag",
    title: "Tutorial: A Minimal RAG Pipeline in 120 Lines",
    excerpt: "Chunk, embed, retrieve, answer — no framework, full visibility. Follow along with plain Python.",
    tags: ["Tutorial", "AI"], category: "tutorial",
    read_mins: 14, created_at: "2026-06-21T00:00:00Z", published: true,
    cover_image_url: null,
    body_html: html(`
      <p>Frameworks hide the four moves that make RAG work. We'll write them by hand: <strong>chunk → embed → retrieve → answer</strong>.</p>
      <h2>Step 1 — chunk with overlap</h2>
      <pre><code>def chunk(text, size=800, overlap=120):
    step = size - overlap
    return [text[i:i+size] for i in range(0, len(text), step)]</code></pre>
      <h2>Step 2 — embed and index</h2>
      <p>Any embedding endpoint works; store vectors in a plain list until you outgrow it.</p>
    `),
  },
];
