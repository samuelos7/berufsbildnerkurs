/* Berufsbildner – Das Spiel der Lehrzeit
   UI-Logik (Vanilla-JS). Inhalte: data.js · 3D-Welt: scene3d.js (window.World) */
(() => {
  "use strict";
  const D = window.GAME_DATA;
  const W = window.World || { mode() {}, rotateTo() {}, menuSide() {}, cheer() {}, dragonBreath() {}, dragonHit() {}, dragonDie() {}, dragonRoar() {} };
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
    roar: () => { tone(110, 0.9, "sawtooth", 0.06, -60); noise(0.9, 0.05); },
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
      } else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  };
  const wrap = (i, n) => ((i % n) + n) % n;
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
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
    if (current !== lastScreen) {
      lastScreen = current;
      current.world && current.world();
    }
    app.innerHTML = "";
    if (current.id !== "title") {
      const zoneName = { wissen: "📘 Wissen", arena: "⚔️ Arena", menu: "🏠 Hub" }[current.zone || "menu"];
      app.append(h("div", { class: "hud" },
        h("div", { class: "crumbs" }, h("span", { class: "zone-badge" }, zoneName), ...crumbs()),
        h("div", { class: "keys" },
          h("span", {}, h("kbd", {}, "←↑↓→"), "Navigieren"),
          h("span", {}, h("kbd", {}, "Enter"), "Wählen"),
          stack.length > 1 ? h("span", {}, h("kbd", {}, "Esc"), "Zurück") : null,
          h("span", {}, h("kbd", {}, "M"), muted ? "Ton an" : "Ton aus"),
        ),
      ));
    }
    app.append(current.view());
    current.after && current.after();
  }
  function crumbs() {
    const parts = stack.filter((s) => s.id !== "title" && s.id !== "menu").map((s) => s.title);
    return parts.flatMap((p, i) => (i === parts.length - 1 ? ["  ›  ", h("b", {}, p)] : ["  ›  ", p]));
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
  const heroes = [charById.lernende, charById.bb];

  /* --- Titelbild --- */
  const TitleScreen = () => ({
    id: "title", title: "Start", zone: "menu",
    world: () => W.mode("menu", { side: null, heroes }),
    view: () =>
      h("div", { class: "screen title-screen" },
        h("h1", { class: "logo" }, D.title, h("small", {}, D.subtitle)),
        h("div", { class: "tagline" }, D.tagline),
        h("div", { class: "press-start", onclick: start }, "Enter drücken"),
        h("div", { class: "title-meta" }, D.meta),
      ),
    key: (e) => { if (e.key === "Enter" || e.key === " ") start(); },
  });
  function start() { sfx.ok(); go(MainMenu()); }

  /* --- Hauptmenü mit zwei Portalen --- */
  const PORTALS = [
    {
      id: "wissen", name: "Wissen", sub: "Lernen & Nachschlagen", ico: "📘",
      items: [
        { ico: "🗂️", lbl: "Kurstage", sub: "5 Level mit allen Inhalten", open: () => LevelSelect() },
        { ico: "👥", lbl: "Rollen", sub: "9 Charaktere · Rechte & Pflichten", open: () => CharSelect() },
        { ico: "🗺️", lbl: "Lehrzeit-Reise", sub: "Vom Lehrvertrag bis zum Abschluss", open: () => Journey() },
        { ico: "📖", lbl: "Lexikon", sub: `${D.lexikon.length} Begriffe von ABU bis VPA`, open: () => Lexikon() },
      ],
    },
    {
      id: "arena", name: "Arena", sub: "Spielen & Prüfen", ico: "⚔️",
      items: [
        { ico: "🐉", lbl: "Bosskampf", sub: "Besiege den QV-Drachen", open: () => Boss() },
        { ico: "⚖️", lbl: "Interventions-Duell", sub: "Leicht, mittel, schwer – oder weiterverweisen?", open: () => Duell() },
        { ico: "🎭", lbl: "Wer bin ich?", sub: "Errate die Rolle", open: () => Raetsel() },
      ],
    },
  ];
  let menuMem = { col: 0, i: 0 };
  const MainMenu = () => {
    const s = menuMem;
    const open = () => { sfx.ok(); go(PORTALS[s.col].items[s.i].open()); };
    return {
      id: "menu", title: "Hauptmenü", zone: "menu",
      world: () => { W.mode("menu", { side: PORTALS[s.col].id, heroes }); },
      view: () =>
        h("div", { class: "screen menu-screen" },
          h("h1", { class: "logo logo-sm" }, D.title, h("small", {}, D.subtitle)),
          h("div", { class: "portals" },
            PORTALS.map((p, c) =>
              h("div", { class: `portal portal-${p.id}` + (c === s.col ? " active" : "") },
                h("div", { class: "portal-head" }, h("span", { class: "portal-ico" }, p.ico), h("div", {}, h("h2", {}, p.name), h("div", { class: "portal-sub" }, p.sub))),
                h("div", { class: "portal-items" },
                  p.items.map((m, i) =>
                    h("div", {
                      class: "menu-item" + (c === s.col && i === s.i ? " active" : ""),
                      onmouseenter: () => { if (s.col !== c || s.i !== i) { const sw = s.col !== c; s.col = c; s.i = i; if (sw) W.menuSide(p.id); render(); } },
                      onclick: () => { s.col = c; s.i = i; open(); },
                    }, h("div", { class: "ico" }, m.ico), h("div", {}, h("div", { class: "lbl" }, m.lbl), h("div", { class: "sub" }, m.sub))),
                  ),
                ),
              ),
            ),
          ),
          h("div", { class: "menu-foot", onclick: () => { sfx.ok(); go(Credits()); } }, h("kbd", {}, "C"), " Credits"),
        ),
      key: (e) => {
        const n = PORTALS[s.col].items.length;
        if (e.key === "ArrowUp") { s.i = wrap(s.i - 1, n); sfx.move(); render(); return true; }
        if (e.key === "ArrowDown") { s.i = wrap(s.i + 1, n); sfx.move(); render(); return true; }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          s.col = 1 - s.col;
          s.i = Math.min(s.i, PORTALS[s.col].items.length - 1);
          W.menuSide(PORTALS[s.col].id);
          sfx.move(); render(); return true;
        }
        if (e.key === "Enter" || e.key === " ") { open(); return true; }
        if (e.key === "c" || e.key === "C") { sfx.ok(); go(Credits()); return true; }
        return false;
      },
    };
  };

  /* --- Level-Auswahl --- */
  const LevelSelect = () => {
    const s = { i: 0 };
    const open = (i) => { sfx.ok(); go(LevelDetail(D.levels[i])); };
    return {
      id: "levels", title: "Kurstage", zone: "wissen",
      world: () => W.mode("wissen"),
      view: () =>
        h("div", { class: "screen" },
          h("h2", { class: "screen-title" }, "Kurstag wählen"),
          h("div", { class: "screen-sub" }, "Jeder Kurstag ist ein Level – jede Mission ein Thema aus dem Kurs."),
          h("div", { class: "levels" },
            D.levels.map((lv, i) =>
              h("div", {
                class: "level-card" + (i === s.i ? " active" : "") + (lv.placeholder ? " placeholder" : ""),
                style: { "--c1": lv.c1, "--c2": lv.c2 },
                onmouseenter: () => { if (s.i !== i) { s.i = i; render(); } },
                onclick: () => open(i),
              },
                h("div", {}, h("div", { class: "lv" }, "Level"), h("div", { class: "num" }, lv.nr)),
                h("div", {},
                  h("div", { class: "name" }, lv.title),
                  h("div", { class: "state" }, lv.placeholder ? "🚧 In Arbeit …" : `${lv.missions.length} Missionen`),
                ),
              ),
            ),
          ),
        ),
      key: (e) => listNav(e, s, D.levels.length, open, "x"),
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
    let bodyEl = null;
    return {
      id: "level", title: `Level ${lv.nr}`, zone: "wissen",
      world: () => W.mode("wissen"),
      view: () => {
        const m = lv.missions[s.i];
        let lastCh = null;
        const list = [];
        lv.missions.forEach((mm, i) => {
          if (mm.ch && mm.ch !== lastCh) { lastCh = mm.ch; list.push(h("div", { class: "chapter" }, mm.ch)); }
          list.push(h("div", { class: "mission" + (i === s.i ? " active" : ""), onclick: () => { s.i = i; sfx.move(); render(); } },
            h("div", { class: "mnum" }, i + 1), h("div", {}, mm.title)));
        });
        bodyEl = h("div", { class: "mission-body panel" },
          h("div", { class: "goal" }, `Mission ${s.i + 1} von ${lv.missions.length}` + (m.ch ? ` · ${m.ch}` : "")),
          h("h3", {}, m.title),
          (m.blocks || [{ t: "list", items: m.points || [] }]).map(block),
          m.source ? h("div", { class: "source" }, "Quelle: " + m.source) : null,
        );
        return h("div", { class: "screen screen-top" },
          h("div", { class: "level-head" }, h("h2", { class: "screen-title" }, `Level ${lv.nr} · ${lv.title}`), h("div", { class: "screen-sub" }, lv.subtitle)),
          h("div", { class: "level-detail" }, h("div", { class: "mission-list panel" }, list), bodyEl),
        );
      },
      after: () => {
        const a = document.querySelector(".mission.active");
        a && a.scrollIntoView({ block: "nearest" });
      },
      key: (e) => {
        if (e.key === "PageDown" || e.key === "ArrowRight") { bodyEl && bodyEl.scrollBy({ top: 260, behavior: "smooth" }); return true; }
        if (e.key === "PageUp" || e.key === "ArrowLeft") { bodyEl && bodyEl.scrollBy({ top: -260, behavior: "smooth" }); return true; }
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
  const TABS = [
    { id: "aufgaben", lbl: "🎯 Aufgaben", bullet: '"◆"' },
    { id: "rechte", lbl: "🛡️ Rechte", bullet: '"✔"' },
    { id: "pflichten", lbl: "📜 Pflichten", bullet: '"!"' },
    { id: "beziehungen", lbl: "🔗 Beziehungen" },
  ];
  const CharSheet = (id) => {
    const s = { tab: 0 };
    const c = charById[id];
    const tabs = TABS.filter((t) => (c[t.id] || []).length);
    return {
      id: "sheet", title: c.name, zone: "wissen",
      world: () => W.mode("character", { char: c }),
      view: () => {
        const t = tabs[s.tab];
        const content = t.id === "beziehungen"
          ? h("div", { class: "rels" }, c.beziehungen.map((r) => {
            const o = charById[r.to];
            return h("div", { class: "rel", style: { "--c": o ? o.color : "#888" }, onclick: () => { if (o) { sfx.ok(); go(CharSheet(o.id), true); } } },
              h("div", { class: "mini" }), h("div", {}, h("b", {}, o ? o.name : r.to), h("span", {}, r.text)), h("span", { class: "go" }, "›"));
          }))
          : h("ul", { class: "blist", style: { "--bullet": t.bullet } }, c[t.id].map((p) => h("li", {}, p)));
        return h("div", { class: "screen sheet-screen" },
          h("div", { class: "sheet", style: { "--c": c.color } },
            h("div", { class: "sheet-stage" },
              h("div", { class: "nameplate" }, h("h2", {}, c.name), h("div", { class: "cshort" }, c.short)),
            ),
            h("div", { class: "sheet-main panel" },
              h("div", { class: "role" }, c.role),
              h("div", { class: "tabs" }, tabs.map((tt, i) => h("div", { class: "tab" + (i === s.tab ? " active" : ""), onclick: () => { s.tab = i; sfx.move(); render(); } }, tt.lbl, h("small", {}, (c[tt.id] || []).length)))),
              h("div", { class: "tab-body" }, content),
              c.sources ? h("div", { class: "source" }, "Quellen: " + c.sources) : null,
            ),
          ),
        );
      },
      key: (e) => {
        if (e.key === "ArrowLeft") { s.tab = wrap(s.tab - 1, tabs.length); sfx.move(); render(); return true; }
        if (e.key === "ArrowRight" || e.key === "Tab") { e.preventDefault(); s.tab = wrap(s.tab + 1, tabs.length); sfx.move(); render(); return true; }
        return false;
      },
    };
  };

  /* --- Lehrzeit-Reise --- */
  const Journey = () => {
    const s = { i: 0, seen: new Set([0]) };
    const J = D.journey;
    return {
      id: "journey", title: "Lehrzeit-Reise", zone: "wissen",
      world: () => W.mode("wissen"),
      view: () => {
        const st = J[s.i];
        return h("div", { class: "screen" },
          h("h2", { class: "screen-title" }, "Lehrzeit-Reise"),
          h("div", { class: "screen-sub" }, "Die Etappen einer Lehre aus Sicht der Berufsbildner/innen – gemäss Ablaufplan der Lehrzeit."),
          h("div", { class: "journey" },
            h("div", { class: "path" }, J.map((j, i) =>
              h("div", { class: "stop" + (i === s.i ? " active" : "") + (s.seen.has(i) ? " visited" : ""), onclick: () => { s.i = i; s.seen.add(i); sfx.move(); render(); } },
                h("div", { class: "node" }, j.icon), h("div", { class: "stop-lbl" }, j.title)))),
            h("div", { class: "mission-body panel" },
              h("div", { class: "goal" }, `Etappe ${s.i + 1} von ${J.length}` + (st.when ? ` · ${st.when}` : "")),
              h("h3", {}, st.title),
              h("ol", { class: "steps" }, st.items.map((p, n) => h("li", {}, h("span", { class: "sn" }, n + 1), h("span", {}, p)))),
              h("div", { class: "source" }, "Quelle: " + st.source),
            ),
          ),
        );
      },
      key: (e) => {
        const r = listNav(e, s, J.length, null, "x");
        if (r) { s.seen.add(s.i); render(); }
        return r;
      },
    };
  };

  /* --- Lexikon --- */
  const Lexikon = () => {
    const s = { q: "" };
    let input = null;
    let grid = null;
    const fill = () => {
      const q = s.q.trim().toLowerCase();
      grid.innerHTML = "";
      const hits = D.lexikon.filter(([k, v]) => !q || k.toLowerCase().includes(q) || v.toLowerCase().includes(q));
      hits.forEach(([k, v]) => grid.append(h("div", { class: "lex" }, h("b", {}, k), h("span", {}, v))));
      if (!hits.length) grid.append(h("div", { class: "lex empty" }, "Kein Begriff gefunden."));
    };
    return {
      id: "lexikon", title: "Lexikon", zone: "wissen",
      world: () => W.mode("wissen"),
      view: () => {
        input = h("input", { class: "search", placeholder: "🔎 Begriff suchen … z. B. BiVo, Lehraufsicht, QV", value: s.q });
        input.addEventListener("input", () => { s.q = input.value; fill(); });
        grid = h("div", { class: "lex-grid" });
        return h("div", { class: "screen screen-top" },
          h("h2", { class: "screen-title" }, "Lexikon"),
          h("div", { class: "screen-sub" }, "Alle Abkürzungen und Begriffe aus dem Kurs – einfach lostippen."),
          input,
          h("div", { class: "panel lex-panel" }, grid),
        );
      },
      after: () => { fill(); input.focus(); },
      key: () => false,
    };
  };

  /* --- ARENA: Bosskampf gegen den QV-Drachen --- */
  const Boss = () => {
    const HP = 8;
    const pool = shuffle(D.quiz).map((q) => {
      const order = shuffle([...q.a.keys()]);
      return { ...q, a: order.map((i) => q.a[i]), correct: order.indexOf(q.correct) };
    });
    const s = { phase: "intro", q: 0, sel: 0, answered: null, hp: HP, lives: 3, busy: false, hits: 0 };
    const q = () => pool[s.q % pool.length];
    const finish = (won) => { s.phase = won ? "won" : "lost"; if (won) sfx.win(); render(); };
    const answer = (i) => {
      if (s.busy) return;
      if (s.answered !== null) return next();
      s.answered = i;
      s.busy = true;
      const ok = i === q().correct;
      if (ok) {
        sfx.zap();
        zapFlash();
        W.onImpact = () => {
          s.hp--; s.hits++; sfx.right();
          if (s.hp <= 0) { W.dragonDie(); sfx.roar(); W.onDefeated = () => setTimeout(() => finish(true), 900); }
          s.busy = false;
          render();
        };
        W.dragonHit();
        if (!W.ok) W.onImpact();
      } else {
        sfx.wrong();
        W.onScorch = () => {
          sfx.fire(); burn();
          s.lives--;
          s.busy = false;
          render();
          if (s.lives <= 0) setTimeout(() => finish(false), 1200);
        };
        setTimeout(() => sfx.roar(), 200);
        W.dragonBreath();
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
      world: () => { W.mode("boss"); setTimeout(() => sfx.roar(), 300); },
      leave: () => { W.onImpact = W.onScorch = W.onDefeated = null; },
      debug: (what) => { s.phase = "fight"; render(); answer(what === "hit" ? q().correct : (q().correct + 1) % q().a.length); },
      view: () => {
        if (s.phase === "intro") {
          return h("div", { class: "screen" }, h("div", { class: "arena-card intro" },
            h("div", { class: "arena-kicker" }, "Endgegner"),
            h("h2", { class: "arena-title" }, D.boss.name),
            h("p", {}, `Beantworte Fragen aus dem Kurs. Jede richtige Antwort schleudert einen Wissensblitz – ${HP} Treffer besiegen den Drachen. Jede falsche Antwort kostet dich ein Leben im Feuerstoss.`),
            h("button", { class: "btn btn-fire", onclick: () => { s.phase = "fight"; sfx.ok(); render(); } }, "Kampf beginnen ", h("kbd", {}, "Enter")),
          ));
        }
        if (s.phase === "won" || s.phase === "lost") {
          const won = s.phase === "won";
          return h("div", { class: "screen" }, h("div", { class: "arena-card intro" },
            h("div", { class: "result-big" }, won ? "🏆" : "🔥"),
            h("h2", { class: "arena-title" }, won ? "Drache besiegt!" : "Verbrannt!"),
            h("p", {}, `${s.hits} Treffer · ${3 - s.lives} Fehler · ${s.q + 1} Fragen`),
            h("p", {}, won ? "Du bist bereit für das Qualifikationsverfahren – und für die Rolle als Berufsbildner/in." : "Zurück ins Wissen-Portal, auftanken – und nochmals angreifen!"),
            h("button", { class: "btn btn-fire", onclick: () => go(Boss(), true) }, "Nochmals ", h("kbd", {}, "Enter")),
          ));
        }
        const qq = q();
        return h("div", { class: "screen boss-screen" },
          h("div", { class: "boss-hud" },
            h("div", { class: "bar-lbl" }, h("span", {}, "🐉 " + D.boss.name), h("span", {}, `${s.hp} / ${HP} HP`)),
            h("div", { class: "bar" }, h("i", { style: { width: (s.hp / HP) * 100 + "%" } })),
            h("div", { class: "hearts" }, "❤️".repeat(Math.max(0, s.lives)) + "🖤".repeat(3 - Math.max(0, s.lives))),
          ),
          h("div", { class: "boss-panel" },
            h("div", { class: "question" }, h("span", { class: "qn" }, `Frage ${s.q + 1}`), qq.q),
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
              ? [(s.answered === qq.correct ? "⚡ Treffer! " : "🔥 Daneben! ") + (qq.why || ""), s.busy ? "" : ["  ", h("kbd", {}, "Enter"), " Weiter"]]
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
    const cases = shuffle(D.duell);
    const s = { i: 0, sel: 0, answered: null, score: 0, done: false };
    const L = D.duellLevels;
    const answer = (k) => {
      if (s.answered !== null) return next();
      s.answered = k;
      if (k === cases[s.i].level) { s.score++; sfx.right(); W.cheer(); } else sfx.wrong();
      render();
    };
    const next = () => {
      if (s.i >= cases.length - 1) { s.done = true; sfx.win(); render(); return; }
      s.i++; s.sel = 0; s.answered = null; render();
    };
    return {
      id: "duell", title: "Interventions-Duell", zone: "arena",
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
            h("div", { class: "case" }, "«", c.s, "»"),
            h("div", { class: "duell-opts" }, L.map((l, k) => {
              let cls = "dopt";
              if (s.answered !== null) { if (k === c.level) cls += " right"; else if (k === s.answered) cls += " wrong"; } else if (k === s.sel) cls += " active";
              return h("div", { class: cls, onclick: () => answer(k), onmouseenter: () => { if (s.answered === null && s.sel !== k) { s.sel = k; render(); } } },
                h("span", { class: "dico" }, l.icon), h("b", {}, l.lbl), h("kbd", {}, k + 1));
            })),
            h("div", { class: "explain" }, s.answered !== null ? [(s.answered === c.level ? "✅ Richtig! " : "❌ Nicht ganz. ") + c.why, "  ", h("kbd", {}, "Enter"), " Weiter"] : "Wie würdest du reagieren? Pfeiltasten oder 1–4."),
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
    const order = shuffle(D.characters).slice(0, ROUNDS);
    const mk = (c) => {
      const clues = shuffle([...(c.aufgaben || []), ...(c.rechte || []), ...(c.pflichten || [])]).slice(0, 3);
      const opts = shuffle([c, ...shuffle(D.characters.filter((o) => o.id !== c.id)).slice(0, 3)]);
      return { c, clues, opts };
    };
    const s = { r: 0, round: mk(order[0]), shown: 1, sel: 0, answered: null, score: 0, done: false };
    const answer = (k) => {
      if (s.answered !== null) return next();
      s.answered = k;
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
            h("h3", { class: "riddle-q" }, "Wer bin ich?"),
            h("ul", { class: "clues" }, R.clues.slice(0, s.shown).map((c, i) => h("li", {}, h("span", { class: "sn" }, i + 1), c))),
            s.answered === null && s.shown < R.clues.length ? h("button", { class: "btn btn-ghost", onclick: hint }, "Weiterer Hinweis ", h("kbd", {}, "H")) : null,
            h("div", { class: "duell-opts" }, R.opts.map((o, k) => {
              let cls = "dopt";
              if (s.answered !== null) { if (o.id === R.c.id) cls += " right"; else if (k === s.answered) cls += " wrong"; } else if (k === s.sel) cls += " active";
              return h("div", { class: cls, style: { "--c": o.color }, onclick: () => answer(k), onmouseenter: () => { if (s.answered === null && s.sel !== k) { s.sel = k; render(); } } },
                h("span", { class: "dot", style: { "--c": o.color } }), h("b", {}, o.name), h("kbd", {}, k + 1));
            })),
            h("div", { class: "explain" }, s.answered !== null
              ? [(R.opts[s.answered].id === R.c.id ? `✅ Richtig – ${R.c.name}! +${4 - s.shown} Punkte. ` : `❌ Das war: ${R.c.name}. `), "  ", h("kbd", {}, "Enter"), " Weiter"]
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

  /* --- Credits --- */
  const Credits = () => ({
    id: "credits", title: "Credits", zone: "menu",
    world: () => W.mode("menu", { side: null, heroes }),
    view: () => h("div", { class: "screen" }, h("div", { class: "placeholder-box panel" },
      h("div", { class: "big" }, "🎓"),
      h("h2", { class: "screen-title" }, "Credits"),
      D.credits.map((line) => h("p", {}, line)))),
    key: () => false,
  });

  /* ---------- Tastatur ---------- */
  window.addEventListener("keydown", (e) => {
    const typing = e.target && e.target.tagName === "INPUT";
    if (e.key === "Escape") { e.preventDefault(); back(); return; }
    if (typing) return;
    if (e.key === "Backspace") { e.preventDefault(); back(); return; }
    if ((e.key === "m" || e.key === "M") && current.id !== "raetsel") { muted = !muted; toast(muted ? "🔇 Ton aus" : "🔊 Ton an"); render(); return; }
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
    if (what === "journey") go(Journey());
    if (what === "lexikon") go(Lexikon());
    if (what === "boss") {
      go(Boss());
      if (fight) current.key({ key: "Enter" });
      if (arg === "burn" || arg === "hit") { const b = current; setTimeout(() => b.debug(arg), 4500); }
    }
    if (what === "duell") go(Duell());
    if (what === "raetsel") go(Raetsel());
  }
})();
