/* Berufsbildner – Das Spiel der Lehrzeit
   UI-Logik (Vanilla-JS). Inhalte: data.js · 3D-Welt: scene3d.js (window.World) */
(() => {
  "use strict";
  const D = window.GAME_DATA;
  const W = window.World || { mode() {}, rotateTo() {}, menuSide() {}, cheer() {}, bossAttack() {}, bossHit() {}, bossDie() {}, bossRoar() {} };
  const app = document.getElementById("app");
  const flash = document.getElementById("flash");
  const charById = Object.fromEntries(D.characters.map((c) => [c.id, c]));

  /* ---------- Sound (kleine Synth-Effekte, M = stumm) ---------- */
  let audio = null;
  let muted = false;
  function tone(freq = 660, dur = 0.06, type = "square", vol = 0.04, slide = 0) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = type;
      o.frequency.value = freq;
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), audio.currentTime + dur);
      g.gain.value = vol;
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
      o.connect(g).connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + dur);
    } catch (_) { /* kein Audio */ }
  }
  function noise(dur = 0.6, vol = 0.08) {
    if (muted) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const len = audio.sampleRate * dur;
      const buf = audio.createBuffer(1, len, audio.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = audio.createBufferSource();
      src.buffer = buf;
      const f = audio.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 900;
      const g = audio.createGain();
      g.gain.value = vol;
      src.connect(f).connect(g).connect(audio.destination);
      src.start();
    } catch (_) { /* kein Audio */ }
  }
  const sfx = {
    move: () => tone(520, 0.05),
    ok: () => { tone(660, 0.07); setTimeout(() => tone(990, 0.09), 70); },
    back: () => tone(330, 0.08, "triangle"),
    right: () => { tone(784, 0.08); setTimeout(() => tone(1046, 0.12), 80); },
    wrong: () => tone(140, 0.25, "sawtooth", 0.05),
    zap: () => tone(1200, 0.35, "sawtooth", 0.035, -900),
    // Drucker-Gebrüll: ratternde Rechteck-Pieptöne + Papiereinzug-Rauschen
    roar: () => { [0, 80, 160, 240, 380].forEach((d, i) => setTimeout(() => tone(i % 2 ? 190 : 120, 0.1, "square", 0.045, i % 2 ? -50 : 70), d)); noise(0.7, 0.04); },
    fire: () => noise(1.1, 0.12),
    win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.18, "square", 0.05), i * 120)),
  };

  /* ---------- Helfer ---------- */
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = v;
      else if (k === "style" && typeof v === "object") {
        for (const [p, val] of Object.entries(v)) {
          if (p.startsWith("--")) el.style.setProperty(p, val);
          else el.style[p] = val;
        }
      } else if (k.startsWith("on")) { el[k] = v; (el._ev || (el._ev = [])).push(k); }
      else if (v !== false && v != null) el.setAttribute(k, v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  };
  /* DOM abgleichen statt neu aufbauen: bestehende Elemente bleiben stehen, nur Änderungen
     werden übernommen → kein Flackern, CSS-Übergänge laufen weich, Scroll-Position bleibt.
     Elemente mit anderem data-k werden ersetzt (damit ihr Inhalt sanft eingeblendet wird). */
  function patch(a, b) {
    if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName || (a.nodeType === 1 && a.getAttribute("data-k") !== b.getAttribute("data-k"))) { a.replaceWith(b); return; }
    if (a.nodeType === 3) { if (a.data !== b.data) a.data = b.data; return; }
    if (a.nodeType !== 1) return;
    for (const at of [...a.attributes]) if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
    for (const at of [...b.attributes]) if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
    for (const k of new Set([...(a._ev || []), ...(b._ev || [])])) a[k] = b[k] || null;
    a._ev = b._ev;
    if (a.tagName === "INPUT") return;
    const ak = [...a.childNodes], bk = [...b.childNodes];
    bk.forEach((n, i) => { if (i < ak.length) patch(ak[i], n); else a.appendChild(n); });
    for (let i = bk.length; i < ak.length; i++) ak[i].remove();
  }
  const luLogo = (cls = "") => h("div", { class: "lu-logo " + cls, title: "Kanton Luzern" }, h("i"), h("span", {}, "Kanton", h("b", {}, "Luzern")));
  const wrap = (i, n) => ((i % n) + n) % n;
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  function toggleMute() { muted = !muted; toast(muted ? "🔇 Ton aus" : "🔊 Ton an"); render(); }
  // Touch-Gerät ohne Maus/Tastatur? → Texte wie «Enter drücken» passend formulieren
  const TOUCH = window.matchMedia && matchMedia("(hover: none) and (pointer: coarse)").matches;
  function toast(msg) {
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    const t = h("div", { class: "toast" }, msg);
    document.body.append(t);
    setTimeout(() => t.remove(), 1800);
  }
  function burn() {
    flash.className = "";
    void flash.offsetWidth;
    flash.className = "burn";
  }
  function zapFlash() {
    flash.className = "";
    void flash.offsetWidth;
    flash.className = "zap";
  }

  /* ---------- Screen-Stack ---------- */
  const stack = [];
  let current = null;
  let lastScreen = null;
  function go(screen, replace = false) {
    if (replace) stack.pop();
    stack.push(screen);
    render();
  }
  function back() {
    if (stack.length <= 1) return;
    sfx.back();
    const s = stack.pop();
    s.leave && s.leave();
    render();
  }
  function render() {
    current = stack[stack.length - 1];
    document.body.dataset.zone = current.zone || "menu";
    const fresh = current !== lastScreen;
    if (fresh) {
      lastScreen = current;
      current.world && current.world();
    }
    let hud = null;
    if (current.id !== "title") {
      const zoneName = { wissen: "📘 Wissen", arena: "⚔️ Arena", menu: "🏠 Hub" }[current.zone || "menu"];
      hud = h("div", { class: "hud" },
        h("div", { class: "crumbs" }, luLogo(),
          h("span", { class: "zone-badge" + (current.id !== "menu" ? " crumb-link" : ""), title: "Zum Hauptmenü", onclick: () => { const m = stack.find((s) => s.id === "menu"); if (m) backTo(m); } }, zoneName),
          h("span", { class: "trail" }, ...crumbs())),
        // Zurück und Ton sind echte Knöpfe (Touch/Maus), die Tastenhinweise blenden auf Touch-Geräten aus
        h("div", { class: "keys" },
          h("span", { class: "k-nav" }, h("kbd", {}, "←↑↓→"), "Navigieren"),
          h("span", { class: "k-nav" }, h("kbd", {}, "Enter"), "Wählen"),
          h("button", { class: "hk" + (stack.length > 1 ? "" : " off"), onclick: back, title: "Zurück (Esc)", "aria-label": "Zurück" }, h("kbd", {}, "Esc"), h("span", { class: "hk-ico" }, "‹"), h("span", { class: "hk-lbl" }, "Zurück")),
          h("button", { class: "hk", onclick: toggleMute, title: "Ton an/aus (M)", "aria-label": muted ? "Ton an" : "Ton aus" }, h("kbd", {}, "M"), h("span", { class: "hk-ico" }, muted ? "🔇" : "🔊"), h("span", { class: "hk-lbl" }, muted ? "Ton an" : "Ton aus")),
        ),
      );
    }
    const next = [hud, current.view()].filter(Boolean);
    const old = [...app.children];
    if (old.length !== next.length) app.replaceChildren(...next);
    else next.forEach((n, i) => (fresh && i === next.length - 1 ? old[i].replaceWith(n) : patch(old[i], n)));
    current.after && current.after(fresh);
  }
  /* Brotkrumen sind anklickbar: springt direkt zu diesem Bildschirm zurück */
  function backTo(scr) {
    let moved = false;
    while (stack.length > 1 && stack[stack.length - 1] !== scr) { const s = stack.pop(); s.leave && s.leave(); moved = true; }
    if (moved) { sfx.back(); render(); }
  }
  function crumbs() {
    const parts = stack.filter((s) => s.id !== "title" && s.id !== "menu");
    return parts.flatMap((p, i) => (i === parts.length - 1
      ? [h("i", {}, "›"), h("b", {}, p.title)]
      : [h("i", {}, "›"), h("span", { class: "crumb-link", title: "Zurück zu «" + p.title + "»", onclick: () => backTo(p) }, p.title)]));
  }
  /* Fortschritt: welche Missionen wurden schon geöffnet? Bleibt im Browser gespeichert. */
  const seen = (() => { try { return JSON.parse(localStorage.getItem("bb-seen") || "{}") || {}; } catch (_) { return {}; } })();
  const lvKey = (lv) => (lv.char ? "beruf" : "l" + lv.nr);
  const seenOf = (lv) => (seen[lvKey(lv)] || []).filter((i) => i < lv.missions.length);
  function markSeen(lv, i) {
    const a = seen[lvKey(lv)] || (seen[lvKey(lv)] = []);
    if (a.includes(i)) return;
    a.push(i);
    try { localStorage.setItem("bb-seen", JSON.stringify(seen)); } catch (_) { /* privater Modus */ }
  }
  function listNav(e, state, n, onEnter, axis = "y") {
    const prev = axis === "y" ? "ArrowUp" : "ArrowLeft";
    const next = axis === "y" ? "ArrowDown" : "ArrowRight";
    if (e.key === prev) { state.i = wrap(state.i - 1, n); sfx.move(); render(); return true; }
    if (e.key === next) { state.i = wrap(state.i + 1, n); sfx.move(); render(); return true; }
    if ((e.key === "Enter" || e.key === " ") && onEnter) { onEnter(state.i); return true; }
    return false;
  }

  /* ---------- Inhalts-Blöcke ---------- */
  function block(b) {
    const head = b.h ? h("h4", { class: "blk-h" }, b.h) : null;
    switch (b.t) {
      case "list":
        return h("div", { class: "blk" }, head, h("ul", { class: "blist" }, b.items.map((i) => h("li", {}, i))));
      case "steps":
        return h("div", { class: "blk" }, head, h("ol", { class: "steps" }, b.items.map((i, n) => h("li", {}, h("span", { class: "sn" }, n + 1), h("span", {}, i)))));
      case "table":
        return h("div", { class: "blk" }, head, h("div", { class: "tbl-wrap" }, h("table", { class: "tbl" },
          h("thead", {}, h("tr", {}, b.head.map((x) => h("th", {}, x)))),
          h("tbody", {}, b.rows.map((r) => h("tr", {}, r.map((c) => h("td", {}, c))))))));
      case "cols":
        return h("div", { class: "blk" }, head, h("div", { class: "cols", style: { "--n": String(Math.min(b.cols.length, 4)) } },
          b.cols.map((c) => h("div", { class: "colcard" }, h("h5", {}, c.h), h("ul", {}, c.items.map((i) => h("li", {}, i)))))));
      case "stats":
        return h("div", { class: "blk" }, head, h("div", { class: "stats" }, b.items.map((s) => h("div", { class: "stat" }, h("b", {}, s.v), h("span", {}, s.l)))));
      case "pyramid": {
        const n = b.items.length;
        return h("div", { class: "blk" }, head, h("div", { class: "pyr" }, b.items.map((p, i) =>
          h("div", { class: "pyr-row", style: { "--w": (48 + (n > 1 ? (i * 52) / (n - 1) : 52)) + "%", "--hue": String(200 - i * 18) } }, h("b", {}, p.h), h("span", {}, p.d)))));
      }
      case "note":
        return h("div", { class: "blk note" }, h("span", { class: "note-ico" }, "💡"), h("span", {}, b.text));
      default:
        return null;
    }
  }

  /* ================= SCREENS ================= */
  const heroes = [charById.lernende, charById.bb, charById.informatik];

  /* --- Titelbild --- */
  const TitleScreen = () => ({
    id: "title", title: "Start", zone: "menu",
    world: () => W.mode("menu", { side: null, heroes, title: true }),
    view: () =>
      h("div", { class: "screen title-screen" },
        luLogo("lu-logo-lg"),
        h("div", { class: "title-top" },
          h("div", { class: "logo-wrap" }, h("h1", { class: "logo" }, D.title), h("div", { class: "logo-sub" }, D.subtitle)),
        ),
        h("div", { class: "title-bottom" },
          h("div", { class: "press-start", onclick: start }, TOUCH ? "Tippen zum Starten" : "Enter drücken"),
          h("div", { class: "demo-start", onclick: () => demoStart() }, "▶ Präsentation", h("small", {}, `Mein Take-away · ${DEMO.length} Stationen`), h("kbd", {}, "P")),
          h("div", { class: "title-meta" }, D.meta),
          D.credits.author ? h("div", { class: "copyright" }, D.credits.copyright) : null,
          h("div", { class: "title-credits link", onclick: () => { sfx.ok(); go(MainMenu()); go(Credits()); } }, h("kbd", {}, "C"), "Credits & Quellen"),
        ),
      ),
    key: (e) => {
      if (e.key === "Enter" || e.key === " ") start();
      if ("dDpP".includes(e.key)) demoStart();
      if (e.key === "c" || e.key === "C") { sfx.ok(); go(MainMenu()); go(Credits()); }
    },
  });
  function start() { sfx.ok(); go(MainMenu()); }

  /* --- Hauptmenü mit zwei Portalen --- */
  const PORTALS = [
    {
      id: "wissen", name: "Wissen", sub: "Lernen & Nachschlagen", ico: "📘",
      items: [
        { ico: "🗂️", lbl: "Kurstage", sub: "5 Level mit allen Inhalten", open: () => LevelSelect() },
        { ico: "👥", lbl: "Rollen", sub: `${D.characters.length} Charaktere · Rechte & Pflichten`, open: () => CharSelect() },
        { ico: "💻", lbl: "Beispielberuf", menuLbl: "Beispiel­beruf", sub: `${D.example.name} · BiVo, Kompetenzen, QV`, open: () => LevelDetail(D.beruf) },
        { ico: "🗺️", lbl: "Lehrzeit-Reise", sub: "Vom Lehrvertrag bis zum Abschluss", open: () => Journey() },
        { ico: "📖", lbl: "Lexikon", sub: `${D.lexikon.length} Begriffe von ABU bis ZEBI`, open: () => Lexikon() },
      ],
    },
    {
      id: "arena", name: "Arena", sub: "Spielen & Prüfen", ico: "⚔️",
      items: [
        { ico: "🖨️", lbl: "Bosskampf", sub: "Patche den PrintNightmare-Drucker", open: () => Boss() },
        { ico: "⚖️", lbl: "Interventions-Duell", sub: "Leicht, mittel, schwer – oder weiterverweisen?", open: () => Duell() },
        { ico: "🎭", lbl: "Wer bin ich?", sub: "Errate die Rolle", open: () => Raetsel() },
      ],
    },
  ];
  /* Alle Menüpunkte in einer Reihe (← → läuft durch alle Knöpfe, ↑ ↓ springt zwischen Wissen und Arena) */
  const MENU = PORTALS.flatMap((p) => p.items.map((m) => ({ ...m, side: p.id })));
  /* Luzerner Wappen: gespalten von Blau und Weiss (Blau heraldisch rechts = vom Betrachter links) */
  const SHIELD = "M3 3H45V25C45 39 24 50 24 50C24 50 3 39 3 25Z";
  const luWappen = (cls = "") => sv("svg", { class: "lu-wappen " + cls, viewBox: "0 0 48 53", "aria-label": "Wappen Kanton Luzern" },
    sv("clipPath", { id: "lu-wappen-clip" }, sv("path", { d: SHIELD })),
    sv("g", { "clip-path": "url(#lu-wappen-clip)" },
      sv("rect", { x: 0, y: 0, width: 24, height: 53, fill: "#1f6fc5" }),
      sv("rect", { x: 24, y: 0, width: 24, height: 53, fill: "#ffffff" })),
    sv("path", { d: SHIELD, fill: "none", stroke: "#0b2340", "stroke-width": 2.4, "stroke-linejoin": "round" }));
  const arenaShield = () => sv("svg", { class: "lu-wappen", viewBox: "0 0 48 53", "aria-hidden": "true" },
    sv("path", { d: SHIELD, fill: "#c2381a", stroke: "#3a0a02", "stroke-width": 2.4, "stroke-linejoin": "round" }),
    // zwei gekreuzte Schwerter (kein Kreuz – sonst sieht es aus wie das Schweizer Wappen)
    sv("path", { d: "M13 11L35 37M35 11L13 37", stroke: "#ffe2a0", "stroke-width": 4, "stroke-linecap": "round" }),
    sv("path", { d: "M10 32L18 40M38 32L30 40", stroke: "#6b2a0e", "stroke-width": 4, "stroke-linecap": "round" }));
  let menuMem = { i: 0 };
  const MainMenu = () => {
    const s = menuMem;
    const sideOf = (i) => MENU[i].side;
    const select = (i, silent) => {
      if (i === s.i) return;
      const sw = sideOf(i) !== sideOf(s.i);
      s.i = i;
      if (sw) W.menuSide(sideOf(i));
      if (!silent) sfx.move();
      render();
    };
    const open = () => { sfx.ok(); go(MENU[s.i].open()); };
    const btn = (m, i) =>
      h("div", {
        class: `lu-btn lu-btn-${m.side}` + (i === s.i ? " active" : ""),
        style: { "--d": i * 0.05 + "s" },
        onmouseenter: () => select(i, true),
        onclick: () => { s.i = i; open(); },
      },
        h("div", { class: "lu-flag" }, h("i")),
        h("div", { class: "lu-roof" }, h("div", { class: "lu-tafel" }, h("span", { class: "lu-ico" }, m.ico))),
        h("div", { class: "lu-body" },
          h("div", { class: "lu-lbl" }, m.menuLbl || m.lbl),
          h("div", { class: "lu-sub" }, m.sub)),
      );
    let k = 0;
    return {
      id: "menu", title: "Hauptmenü", zone: "menu",
      world: () => { W.mode("menu", { side: sideOf(s.i), heroes }); },
      view: () => {
        k = 0;
        return h("div", { class: "screen menu-screen" },
          h("div", { class: "logo-wrap logo-wrap-sm" }, h("h1", { class: "logo logo-sm" }, D.title), h("div", { class: "logo-sub" }, D.subtitle)),
          h("div", { class: "menu-stage" }),
          // Wissen (Kapellbrücke) | Wasserturm als Trenner | Arena (Feuer-Bastion)
          h("div", { class: "lu-menu" },
            PORTALS.map((p, n) => [
              n ? h("div", { class: "lu-tower", "aria-hidden": "true" }, h("i", { class: "lu-tw-flag" }), h("b", { class: "lu-tw-roof" }), h("span", { class: "lu-tw-body" })) : null,
              h("div", { class: `lu-group lu-group-${p.id}` + (sideOf(s.i) === p.id ? " on" : "") },
                h("div", { class: "lu-group-head" }, p.id === "wissen" ? luWappen() : arenaShield(), h("b", {}, p.name), h("span", {}, p.sub)),
                h("div", { class: "lu-row" }, p.items.map(() => { const i = k++; return btn(MENU[i], i); })),
                h("div", { class: `lu-deck lu-deck-${p.id}` }),
              ),
            ]),
          ),
          h("div", { class: "menu-foot" },
            h("span", {}, h("kbd", {}, "←"), h("kbd", {}, "→"), " Auswahl"),
            h("span", {}, h("kbd", {}, "↑"), h("kbd", {}, "↓"), " Wissen / Arena"),
            h("span", {}, h("kbd", {}, "1–8"), " Direktwahl"),
            h("span", { class: "link", onclick: () => demoStart() }, h("kbd", {}, "P"), " Präsentation"),
            h("span", { class: "link", onclick: () => { sfx.ok(); go(Credits()); } }, h("kbd", {}, "C"), " Credits")),
          D.credits.author ? h("div", { class: "copyright link", onclick: () => { sfx.ok(); go(Credits()); } }, D.credits.copyright) : null,
        );
      },
      key: (e) => {
        const n = MENU.length;
        if (e.key === "ArrowLeft") { select(wrap(s.i - 1, n)); return true; }
        if (e.key === "ArrowRight") { select(wrap(s.i + 1, n)); return true; }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          // in die andere Gruppe springen, möglichst an die gleiche Position
          const side = sideOf(s.i), first = MENU.findIndex((m) => m.side === side);
          const other = MENU.map((m, i) => i).filter((i) => MENU[i].side !== side);
          select(other[Math.min(s.i - first, other.length - 1)]);
          return true;
        }
        if (/^[1-9]$/.test(e.key) && +e.key <= n) { s.i = +e.key - 1; W.menuSide(sideOf(s.i)); render(); open(); return true; }
        if (e.key === "Enter" || e.key === " ") { open(); return true; }
        if ("dDpP".includes(e.key)) { demoStart(); return true; }
        if (e.key === "c" || e.key === "C") { sfx.ok(); go(Credits()); return true; }
        return false;
      },
    };
  };

  /* --- Level-Auswahl: die Kurstage als Giebel der Kapellbrücke (wie das Hauptmenü) --- */
  const rgbOf = (hex, k = 0) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * k)).join(", "); };
  const LevelSelect = () => {
    const s = { i: 0 };
    const open = (i) => { sfx.ok(); go(LevelDetail(D.levels[i])); };
    const total = D.levels.reduce((a, lv) => a + lv.missions.length, 0);
    return {
      id: "levels", title: "Kurstage", zone: "wissen",
      world: () => W.mode("wissen"),
      view: () =>
        h("div", { class: "screen levels-screen" },
          h("h2", { class: "screen-title" }, "Kurstag wählen"),
          h("div", { class: "screen-sub" }, "Jeder Kurstag ist ein Level – jede Mission ein Thema aus dem Kurs."),
          h("div", { class: "menu-stage" }),
          h("div", { class: "lv-bridge" },
            h("div", { class: "lu-group-head" }, luWappen(), h("b", {}, "Kurstage"), h("span", {}, `${D.levels.length} Level · ${total} Missionen`)),
            h("div", { class: "lu-row lv-row" },
              D.levels.map((lv, i) =>
                h("div", {
                  class: "lu-btn lv-btn" + (i === s.i ? " active" : "") + (lv.placeholder ? " placeholder" : ""),
                  style: { "--a": rgbOf(lv.c1), "--a2": rgbOf(lv.c1, 0.55), "--d": i * 0.06 + "s" },
                  onmouseenter: () => { if (s.i !== i) { s.i = i; render(); } },
                  onclick: () => open(i),
                },
                  h("div", { class: "lu-flag" }, h("i")),
                  h("div", { class: "lu-roof" }, h("div", { class: "lu-tafel" }, h("span", { class: "lv-num" }, lv.nr))),
                  h("div", { class: "lu-body" },
                    h("div", { class: "lv-kicker" }, `Level ${lv.nr}`),
                    h("div", { class: "lu-lbl" }, lv.title),
                    lv.subtitle ? h("div", { class: "lu-sub" }, lv.subtitle) : null,
                    h("div", { class: "lv-state" }, lv.placeholder ? "🚧 In Arbeit …"
                      : seenOf(lv).length >= lv.missions.length ? `✓ Alle ${lv.missions.length} Missionen gesehen`
                      : seenOf(lv).length ? `${seenOf(lv).length} von ${lv.missions.length} Missionen gesehen` : `${lv.missions.length} Missionen`),
                    lv.placeholder ? null : h("div", { class: "lv-prog" }, h("i", { style: { width: (seenOf(lv).length / lv.missions.length) * 100 + "%" } })),
                  ),
                ),
              ),
            ),
            h("div", { class: "lu-deck" }),
          ),
          h("div", { class: "menu-foot" },
            h("span", {}, h("kbd", {}, "←"), h("kbd", {}, "→"), " Auswahl"),
            h("span", {}, h("kbd", {}, "1–" + D.levels.length), " Direktwahl"),
            h("span", {}, h("kbd", {}, "Enter"), " Öffnen")),
        ),
      key: (e) => {
        if (/^[1-9]$/.test(e.key) && +e.key <= D.levels.length) { s.i = +e.key - 1; render(); open(s.i); return true; }
        return listNav(e, s, D.levels.length, open, "x");
      },
    };
  };

  /* --- Level-Detail --- */
  const LevelDetail = (lv, start = 0) => {
    const s = { i: Math.min(start, Math.max(0, lv.missions.length - 1)) };
    if (lv.placeholder) {
      return {
        id: "level", title: `Level ${lv.nr}`, zone: "wissen",
        world: () => W.mode("wissen"),
        view: () => h("div", { class: "screen" }, h("div", { class: "placeholder-box" },
          h("div", { class: "big" }, "🚧"),
          h("h2", { class: "screen-title" }, `Level ${lv.nr}: ${lv.title}`),
          h("p", {}, "Dieses Level wird nach dem Kurstag mit Inhalten gefüllt."))),
        key: () => false,
      };
    }
    const hero = lv.char ? charById[lv.char] : null;
    const bodyEl = () => document.querySelector(".mission-body");
    let shownI = -1;
    return {
      id: "level", title: hero ? "Beispielberuf" : `Level ${lv.nr}`, zone: "wissen",
      world: () => (hero ? W.mode("character", { char: hero, stageX: -3.35 }) : W.mode("wissen")),
      view: () => {
        const m = lv.missions[s.i], n = lv.missions.length;
        markSeen(lv, s.i);
        const done = seenOf(lv);
        const step = (d) => { s.i = wrap(s.i + d, n); sfx.move(); render(); };
        let lastCh = null;
        const list = [h("div", { class: "m-progress" }, h("span", {}, `${done.length} von ${n} gesehen`), h("div", { class: "m-bar" }, h("i", { style: { width: (done.length / n) * 100 + "%" } })))];
        lv.missions.forEach((mm, i) => {
          if (mm.ch && mm.ch !== lastCh) { lastCh = mm.ch; list.push(h("div", { class: "chapter" }, mm.ch)); }
          list.push(h("div", { class: "mission" + (i === s.i ? " active" : done.includes(i) ? " done" : ""), onclick: () => { s.i = i; sfx.move(); render(); } },
            h("div", { class: "mnum" }, i !== s.i && done.includes(i) ? "✓" : i + 1), h("div", {}, mm.title)));
        });
        const nx = lv.missions[s.i + 1];
        const nav = h("div", { class: "m-nav" },
          h("button", { class: "m-btn", disabled: s.i === 0 ? "" : false, onclick: () => step(-1) }, h("kbd", {}, "↑"), "Zurück"),
          nx ? h("button", { class: "m-btn m-next", onclick: () => step(1) }, h("span", {}, h("small", {}, "Weiter"), nx.title), h("kbd", {}, "↓"))
             : h("button", { class: "m-btn m-next", onclick: back }, h("span", {}, h("small", {}, "Geschafft"), hero ? "Zurück zum Menü" : "Zurück zu den Kurstagen"), h("kbd", {}, "Esc")));
        const body = h("div", { class: "mission-body panel" },
          h("div", { class: "swap", "data-k": "m" + s.i },
            h("div", { class: "goal" }, `Mission ${s.i + 1} von ${lv.missions.length}` + (m.ch ? ` · ${m.ch}` : "")),
            h("h3", {}, m.title),
            (m.blocks || [{ t: "list", items: m.points || [] }]).map(block),
            m.source ? h("div", { class: "source" }, "Quelle: " + m.source) : null,
          ),
        );
        const bodyWrap = h("div", { class: "mission-col" }, body, nav);
        return h("div", { class: "screen screen-top" + (hero ? " beruf-screen" : "") },
          h("div", { class: "level-head" }, h("h2", { class: "screen-title" }, hero ? lv.title : `Level ${lv.nr} · ${lv.title}`), h("div", { class: "screen-sub" }, lv.subtitle)),
          h("div", { class: "level-detail" + (hero ? " with-stage" : "") },
            hero ? h("div", { class: "stage-col" }, h("div", { class: "nameplate", style: { "--c": hero.color } }, h("h2", {}, hero.name), h("div", { class: "cshort" }, hero.short))) : null,
            h("div", { class: "mission-list panel" }, list), bodyWrap),
        );
      },
      after: () => {
        const a = document.querySelector(".mission.active");
        a && a.scrollIntoView({ block: "nearest" });
        if (shownI !== s.i) { shownI = s.i; const b = bodyEl(); if (b) b.scrollTop = 0; }
      },
      key: (e) => {
        if (e.key === "PageDown" || e.key === "ArrowRight") { const b = bodyEl(); b && b.scrollBy({ top: 260, behavior: "smooth" }); return true; }
        if (e.key === "PageUp" || e.key === "ArrowLeft") { const b = bodyEl(); b && b.scrollBy({ top: -260, behavior: "smooth" }); return true; }
        return listNav(e, s, lv.missions.length, null);
      },
    };
  };

  /* --- Charakterwahl: 3D-Karussell --- */
  let lastChar = 0;
  const CharSelect = () => {
    const n = D.characters.length;
    const s = { i: lastChar };
    const rotate = (d) => { s.i = wrap(s.i + d, n); lastChar = s.i; W.rotateTo(s.i); sfx.move(); render(); };
    const open = () => { sfx.ok(); go(CharSheet(D.characters[s.i].id)); };
    return {
      id: "chars", title: "Rollen", zone: "wissen",
      world: () => W.mode("carousel", { chars: D.characters, index: s.i }),
      view: () => {
        const c = D.characters[s.i];
        return h("div", { class: "screen carousel-screen" },
          h("h2", { class: "screen-title" }, "Wähle deine Rolle"),
          h("div", { class: "carousel-space" },
            h("button", { class: "arrow left", onclick: () => rotate(-1) }, "‹"),
            h("button", { class: "arrow right", onclick: () => rotate(1) }, "›"),
          ),
          h("div", { class: "char-caption", style: { "--c": c.color } },
            h("div", { class: "dots" }, D.characters.map((cc, i) => h("i", { class: i === s.i ? "on" : "", style: { "--c": cc.color }, onclick: () => rotate(i - s.i) }))),
            h("h2", {}, c.name),
            h("div", { class: "cshort" }, c.short),
            h("p", {}, c.tagline),
            h("button", { class: "btn", onclick: open }, "Charakterbogen öffnen ", h("kbd", {}, "Enter")),
          ),
        );
      },
      key: (e) => {
        if (e.key === "ArrowLeft") { rotate(-1); return true; }
        if (e.key === "ArrowRight") { rotate(1); return true; }
        if (e.key === "Enter" || e.key === " ") { open(); return true; }
        return false;
      },
    };
  };

  /* --- Charakterbogen --- */
  const ROLE_ICON = { lernende: "🎒", informatik: "💻", betrieb: "🏭", bb: "🧑‍🏫", eltern: "👪", dbw: "🏛️", bfs: "🏫", uek: "🛠️", oda: "🤝", sbfi: "⚖️", pferd: "🐴", giraffe: "🦒" };
  const ROLE_ABBR = { lernende: "Lernende", informatik: "Informatik", betrieb: "Betrieb", bb: "BB", eltern: "Eltern", dbw: "DBW", bfs: "BFS", uek: "üK", oda: "OdA", sbfi: "SBFI", pferd: "Pferd", giraffe: "Giraffe" };
  /* Wo steht die Rolle im System? (von oben nach unten) */
  const SYSTEM = [
    { lbl: "Bund", sub: "Gesetze, BiVo", ids: ["sbfi"] },
    { lbl: "Kanton", sub: "Lehraufsicht", ids: ["dbw"] },
    { lbl: "Branche", sub: "Inhalte, üK", ids: ["oda"] },
    { lbl: "Lernorte", sub: "Betrieb · Schule · üK", ids: ["betrieb", "bfs", "uek"] },
    { lbl: "Menschen", sub: "in der Lehre", ids: ["bb", "lernende", "informatik", "pferd", "eltern"] },
    { lbl: "Savanne", sub: "ausser Konkurrenz", ids: ["giraffe"] },
  ];
  /* Piktogramme für Listeneinträge – nach Stichwort gewählt */
  const ICONS = [
    [/Bildungsbericht/i, "📝"], [/Lerndoku|Lernbericht/i, "📒"], [/Lehrvertrag|Vertragspartei|Vertrag/i, "📄"],
    [/IPA|QV\b|Qualifikationsverfahren|Prüfung|Erfahrungsnote|Gesamtnote/i, "🎓"], [/Sicherheit|gefährlich|Schutz|Belästigung|Verstöss/i, "⛑️"],
    [/Entschädigung|Lohn|Versicherung/i, "💰"], [/Ferien|Urlaub|Absenz/i, "🏖️"], [/Beratung|Unterstütz|Help Point|Lostly|Fachstelle|Hilfe|Begleitung/i, "🤝"],
    [/Bewilligung|genehmig|bewillig/i, "✅"], [/Gesetz|BBG|BBV|\bOR\b|ArG|Verordnung|BiVo|Art\.|Erlass/, "⚖️"], [/Schule|Unterricht|Modul|Lektion|Lehrplan|Theorie/i, "🏫"],
    [/üK|überbetrieb|Kurse?\b/i, "🛠️"], [/Eltern|Vertretung|Ablösung/i, "👪"], [/Portal|Daten|digital|ICT|Netz|Server|Applikation|Software|Informatik/i, "💻"],
    [/Feedback|Gespräch|kommuniz|informiert/i, "💬"], [/plan|Semester|Termin|Lehrstart/i, "🗓️"], [/Qualität|QualiCarte/i, "⭐"], [/Projekt/i, "📊"],
    [/Kompetenz|lernt|Fertigkeit|Grundkompetenz/i, "🧠"], [/Ziel|Lernerfolg/i, "🎯"], [/Rolle|Vorbild|Coach|Bezugsperson/i, "🧭"], [/Lehrstelle|auswählen|Schnupper/i, "🔎"],
  ];
  const iconFor = (txt, fb) => (ICONS.find(([re]) => re.test(txt)) || [0, fb])[1];
  const TABS = [
    { id: "overview", lbl: "✨ Überblick", ico: "✨" },
    { id: "aufgaben", lbl: "🎯 Aufgaben", ico: "🎯" },
    { id: "rechte", lbl: "🛡️ Rechte", ico: "🛡️" },
    { id: "pflichten", lbl: "📜 Pflichten", ico: "📜" },
    { id: "informatik", lbl: "💻 Informatik", ico: "💻", example: true },
    { id: "beziehungen", lbl: "🔗 Beziehungen", ico: "🔗" },
  ];
  const SVGNS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs = {}, ...kids) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k.startsWith("on")) { el[k] = v; (el._ev || (el._ev = [])).push(k); } else if (v != null) el.setAttribute(k, v);
    }
    kids.flat(Infinity).forEach((k) => k != null && el.append(k.nodeType ? k : document.createTextNode(String(k))));
    return el;
  };
  /* Beziehungsnetz als Grafik: Rolle in der Mitte, Partner rundherum (anklickbar) */
  function relNet(c, big = false) {
    const W0 = big ? 520 : 340, H0 = big ? 290 : 236, cx = W0 / 2, cy = H0 / 2 - 6;
    const rels = (c.beziehungen || []).filter((r) => charById[r.to]);
    const n = rels.length, rx = W0 / 2 - 46, ry = H0 / 2 - 42;
    const pts = rels.map((r, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return { r, o: charById[r.to], x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry }; });
    return sv("svg", { class: "net", viewBox: `0 0 ${W0} ${H0}`, role: "img", "aria-label": "Beziehungsnetz" },
      pts.map((p, i) => sv("line", { class: "net-line", x1: cx, y1: cy, x2: p.x, y2: p.y, stroke: p.o.color, style: `animation-delay:${i * 0.08}s` })),
      sv("circle", { cx, cy, r: big ? 40 : 32, class: "net-core", fill: c.color }),
      sv("text", { x: cx, y: cy + 1, class: "net-emoji big" }, ROLE_ICON[c.id] || "●"),
      pts.map((p, i) => sv("g", { class: "net-node", style: `animation-delay:${0.15 + i * 0.08}s`, onclick: () => { sfx.ok(); go(CharSheet(p.o.id), true); } },
        sv("title", {}, `${p.o.name}: ${p.r.text}`),
        sv("circle", { cx: p.x, cy: p.y, r: 21, fill: "rgba(8,14,30,.85)", stroke: p.o.color, "stroke-width": 2.5 }),
        sv("text", { x: p.x, y: p.y + 1, class: "net-emoji" }, ROLE_ICON[p.o.id] || "●"),
        sv("text", { x: p.x, y: p.y + 35, class: "net-lbl", fill: p.o.color }, ROLE_ABBR[p.o.id] || p.o.name))));
  }
  /* Ebene im System als gestufte Pyramide */
  const systemStack = (c) => h("div", { class: "sys" }, SYSTEM.map((row, i) => {
    const here = row.ids.includes(c.id);
    return h("div", { class: "sys-row" + (here ? " here" : ""), style: { "--w": 46 + (i * 54) / (SYSTEM.length - 1) + "%" } },
      h("div", { class: "sys-lbl" }, h("b", {}, row.lbl), h("span", {}, row.sub)),
      h("div", { class: "sys-chips" }, row.ids.map((id) => h("i", { class: id === c.id ? "me" : "", title: charById[id].name, onclick: () => { if (id !== c.id) { sfx.ok(); go(CharSheet(id), true); } } }, ROLE_ICON[id]))));
  }));
  const icards = (list, fb) => h("div", { class: "icards" }, list.map((p, i) =>
    h("div", { class: "icard", style: { "--i": String(i) } }, h("div", { class: "ic" }, iconFor(p, fb)), h("div", { class: "it" }, p), h("div", { class: "in" }, String(i + 1).padStart(2, "0")))));
  const CharSheet = (id) => {
    const s = { tab: 0, shown: -1 };
    const c = charById[id];
    const tabs = TABS.filter((t) => t.id === "overview" || (c[t.id] || []).length);
    const toTab = (tid) => { const i = tabs.findIndex((t) => t.id === tid); if (i >= 0) { s.tab = i; sfx.move(); render(); } };
    const overview = () => {
      const stats = ["aufgaben", "rechte", "pflichten", "beziehungen"].filter((k) => (c[k] || []).length);
      const hiR = (c.rechte || []).slice(0, 2), hiP = (c.pflichten || []).slice(0, 2);
      return h("div", { class: "ov" },
        h("div", { class: "ov-stats" }, stats.map((k) => {
          const t = TABS.find((x) => x.id === k);
          return h("div", { class: "ov-stat", onclick: () => toTab(k) }, h("span", { class: "ov-ico" }, t.ico), h("b", {}, c[k].length), h("span", {}, t.lbl.split(" ").slice(1).join(" ")));
        })),
        h("div", { class: "ov-grid" },
          h("div", { class: "ov-card" }, h("h5", {}, "🔗 Beziehungsnetz", h("small", {}, "Rolle anklicken")), relNet(c)),
          h("div", { class: "ov-card" }, h("h5", {}, "🏛️ Ebene im System"), systemStack(c))),
        hiR.length || hiP.length
          ? h("div", { class: "ov-grid" },
            hiR.length ? h("div", { class: "ov-card" }, h("h5", {}, "🛡️ Wichtigste Rechte"), icards(hiR, "🛡️")) : null,
            hiP.length ? h("div", { class: "ov-card" }, h("h5", {}, "📜 Wichtigste Pflichten"), icards(hiP, "📜")) : null)
          : h("div", { class: "ov-card" }, h("h5", {}, "🎯 Kernaufgaben"), icards((c.aufgaben || []).slice(0, 4), "🎯")),
        c.informatik && c.id !== "informatik"
          ? h("div", { class: "ov-teaser", onclick: () => toTab("informatik") }, h("span", { class: "ov-ico" }, "💻"), h("div", {}, h("b", {}, "Beispiel " + D.example.name), h("span", {}, c.informatik[0])), h("span", { class: "go" }, "›"))
          : null,
      );
    };
    return {
      id: "sheet", title: c.name, zone: "wissen",
      world: () => W.mode("character", { char: c }),
      view: () => {
        const t = tabs[s.tab];
        let content;
        if (t.id === "overview") content = overview();
        else if (t.id === "beziehungen") {
          content = h("div", { class: "rel-wrap" }, h("div", { class: "ov-card net-big" }, relNet(c, true)), h("div", { class: "rels" }, c.beziehungen.map((r) => {
            const o = charById[r.to];
            return h("div", { class: "rel", style: { "--c": o ? o.color : "#888" }, onclick: () => { if (o) { sfx.ok(); go(CharSheet(o.id), true); } } },
              h("div", { class: "mini" }, ROLE_ICON[r.to] || ""), h("div", {}, h("b", {}, o ? o.name : r.to), h("span", {}, r.text)), h("span", { class: "go" }, "›"));
          })));
        } else {
          content = h("div", {},
            t.example && c.id !== "informatik" ? h("div", { class: "example-hint" }, "💡 Allgemein gelten Aufgaben / Rechte / Pflichten – hier konkret für ", h("b", {}, D.example.name), ":") : null,
            icards(c[t.id], t.ico));
        }
        return h("div", { class: "screen sheet-screen" },
          h("div", { class: "sheet", style: { "--c": c.color } },
            h("div", { class: "sheet-stage" },
              h("div", { class: "nameplate" }, h("span", { class: "np-ico" }, ROLE_ICON[c.id] || ""), h("div", {}, h("h2", {}, c.name), h("div", { class: "cshort" }, c.short))),
            ),
            h("div", { class: "sheet-main panel" },
              h("div", { class: "role" }, c.role),
              h("div", { class: "tabs" }, tabs.map((tt, i) => h("div", { class: "tab" + (i === s.tab ? " active" : "") + (tt.example ? " tab-example" : ""), onclick: () => { s.tab = i; sfx.move(); render(); } }, tt.lbl, tt.id !== "overview" ? h("small", {}, (c[tt.id] || []).length) : null))),
              h("div", { class: "tab-body" }, h("div", { class: "swap", "data-k": c.id + t.id }, content)),
              c.sources ? h("div", { class: "source" }, "Quellen: " + c.sources) : null,
            ),
          ),
        );
      },
      after: () => { if (s.shown !== s.tab) { s.shown = s.tab; const b = document.querySelector(".tab-body"); if (b) b.scrollTop = 0; } },
      key: (e) => {
        const b = document.querySelector(".tab-body");
        if (e.key === "ArrowLeft") { s.tab = wrap(s.tab - 1, tabs.length); sfx.move(); render(); return true; }
        if (e.key === "ArrowRight" || e.key === "Tab") { e.preventDefault(); s.tab = wrap(s.tab + 1, tabs.length); sfx.move(); render(); return true; }
        if (e.key === "ArrowDown" || e.key === "PageDown") { b && b.scrollBy({ top: 220, behavior: "smooth" }); return true; }
        if (e.key === "ArrowUp" || e.key === "PageUp") { b && b.scrollBy({ top: -220, behavior: "smooth" }); return true; }
        return false;
      },
    };
  };

  /* --- Lehrzeit-Reise: links die Route als Wegkarte, rechts die gewählte Etappe --- */
  const J_COLORS = ["#8ec5ff", "#5fd4ff", "#5be3a0", "#ffd166", "#ff9a4d", "#ff7a8a", "#c79bff"];
  const Journey = (start = 0) => {
    const J = D.journey;
    const s = { i: start, seen: new Set([start]) };
    const goTo = (i) => { s.i = wrap(i, J.length); s.seen.add(s.i); sfx.move(); render(); };
    const bodyEl = () => app.querySelector(".jr-main");
    const name = (j) => (j.short || j.title).replace(/­/g, "");
    let shownI = -1;
    // ein Schritt als Karte: was der Betrieb tut, darunter Erklärung und Etiketten (wann · Hilfsmittel · lernende Person)
    const step = (it, n) => h("div", { class: "jr-step", style: { "--i": String(n) } },
      h("span", { class: "jr-n" }, n + 1),
      h("div", { class: "jr-txt" },
        h("b", {}, it.t),
        it.d ? h("p", {}, it.d) : null,
        (it.when || it.tool || it.who) ? h("div", { class: "js-tags" },
          it.when ? h("span", { class: "tag tag-when" }, "⏱ " + it.when) : null,
          it.tool ? h("span", { class: "tag tag-tool" }, "📄 " + it.tool) : null,
          it.who ? h("span", { class: "tag tag-who" }, "🎒 Lernende Person " + it.who) : null) : null));
    return {
      id: "journey", title: "Lehrzeit-Reise", zone: "wissen",
      world: () => W.mode("wissen"),
      view: () => {
        const st = J[s.i], nx = J[s.i + 1], pv = J[s.i - 1];
        return h("div", { class: "screen screen-top journey-screen" },
          h("h2", { class: "screen-title" }, "Lehrzeit-Reise"),
          h("div", { class: "screen-sub" }, h("span", { class: "persp" }, "👔 " + D.journeyIntro.perspective), h("span", { class: "js-intro" }, " " + D.journeyIntro.text)),
          h("div", { class: "jr", style: { "--c": J_COLORS[s.i % J_COLORS.length] } },
            h("div", { class: "jr-rail panel" },
              h("div", { class: "jr-rail-h" }, h("b", {}, "🧭 Die Route"), h("small", {}, `${s.seen.size} von ${J.length} besucht`)),
              h("div", { class: "jr-stops", style: { "--p": String(s.i / (J.length - 1)) } }, J.map((j, i) =>
                h("div", { class: "jr-stop" + (i === s.i ? " active" : "") + (s.seen.has(i) ? " visited" : ""), style: { "--c": J_COLORS[i % J_COLORS.length] }, onclick: () => goTo(i) },
                  h("div", { class: "jr-dot" }, j.icon),
                  h("div", { class: "jr-lbl" }, h("b", {}, name(j)), h("small", {}, j.when)),
                  h("span", { class: "jr-num" }, i !== s.i && s.seen.has(i) ? "✓" : i + 1))))),
            h("div", { class: "jr-col" },
              h("div", { class: "jr-main panel" }, h("div", { class: "swap", "data-k": "j" + s.i },
                h("div", { class: "jr-hero" },
                  h("div", { class: "jr-ico" }, st.icon),
                  h("div", {},
                    h("div", { class: "goal" }, `Etappe ${s.i + 1} von ${J.length}`),
                    h("h3", {}, st.title),
                    h("span", { class: "jr-when" }, "⏱ " + st.when))),
                h("div", { class: "jr-goal" }, h("b", {}, "🎯 Ziel"), h("span", {}, st.goal)),
                h("div", { class: "jr-steps" }, st.items.map(step)),
                st.always ? h("div", { class: "js-always" },
                  h("h4", { class: "blk-h" }, st.always.title),
                  h("div", { class: "js-always-grid" }, st.always.list.map(([ico, t, d]) => h("div", { class: "js-card" }, h("span", {}, ico), h("b", {}, t), h("small", {}, d)))),
                  h("p", { class: "js-hint" }, "💡 " + st.always.note)) : null,
                st.alt ? h("div", { class: "js-alt" }, h("b", {}, "⚠️ Plan B"), h("span", {}, st.alt)) : null,
                h("div", { class: "jr-result" }, h("b", {}, "🏁 Ergebnis"), h("span", {}, st.result)),
                h("div", { class: "source" }, "Quelle: " + st.source),
              )),
              h("div", { class: "m-nav" },
                h("button", { class: "m-btn", disabled: pv ? false : "", onclick: () => goTo(s.i - 1) }, h("kbd", {}, "←"), pv ? name(pv) : "Start"),
                nx ? h("button", { class: "m-btn m-next", onclick: () => goTo(s.i + 1) }, h("span", {}, h("small", {}, "Nächste Etappe"), name(nx)), h("kbd", {}, "→"))
                   : h("button", { class: "m-btn m-next", onclick: () => goTo(0) }, h("span", {}, h("small", {}, "Geschafft"), "Die Reise beginnt von vorn"), h("kbd", {}, "Home"))),
            ),
          ),
        );
      },
      after: () => {
        if (shownI === s.i) return;
        shownI = s.i;
        const b = bodyEl();
        if (b) b.scrollTop = 0;
        const a = app.querySelector(".jr-stop.active");
        a && a.scrollIntoView({ block: "nearest", inline: "center" });
      },
      key: (e) => {
        const b = bodyEl();
        if (e.key === "ArrowDown" || e.key === "PageDown") { b && b.scrollBy({ top: 220, behavior: "smooth" }); return true; }
        if (e.key === "ArrowUp" || e.key === "PageUp") { b && b.scrollBy({ top: -220, behavior: "smooth" }); return true; }
        if (e.key === "Home") { goTo(0); return true; }
        if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { goTo(s.i + 1); return true; }
        if (e.key === "ArrowLeft") { goTo(s.i - 1); return true; }
        return false;
      },
    };
  };

  /* --- Lexikon --- */
  const LEX_ALIAS = {
    "BB": ["Berufsbildner/in", "Berufsbildner/innen", "Berufsbildnerin"], "BFS": ["Berufsfachschule"], "BiPla / Bipla": ["Bildungsplan"], "BiVo": ["Bildungsverordnung"],
    "BM 1 / BM 2": ["BM", "Berufsmaturität"], "DBW": ["Dienststelle Berufs- und Weiterbildung"], "EFZ": ["Fähigkeitszeugnis"], "EBA": ["Berufsattest"],
    "Handlungskompetenz": ["Handlungskompetenzen"], "LOK": ["Lernortkooperation"], "OdA": ["Organisation der Arbeitswelt", "Organisationen der Arbeitswelt"],
    "QV": ["Qualifikationsverfahren"], "SB / SB Plus": ["SB"], "üK": ["überbetriebliche Kurse", "überbetrieblichen Kurse"], "IPA": ["individuelle praktische Arbeit"],
    "Lerndokumentation": ["Lerndoku"], "Bildungsbewilligung": ["Bildungsbewilligungen"], "SBFI": ["Staatssekretariat"],
    "Stellwerk": ["Stellwerktest", "Stellwerktests", "Stellwerk-Resultaten"], "Anforderungsprofil": ["Anforderungsprofile", "Anforderungsprofils"], "Schnupperlehre": ["Schnupperlehren", "Schnuppertage"],
    "Beurteilungsfehler": ["Beurteilungsfehlern"], "Lernpartnerschaft": ["Lernpartnerschaften", "Lernpartner/in"], "Multicheck": ["Multichecks"], "Praxisbildner/in": ["Praxisbildner/innen"],
  };
  const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const termRe = (k) => new RegExp(`(^|[^\\p{L}\\p{N}])(${[...k.split(" / "), ...(LEX_ALIAS[k] || [])].map(reEsc).join("|")})(?=$|[^\\p{L}\\p{N}])`, "u");
  let lexIndex = null;
  function buildLexIndex() {
    // alle Textstellen im Kurs sammeln (Missionen, Beispielberuf, Lehrzeit-Reise)
    const texts = [];
    const add = (text, link) => text && texts.push({ text: String(text).trim(), link });
    const walk = (lv, mi, m) => {
      const link = { lv, mi, label: (lv.char ? "Beispielberuf" : `Level ${lv.nr}`) + " · " + m.title };
      (m.blocks || []).forEach((b) => {
        (b.items || []).forEach((it) => add(typeof it === "string" ? it : `${it.h || it.v || ""} ${it.d || it.l || ""}`, link));
        (b.rows || []).forEach((r) => add(r.filter(Boolean).join(" – "), link));
        (b.cols || []).forEach((c) => c.items.forEach((it) => add(`${c.h}: ${it}`, link)));
        if (b.text) add(b.text, link);
      });
    };
    D.levels.filter((l) => !l.placeholder).concat([D.beruf]).forEach((lv) => lv.missions.forEach((m, mi) => walk(lv, mi, m)));
    D.journey.forEach((j, ji) => {
      const link = { journey: ji, label: "Lehrzeit-Reise · " + j.title };
      j.items.forEach((it) => add(`${it.t}${it.d ? " – " + it.d : ""}`, link));
      (j.always ? j.always.list : []).forEach(([, t, d]) => add(`${t} – ${d}`, link));
      [j.alt, j.always && j.always.note].forEach((x) => add(x, link));
    });
    lexIndex = {};
    D.lexikon.forEach(([k, v]) => {
      const re = termRe(k);
      const hits = [], seen = new Set();
      texts.forEach((t) => { if (re.test(t.text) && !seen.has(t.text)) { seen.add(t.text); hits.push(t); } });
      const roles = D.characters.map((c) => {
        const all = [c.role, ...(c.aufgaben || []), ...(c.rechte || []), ...(c.pflichten || []), ...(c.informatik || [])];
        return { c, n: all.filter((x) => re.test(x)).length };
      }).filter((r) => r.n).sort((a, b) => b.n - a.n).slice(0, 6);
      const more = (D.lexikonMehr || {})[k] || "";
      const related = D.lexikon.filter(([k2]) => k2 !== k && termRe(k2).test(v + " " + more)).map(([k2]) => k2).slice(0, 8);
      lexIndex[k] = { re, hits, roles, related, more };
    });
  }
  const markTerm = (text, re) => {
    const g = new RegExp(re.source, "gu"), out = [];
    let last = 0, m;
    while ((m = g.exec(text))) { const st = m.index + m[1].length; out.push(text.slice(last, st), h("mark", {}, m[2])); last = st + m[2].length; g.lastIndex = last; }
    out.push(text.slice(last));
    return out;
  };
  /* Lexikon als Nachschlagewerk: links Suche, A–Z-Register und Begriffsliste, rechts die ganze Erklärung */
  const Lexikon = (pre = null) => {
    if (!lexIndex) buildLexIndex();
    const s = { q: "", cur: Math.max(0, D.lexikon.findIndex(([k]) => k === pre)), shown: null };
    const letterOf = (k) => k[0].toUpperCase();
    const LETTERS = [...new Set(D.lexikon.map(([k]) => letterOf(k)))];
    const hitsOf = () => { const q = s.q.trim().toLowerCase(); return D.lexikon.filter(([k, v]) => !q || k.toLowerCase().includes(q) || v.toLowerCase().includes(q)); };
    const clearSearch = () => { s.q = ""; const el = document.querySelector(".search"); if (el) el.value = ""; };
    const select = (i) => { const n = hitsOf().length; if (!n) return; s.cur = Math.max(0, Math.min(n - 1, i)); sfx.move(); render(); };
    const openTerm = (k) => {
      let i = hitsOf().findIndex(([kk]) => kk === k);
      if (i < 0) { clearSearch(); i = D.lexikon.findIndex(([kk]) => kk === k); }
      s.cur = Math.max(0, i);
      sfx.ok();
      render();
    };
    const detail = (k, v) => {
      const ix = lexIndex[k];
      return h("div", { class: "lx-detail panel" }, h("div", { class: "swap", "data-k": "d" + k },
        h("div", { class: "lx-hero" },
          h("div", { class: "lx-letter" }, letterOf(k)),
          h("div", {}, h("div", { class: "lex-term" }, k), h("div", { class: "lex-def" }, v))),
        ix.more ? h("div", { class: "lex-more" }, h("h5", {}, "📖 Was steckt dahinter?"), h("p", {}, markTerm(ix.more, ix.re))) : null,
        ix.roles.length ? h("div", { class: "lex-sec" }, h("h5", {}, "👥 Wer hat damit zu tun?"), h("div", { class: "lex-roles" }, ix.roles.map((r) =>
          h("div", { class: "lex-role", style: { "--c": r.c.color }, onclick: () => { sfx.ok(); go(CharSheet(r.c.id)); } }, h("span", {}, ROLE_ICON[r.c.id] || ""), h("b", {}, r.c.name), h("small", {}, r.n + "×"))))) : null,
        ix.hits.length ? h("div", { class: "lex-sec" }, h("h5", {}, "🎓 So kam es im Kurs vor", h("small", {}, `${ix.hits.length} Stellen`)), h("div", { class: "lex-hits" }, ix.hits.slice(0, 5).map((t) =>
          h("div", { class: "lex-hit", onclick: () => { sfx.ok(); if (t.link.journey != null) go(Journey(t.link.journey)); else go(LevelDetail(t.link.lv, t.link.mi)); } },
            h("p", {}, markTerm(t.text, ix.re)), h("small", {}, "↗ " + t.link.label))))) : null,
        ix.related.length ? h("div", { class: "lex-sec" }, h("h5", {}, "🔗 Verwandte Begriffe"), h("div", { class: "lex-rel" }, ix.related.map((k2) => h("span", { onclick: () => openTerm(k2) }, k2)))) : null,
      ));
    };
    return {
      id: "lexikon", title: "Lexikon", zone: "wissen",
      world: () => W.mode("wissen"),
      view: () => {
        const hits = hitsOf();
        s.cur = Math.min(s.cur, Math.max(0, hits.length - 1));
        const sel = hits[s.cur];
        const have = new Set(hits.map(([k]) => letterOf(k)));
        const inp = h("input", {
          class: "search", placeholder: "🔎 Begriff suchen …", value: s.q,
          oninput: (e) => { s.q = e.target.value; s.cur = 0; render(); },
          onkeydown: (e) => {
            const d = { ArrowDown: 1, ArrowUp: -1, PageDown: 6, PageUp: -6 }[e.key];
            if (d) { e.preventDefault(); select(s.cur + d); }
          },
        });
        let last = "";
        const rows = [];
        hits.forEach(([k, v], i) => {
          if (letterOf(k) !== last) { last = letterOf(k); rows.push(h("div", { class: "lx-h" }, last)); }
          rows.push(h("div", { class: "lx-row" + (i === s.cur ? " active" : ""), onclick: () => select(i) },
            h("b", {}, k), lexIndex[k].hits.length ? h("small", {}, lexIndex[k].hits.length + "×") : h("small", {}, ""), h("span", {}, v)));
        });
        return h("div", { class: "screen screen-top lexikon-screen" },
          h("h2", { class: "screen-title" }, "Lexikon"),
          h("div", { class: "screen-sub" }, "Alle Abkürzungen und Begriffe aus dem Kurs – suchen oder mit ↑ ↓ blättern."),
          h("div", { class: "lx" },
            h("div", { class: "lx-side panel" },
              h("div", { class: "search-wrap" }, inp,
                h("span", { class: "search-count" }, s.q.trim() ? `${hits.length} Treffer` : `${D.lexikon.length} Begriffe`),
                s.q ? h("button", { class: "search-x", title: "Suche leeren", "aria-label": "Suche leeren", onclick: () => { clearSearch(); s.cur = 0; render(); } }, "✕") : null),
              h("div", { class: "lx-letters" }, LETTERS.map((L) =>
                h("i", { class: (sel && letterOf(sel[0]) === L ? "on" : "") + (have.has(L) ? "" : " off"), onclick: () => select(hits.findIndex(([k]) => letterOf(k) === L)) }, L))),
              h("div", { class: "lx-list" }, rows.length ? rows : h("div", { class: "lx-empty" }, "Kein Begriff gefunden."))),
            sel ? detail(sel[0], sel[1]) : h("div", { class: "lx-detail panel lx-none" }, h("div", { class: "big" }, "🔎"), h("p", {}, "Kein Begriff gefunden – versuch es mit einem anderen Suchwort.")),
          ),
        );
      },
      after: () => {
        const inp = document.querySelector(".search");
        if (inp && !demo.on && document.activeElement !== inp) inp.focus();
        const a = document.querySelector(".lx-row.active");
        a && a.scrollIntoView({ block: "nearest" });
        if (s.shown !== s.cur + s.q) { s.shown = s.cur + s.q; const d = document.querySelector(".lx-detail"); if (d) d.scrollTop = 0; }
      },
      key: () => false,
    };
  };

  /* --- ARENA: Bosskampf gegen den PrintNightmare-Drucker --- */
  const Boss = () => {
    const HP = 8;
    const pool = shuffle(D.quiz).map((q) => {
      const order = shuffle([...q.a.keys()]);
      return { ...q, a: order.map((i) => q.a[i]), correct: order.indexOf(q.correct) };
    });
    const s = { phase: "intro", q: 0, sel: 0, answered: null, hp: HP, lives: 3, busy: false, hits: 0 };
    const q = () => pool[s.q % pool.length];
    const finish = (won) => { s.phase = won ? "won" : "lost"; if (won) sfx.win(); render(); };
    // Nach jeder Antwort geht es von selbst weiter – Enter überspringt nur die Wartezeit
    const AUTO_MS = 3200;
    let alive = true;
    const autoNext = () => { const qi = s.q; setTimeout(() => { if (alive && current.id === "boss" && s.q === qi && s.answered !== null) next(); }, AUTO_MS); };
    const answer = (i) => {
      if (s.busy) return;
      if (s.answered !== null) return next();
      s.answered = i; s.at = Date.now();
      s.busy = true;
      const ok = i === q().correct;
      if (ok) {
        sfx.zap();
        zapFlash();
        W.onImpact = () => {
          s.hp--; s.hits++; sfx.right();
          if (s.hp <= 0) { W.bossDie(); sfx.roar(); W.onDefeated = () => setTimeout(() => finish(true), 900); }
          s.busy = false;
          render();
          autoNext();
        };
        W.bossHit();
        if (!W.ok) W.onImpact();
      } else {
        sfx.wrong();
        W.onScorch = () => {
          sfx.fire(); burn();
          s.lives--;
          s.busy = false;
          render();
          autoNext();
          if (s.lives <= 0) setTimeout(() => finish(false), 1200);
        };
        setTimeout(() => sfx.roar(), 200);
        W.bossAttack();
        if (!W.ok) W.onScorch();
      }
      render();
    };
    const next = () => {
      if (s.busy || s.phase !== "fight") return;
      if (s.hp <= 0 || s.lives <= 0) return;
      s.q++;
      s.sel = 0;
      s.answered = null;
      render();
    };
    return {
      id: "boss", title: "Bosskampf", zone: "arena",
      clickNext: () => s.phase === "fight" && s.answered !== null && !s.busy && s.hp > 0 && s.lives > 0 && Date.now() - s.at > 400 && (next(), true),
      world: () => { W.mode("boss"); setTimeout(() => sfx.roar(), 300); },
      leave: () => { alive = false; W.onImpact = W.onScorch = W.onDefeated = null; },
      debug: (what) => { s.phase = "fight"; render(); answer(what === "hit" ? q().correct : (q().correct + 1) % q().a.length); },
      view: () => {
        if (s.phase === "intro") {
          return h("div", { class: "screen" }, h("div", { class: "arena-card intro" },
            h("div", { class: "arena-kicker" }, "Endgegner"),
            h("h2", { class: "arena-title" }, D.boss.name),
            h("p", {}, `Ein vom PrintNightmare-Virus befallener Drucker flattert über der Arena. Jede richtige Antwort schleudert einen Wissensblitz – nach ${HP} Treffern ist er gepatcht. Jede falsche Antwort kostet dich ein Leben in seiner brennenden Papierstau-Salve.`),
            h("button", { class: "btn btn-fire", onclick: () => { s.phase = "fight"; sfx.ok(); render(); } }, "Kampf beginnen ", h("kbd", {}, "Enter")),
          ));
        }
        if (s.phase === "won" || s.phase === "lost") {
          const won = s.phase === "won";
          return h("div", { class: "screen" }, h("div", { class: "arena-card intro" },
            h("div", { class: "result-big" }, won ? "🏆" : "📄"),
            h("h2", { class: "arena-title" }, won ? "Drucker gepatcht!" : "Papierstau!"),
            h("p", {}, `${s.hits} Treffer · ${3 - s.lives} Fehler · ${s.q + 1} Fragen`),
            h("p", {}, won ? "Du bist bereit für das Qualifikationsverfahren – und für die Rolle als Berufsbildner/in." : "Zurück ins Wissen-Portal, auftanken – und nochmals angreifen!"),
            h("button", { class: "btn btn-fire", onclick: () => go(Boss(), true) }, "Nochmals ", h("kbd", {}, "Enter")),
          ));
        }
        const qq = q();
        return h("div", { class: "screen boss-screen" },
          h("div", { class: "boss-hud" },
            h("div", { class: "bar-lbl" }, h("span", {}, "🖨️ " + D.boss.name), h("span", {}, `${s.hp} / ${HP} HP`)),
            h("div", { class: "bar" }, h("i", { style: { width: (s.hp / HP) * 100 + "%" } })),
            h("div", { class: "hearts" }, "❤️".repeat(Math.max(0, s.lives)) + "🖤".repeat(3 - Math.max(0, s.lives))),
          ),
          h("div", { class: "boss-panel" },
            h("div", { class: "question swap", "data-k": "q" + s.q }, h("span", { class: "qn" }, `Frage ${s.q + 1}`), qq.q),
            h("div", { class: "answers" }, qq.a.map((a, i) => {
              let cls = "answer";
              if (s.answered !== null) {
                if (i === qq.correct) cls += " right";
                else if (i === s.answered) cls += " wrong";
              } else if (i === s.sel) cls += " active";
              return h("div", { class: cls, onclick: () => answer(i), onmouseenter: () => { if (s.answered === null && s.sel !== i) { s.sel = i; render(); } } },
                h("kbd", { class: "key" }, String.fromCharCode(65 + i)), h("span", {}, a));
            })),
            h("div", { class: "explain" }, s.answered !== null
              ? [(s.answered === qq.correct ? "⚡ Treffer! " : "📄 Daneben! ") + (qq.why || ""), s.busy || s.hp <= 0 || s.lives <= 0 ? "" : h("span", { class: "auto-next" }, "  Weiter: klicken oder Enter – sonst automatisch …")]
              : "Wähle mit A–D oder den Pfeiltasten."),
          ),
        );
      },
      key: (e) => {
        if (s.phase === "intro") { if (e.key === "Enter" || e.key === " ") { s.phase = "fight"; sfx.ok(); render(); } return true; }
        if (s.phase !== "fight") { if (e.key === "Enter") go(Boss(), true); return true; }
        const n = q().a.length;
        const k = e.key.toUpperCase();
        if (k.length === 1 && k >= "A" && k < String.fromCharCode(65 + n) && s.answered === null) { answer(k.charCodeAt(0) - 65); return true; }
        if (s.answered !== null) { if (e.key === "Enter" || e.key === " ") next(); return true; }
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { s.sel = wrap(s.sel + 1, n); sfx.move(); render(); return true; }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { s.sel = wrap(s.sel - 1, n); sfx.move(); render(); return true; }
        if (e.key === "Enter" || e.key === " ") { answer(s.sel); return true; }
        return false;
      },
    };
  };

  /* --- ARENA: Interventions-Duell --- */
  const Duell = () => {
    const cases = shuffle(D.duell).slice(0, 10); // pro Runde 10 zufällige Fälle aus dem Pool
    const s = { i: 0, sel: 0, answered: null, score: 0, done: false };
    const L = D.duellLevels;
    const answer = (k) => {
      if (s.answered !== null) return next();
      s.answered = k; s.at = Date.now();
      if (k === cases[s.i].level) { s.score++; sfx.right(); W.cheer(); } else sfx.wrong();
      render();
    };
    const next = () => {
      if (s.i >= cases.length - 1) { s.done = true; sfx.win(); render(); return; }
      s.i++; s.sel = 0; s.answered = null; render();
    };
    return {
      id: "duell", title: "Interventions-Duell", zone: "arena",
      clickNext: () => !s.done && s.answered !== null && Date.now() - s.at > 400 && (next(), true),
      world: () => W.mode("arena", { hero: charById.bb }),
      view: () => {
        if (s.done) {
          return h("div", { class: "screen" }, h("div", { class: "arena-card intro" },
            h("div", { class: "result-big" }, s.score >= cases.length * 0.8 ? "🏆" : s.score >= cases.length / 2 ? "🥈" : "📚"),
            h("h2", { class: "arena-title" }, `${s.score} / ${cases.length} richtig eingeordnet`),
            h("p", {}, "Merke: Probleme früh erkennen, richtig einordnen und verhältnismässig handeln – im Zweifel lieber zu früh Hilfe holen."),
            h("button", { class: "btn btn-fire", onclick: () => go(Duell(), true) }, "Nochmals ", h("kbd", {}, "Enter")),
          ));
        }
        const c = cases[s.i];
        return h("div", { class: "screen duell-screen" },
          h("div", { class: "arena-card" },
            h("div", { class: "arena-kicker" }, `Fall ${s.i + 1} von ${cases.length} · Punkte ${s.score}`),
            h("div", { class: "case swap", "data-k": "c" + s.i }, "«", c.s, "»"),
            h("div", { class: "duell-opts" }, L.map((l, k) => {
              let cls = "dopt";
              if (s.answered !== null) { if (k === c.level) cls += " right"; else if (k === s.answered) cls += " wrong"; } else if (k === s.sel) cls += " active";
              return h("div", { class: cls, onclick: () => answer(k), onmouseenter: () => { if (s.answered === null && s.sel !== k) { s.sel = k; render(); } } },
                h("span", { class: "dico" }, l.icon), h("b", {}, l.lbl), h("kbd", {}, k + 1));
            })),
            h("div", { class: "explain" }, s.answered !== null ? [(s.answered === c.level ? "✅ Richtig! " : "❌ Nicht ganz. ") + c.why, "  Klick oder ", h("kbd", {}, "Enter"), " Weiter"] : "Wie würdest du reagieren? Pfeiltasten oder 1–4."),
            h("div", { class: "disclaimer" }, "Übungsfälle nach dem Interventionsschema aus Tag 2"),
          ),
        );
      },
      key: (e) => {
        if (s.done) { if (e.key === "Enter") go(Duell(), true); return true; }
        if (["1", "2", "3", "4"].includes(e.key) && s.answered === null) { answer(+e.key - 1); return true; }
        if (s.answered !== null) { if (e.key === "Enter" || e.key === " ") next(); return true; }
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { s.sel = wrap(s.sel + 1, 4); sfx.move(); render(); return true; }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { s.sel = wrap(s.sel - 1, 4); sfx.move(); render(); return true; }
        if (e.key === "Enter" || e.key === " ") { answer(s.sel); return true; }
        return false;
      },
    };
  };

  /* --- ARENA: Wer bin ich? --- */
  const Raetsel = () => {
    const ROUNDS = 6;
    // Arena bleibt allgemein: keine berufsspezifischen Rollen (Informatik, Pferdefachmann/-frau)
    const CHARS = D.characters.filter((c) => c.id !== "informatik" && c.id !== "pferd");
    const order = shuffle(CHARS).slice(0, ROUNDS);
    const mk = (c) => {
      const clues = shuffle([...(c.aufgaben || []), ...(c.rechte || []), ...(c.pflichten || [])]).slice(0, 3);
      const opts = shuffle([c, ...shuffle(CHARS.filter((o) => o.id !== c.id)).slice(0, 3)]);
      return { c, clues, opts };
    };
    const s = { r: 0, round: mk(order[0]), shown: 1, sel: 0, answered: null, score: 0, done: false };
    const answer = (k) => {
      if (s.answered !== null) return next();
      s.answered = k; s.at = Date.now();
      const ok = s.round.opts[k].id === s.round.c.id;
      if (ok) { s.score += 4 - s.shown; sfx.right(); } else sfx.wrong();
      W.mode("arena", { hero: s.round.c });
      render();
    };
    const next = () => {
      if (s.r >= ROUNDS - 1) { s.done = true; sfx.win(); render(); return; }
      s.r++; s.round = mk(order[s.r]); s.shown = 1; s.sel = 0; s.answered = null;
      W.mode("arena");
      render();
    };
    const hint = () => { if (s.answered === null && s.shown < s.round.clues.length) { s.shown++; sfx.move(); render(); } };
    return {
      id: "raetsel", title: "Wer bin ich?", zone: "arena",
      clickNext: () => !s.done && s.answered !== null && Date.now() - s.at > 400 && (next(), true),
      world: () => W.mode("arena"),
      view: () => {
        if (s.done) {
          return h("div", { class: "screen" }, h("div", { class: "arena-card intro" },
            h("div", { class: "result-big" }, "🎭"),
            h("h2", { class: "arena-title" }, `${s.score} von ${ROUNDS * 3} Punkten`),
            h("p", {}, "Je weniger Hinweise du brauchst, desto mehr Punkte gibt es."),
            h("button", { class: "btn btn-fire", onclick: () => go(Raetsel(), true) }, "Nochmals ", h("kbd", {}, "Enter")),
          ));
        }
        const R = s.round;
        return h("div", { class: "screen duell-screen" },
          h("div", { class: "arena-card" },
            h("div", { class: "arena-kicker" }, `Runde ${s.r + 1} von ${ROUNDS} · Punkte ${s.score}`),
            h("h3", { class: "riddle-q swap", "data-k": "r" + s.r }, "Wer bin ich?"),
            h("ul", { class: "clues" }, R.clues.slice(0, s.shown).map((c, i) => h("li", {}, h("span", { class: "sn" }, i + 1), c))),
            s.answered === null && s.shown < R.clues.length ? h("button", { class: "btn btn-ghost", onclick: hint }, "Weiterer Hinweis ", h("kbd", {}, "H")) : null,
            h("div", { class: "duell-opts" }, R.opts.map((o, k) => {
              let cls = "dopt";
              if (s.answered !== null) { if (o.id === R.c.id) cls += " right"; else if (k === s.answered) cls += " wrong"; } else if (k === s.sel) cls += " active";
              return h("div", { class: cls, style: { "--c": o.color }, onclick: () => answer(k), onmouseenter: () => { if (s.answered === null && s.sel !== k) { s.sel = k; render(); } } },
                h("span", { class: "dot", style: { "--c": o.color } }), h("b", {}, o.name), h("kbd", {}, k + 1));
            })),
            h("div", { class: "explain" }, s.answered !== null
              ? [(R.opts[s.answered].id === R.c.id ? `✅ Richtig – ${R.c.name}! +${4 - s.shown} Punkte. ` : `❌ Das war: ${R.c.name}. `), "  Klick oder ", h("kbd", {}, "Enter"), " Weiter"]
              : "Weniger Hinweise = mehr Punkte (3 / 2 / 1)."),
          ),
        );
      },
      key: (e) => {
        if (s.done) { if (e.key === "Enter") go(Raetsel(), true); return true; }
        if ((e.key === "h" || e.key === "H")) { hint(); return true; }
        if (["1", "2", "3", "4"].includes(e.key) && s.answered === null) { answer(+e.key - 1); return true; }
        if (s.answered !== null) { if (e.key === "Enter" || e.key === " ") next(); return true; }
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { s.sel = wrap(s.sel + 1, 4); sfx.move(); render(); return true; }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { s.sel = wrap(s.sel - 1, 4); sfx.move(); render(); return true; }
        if (e.key === "Enter" || e.key === " ") { answer(s.sel); return true; }
        return false;
      },
    };
  };

  /* --- Credits & Quellen --- */
  const Credits = () => {
    const C = D.credits;
    const sec = (title, ...kids) => h("section", { class: "cr-sec" }, h("h4", {}, title), ...kids);
    const scroller = () => app.querySelector(".credits");
    return {
      id: "credits", title: "Credits & Quellen", zone: "menu",
      world: () => W.mode("menu", { side: null, heroes, title: true }),
      view: () => h("div", { class: "screen" },
        h("h2", { class: "screen-title" }, "Credits & Quellen"),
        h("div", { class: "screen-sub" }, [D.title + " – " + D.subtitle, C.author && "von " + C.author, C.version].filter(Boolean).join(" · ")),
        h("div", { class: "credits panel" },
          h("div", { class: "cr-col" },
            sec("Über das Spiel", C.about.map((p) => h("p", {}, p))),
            sec("Quellen", h("div", { class: "cr-src" }, C.sources.map((g) =>
              [h("h5", {}, g.group), h("ol", {}, g.items.map(([t, by]) => h("li", {}, t, h("small", {}, by))))]))),
          ),
          h("div", { class: "cr-col" },
            sec("Technik & Lizenzen", h("dl", { class: "cr-dl" }, C.tech.map(([k, v]) => [h("dt", {}, k), h("dd", {}, v)]))),
            sec("Bedienung", h("dl", { class: "cr-dl cr-keys" }, C.keys.map(([ks, v]) => [h("dt", {}, ks.map((k) => h("kbd", {}, k))), h("dd", {}, v)]))),
            sec("Dank", h("p", {}, C.thanks)),
            h("p", { class: "cr-note" }, C.disclaimer),
          ),
        ),
        h("div", { class: "menu-foot" },
          h("span", {}, h("kbd", {}, "↑"), h("kbd", {}, "↓"), " Scrollen"),
          h("span", { class: "link", onclick: back }, h("kbd", {}, "Esc"), " Zurück")),
      ),
      key: (e) => {
        const b = scroller();
        if (e.key === "ArrowDown" || e.key === "PageDown") { b && b.scrollBy({ top: 220, behavior: "smooth" }); return true; }
        if (e.key === "ArrowUp" || e.key === "PageUp") { b && b.scrollBy({ top: -220, behavior: "smooth" }); return true; }
        return false;
      },
    };
  };

  /* ================= PRÄSENTATIONSMODUS =================
     Führt Station für Station durch mein Take-away (5–9 Minuten) – weiter geht es nur, wenn ich es sage.
     Ablauf und Texte stehen in data.js unter "demo" (sec = Richtzeit, nur zur Orientierung).
     Steuerung: → / Enter / Leertaste (auch Presenter-Klicker) = weiter · ← = zurück · ↑ ↓ = Inhalt scrollen · Esc = beenden */
  const demo = { on: false, i: 0, t: 0, clock: 0, paused: false, speed: 1, el: null, timer: null, later: [], ended: false };
  const DEMO = D.demo || [];
  function demoScreens(show) {
    const [what, arg] = show.split(":");
    const [kind, n] = what.split("-");
    const idx = (lv) => Math.max(0, lv.missions.findIndex((m) => arg && m.title.includes(arg)));
    if (kind === "title") return [];
    if (kind === "menu") { menuMem.i = n === "arena" ? MENU.findIndex((m) => m.side === "arena") : 0; return [MainMenu()]; }
    if (kind === "levels") return [MainMenu(), LevelSelect()];
    if (kind === "level") { const lv = D.levels[(+n || 1) - 1]; return [MainMenu(), LevelSelect(), LevelDetail(lv, idx(lv))]; }
    if (kind === "beruf") return [MainMenu(), LevelDetail(D.beruf, idx(D.beruf))];
    if (kind === "chars") { lastChar = Math.max(0, D.characters.findIndex((c) => c.id === arg)); return [MainMenu(), CharSelect()]; }
    if (kind === "sheet" && charById[arg]) return [MainMenu(), CharSelect(), CharSheet(arg)];
    if (kind === "journey") return [MainMenu(), Journey(Math.max(0, Math.min(D.journey.length - 1, (+n || 1) - 1)))];
    if (kind === "lexikon") return [MainMenu(), Lexikon(arg || null)];
    if (kind === "boss") return [MainMenu(), Boss()];
    return [MainMenu()];
  }
  const fmt = (sec) => Math.floor(sec / 60) + ":" + String(Math.floor(sec % 60)).padStart(2, "0");
  const demoTotal = () => DEMO.reduce((a, d) => a + (d.sec || 20), 0);
  function demoPaint() {
    const st = DEMO[demo.i], el = demo.el;
    if (!el) return;
    el.querySelector(".db-kick").textContent = `${demo.i + 1} / ${DEMO.length} · ${st.kicker}`;
    el.querySelector(".db-title").textContent = st.title;
    el.querySelector(".db-text").textContent = st.text;
    el.querySelector(".db-time").textContent = `${fmt(demo.clock)} · Richtzeit ${fmt(demoTotal())}`;
    el.querySelectorAll(".db-seg").forEach((seg, i) => {
      seg.classList.toggle("on", i === demo.i);
      seg.firstChild.style.width = (i <= demo.i ? 100 : 0) + "%";
    });
  }
  function demoShow(i) {
    demo.later.forEach(clearTimeout);
    demo.later = [];
    demo.i = Math.max(0, Math.min(DEMO.length - 1, i));
    demo.t = 0;
    demo.ended = false;
    const st = DEMO[demo.i];
    while (stack.length > 1) { const x = stack.pop(); x.leave && x.leave(); }
    demoScreens(st.show).forEach((scr) => stack.push(scr));
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    sfx.ok();
    render();
    if (st.show.startsWith("boss")) {
      // Bosskampf vorführen: Kampf starten und zwei Treffer landen
      const b = current;
      b.key({ key: "Enter" });
      [5000, 12000].forEach((ms, k) => demo.later.push(setTimeout(() => { if (demo.on && current === b && !demo.paused) { if (k) b.key({ key: "Enter" }); b.debug("hit"); } }, ms / demo.speed)));
    }
    demoFit();
    demoPaint();
  }
  /* Station mit Kursinhalt: Erkenntnis und «Das nehme ich mit» stehen im Kopf des Inhaltsfensters,
     die Leiste unten schrumpft auf Fortschritt + Steuerung, und der Inhalt wird so skaliert,
     dass alles ohne Scrollen auf eine Seite passt. */
  function demoFit() {
    if (!demo.on || !demo.el) return;
    const st = DEMO[demo.i];
    const body = app.querySelector(".mission-col .mission-body");
    document.body.classList.toggle("demo-slim", !!body);
    demo.el.classList.toggle("slim", !!body);
    if (!body) return;
    const sw = body.querySelector(".swap"), goal = sw.querySelector(".goal"), h3 = sw.querySelector("h3");
    if (!sw.querySelector(".demo-take")) {
      goal.textContent = `${demo.i + 1} / ${DEMO.length} · ${st.kicker} · ${h3.textContent}`;
      h3.textContent = st.title;
      const take = h("div", { class: "demo-take" }, h("b", {}, "Das nehme ich mit"), st.text);
      h3.after(take);
      // Statt des ganzen Kursinhalts nur die Kernpunkte zeigen, über die ich spreche (data.js → demo[].points)
      if (st.points && st.points.length) {
        while (take.nextSibling) take.nextSibling.remove();
        take.after(h("ul", { class: "demo-points" }, st.points.map((pt) => h("li", {}, pt))));
      }
    }
    body.scrollTop = 0;
    let lo = 0.45, hi = 1.5;
    sw.style.zoom = hi;
    if (body.scrollHeight > body.clientHeight + 1) {
      for (let k = 0; k < 9; k++) {
        const mid = (lo + hi) / 2;
        sw.style.zoom = mid;
        if (body.scrollHeight <= body.clientHeight + 1) lo = mid; else hi = mid;
      }
      sw.style.zoom = lo;
    }
  }
  window.addEventListener("resize", () => demo.on && demoFit());
  const demoScroller = () => app.querySelector(".mission-col .mission-body, .jr-main, .tab-body, .lx-detail, .credits");
  // Kein automatisches Weiterschalten: Ich bestimme das Tempo. Die Uhr läuft nur als Orientierung mit.
  function demoTick() {
    if (!demo.on) return;
    demo.clock += 1;
    demoPaint();
  }
  const demoNext = () => { if (demo.i < DEMO.length - 1) demoShow(demo.i + 1); };
  const demoScroll = (dir) => { const sc = demoScroller(); if (sc) sc.scrollBy({ top: dir * sc.clientHeight * 0.6, behavior: "smooth" }); };
  function demoStart(from = 0) {
    if (demo.on || !DEMO.length) return;
    demo.on = true; demo.paused = false; demo.speed = 1; demo.clock = 0;
    const btn = (cls, txt, title, fn) => h("button", { class: "db-btn " + cls, title, "aria-label": title, onclick: (e) => { e.currentTarget.blur(); fn(); } }, txt);
    demo.el = h("div", { id: "demo-bar" },
      h("div", { class: "db-main" }, h("div", { class: "db-kick" }), h("div", { class: "db-title" }), h("div", { class: "db-text" })),
      h("div", { class: "db-side" },
        h("div", { class: "db-ctrl" },
          btn("", "⏮", "Zurück (←)", () => demoShow(demo.i - 1)),
          btn("db-play", "⏭", "Weiter (→, Enter oder Leertaste)", demoNext),
          btn("db-x", "✕", "Präsentation beenden (Esc)", demoStop)),
        h("div", { class: "db-time" })),
      h("div", { class: "db-segs" }, DEMO.map((d, i) => h("div", { class: "db-seg", title: d.title, style: { "--w": String(d.sec || 20) }, onclick: () => demoShow(i) }, h("i")))));
    document.body.append(demo.el);
    document.body.classList.add("demo");
    demo.timer = setInterval(demoTick, 1000);
    demoShow(from);
  }
  function demoStop() {
    if (!demo.on) return;
    demo.on = false;
    clearInterval(demo.timer);
    demo.later.forEach(clearTimeout);
    demo.el.remove();
    demo.el = null;
    document.body.classList.remove("demo", "demo-slim");
    while (stack.length > 1) { const x = stack.pop(); x.leave && x.leave(); }
    menuMem.i = 0;
    stack.push(MainMenu());
    sfx.back();
    render();
  }
  function demoKey(e) {
    if (e.key === "Escape") demoStop();
    else if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight" || e.key === "PageDown") demoNext();
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") demoScroll(e.key === "ArrowDown" ? 1 : -1);
    else if (e.key === "ArrowLeft" || e.key === "PageUp") demoShow(demo.i - 1);
    else if (e.key === "Home") demoShow(0);
    else if (e.key === "m" || e.key === "M") toggleMute();
    else return;
    e.preventDefault();
  }

  /* Arena: Nach einer Antwort führt ein Klick irgendwo auf dem Bildschirm zur nächsten Frage */
  window.addEventListener("click", (e) => {
    if (demo.on || !current || !current.clickNext) return;
    if (e.target.closest && e.target.closest(".hud, #hud, .zone-badge, .crumb-link, #demo-bar")) return;
    if (current.clickNext()) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ---------- Tastatur ---------- */
  window.addEventListener("keydown", (e) => {
    if (demo.on) { demoKey(e); return; }
    const typing = e.target && e.target.tagName === "INPUT";
    // angeklickte Knöpfe behalten den Fokus – Enter/Leertaste sollen trotzdem nur die Bildschirm-Aktion auslösen
    if (e.target && e.target.tagName === "BUTTON" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.target.blur(); }
    if (e.key === "Escape") { e.preventDefault(); if (current.esc && current.esc()) return; back(); return; }
    if (typing) return;
    if (e.key === "Backspace") { e.preventDefault(); back(); return; }
    if ((e.key === "m" || e.key === "M") && current.id !== "raetsel") { toggleMute(); return; }
    if (current.key) current.key(e);
  });

  go(TitleScreen());

  /* Direkteinstieg per URL – z. B. index.html#chars, #sheet-betrieb, #level-2, #journey, #lexikon, #boss, #duell, #raetsel */
  const jump = location.hash.slice(1);
  if (jump) {
    go(MainMenu());
    const [what, arg, sub] = jump.split("-");
    const fight = jump.endsWith("-fight");
    if (what === "levels") go(LevelSelect());
    if (what === "level") { go(LevelSelect()); go(LevelDetail(D.levels[(+arg || 1) - 1], (+sub || 1) - 1)); }
    if (what === "chars") go(CharSelect());
    if (what === "sheet" && charById[arg]) { go(CharSelect()); go(CharSheet(arg)); }
    if (what === "beruf") go(LevelDetail(D.beruf, (+arg || 1) - 1));
    if (what === "journey") go(Journey(Math.max(0, Math.min(D.journey.length - 1, (+arg || 1) - 1))));
    if (what === "lexikon") go(Lexikon(arg ? decodeURIComponent(jump.slice(8)) : null));
    if (what === "boss") {
      go(Boss());
      if (fight) current.key({ key: "Enter" });
      if (arg === "burn" || arg === "hit") { const b = current; setTimeout(() => b.debug(arg), 4500); }
    }
    if (what === "duell") go(Duell());
    if (what === "raetsel") go(Raetsel());
    if (what === "credits") go(Credits());
    if (what === "demo") demoStart(Math.max(0, (+arg || 1) - 1));
  }
})();
