export const CSS = `
  @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=satoshi@400,500,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

  :root{
    --bg:#FFFFFF; --bg-alt:#FBFBFD; --ink:#0A0A0F; --ink-2:#25252E;
    --muted:#57565F; --faint:#8A8A94; --line:#ECECF1; --line-2:#E2E2E9;
    --card:#FFFFFF; --code-bg:#F6F6F9;
    --accent:#4F46E5; --accent-2:#06B6D4; --accent-ink:#3730C4; --accent-soft:#EEF0FE;
    --ok:#0E9F6E;
    --sans:'General Sans','Satoshi',system-ui,-apple-system,sans-serif;
    --disp:'General Sans','Satoshi',system-ui,sans-serif;
    --mono:'JetBrains Mono',ui-monospace,monospace;
    --shadow-sm:0 1px 2px rgba(10,10,20,.04),0 1px 3px rgba(10,10,20,.06);
    --shadow-md:0 10px 30px -12px rgba(10,10,25,.18),0 4px 10px -6px rgba(10,10,25,.10);
    --r:12px;
  }
  html,body{overflow-x:hidden}
  *{box-sizing:border-box;margin:0;padding:0}
  .pp{background:var(--bg);color:var(--ink);font-family:var(--sans);min-height:100vh;
    font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;letter-spacing:-.006em}
  .wrap{max-width:1140px;margin:0 auto;padding:0 24px}
  a,button{font-family:inherit}
  .pp button{cursor:pointer;border:none;background:none;font-size:inherit;color:inherit}
  .pp :focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:3px}
  .eyebrow{font-family:var(--mono);font-size:12px;color:var(--faint);
    letter-spacing:.08em;text-transform:uppercase}
  .eyebrow b{color:var(--accent-ink);font-weight:500}

  /* ── nav ── */
  .nav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.72);
    backdrop-filter:blur(16px) saturate(160%);border-bottom:1px solid var(--line)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:64px;gap:24px}
  .logo{font-family:var(--disp);font-weight:600;font-size:18px;letter-spacing:-.03em;
    display:flex;align-items:center;gap:10px;color:var(--ink)}
  .logo-mark{width:30px;height:30px;border-radius:8px;position:relative;
    background:linear-gradient(140deg,var(--accent),var(--accent-2));flex:none;
    box-shadow:0 3px 10px -2px rgba(79,70,229,.55),inset 0 1px 0 rgba(255,255,255,.35)}
  .logo-mark::after{content:'';position:absolute;inset:9px 8px auto 8px;height:2px;
    background:rgba(255,255,255,.95);border-radius:2px;
    box-shadow:0 5px 0 rgba(255,255,255,.6),0 10px 0 rgba(255,255,255,.32)}
  .logo b{font-weight:600}
  .logo em{font-style:normal;color:var(--accent);font-weight:500}
  .nav-links{display:flex;gap:2px;background:var(--bg-alt);border:1px solid var(--line);
    padding:4px;border-radius:11px}
  .nav-links button{padding:7px 15px;font-size:14px;color:var(--muted);border-radius:8px;font-weight:500;transition:.14s}
  .nav-links button:hover{color:var(--ink);background:var(--card)}
  .nav-links button.on{color:var(--ink);background:var(--card);box-shadow:var(--shadow-sm)}
  .btn-yt{display:flex;align-items:center;gap:7px;background:var(--card);color:var(--ink);
    border:1px solid var(--line-2);padding:7px 14px;border-radius:9px;font-size:13.5px;font-weight:500;
    transition:.14s;box-shadow:var(--shadow-sm)}
  .btn-yt:hover{border-color:#D5D8FB;background:var(--bg-alt)}
  .yt-dot{width:0;height:0;border-left:8px solid #E11D48;border-top:5px solid transparent;border-bottom:5px solid transparent}
  .nav-right{display:flex;align-items:center;gap:10px}
  .nav-burger{display:none;width:38px;height:38px;border:1px solid var(--line-2);border-radius:9px;
    align-items:center;justify-content:center;background:var(--card)}
  .burger{display:flex;flex-direction:column;gap:4px;width:16px}
  .burger i{display:block;height:2px;background:var(--ink);border-radius:2px;transition:.2s}
  .burger.open i:nth-child(1){transform:translateY(6px) rotate(45deg)}
  .burger.open i:nth-child(2){opacity:0}
  .burger.open i:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
  .mobile-menu{border-bottom:1px solid var(--line);background:var(--card);
    animation:menudrop .18s ease}
  @keyframes menudrop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
  .mobile-menu .wrap{display:flex;flex-direction:column;padding-top:8px;padding-bottom:14px}
  .mobile-menu button{text-align:left;padding:13px 4px;font-size:16px;font-weight:500;color:var(--ink-2);
    border-bottom:1px solid var(--line)}
  .mobile-menu button.on{color:var(--accent-ink)}
  .mm-sub{display:flex;align-items:center;gap:8px;margin-top:14px;padding:12px 16px;
    background:var(--ink);color:#fff;border-radius:10px;font-size:14px;font-weight:500;justify-content:center}
  .mm-sub .yt-dot{border-left-color:#fff}
  @media(max-width:760px){
    .nav-links{display:none}
    .nav-burger{display:flex}
    .btn-yt{display:none}
  }

  /* ── hero (signature: aurora mesh) ── */
  .hero{position:relative;overflow:hidden;border-bottom:1px solid var(--line);background:var(--bg)}
  .aurora{position:absolute;inset:-40% -10% auto -10%;height:120%;z-index:0;filter:blur(64px);opacity:.45;
    background:
      radial-gradient(40% 55% at 20% 30%,rgba(79,70,229,.5),transparent 70%),
      radial-gradient(38% 50% at 75% 25%,rgba(6,182,212,.38),transparent 70%),
      radial-gradient(45% 60% at 55% 60%,rgba(124,58,237,.34),transparent 70%);
    animation:drift 22s ease-in-out infinite alternate}
  @keyframes drift{0%{transform:translate3d(-3%,-2%,0) scale(1)}100%{transform:translate3d(4%,3%,0) scale(1.12)}}
  .hero-in{position:relative;z-index:1;padding:88px 0 88px;max-width:760px}
  .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 8px;border-radius:99px;
    background:var(--card);border:1px solid var(--line-2);box-shadow:var(--shadow-sm);
    font-size:12.5px;color:var(--muted);font-weight:500;margin-bottom:26px}
  .hero-badge .dot{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 3px rgba(14,159,110,.15)}
  .hero-badge b{color:var(--ink);font-weight:600}
  .hero h1{font-family:var(--disp);font-size:clamp(38px,5.6vw,64px);font-weight:600;
    letter-spacing:-.035em;line-height:1.05;color:var(--ink);max-width:15ch}
  .hero h1 em{font-style:normal;background:linear-gradient(120deg,var(--accent),var(--accent-2));
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
  .hero-eyebrow{font-family:var(--mono);font-size:12.5px;color:var(--faint);letter-spacing:.06em;
    text-transform:uppercase;margin-bottom:22px}
  .hero-eyebrow b{color:var(--accent-ink);font-weight:500}
  .hero p{margin-top:22px;font-size:19px;color:var(--muted);max-width:44ch;line-height:1.55;letter-spacing:-.01em}
  .subscribe{margin-top:32px;display:flex;gap:8px;max-width:440px}
  .subscribe input{flex:1;padding:12px 15px;font-size:14.5px;font-family:inherit;
    border:1px solid var(--line-2);border-radius:9px;background:var(--card);color:var(--ink);box-shadow:var(--shadow-sm)}
  .subscribe input::placeholder{color:var(--faint)}
  .subscribe input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
  .btn-solid{background:var(--accent);color:#fff;padding:12px 20px;border-radius:9px;
    font-size:14.5px;font-weight:550;white-space:nowrap;transition:transform .12s,box-shadow .12s;box-shadow:0 2px 8px -2px rgba(79,70,229,.5)}
  .btn-solid:hover{transform:translateY(-1px);box-shadow:0 6px 18px -4px rgba(79,70,229,.55);background:var(--accent)}
  .btn-solid:active,.btn-solid:focus{background:var(--accent);color:#fff}
  .btn-solid:disabled{opacity:.5;cursor:default;transform:none;box-shadow:none}
  .sub-ok{margin-top:12px;font-family:var(--mono);font-size:13px;color:var(--ok)}
  .hero-cta{margin-top:34px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .btn-outline{display:inline-flex;align-items:center;gap:6px;padding:12px 20px;border-radius:10px;
    font-size:14.5px;font-weight:550;color:var(--ink);background:var(--card);border:1px solid var(--line-2);
    transition:.14s;box-shadow:var(--shadow-sm)}
  .btn-outline:hover{border-color:#D5D8FB;background:var(--bg-alt);transform:translateY(-1px)}
  @media(prefers-reduced-motion:reduce){.aurora{animation:none}}

  /* ── sections ── */
  .sect{padding:66px 0}
  .sect.alt{background:var(--bg-alt);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .sect-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:34px;gap:16px}
  .sect h2{font-family:var(--disp);font-size:30px;font-weight:600;letter-spacing:-.025em;margin-top:8px;color:var(--ink)}
  .see-all{font-size:13.5px;color:var(--accent-ink);font-weight:500;white-space:nowrap;display:inline-flex;gap:5px;align-items:center}
  .see-all:hover{gap:8px}

  /* ── video grid ── */
  .vgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  @media(max-width:920px){.vgrid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:600px){.vgrid{grid-template-columns:1fr}}
  .vcard{background:var(--card);border:1px solid var(--line);border-radius:var(--r);
    overflow:hidden;text-align:left;transition:transform .16s,box-shadow .16s,border-color .16s;
    display:block;width:100%;box-shadow:var(--shadow-sm);text-decoration:none;color:inherit}
  .vcard *{text-decoration:none}
  .vcard:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);border-color:var(--line-2)}
  .thumb{position:relative;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#111119,#0A0A0F)}
  .thumb::before{content:'';position:absolute;inset:0;opacity:.4;
    background:radial-gradient(60% 90% at 30% 20%,rgba(79,70,229,.5),transparent 60%),
      radial-gradient(50% 80% at 80% 80%,rgba(6,182,212,.35),transparent 60%)}
  .thumb-tag{position:absolute;top:10px;left:10px;font-family:var(--mono);font-size:10.5px;
    color:#EDEDF2;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);
    padding:2px 8px;border-radius:5px;letter-spacing:.04em;backdrop-filter:blur(4px)}
  .play{width:46px;height:46px;border-radius:50%;background:#fff;display:flex;align-items:center;
    justify-content:center;transition:transform .16s;z-index:1;box-shadow:0 6px 18px -4px rgba(0,0,0,.5)}
  .vcard:hover .play{transform:scale(1.09)}
  .play::after{content:'';width:0;height:0;border-left:13px solid var(--ink);
    border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:3px}
  .vlen{position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.6);color:#fff;
    font-family:var(--mono);font-size:11px;padding:3px 7px;border-radius:5px;backdrop-filter:blur(4px)}
  .vbody{padding:16px 17px}
  .vbody h3{font-family:var(--disp);font-size:15.5px;font-weight:550;letter-spacing:-.015em;line-height:1.38}
  .vbody span{display:block;margin-top:7px;font-size:12px;color:var(--faint);font-family:var(--mono)}

  /* ── blog feed ── */
  .bgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  @media(max-width:920px){.bgrid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:600px){.bgrid{grid-template-columns:1fr}}
  .bcard{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;
    text-align:left;transition:transform .16s,box-shadow .16s,border-color .16s;
    display:flex;flex-direction:column;width:100%;box-shadow:var(--shadow-sm);text-decoration:none;color:inherit}
  .bcard *{text-decoration:none}
  .bcard:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);border-color:var(--line-2)}
  .bphoto{aspect-ratio:16/9;border-bottom:1px solid var(--line);position:relative;overflow:hidden;
    background:linear-gradient(135deg,#EEF0FE,#E7F6FA)}
  .bphoto img{width:100%;height:100%;object-fit:cover}
  .bphoto .ph-mono{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
    font-family:var(--mono);font-size:12px;color:var(--accent-ink);opacity:.55}
  .bbody{padding:18px 19px 20px;display:flex;flex-direction:column;gap:11px;flex:1}
  .tags{display:flex;gap:6px;flex-wrap:wrap}
  .tag{font-family:var(--mono);font-size:10.5px;padding:3px 9px;border-radius:6px;
    border:1px solid var(--line-2);color:var(--muted);background:var(--bg-alt);letter-spacing:.02em}
  .tag.hi{color:var(--accent-ink);border-color:#D5D8FB;background:var(--accent-soft)}
  .bbody h3{font-family:var(--disp);font-size:19px;font-weight:600;letter-spacing:-.02em;line-height:1.3;color:var(--ink)}
  .bbody p{font-size:14px;color:var(--muted);line-height:1.55}
  .meta{margin-top:auto;padding-top:10px;font-family:var(--mono);font-size:11.5px;color:var(--faint)}

  /* ── article / rich text ── */
  .article{max-width:704px;margin:0 auto;padding:66px 0 100px}
  .article .back{font-family:var(--mono);font-size:13px;color:var(--muted);margin-bottom:30px;display:inline-block}
  .article .back:hover{color:var(--accent-ink)}
  .article h1{font-family:var(--disp);font-size:clamp(33px,4.8vw,48px);font-weight:600;letter-spacing:-.032em;line-height:1.08;color:var(--ink)}
  .art-meta{margin:18px 0 8px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
  .art-meta .meta{margin:0;padding:0}
  .art-cover{margin-top:30px;border-radius:14px;overflow:hidden;border:1px solid var(--line);aspect-ratio:16/9;box-shadow:var(--shadow-md)}
  .art-cover img{width:100%;height:100%;object-fit:cover}
  .rt{margin-top:34px}
  .rt h2{font-family:var(--disp);font-size:26px;font-weight:600;letter-spacing:-.025em;margin:42px 0 15px;color:var(--ink)}
  .rt h3{font-family:var(--disp);font-size:20px;font-weight:600;letter-spacing:-.02em;margin:30px 0 11px;color:var(--ink)}
  .rt p{margin:0 0 19px;font-size:17px;line-height:1.8;color:var(--ink-2)}
  .rt ul,.rt ol{margin:0 0 19px 22px}
  .rt li{font-size:17px;line-height:1.72;color:var(--ink-2);margin-bottom:7px}
  .rt blockquote{border-left:2.5px solid var(--accent);padding:3px 0 3px 20px;margin:0 0 22px;color:var(--muted);font-size:17.5px}
  .rt code{font-family:var(--mono);font-size:.84em;background:var(--code-bg);
    border:1px solid var(--line);padding:2px 6px;border-radius:6px;color:var(--accent-ink)}
  .rt pre{background:#0C0C12;color:#E7E7EF;border-radius:12px;padding:20px 22px;overflow-x:auto;margin:0 0 24px;box-shadow:var(--shadow-md)}
  .rt pre code{font-family:var(--mono);font-size:13.5px;line-height:1.7;background:none;border:none;padding:0;color:inherit}
  .rt img.rt-img{width:100%;border-radius:12px;border:1px solid var(--line);margin:10px 0 24px;display:block;box-shadow:var(--shadow-sm)}
  .rt a{color:var(--accent-ink);text-decoration:underline;text-underline-offset:2px}

  /* ── simple pages ── */
  .page{max-width:704px;margin:0 auto;padding:66px 0 100px}
  .page h1{font-family:var(--disp);font-size:38px;font-weight:600;letter-spacing:-.03em;margin-bottom:18px;color:var(--ink)}
  .page p{color:var(--muted);margin-bottom:17px;max-width:62ch;font-size:17px;line-height:1.7}
  .list-sect{padding:56px 0 96px}
  .list-head{margin-bottom:34px}
  .list-head h2{font-family:var(--disp);font-size:36px;font-weight:600;letter-spacing:-.03em;margin-top:8px;color:var(--ink)}

  /* ── footer ── */
  .foot{padding:56px 0 44px;background:var(--ink);color:#B9B9C4;margin-top:0;border-top:1px solid var(--line)}
  .foot .logo{color:#fff}
  .foot-grid{display:flex;justify-content:space-between;gap:48px;flex-wrap:wrap}
  .foot-brand{max-width:280px}
  .foot-brand p{font-size:13.5px;color:#8A8A98;margin-top:14px;line-height:1.6}
  .foot-cols{display:flex;gap:60px;flex-wrap:wrap}
  .foot-col h4{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6E6E7C;margin-bottom:13px;font-weight:500}
  .foot-col button,.foot-col a{display:block;font-size:14px;color:#B9B9C4;padding:5px 0;text-align:left}
  .foot-col button:hover,.foot-col a:hover{color:#fff}
  .foot-news{max-width:280px}
  .foot-news .subscribe{margin-top:0;flex-wrap:wrap}
  .foot-news .subscribe input{background:#16161E;border-color:#2A2A38;color:#fff;min-width:0;box-shadow:none}
  .foot-news .subscribe .btn-solid{padding:11px 16px}
  .foot-bottom{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;
    margin-top:40px;padding-top:24px;border-top:1px solid #232330}
  .foot-bottom small{font-family:var(--mono);font-size:12px;color:#6E6E7C}
  .soc{display:flex;gap:9px}
  .soc a{width:34px;height:34px;border:1px solid #2A2A38;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#B9B9C4;transition:.14s}
  .soc a:hover{color:#fff;border-color:#44445A;background:#1A1A24}

  /* ── admin login ── */
  .admin{min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;padding:40px 24px;background:var(--bg-alt)}
  .admin-card{width:100%;max-width:388px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:34px;box-shadow:var(--shadow-md)}
  .admin-card .brandline{display:flex;align-items:center;gap:9px;margin-bottom:20px}
  .admin-card .brandline .logo-mark{width:26px;height:26px}
  .admin-card .brandline b{font-family:var(--disp);font-size:15px;font-weight:600}
  .admin-card h1{font-family:var(--disp);font-size:22px;font-weight:600;letter-spacing:-.02em}
  .admin-card p{font-size:14px;color:var(--muted);margin:8px 0 24px}
  .field{margin-bottom:16px}
  .field label{display:block;font-size:13px;font-weight:500;margin-bottom:7px;color:var(--ink-2)}
  .field input,.field select,.field textarea{width:100%;padding:10px 13px;font-size:14px;font-family:inherit;
    border:1px solid var(--line-2);border-radius:9px;background:var(--bg);color:var(--ink)}
  .field textarea{resize:vertical;min-height:80px;line-height:1.5}
  .field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
  .field-hint{font-size:12px;color:var(--faint);margin-top:6px;line-height:1.5}
  .video-add{background:var(--bg-alt);border:1px solid var(--line);border-radius:12px;padding:18px;margin-bottom:8px}
  .seg-toggle{display:flex;gap:8px}
  .seg-toggle button{flex:1;padding:14px 16px;border:1.5px solid var(--line-2);border-radius:10px;
    font-size:15px;font-weight:600;color:var(--muted);background:var(--card);transition:.14s}
  .seg-toggle button:hover{border-color:var(--accent);color:var(--ink)}
  .seg-toggle button.on{border-color:var(--accent);background:var(--accent-soft);color:var(--accent-ink);box-shadow:0 0 0 3px var(--accent-soft)}
  .pill-cat{font-family:var(--mono);font-size:9.5px;padding:2px 8px;border-radius:99px;text-transform:uppercase;letter-spacing:.05em;font-weight:500}
  .pill-cat.blog{color:var(--accent-ink);background:var(--accent-soft);border:1px solid #D5D8FB}
  .pill-cat.tut{color:#0B6E4F;background:#E4F3EC;border:1px solid #A7E8CE}
  .empty-note{padding:28px;border:1px dashed var(--line-2);border-radius:12px;text-align:center;color:var(--muted);font-size:14px}
  .empty-note b{color:var(--ink)}
  .video-add-row{display:flex;gap:12px;align-items:flex-end}
  .vm-thumb{width:72px;height:44px;object-fit:cover;border-radius:6px;border:1px solid var(--line-2)}
  @media(max-width:560px){.video-add-row{flex-direction:column;align-items:stretch}.video-add-row .btn-solid{width:100%}}
  .admin-err{font-family:var(--mono);font-size:12.5px;color:#DC2626;margin-top:12px;line-height:1.5;
    background:#FEF2F2;border:1px solid #FCA5A5;padding:10px 12px;border-radius:8px}
  .admin-note{margin-top:22px;padding-top:16px;border-top:1px solid var(--line);
    font-family:var(--mono);font-size:11.5px;color:var(--faint);line-height:1.7}

  /* ── dashboard / editor ── */
  .dash{max-width:860px;margin:0 auto;padding:48px 24px 100px}
  .dash-topbar{max-width:860px;margin:0 auto;padding:16px 24px 0;display:flex;justify-content:space-between;align-items:center;gap:12px}
  .dash-tabs{display:flex;gap:4px;background:var(--bg-alt);border:1px solid var(--line);padding:4px;border-radius:10px}
  .dash-tabs button{padding:7px 14px;font-size:13.5px;border-radius:7px;color:var(--muted);font-weight:500}
  .dash-tabs button.on{background:var(--card);color:var(--ink);box-shadow:var(--shadow-sm)}
  .dash-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:26px}
  .dash-head h1,.dash h1{font-family:var(--disp);font-size:29px;font-weight:600;letter-spacing:-.025em;margin-top:6px}
  .dash-empty{color:var(--muted);font-size:14px;padding:28px;border:1px dashed var(--line-2);border-radius:12px;text-align:center}
  .dash-list{border:1px solid var(--line);border-radius:12px;overflow:hidden}
  .dash-row{display:flex;justify-content:space-between;align-items:center;padding:15px 18px;border-bottom:1px solid var(--line);background:var(--card)}
  .dash-row:last-child{border-bottom:none}
  .dash-row:hover{background:var(--bg-alt)}
  .dash-row-title{font-weight:600;font-size:15px;display:flex;align-items:center;gap:9px;font-family:var(--disp);letter-spacing:-.01em}
  .pill-draft{font-family:var(--mono);font-size:9.5px;color:var(--muted);background:var(--code-bg);border:1px solid var(--line-2);padding:2px 7px;border-radius:99px;text-transform:uppercase;letter-spacing:.05em}
  .pill-live{font-family:var(--mono);font-size:9.5px;color:var(--ok);background:#E7F7F0;border:1px solid #A7E8CE;padding:2px 7px;border-radius:99px;text-transform:uppercase;letter-spacing:.05em}
  .dash-row-meta{font-family:var(--mono);font-size:11.5px;color:var(--faint);margin-top:4px}
  .dash-row-actions{display:flex;gap:8px}
  .btn-ghost{padding:7px 13px;border:1px solid var(--line-2);border-radius:8px;font-size:13px;font-weight:500;background:var(--card);transition:.12s}
  .btn-ghost:hover{border-color:var(--ink);background:var(--bg-alt)}
  .btn-ghost.danger{color:#DC2626}
  .btn-ghost.danger:hover{border-color:#DC2626;background:#FEF2F2}
  .dash .back{font-family:var(--mono);font-size:13px;color:var(--muted);display:inline-block;margin-bottom:18px}
  .dash .back:hover{color:var(--accent-ink)}
  .ed-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:560px){.ed-grid{grid-template-columns:1fr}}
  .cover-row{display:flex;align-items:center;gap:14px}
  .cover-preview{width:104px;height:64px;object-fit:cover;border-radius:8px;border:1px solid var(--line-2)}
  .ed-actions{display:flex;gap:10px;margin-top:26px;padding-top:22px;border-top:1px solid var(--line)}
  .save-ok{font-family:var(--mono);font-size:12.5px;color:var(--ok);margin-top:12px}

  /* tiptap editor chrome */
  .editor{border:1px solid var(--line-2);border-radius:10px;overflow:hidden;background:var(--card)}
  .ed-toolbar{display:flex;flex-wrap:wrap;gap:2px;padding:8px;border-bottom:1px solid var(--line);background:var(--bg-alt)}
  .ed-btn{min-width:32px;height:32px;padding:0 7px;border-radius:7px;font-size:13px;display:flex;align-items:center;justify-content:center;color:var(--ink-2)}
  .ed-btn:hover{background:var(--code-bg)}
  .ed-btn.on{background:var(--ink);color:#fff}
  .ed-sep{width:1px;background:var(--line-2);margin:4px 4px}
  .ed-content{padding:18px 20px;min-height:300px}
  .ed-content .ProseMirror{outline:none;min-height:280px}
  .ed-content .ProseMirror>*{margin-bottom:12px}
  .ed-content .ProseMirror:focus{outline:none}
  .ed-content .ProseMirror p.is-editor-empty:first-child::before{content:'Start writing…';color:var(--faint);float:left;height:0;pointer-events:none}

  /* ── responsive: tablet & phone ── */
  @media(max-width:900px){
    .wrap{padding:0 32px}
  }
  @media(max-width:820px){
    .sect{padding:52px 0}
    .hero-in{padding:60px 0 60px;max-width:100%}
    .hero h1{font-size:clamp(36px,6vw,52px)}
  }
  @media(max-width:560px){
    .wrap{padding:0 22px}
    .hero-in{padding:44px 0 48px}
    .hero-badge{margin-bottom:20px}
    .hero h1{font-size:clamp(30px,8vw,40px);letter-spacing:-.03em;word-break:break-word;overflow-wrap:break-word}
    .hero-eyebrow{font-size:11px;letter-spacing:.04em}
    .hero p{font-size:16.5px}
    .hero-cta{margin-top:28px;flex-direction:column;align-items:stretch;gap:10px}
    .hero-cta .btn-solid,.hero-cta .btn-outline{width:100%;text-align:center;justify-content:center}
    .sect{padding:44px 0}
    .sect-head{flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:24px}
    .sect h2{font-size:24px}
    .list-head h2{font-size:28px}
    .article{padding:44px 0 72px}
    .article h1{font-size:clamp(27px,7.5vw,34px)}
    .rt p,.rt li{font-size:16px}
    .rt h2{font-size:22px}
    .rt h3{font-size:18px}
    .rt pre{padding:16px 14px;border-radius:10px}
    .page{padding:48px 0 72px}
    .page h1{font-size:28px}
    .foot{padding:44px 0 36px}
    .foot-grid{gap:32px}
    .foot-cols{gap:40px}
    .foot-bottom{flex-direction:column;align-items:flex-start;gap:6px}
    .dash{padding:32px 22px 80px}
    .dash-topbar{padding:14px 22px 0}
    .ed-actions{flex-wrap:wrap}
    .ed-actions .btn-solid,.ed-actions .btn-ghost{flex:1;text-align:center}
  }
  @media(max-width:380px){
    .wrap{padding:0 18px}
    .hero h1{font-size:30px}
  }
  .vcard-static{cursor:default}
  .vcard-static:hover{transform:none;box-shadow:var(--shadow-sm);border-color:var(--line)}`;
