/* 3D-Welt hinter der App – Three.js r149 (lokal in vendor/three.min.js, läuft offline).
   Alles ist prozedural aus Grundkörpern gebaut: keine Modelle, keine Texturen-Dateien.
   API für main.js:  World.mode(name, opts) · World.rotateTo(i) · World.dragon* · World.onScorch */
window.World = (() => {
  "use strict";
  const noop = () => {};
  const stub = { ok: false, mode: noop, rotateTo: noop, dragonBreath: noop, dragonHit: noop, dragonDie: noop, dragonRoar: noop, cheer: noop, menuSide: noop, onScorch: null, onImpact: null };
  if (!window.THREE) return stub;
  const canvas = document.getElementById("scene");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    return stub;
  }
  document.body.classList.add("has-3d");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
  const clock = new THREE.Clock();
  const C = (c) => new THREE.Color(c);
  const lerp = (a, b, k) => a + (b - a) * k;
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- Material- & Mesh-Helfer ---------- */
  const matCache = {};
  function M(color, o = {}) {
    const key = color + JSON.stringify(o);
    if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.68, metalness: 0.06, flatShading: true }, o));
    return matCache[key];
  }
  function mesh(geo, mat, x = 0, y = 0, z = 0, parent = null) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    if (parent) parent.add(m);
    return m;
  }
  const box = (w, h, d, mat, x, y, z, p) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, p);
  const cyl = (rt, rb, h, mat, x, y, z, p, seg = 12) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z, p);
  const sph = (r, mat, x, y, z, p, seg = 12) => mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg - 4)), mat, x, y, z, p);
  function prism(w, h, d, mat, x, y, z, p) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    return mesh(g, mat, x, y, z, p);
  }
  function gear(r, teeth, depth, mat) {
    const g = new THREE.Group();
    cyl(r, r, depth, mat, 0, 0, 0, g, 20).rotation.x = Math.PI / 2;
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const t = box(r * 0.28, r * 0.34, depth, mat, Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08, 0, g);
      t.rotation.z = a;
    }
    cyl(r * 0.3, r * 0.3, depth * 1.2, M("#1b1f2e"), 0, 0, 0, g, 12).rotation.x = Math.PI / 2;
    return g;
  }
  function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, inner);
    gr.addColorStop(0.35, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, outer);
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const GLOW = glowTexture();

  /* ---------- Himmel, Nebel, Licht, Boden ---------- */
  const skyU = { top: { value: C("#1a2a6c") }, bottom: { value: C("#05060f") } };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(160, 32, 16),
    new THREE.ShaderMaterial({
      uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(vP.y*0.5+0.5,0.0,1.0); gl_FragColor = vec4(mix(bottom, top, smoothstep(0.42,0.9,h)),1.0); }",
    }),
  );
  scene.add(sky);
  scene.fog = new THREE.Fog("#0a0f26", 16, 60);

  const hemi = new THREE.HemisphereLight("#bcd4ff", "#1a1020", 0.75);
  scene.add(hemi);
  const key = new THREE.DirectionalLight("#ffffff", 1.05);
  key.position.set(5, 10, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
  scene.add(key);
  const rim = new THREE.PointLight("#7aa2ff", 1.4, 30);
  rim.position.set(-4, 4, -3);
  scene.add(rim);
  const spot = new THREE.SpotLight("#ffffff", 0, 18, 0.45, 0.6);
  spot.position.set(0, 8, 6);
  scene.add(spot, spot.target);

  const groundMat = new THREE.MeshStandardMaterial({ color: "#0b1030", roughness: 0.95, metalness: 0, emissive: "#000000" });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(70, 48), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  const grid = new THREE.GridHelper(140, 70, "#3a5cff", "#3a5cff");
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  grid.position.y = 0.01;
  scene.add(grid);

  /* ---------- Schwebende Partikel (Staub / Glut) ---------- */
  const PN = 700;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PN * 3);
  const pSpd = new Float32Array(PN);
  for (let i = 0; i < PN; i++) {
    pPos[i * 3] = rnd(-25, 25); pPos[i * 3 + 1] = rnd(0, 14); pPos[i * 3 + 2] = rnd(-25, 12);
    pSpd[i] = rnd(0.2, 1);
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: "#9fc4ff", size: 0.09, map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 });
  const motes = new THREE.Points(pGeo, pMat);
  scene.add(motes);
  let pMode = "motes";

  /* ---------- Themen (Farbwelten) ---------- */
  const THEMES = {
    menu: { top: "#1b2a70", bottom: "#04050e", fog: "#0a0f26", ground: "#0a0f2c", grid: "#3a5cff", rim: "#7aa2ff", p: "#9fc4ff", pm: "motes", hemi: "#bcd4ff" },
    wissen: { top: "#0f5f8f", bottom: "#03111d", fog: "#05192a", ground: "#041b2c", grid: "#2fd3ff", rim: "#5fd4ff", p: "#a5ecff", pm: "motes", hemi: "#bfefff" },
    arena: { top: "#6b1208", bottom: "#0c0202", fog: "#1d0603", ground: "#1a0603", grid: "#ff5a1f", rim: "#ff6a2a", p: "#ffb347", pm: "embers", hemi: "#ffcaa0" },
  };
  const cur = { top: C("#000"), bottom: C("#000"), fog: C("#000"), ground: C("#000"), grid: C("#000"), rim: C("#000"), p: C("#000"), hemi: C("#fff") };
  let tgt = null;
  function setTheme(th) {
    tgt = {};
    for (const k of Object.keys(cur)) tgt[k] = C(th[k]);
    pMode = th.pm;
  }
  function themeFromColor(hex, base = "wissen") {
    const c = C(hex);
    const b = THEMES[base];
    return {
      ...b,
      top: "#" + c.clone().multiplyScalar(0.55).getHexString(),
      bottom: "#" + c.clone().multiplyScalar(0.06).getHexString(),
      fog: "#" + c.clone().multiplyScalar(0.12).getHexString(),
      ground: "#" + c.clone().multiplyScalar(0.1).getHexString(),
      grid: hex, rim: hex, p: hex,
    };
  }

  /* ---------- Ein-/Ausblenden von Gruppen ---------- */
  const faders = new Set();
  function show(g, on) {
    if (!g) return;
    g.userData.target = on ? 1 : 0;
    if (on) g.visible = true;
    if (g.userData.s == null) { g.userData.s = 0; g.scale.setScalar(0.001); }
    faders.add(g);
  }

  /* =====================================================================
     FIGUREN
     ===================================================================== */
  function person(L) {
    const root = new THREE.Group();
    const body = new THREE.Group();
    root.add(body);
    const skin = M(L.skin), shirt = M(L.shirt), pants = M(L.pants), hair = M(L.hair), dark = M("#1b1b25");
    const legGeo = new THREE.CapsuleGeometry(0.11, 0.48, 4, 8);
    const legL = mesh(legGeo, pants, -0.13, 0.4, 0, body);
    const legR = mesh(legGeo, pants, 0.13, 0.4, 0, body);
    const shoe = new THREE.BoxGeometry(0.17, 0.09, 0.28);
    mesh(shoe, dark, -0.13, 0.05, 0.05, body);
    mesh(shoe, dark, 0.13, 0.05, 0.05, body);
    const torso = mesh(new THREE.CapsuleGeometry(0.27, 0.42, 4, 10), shirt, 0, 1.08, 0, body);
    torso.scale.z = 0.72;
    const armGeo = new THREE.CapsuleGeometry(0.075, 0.44, 4, 8);
    const hand = new THREE.SphereGeometry(0.085, 10, 8);
    function arm(side) {
      const p = new THREE.Group();
      p.position.set(side * 0.36, 1.36, 0);
      body.add(p);
      mesh(armGeo, shirt, 0, -0.3, 0, p);
      mesh(hand, skin, 0, -0.6, 0, p);
      p.rotation.z = side * 0.12;
      return p;
    }
    const armL = arm(-1), armR = arm(1);
    cyl(0.08, 0.09, 0.12, skin, 0, 1.58, 0, body, 8);
    const head = new THREE.Group();
    head.position.set(0, 1.84, 0);
    body.add(head);
    sph(0.27, skin, 0, 0, 0, head, 16);
    const eye = new THREE.SphereGeometry(0.036, 8, 6);
    mesh(eye, dark, -0.09, 0.03, 0.245, head);
    mesh(eye, dark, 0.09, 0.03, 0.245, head);
    const shine = new THREE.SphereGeometry(0.012, 6, 4);
    mesh(shine, M("#ffffff", { emissive: "#ffffff" }), -0.08, 0.045, 0.275, head);
    mesh(shine, M("#ffffff", { emissive: "#ffffff" }), 0.1, 0.045, 0.275, head);
    const cheek = new THREE.SphereGeometry(0.045, 8, 6);
    const ch = M("#ff9aa8", { roughness: 1 });
    mesh(cheek, ch, -0.16, -0.05, 0.2, head).scale.z = 0.4;
    mesh(cheek, ch, 0.16, -0.05, 0.2, head).scale.z = 0.4;
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.014, 6, 12, Math.PI), dark);
    mouth.position.set(0, -0.08, 0.252);
    mouth.rotation.z = Math.PI;
    head.add(mouth);
    // Haare / Kopfbedeckung
    const cap = (r, mat, tilt = -0.32) => {
      const m = mesh(new THREE.SphereGeometry(r, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.42), mat, 0, 0.04, -0.01, head);
      m.rotation.x = tilt;
      return m;
    };
    const st = L.hairStyle || "short";
    if (st === "cap") {
      cap(0.29, M(L.cap || "#ff8a3d"), -0.15);
      box(0.32, 0.035, 0.24, M(L.cap || "#ff8a3d"), 0, 0.1, 0.27, head);
    } else if (st === "helmet") {
      cap(0.31, M("#ffd23f", { metalness: 0.2, roughness: 0.4 }), -0.1);
      const brim = mesh(new THREE.TorusGeometry(0.3, 0.025, 6, 20), M("#ffd23f"), 0, 0.03, 0, head);
      brim.rotation.x = Math.PI / 2;
    } else {
      cap(0.29, hair);
      if (st === "long") box(0.5, 0.48, 0.14, hair, 0, -0.16, -0.17, head);
      if (st === "bun") sph(0.12, hair, 0, 0.2, -0.2, head, 10);
    }
    return { root, body, torso, armL, armR, legL, legR, head, phase: Math.random() * 10, jump: 0 };
  }

  function addExtras(rig, L) {
    const ex = L.extra || [];
    const handR = (o) => { o.position.y -= 0.62; rig.armR.add(o); return o; };
    const handL = (o) => { o.position.y -= 0.62; rig.armL.add(o); return o; };
    const g = () => new THREE.Group();
    if (ex.includes("backpack")) {
      box(0.42, 0.5, 0.2, M("#1f5fa0"), 0, 1.12, -0.27, rig.body);
      box(0.3, 0.16, 0.06, M("#2a74bf"), 0, 0.98, -0.39, rig.body);
    }
    if (ex.includes("tie")) {
      box(0.07, 0.36, 0.04, M("#d63031"), 0, 1.13, 0.2, rig.body);
      box(0.24, 0.08, 0.05, M("#f5f6fa"), 0, 1.36, 0.17, rig.body);
    }
    if (ex.includes("badge")) box(0.12, 0.16, 0.03, M("#ffffff", { emissive: "#666" }), -0.13, 1.18, 0.2, rig.body);
    if (ex.includes("swiss")) {
      box(0.2, 0.2, 0.03, M("#d52b1e"), -0.12, 1.2, 0.2, rig.body);
      box(0.12, 0.04, 0.035, M("#ffffff"), -0.12, 1.2, 0.205, rig.body);
      box(0.04, 0.12, 0.035, M("#ffffff"), -0.12, 1.2, 0.205, rig.body);
    }
    if (ex.includes("glasses")) {
      const fr = M("#222");
      const r1 = mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 14), fr, -0.09, 0.03, 0.27, rig.head);
      const r2 = mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 14), fr, 0.09, 0.03, 0.27, rig.head);
      box(0.06, 0.012, 0.012, fr, 0, 0.04, 0.27, rig.head);
      r1.castShadow = r2.castShadow = false;
    }
    if (ex.includes("clipboard")) {
      const o = g();
      box(0.28, 0.36, 0.03, M("#8b5a2b"), 0, -0.05, 0.08, o);
      box(0.22, 0.28, 0.035, M("#ffffff"), 0, -0.06, 0.09, o);
      o.rotation.x = -0.6;
      handL(o);
    }
    if (ex.includes("briefcase")) {
      const o = g();
      box(0.42, 0.3, 0.12, M("#5a3b22"), 0, -0.18, 0, o);
      const h = mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 12, Math.PI), M("#2b1b10"), 0, -0.03, 0, o);
      h.rotation.z = 0;
      handR(o);
    }
    if (ex.includes("stamp")) {
      const o = g();
      cyl(0.04, 0.05, 0.2, M("#2d2a4a"), 0, 0, 0, o, 8);
      box(0.18, 0.06, 0.12, M("#6c5ce7"), 0, -0.12, 0, o);
      box(0.17, 0.02, 0.11, M("#d63031"), 0, -0.16, 0, o);
      handR(o);
    }
    if (ex.includes("book")) {
      const o = g();
      const l = box(0.22, 0.3, 0.03, M("#c0392b"), -0.1, 0, 0.05, o); l.rotation.y = 0.5;
      const r = box(0.22, 0.3, 0.03, M("#c0392b"), 0.1, 0, 0.05, o); r.rotation.y = -0.5;
      o.rotation.x = -0.9;
      handL(o);
    }
    if (ex.includes("wrench")) {
      const o = g();
      box(0.05, 0.38, 0.04, M("#a4b0be", { metalness: 0.7, roughness: 0.3 }), 0, -0.12, 0, o);
      mesh(new THREE.TorusGeometry(0.07, 0.025, 6, 10, Math.PI * 1.5), M("#a4b0be", { metalness: 0.7, roughness: 0.3 }), 0, -0.33, 0, o);
      handR(o);
    }
    if (ex.includes("flag")) {
      const o = g();
      cyl(0.02, 0.02, 1.2, M("#ddd"), 0, 0.4, 0, o, 6);
      const f = box(0.5, 0.32, 0.01, M("#d94848", { side: THREE.DoubleSide }), 0.26, 0.82, 0, o);
      o.userData.flag = f;
      rig.flag = f;
      handR(o);
    }
    if (ex.includes("scroll")) {
      const o = g();
      const s = cyl(0.05, 0.05, 0.36, M("#f3e5c0"), 0, 0, 0.06, o, 10);
      s.rotation.z = Math.PI / 2;
      handL(o);
    }
  }

  const charCache = {};
  function makeCharacter(c) {
    const L = c.look || {};
    const holder = new THREE.Group();
    const rigs = [];
    const a = person(L);
    addExtras(a, L);
    holder.add(a.root);
    rigs.push(a);
    if ((L.extra || []).includes("partner")) {
      const b = person({ skin: "#e0ac69", shirt: "#4f7cff", pants: "#2c3550", hair: "#3a2a1a", hairStyle: "short" });
      a.root.position.x = -0.42;
      b.root.position.x = 0.42;
      holder.add(b.root);
      rigs.push(b);
      const heart = new THREE.Group();
      sph(0.1, M("#ff4d6d", { emissive: "#661020" }), -0.07, 0, 0, heart, 10);
      sph(0.1, M("#ff4d6d", { emissive: "#661020" }), 0.07, 0, 0, heart, 10);
      const tip = mesh(new THREE.ConeGeometry(0.135, 0.2, 10), M("#ff4d6d", { emissive: "#661020" }), 0, -0.12, 0, heart);
      tip.rotation.z = Math.PI;
      heart.position.set(0, 2.45, 0);
      holder.add(heart);
      holder.userData.heart = heart;
    }
    const s = L.scale || 1;
    holder.scale.setScalar(s);
    holder.userData.baseScale = s;
    return { obj: holder, rigs, id: c.id };
  }
  function getChar(c, slot) {
    const k = c.id + ":" + slot;
    if (!charCache[k]) charCache[k] = makeCharacter(c);
    return charCache[k];
  }

  function animateChar(ch, t, active, dt) {
    ch.rigs.forEach((r, n) => {
      const p = t + r.phase;
      r.torso.scale.y = 1 + Math.sin(p * 2.2) * 0.025;
      r.head.rotation.y = Math.sin(p * 0.7) * 0.25;
      r.head.rotation.z = Math.sin(p * 1.1) * 0.05;
      r.legL.rotation.x = r.legR.rotation.x = 0;
      if (r.jump > 0) r.jump = Math.max(0, r.jump - dt);
      const jy = r.jump > 0 ? Math.sin((1 - r.jump / 0.8) * Math.PI) * 0.55 : 0;
      r.body.position.y = jy + (active ? Math.abs(Math.sin(p * 2.4)) * 0.03 : 0);
      if (active && n === 0) {
        r.armR.rotation.z = lerp(r.armR.rotation.z, 2.5 + Math.sin(p * 8) * 0.35, 0.15);
        r.armR.rotation.x = 0;
        r.armL.rotation.x = Math.sin(p * 1.6) * 0.15;
        r.armL.rotation.z = -0.12;
      } else {
        r.armR.rotation.z = lerp(r.armR.rotation.z, 0.12, 0.1);
        r.armR.rotation.x = Math.sin(p * 1.6) * 0.18;
        r.armL.rotation.x = -Math.sin(p * 1.6) * 0.18;
        r.armL.rotation.z = -0.12;
      }
      if (r.flag) r.flag.rotation.y = Math.sin(p * 4) * 0.3;
    });
    const hrt = ch.obj.userData.heart;
    if (hrt) { hrt.position.y = 2.45 + Math.sin(t * 2) * 0.08; hrt.rotation.y = t * 1.5; }
  }

  /* =====================================================================
     UMGEBUNGEN PRO ROLLE
     ===================================================================== */
  const tickers = [];
  function envGroup(build, color) {
    const g = new THREE.Group();
    g.visible = false;
    build(g, color);
    scene.add(g);
    return g;
  }
  function windows(parent, w, h, cols, rows, x0, y0, z, mat) {
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      box(w, h, 0.05, mat, x0 + i * (w * 1.8), y0 + j * (h * 1.7), z, parent).castShadow = false;
    }
  }
  const litWin = M("#ffe08a", { emissive: "#ffb830", emissiveIntensity: 0.9 });
  const ENV = {
    lernorte(g, col) {
      const places = [
        { x: -3.4, c: "#ff5d73", b: (p) => { box(1.1, 0.8, 0.8, M("#c44"), 0, 0.8, 0, p); cyl(0.12, 0.14, 0.9, M("#666"), 0.35, 1.5, 0, p); } },
        { x: 0, c: "#5be3a0", b: (p) => { box(1.2, 0.8, 0.8, M("#2fb67a"), 0, 0.8, 0, p); prism(1.3, 0.5, 0.85, M("#1e7a52"), 0, 1.2, 0, p); box(0.3, 0.5, 0.3, M("#2fb67a"), 0, 1.75, 0, p); } },
        { x: 3.4, c: "#ff9a4d", b: (p) => { const gg = gear(0.45, 10, 0.18, M("#ff9a4d", { metalness: 0.4 })); gg.position.y = 1.1; p.add(gg); p.userData.gear = gg; } },
      ];
      places.forEach((pl, i) => {
        const p = new THREE.Group();
        p.position.set(pl.x, 0.6, -5);
        cyl(1.1, 0.6, 0.5, M("#2b3550"), 0, 0.15, 0, p, 10);
        cyl(1.12, 1.12, 0.06, M(pl.c, { emissive: pl.c, emissiveIntensity: 0.25 }), 0, 0.42, 0, p, 20);
        pl.b(p);
        g.add(p);
        tickers.push((t) => { if (!g.visible) return; p.position.y = 0.6 + Math.sin(t + i * 2) * 0.15; if (p.userData.gear) p.userData.gear.rotation.z = t; });
      });
      // Verbindungsbögen = Lernortkooperation
      const arcMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6 });
      [[-3.4, 0], [0, 3.4], [-3.4, 3.4]].forEach(([a, b], i) => {
        const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(a, 1.6, -5), new THREE.Vector3((a + b) / 2, i === 2 ? 4.4 : 3.2, -5.4), new THREE.Vector3(b, 1.6, -5));
        g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.03, 6), arcMat));
      });
    },
    fabrik(g) {
      const wall = M("#7b8794"), roof = M("#4b5563");
      for (let i = 0; i < 3; i++) {
        box(2, 1.8, 2.4, wall, -3 + i * 2, 0.9, -6, g);
        prism(2, 0.8, 2.4, roof, -3 + i * 2, 1.8, -6, g).rotation.y = Math.PI / 2;
        windows(g, 0.3, 0.3, 3, 2, -3.6 + i * 2, 0.6, -4.78, litWin);
      }
      [-3.6, 2.6].forEach((x, i) => {
        cyl(0.25, 0.32, 3.2, M("#a33"), x, 1.6, -7, g, 10);
        const puffs = [];
        for (let k = 0; k < 6; k++) puffs.push(sph(0.25, M("#cfd8dc", { transparent: true, opacity: 0.6 }), x, 3.3, -7, g, 8));
        tickers.push((t) => {
          if (!g.visible) return;
          puffs.forEach((p, k) => { const s = ((t * 0.4 + k / 6 + i * 0.3) % 1); p.position.y = 3.3 + s * 3; p.position.x = x + s * 0.8; p.scale.setScalar(0.6 + s * 1.6); p.material.opacity = 0.6 * (1 - s); });
        });
      });
      const g1 = gear(0.8, 12, 0.25, M("#ff5d73", { metalness: 0.5, roughness: 0.4 }));
      g1.position.set(4.2, 2.4, -4.5); g.add(g1);
      const g2 = gear(0.5, 9, 0.25, M("#ffcc4d", { metalness: 0.5, roughness: 0.4 }));
      g2.position.set(5.35, 1.55, -4.5); g.add(g2);
      tickers.push((t) => { g1.rotation.z = t * 0.6; g2.rotation.z = -t * 0.6 * 1.33; });
    },
    werkstatt(g) {
      box(3, 0.12, 1.2, M("#8b5a2b"), 2.6, 1.0, -3.5, g);
      [[1.3, -3], [3.9, -3], [1.3, -4], [3.9, -4]].forEach(([x, z]) => box(0.1, 1, 0.1, M("#5a3b22"), x, 0.5, z, g));
      box(0.6, 0.35, 0.4, M("#d63031"), 2, 1.25, -3.5, g);
      box(2.6, 1.6, 0.08, M("#f5f6fa"), -1.5, 2.2, -5.5, g);
      [["#ffcc4d", 0.4], ["#5fd4ff", 0.1], ["#5be3a0", -0.2]].forEach(([c, y], i) => box(1.6 - i * 0.4, 0.14, 0.09, M(c), -1.7 + i * 0.2, 2.2 + y, -5.45, g));
      [-2.6, -0.4].forEach((x) => box(0.08, 1.4, 0.08, M("#555"), x, 0.7, -5.5, g));
      const gg = gear(0.6, 10, 0.2, M("#ffcc4d", { metalness: 0.5 }));
      gg.position.set(-4, 3, -4); g.add(gg);
      tickers.push((t) => { gg.rotation.z = t * 0.5; gg.position.y = 3 + Math.sin(t) * 0.2; });
    },
    zuhause(g) {
      box(3, 2, 2.4, M("#f3d9b1"), 0, 1, -6, g);
      const r = mesh(new THREE.ConeGeometry(2.4, 1.5, 4), M("#c0392b"), 0, 2.75, -6, g);
      r.rotation.y = Math.PI / 4;
      box(0.6, 1.1, 0.06, M("#7a4b2a"), 0, 0.55, -4.78, g);
      box(0.6, 0.5, 0.06, litWin, -0.95, 1.3, -4.78, g);
      box(0.6, 0.5, 0.06, litWin, 0.95, 1.3, -4.78, g);
      [[-3.6, -5], [3.8, -6.5], [-5, -8]].forEach(([x, z], i) => {
        cyl(0.15, 0.2, 1.2, M("#6b4226"), x, 0.6, z, g, 8);
        const crown = mesh(new THREE.IcosahedronGeometry(0.9, 0), M("#3fae5a"), x, 1.7, z, g);
        tickers.push((t) => { crown.rotation.y = Math.sin(t * 0.5 + i) * 0.2; });
      });
      for (let i = 0; i < 9; i++) box(0.08, 0.5, 0.08, M("#e8e8e8"), -4 + i, 0.25, -3.2, g);
      box(8.2, 0.06, 0.06, M("#e8e8e8"), 0, 0.42, -3.2, g);
    },
    amt(g, col) {
      const stone = M("#dcdde1");
      box(6, 0.3, 3.2, stone, 0, 0.15, -6, g);
      box(5.6, 0.3, 2.9, stone, 0, 0.45, -6, g);
      for (let i = 0; i < 6; i++) cyl(0.2, 0.22, 2.4, stone, -2.25 + i * 0.9, 1.8, -4.9, g, 12);
      box(5.6, 2.4, 1.8, M("#b2b6c2"), 0, 1.8, -6.5, g);
      box(5.8, 0.3, 3, stone, 0, 3.15, -6, g);
      prism(5.8, 1, 3, stone, 0, 3.3, -6, g);
      const docs = [];
      for (let i = 0; i < 6; i++) {
        const d = box(0.5, 0.7, 0.02, M("#ffffff", { emissive: col, emissiveIntensity: 0.15, side: THREE.DoubleSide }), 0, 0, 0, g);
        docs.push(d);
      }
      tickers.push((t) => {
        if (!g.visible) return;
        docs.forEach((d, i) => { const a = t * 0.4 + (i / docs.length) * Math.PI * 2; d.position.set(Math.cos(a) * 4.2, 3 + Math.sin(t + i) * 0.4, -5 + Math.sin(a) * 1.5); d.rotation.y = a; d.rotation.z = Math.sin(t + i) * 0.3; });
      });
    },
    schule(g) {
      const wall = M("#e7d7b5");
      box(6, 2.2, 2.2, wall, 0, 1.1, -6.5, g);
      windows(g, 0.45, 0.45, 6, 2, -2.4, 0.7, -5.38, litWin);
      box(1.2, 3.8, 1.2, wall, 0, 1.9, -6.2, g);
      const r = mesh(new THREE.ConeGeometry(1, 1.2, 4), M("#2fb67a"), 0, 4.4, -6.2, g);
      r.rotation.y = Math.PI / 4;
      cyl(0.38, 0.38, 0.05, M("#ffffff"), 0, 3.2, -5.58, g, 20).rotation.x = Math.PI / 2;
      const hand = box(0.04, 0.3, 0.02, M("#222"), 0, 3.2, -5.54, g);
      tickers.push((t) => { hand.rotation.z = -t * 0.8; hand.position.set(Math.sin(t * 0.8) * 0.13, 3.2 + Math.cos(t * 0.8) * 0.13, -5.54); });
      const books = [];
      const colors = ["#e74c3c", "#3498db", "#f1c40f", "#9b59b6", "#2ecc71"];
      for (let i = 0; i < 8; i++) books.push(box(0.5, 0.12, 0.38, M(colors[i % 5]), 0, 0, 0, g));
      tickers.push((t) => {
        if (!g.visible) return;
        books.forEach((b, i) => { const a = t * 0.35 + i; b.position.set(-4 + (i % 4) * 2.6, 2.2 + Math.sin(a) * 0.5 + (i > 3 ? 1.4 : 0), -3.5 - (i % 3)); b.rotation.set(Math.sin(a) * 0.4, a, Math.cos(a) * 0.3); });
      });
    },
    kurszentrum(g) {
      box(7, 2.6, 2.6, M("#8395a7"), 0, 1.3, -7, g);
      windows(g, 0.6, 0.35, 5, 2, -2.6, 0.9, -5.68, litWin);
      box(0.8, 0.5, 0.5, M("#2d3436", { metalness: 0.6 }), 3.2, 0.75, -4, g);
      box(0.5, 0.5, 0.4, M("#2d3436"), 3.2, 0.25, -4, g);
      const g1 = gear(0.9, 12, 0.25, M("#ff9a4d", { metalness: 0.5, roughness: 0.4 }));
      g1.position.set(-3.8, 3.4, -5); g.add(g1);
      const g2 = gear(0.55, 9, 0.25, M("#ffd23f", { metalness: 0.5, roughness: 0.4 }));
      g2.position.set(-2.55, 2.5, -5); g.add(g2);
      const sparks = [];
      for (let i = 0; i < 14; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: "#ffb347", blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
        s.scale.setScalar(0.15);
        g.add(s);
        sparks.push({ s, v: new THREE.Vector3(), life: 0 });
      }
      tickers.push((t, dt) => {
        g1.rotation.z = t * 0.5; g2.rotation.z = -t * 0.5 * 1.6;
        if (!g.visible) return;
        sparks.forEach((p) => {
          p.life -= dt;
          if (p.life <= 0) { p.life = rnd(0.4, 1); p.s.position.set(3.2, 1.05, -4); p.v.set(rnd(-1.5, 1.5), rnd(1.5, 3), rnd(-0.5, 1.5)); }
          p.v.y -= 6 * dt;
          p.s.position.addScaledVector(p.v, dt);
          p.s.material.opacity = Math.min(1, p.life * 2);
        });
      });
    },
    branche(g, col) {
      const tones = ["#34495e", "#2c3e50", "#3d4f66", "#46576e"];
      for (let i = 0; i < 9; i++) {
        const h = rnd(1.5, 4.2);
        const x = -5 + i * 1.25;
        const z = -6 - (i % 2) * 1.2;
        box(1.05, h, 1.05, M(tones[i % 4]), x, h / 2, z, g);
        windows(g, 0.16, 0.18, 3, Math.floor(h / 0.5), x - 0.29, 0.4, z + 0.53, litWin);
        if (i % 3 === 1) {
          cyl(0.02, 0.02, 0.8, M("#ddd"), x, h + 0.4, z, g, 6);
          const f = box(0.45, 0.28, 0.01, M(col, { side: THREE.DoubleSide }), x + 0.23, h + 0.65, z, g);
          tickers.push((t) => { f.rotation.y = Math.sin(t * 3 + i) * 0.4; });
        }
      }
    },
    bundeshaus(g) {
      const stone = M("#c9b99a"), green = M("#3f8f6b", { metalness: 0.3, roughness: 0.5 });
      box(8, 2.4, 2.6, stone, 0, 1.2, -7, g);
      windows(g, 0.35, 0.5, 8, 2, -3.2, 0.7, -5.68, litWin);
      box(2.6, 3, 2.8, stone, 0, 1.5, -6.8, g);
      cyl(1, 1.1, 0.6, stone, 0, 3.3, -6.8, g, 16);
      const dome = mesh(new THREE.SphereGeometry(1.05, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), green, 0, 3.6, -6.8, g);
      dome.castShadow = true;
      [-3.4, 3.4].forEach((x) => mesh(new THREE.SphereGeometry(0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), green, x, 2.4, -7, g));
      const flag = new THREE.Group();
      flag.position.set(0, 5.2, -6.8);
      cyl(0.03, 0.03, 1.4, M("#ddd"), 0, -0.3, 0, flag, 6);
      const red = box(0.6, 0.6, 0.02, M("#d52b1e", { side: THREE.DoubleSide }), 0.32, 0.15, 0, flag);
      box(0.36, 0.1, 0.03, M("#ffffff"), 0.32, 0.15, 0, flag);
      box(0.1, 0.36, 0.03, M("#ffffff"), 0.32, 0.15, 0, flag);
      g.add(flag);
      tickers.push((t) => { flag.rotation.y = Math.sin(t * 2) * 0.25; red.rotation.y = Math.sin(t * 4) * 0.1; });
    },
  };
  const envs = {};
  function getEnv(c) {
    if (!envs[c.id]) envs[c.id] = envGroup(ENV[c.env] || ENV.lernorte, c.color);
    return envs[c.id];
  }

  /* =====================================================================
     HAUPTMENÜ-, WISSENS- UND ARENA-KULISSEN
     ===================================================================== */
  const menuG = new THREE.Group();
  scene.add(menuG);
  menuG.visible = false;
  const island = new THREE.Group();
  menuG.add(island);
  cyl(3.4, 3.2, 0.5, M("#2b3a67"), 0, 0, 0, island, 9);
  cyl(3.25, 3.25, 0.08, M("#3fae5a"), 0, 0.28, 0, island, 9);
  mesh(new THREE.ConeGeometry(3.2, 3.6, 9), M("#1e2747"), 0, -2.05, 0, island).rotation.x = Math.PI;
  island.position.y = 0.2;
  function crystal(color, x) {
    const c = new THREE.Group();
    const m = mesh(new THREE.OctahedronGeometry(0.75, 0), M(color, { emissive: color, emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.2 }), 0, 0, 0, c);
    m.scale.y = 1.6;
    const l = new THREE.PointLight(color, 2.2, 10);
    c.add(l);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.7 }));
    halo.scale.setScalar(3.2);
    c.add(halo);
    c.position.set(x, 2.6, -0.6);
    menuG.add(c);
    return { c, m, l, halo };
  }
  const crysW = crystal("#2fd3ff", -2.3);
  const crysA = crystal("#ff5a1f", 2.3);
  let menuSide = null;
  const rocks = [];
  for (let i = 0; i < 9; i++) {
    const r = mesh(new THREE.DodecahedronGeometry(rnd(0.2, 0.5), 0), M("#2b3a67"), 0, 0, 0, menuG);
    rocks.push({ r, a: (i / 9) * Math.PI * 2, rad: rnd(4.5, 6.5), y: rnd(0.5, 4) });
  }

  const wissenG = new THREE.Group();
  scene.add(wissenG);
  wissenG.visible = false;
  const wBooks = [];
  const wBooksG = new THREE.Group();
  wissenG.add(wBooksG);
  const bcol = ["#5fd4ff", "#9b8cff", "#5be3a0", "#ffcc4d", "#ff8fb1"];
  for (let i = 0; i < 16; i++) {
    const b = new THREE.Group();
    box(0.7, 0.16, 0.5, M(bcol[i % 5], { emissive: bcol[i % 5], emissiveIntensity: 0.15 }), 0, 0, 0, b);
    box(0.66, 0.12, 0.46, M("#f5f0e1"), 0.03, 0, 0, b);
    wBooksG.add(b);
    wBooks.push({ b, a: (i / 16) * Math.PI * 2, rad: rnd(5, 9), y: rnd(1, 6), s: rnd(0.1, 0.25) });
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(6, 0.05, 8, 80), new THREE.MeshBasicMaterial({ color: "#5fd4ff", transparent: true, opacity: 0.5 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.05, -2);
  wissenG.add(ring);
  const wPillars = new THREE.Group();
  wissenG.add(wPillars);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const p = mesh(new THREE.CylinderGeometry(0.35, 0.45, 5, 6), M("#16486b", { emissive: "#0b3550" }), Math.cos(a) * 9, 2.5, -4 + Math.sin(a) * 6, wPillars);
    p.rotation.y = a;
  }

  const arenaG = new THREE.Group();
  scene.add(arenaG);
  arenaG.visible = false;
  const lava = M("#3a0d05", { emissive: "#ff3d00", emissiveIntensity: 0.35 });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = mesh(new THREE.DodecahedronGeometry(rnd(0.8, 2.2), 0), i % 3 ? M("#2a1210") : lava, Math.cos(a) * rnd(9, 14), rnd(0, 1.5), -6 + Math.sin(a) * rnd(6, 10), arenaG);
    r.rotation.set(rnd(0, 3), rnd(0, 3), 0);
  }
  const torches = [];
  [[-5, -2], [5, -2], [-7, -7], [7, -7]].forEach(([x, z]) => {
    cyl(0.15, 0.25, 2.2, M("#2a1210"), x, 1.1, z, arenaG, 6);
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: "#ff8a1f", blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    f.position.set(x, 2.5, z);
    f.scale.setScalar(1.4);
    arenaG.add(f);
    const l = new THREE.PointLight("#ff6a1f", 1.4, 9);
    l.position.set(x, 2.6, z);
    arenaG.add(l);
    torches.push({ f, l });
  });
  const arenaRing = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.5, 48), new THREE.MeshBasicMaterial({ color: "#ff5a1f", transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  arenaRing.rotation.x = -Math.PI / 2;
  arenaRing.position.y = 0.03;
  arenaG.add(arenaRing);

  /* =====================================================================
     KARUSSELL & BÜHNE
     ===================================================================== */
  const carousel = new THREE.Group();
  scene.add(carousel);
  carousel.visible = false;
  let carChars = [];
  let carIndex = 0, carTurn = 0, carAngle = 0;
  const CAR_R = 4.3;
  const plat = cyl(CAR_R + 1, CAR_R + 1.2, 0.3, M("#13294a", { metalness: 0.3 }), 0, 0.15, 0, carousel, 48);
  const platRing = new THREE.Mesh(new THREE.TorusGeometry(CAR_R + 1.05, 0.04, 6, 80), new THREE.MeshBasicMaterial({ color: "#5fd4ff" }));
  platRing.rotation.x = Math.PI / 2;
  platRing.position.y = 0.31;
  carousel.add(platRing);
  const ped = [];
  let charList = [];

  function buildCarousel(list) {
    if (carChars.length) return;
    charList = list;
    const n = list.length;
    list.forEach((c, i) => {
      const a = (i / n) * Math.PI * 2;
      const ch = getChar(c, "car");
      ch.obj.position.set(Math.sin(a) * CAR_R, 0.3, Math.cos(a) * CAR_R);
      ch.obj.rotation.y = a;
      carousel.add(ch.obj);
      const pd = cyl(0.62, 0.7, 0.12, M(c.color, { emissive: c.color, emissiveIntensity: 0.35 }), Math.sin(a) * CAR_R, 0.36, Math.cos(a) * CAR_R, carousel, 24);
      ped.push(pd);
      carChars.push(ch);
    });
  }

  const stage = new THREE.Group();
  scene.add(stage);
  let stageChar = null;
  const stagePed = cyl(0.9, 1.0, 0.25, M("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.2 }), 0, 0.12, 0, stage, 32);
  const stageGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: "#ffffff", blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.5 }));
  stageGlow.scale.set(4, 1.2, 1);
  stageGlow.position.y = 0.3;
  stage.add(stageGlow);
  stage.visible = false;
  function putOnStage(c) {
    if (stageChar) stage.remove(stageChar.obj);
    stageChar = getChar(c, "stage");
    stageChar.obj.position.set(0, 0.25, 0);
    stageChar.obj.rotation.y = 0.35;
    stage.add(stageChar.obj);
    stagePed.material = M(c.color, { emissive: c.color, emissiveIntensity: 0.35 });
    stageGlow.material.color = C(c.color);
    stageChar.rigs.forEach((r) => (r.jump = 0.8));
  }

  // Menü-Helden: Lernende/r und Berufsbildner/in auf der Insel
  let menuHeroes = [];

  /* =====================================================================
     DER QV-DRACHE
     ===================================================================== */
  const dragon = (() => {
    const g = new THREE.Group();
    const scale = new THREE.Group();
    g.add(scale);
    const body = M("#9e1b1b", { emissive: "#2a0000", roughness: 0.5 });
    const belly = M("#e8a33d", { roughness: 0.6 });
    const horn = M("#f2e6c9");
    const eyeM = new THREE.MeshBasicMaterial({ color: "#ffe14d" });
    const segs = [];
    const N = 14;
    for (let i = 0; i < N; i++) {
      const r = i < 3 ? 0.36 - i * 0.03 : Math.max(0.07, 0.55 - (i - 3) * 0.045);
      const s = sph(r, body, 0, 0, -i * 0.42, scale, 10);
      if (i >= 3 && i < 9) sph(r * 0.8, belly, 0, -r * 0.35, -i * 0.42, s.parent, 8).userData.bellyOf = i;
      // Rückenstacheln
      if (i > 1 && i < N - 1) {
        const sp = mesh(new THREE.ConeGeometry(r * 0.35, r * 0.9, 4), horn, 0, r * 0.95, 0, s);
        sp.rotation.x = -0.4;
      }
      segs.push(s);
    }
    scale.children.filter((c) => c.userData.bellyOf != null).forEach((b) => { b.userData.seg = segs[b.userData.bellyOf]; });
    // Kopf
    const head = new THREE.Group();
    head.position.set(0, 0.35, 0.45);
    scale.add(head);
    const skull = sph(0.42, body, 0, 0, 0, head, 12);
    skull.scale.set(1, 0.85, 1.1);
    const snout = box(0.46, 0.26, 0.6, body, 0, -0.05, 0.5, head);
    const jaw = new THREE.Group();
    jaw.position.set(0, -0.18, 0.15);
    head.add(jaw);
    box(0.42, 0.1, 0.62, belly, 0, -0.04, 0.32, jaw);
    for (let i = 0; i < 4; i++) {
      const tooth = mesh(new THREE.ConeGeometry(0.03, 0.09, 4), horn, -0.15 + i * 0.1, 0.04, 0.6, jaw);
      tooth.castShadow = false;
    }
    [-1, 1].forEach((s) => {
      const h = mesh(new THREE.ConeGeometry(0.08, 0.55, 6), horn, s * 0.22, 0.38, -0.15, head);
      h.rotation.set(-0.9, 0, s * -0.3);
      const e = mesh(new THREE.SphereGeometry(0.075, 8, 6), eyeM, s * 0.2, 0.12, 0.3, head);
      e.castShadow = false;
      box(0.05, 0.02, 0.05, M("#300"), s * 0.1, 0.02, 0.8, head);
    });
    const mouthPos = new THREE.Object3D();
    mouthPos.position.set(0, -0.12, 0.85);
    head.add(mouthPos);
    // Flügel
    const wingMat = M("#6b1010", { side: THREE.DoubleSide, emissive: "#200000", transparent: true, opacity: 0.95 });
    function wing(side) {
      const w = new THREE.Group();
      w.position.set(side * 0.3, 0.3, -0.9);
      const shp = new THREE.Shape();
      shp.moveTo(0, 0);
      shp.lineTo(2.6, 0.9);
      shp.lineTo(2.3, -0.2);
      shp.lineTo(1.7, -0.5);
      shp.lineTo(1.1, -0.65);
      shp.lineTo(0.5, -0.9);
      shp.lineTo(0, -0.6);
      const geo = new THREE.ShapeGeometry(shp);
      const memb = new THREE.Mesh(geo, wingMat);
      memb.castShadow = true;
      if (side < 0) memb.scale.x = -1;
      w.add(memb);
      const bone = mesh(new THREE.CylinderGeometry(0.04, 0.07, 2.75, 6), M("#4a0a0a"), side * 1.3, 0.45, 0.02, w);
      bone.rotation.z = Math.PI / 2 + side * 0.33;
      w.rotation.x = -0.35;
      scale.add(w);
      return w;
    }
    const wL = wing(-1), wR = wing(1);
    // Beine
    [-1, 1].forEach((s) => { const l = mesh(new THREE.CapsuleGeometry(0.09, 0.3, 3, 6), body, s * 0.28, -0.45, -1.4, scale); l.rotation.x = 0.6; });
    scale.scale.setScalar(1.6);
    g.visible = false;
    scene.add(g);
    return { g, scale, segs, head, jaw, wL, wR, mouthPos, body, state: "fly", t0: 0, hp: 1, base: new THREE.Vector3(0, 3.4, -6) };
  })();

  /* ---------- Feuer & Effekte ---------- */
  const fx = [];
  const FXN = 260;
  for (let i = 0; i < FXN; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: "#ffffff", blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    s.visible = false;
    scene.add(s);
    fx.push({ s, v: new THREE.Vector3(), life: 0, max: 1, kind: "fire", size: 1 });
  }
  let fxi = 0;
  function emit(pos, vel, life, kind, size) {
    const p = fx[fxi = (fxi + 1) % FXN];
    p.s.position.copy(pos);
    p.v.copy(vel);
    p.life = p.max = life;
    p.kind = kind;
    p.size = size;
    p.s.visible = true;
    return p;
  }
  let shake = 0;
  let breathing = 0, breathFired = false;
  let projectile = null;
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();

  function dragonUpdate(t, dt) {
    const d = dragon;
    if (!d.g.visible) return;
    const st = d.state;
    const flap = st === "die" ? 0 : Math.sin(t * (st === "breath" ? 9 : 6));
    d.wL.rotation.z = 0.1 + flap * 0.55;
    d.wR.rotation.z = -0.1 - flap * 0.55;
    d.segs.forEach((s, i) => {
      s.position.y = Math.sin(t * 3 - i * 0.55) * 0.12 * (i / 4);
      s.position.x = Math.sin(t * 2 - i * 0.45) * 0.1 * (i / 3);
    });
    d.scale.children.forEach((c) => { if (c.userData.seg) { c.position.y = c.userData.seg.position.y - 0.15; c.position.x = c.userData.seg.position.x; } });
    let target;
    const wander = new THREE.Vector3(Math.sin(t * 0.45) * 3.0, 2.75 + Math.sin(t * 1.1) * 0.45, -6 + Math.sin(t * 0.7) * 1.2);
    if (st === "fly" || st === "roar") {
      target = wander;
      d.g.rotation.y = lerp(d.g.rotation.y, -Math.cos(t * 0.45) * 0.5, 0.05);
      d.g.rotation.z = lerp(d.g.rotation.z, Math.cos(t * 0.45) * 0.3, 0.05);
      d.g.rotation.x = lerp(d.g.rotation.x, 0, 0.05);
      d.jaw.rotation.x = lerp(d.jaw.rotation.x, st === "roar" ? 0.55 : 0.05 + Math.max(0, Math.sin(t * 1.3)) * 0.1, 0.15);
      if (st === "roar" && t - d.t0 > 1.6) d.state = "fly";
    } else if (st === "breath") {
      target = new THREE.Vector3(0, 2.3, -2.4);
      d.g.rotation.y = lerp(d.g.rotation.y, 0, 0.1);
      d.g.rotation.z = lerp(d.g.rotation.z, 0, 0.1);
      d.g.rotation.x = lerp(d.g.rotation.x, 0.15, 0.1);
      const el = t - d.t0;
      d.jaw.rotation.x = lerp(d.jaw.rotation.x, el > 0.5 ? 0.7 : 0.2, 0.2);
      if (el > 0.55 && el < 1.9) {
        d.mouthPos.getWorldPosition(tmp);
        const count = Math.min(60, Math.ceil(dt * 360));
        for (let k = 0; k < count; k++) {
          tmp2.copy(camera.position).add(new THREE.Vector3(rnd(-0.8, 0.8), rnd(-0.9, 0.4), 0)).sub(tmp).normalize().multiplyScalar(rnd(7, 10));
          tmp2.x += rnd(-1, 1); tmp2.y += rnd(-0.8, 0.8);
          emit(tmp, tmp2, rnd(0.6, 0.9), "fire", rnd(0.4, 0.7));
        }
        if (!breathFired && el > 1.05) { breathFired = true; shake = 0.35; World.onScorch && World.onScorch(); }
      }
      if (el > 2.5) d.state = "fly";
    } else if (st === "hit") {
      target = d.g.position.clone();
      const el = t - d.t0;
      d.g.rotation.x = lerp(d.g.rotation.x, el < 0.4 ? -0.6 : 0, 0.15);
      d.body.emissive.setRGB(el < 0.25 ? 1 : 0.16, el < 0.25 ? 1 : 0, el < 0.25 ? 1 : 0);
      if (el > 0.25) d.body.emissive.set("#2a0000");
      if (el > 1) d.state = "fly";
    } else if (st === "die") {
      const el = t - d.t0;
      target = d.g.position.clone();
      target.y = Math.max(0.4, 3.4 - el * el * 1.6);
      d.g.rotation.z += dt * 3;
      d.g.rotation.x = lerp(d.g.rotation.x, 0.9, 0.05);
      d.jaw.rotation.x = 0.6;
      if (el > 1.6 && !d.exploded) {
        d.exploded = true;
        d.g.getWorldPosition(tmp);
        for (let k = 0; k < 120; k++) emit(tmp, new THREE.Vector3(rnd(-1, 1), rnd(-0.2, 1.2), rnd(-1, 1)).normalize().multiplyScalar(rnd(3, 9)), rnd(0.8, 1.6), k % 2 ? "fire" : "gold", rnd(0.4, 1));
        shake = 0.5;
        d.g.visible = false;
        World.onDefeated && World.onDefeated();
      }
    }
    d.g.position.lerp(target, 1 - Math.exp(-dt * (st === "breath" ? 4 : st === "die" ? 6 : 1.8)));
  }

  /* =====================================================================
     KAMERA & MODI
     ===================================================================== */
  const camPos = new THREE.Vector3(0, 2.4, 10);
  const camLook = new THREE.Vector3(0, 1.5, 0);
  const camTgtPos = camPos.clone();
  const camTgtLook = camLook.clone();
  let curMode = null;
  let orbit = 0;
  let arenaHero = null;

  const api = {
    ok: true,
    onScorch: null,
    onDefeated: null,
    mode(name, o = {}) {
      curMode = name;
      show(menuG, name === "menu");
      show(wissenG, name === "wissen" || name === "carousel");
      show(arenaG, name === "arena" || name === "boss");
      show(carousel, name === "carousel");
      show(stage, name === "character");
      wPillars.visible = wBooksG.visible = name !== "carousel";
      Object.values(envs).forEach((e) => show(e, false));
      if (name !== "boss") { dragon.g.visible = false; }
      if (arenaHero && !(name === "arena" && o.hero)) { arenaG.remove(arenaHero.obj); arenaHero = null; }
      spot.intensity = 0;
      if (name === "menu") {
        setTheme(THEMES.menu);
        if (!menuHeroes.length && o.heroes) {
          o.heroes.forEach((c, i) => {
            const ch = getChar(c, "menu");
            ch.obj.position.set(i ? 0.8 : -0.8, 0.52, 0.6);
            ch.obj.rotation.y = i ? -0.3 : 0.3;
            island.add(ch.obj);
            menuHeroes.push(ch);
          });
        }
        camTgtPos.set(0, 2.6, 10.5);
        camTgtLook.set(0, 2.0, 0);
        api.menuSide(o.side || null);
      } else if (name === "wissen") {
        setTheme(THEMES.wissen);
        camTgtPos.set(0, 3.2, 11);
        camTgtLook.set(0, 2.2, 0);
      } else if (name === "arena") {
        setTheme(THEMES.arena);
        camTgtPos.set(0, 3, 10);
        camTgtLook.set(0, 1.6, 0);
        if (o.hero) {
          camTgtPos.set(0, 1.9, 5.6);
          camTgtLook.set(0, 0.55, 0);
          if (arenaHero) arenaG.remove(arenaHero.obj);
          arenaHero = getChar(o.hero, "arena");
          arenaHero.obj.position.set(0, 0, 0);
          arenaHero.obj.rotation.y = 0;
          arenaG.add(arenaHero.obj);
          arenaHero.rigs.forEach((r) => (r.jump = 0.8));
        }
      } else if (name === "carousel") {
        buildCarousel(o.chars);
        api.rotateTo(o.index || 0, true);
        camTgtPos.set(0, 2.5, CAR_R + 5.4);
        camTgtLook.set(0, 0.75, CAR_R - 1.2);
        spot.intensity = 2.2;
        spot.position.set(0, 7, CAR_R + 2);
        spot.target.position.set(0, 0, CAR_R);
      } else if (name === "character") {
        const c = o.char;
        setTheme(themeFromColor(c.color));
        putOnStage(c);
        stage.position.set(-2.2, 0, 1.2);
        const env = getEnv(c);
        env.position.set(-2.6, 0, 0.8);
        show(env, true);
        camTgtPos.set(0.2, 2.1, 7.6);
        camTgtLook.set(0.2, 1.4, 0);
        spot.intensity = 2.4;
        spot.position.set(-2.2, 7, 4);
        spot.target.position.set(-2.2, 0, 1.2);
      } else if (name === "boss") {
        setTheme(THEMES.arena);
        dragon.g.visible = true;
        dragon.exploded = false;
        dragon.state = "roar";
        dragon.t0 = clock.elapsedTime;
        dragon.g.position.set(0, 9, -16);
        dragon.g.rotation.set(0, 0, 0);
        dragon.body.emissive.set("#2a0000");
        camTgtPos.set(0, 1.7, 7);
        camTgtLook.set(0, 2.5, -4);
        shake = 0.2;
      }
    },
    rotateTo(i, instant = false) {
      const n = carChars.length || 1;
      let d = i - carIndex;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      carTurn += d;
      carIndex = i;
      if (instant) carAngle = -carTurn * ((Math.PI * 2) / n);
      const c = charList[i];
      if (c) setTheme(themeFromColor(c.color));
      const ch = carChars[i];
      if (ch) ch.rigs.forEach((r) => (r.jump = 0.8));
    },
    menuSide(side) {
      menuSide = side;
      camTgtPos.x = side === "wissen" ? -0.9 : side === "arena" ? 0.9 : 0;
    },
    cheer() {
      if (arenaHero) arenaHero.rigs.forEach((r) => (r.jump = 0.8));
      if (stageChar) stageChar.rigs.forEach((r) => (r.jump = 0.8));
    },
    dragonRoar() { dragon.state = "roar"; dragon.t0 = clock.elapsedTime; shake = 0.15; },
    dragonBreath() { dragon.state = "breath"; dragon.t0 = clock.elapsedTime; breathFired = false; },
    dragonHit() {
      // Wissensblitz fliegt von der Kamera zum Drachen
      projectile = { p: camera.position.clone().add(new THREE.Vector3(0, -0.6, -0.5)), life: 0 };
    },
    dragonDie() { dragon.state = "die"; dragon.t0 = clock.elapsedTime; },
  };

  /* =====================================================================
     RENDER-LOOP
     ===================================================================== */
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 60 : 42;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  let frames = 0;
  // Diagnose-Anzeige nur mit ?dbg in der URL
  const DBG = location.search.includes("dbg") ? document.body.appendChild(Object.assign(document.createElement("div"), { style: "position:fixed;left:8px;bottom:8px;z-index:99;font:12px monospace;color:#0f0;background:#000a;padding:4px 8px" })) : null;
  function tick() {
    const dt = Math.min(clock.getDelta(), DBG ? 0.6 : 0.1);
    const t = clock.elapsedTime;

    // Farben weich überblenden
    if (tgt) {
      const k = Math.min(1, dt * 2.5);
      for (const key of Object.keys(cur)) cur[key].lerp(tgt[key], k);
      skyU.top.value.copy(cur.top);
      skyU.bottom.value.copy(cur.bottom);
      scene.fog.color.copy(cur.fog);
      groundMat.color.copy(cur.ground);
      groundMat.emissive.copy(cur.ground).multiplyScalar(pMode === "embers" ? 1.2 : 0.3);
      grid.material.color.copy(cur.grid);
      rim.color.copy(cur.rim);
      pMat.color.copy(cur.p);
      hemi.color.copy(cur.hemi);
    }
    // Gruppen ein-/ausblenden
    faders.forEach((g) => {
      const s = (g.userData.s = lerp(g.userData.s, g.userData.target, Math.min(1, dt * 6)));
      g.scale.setScalar(Math.max(0.001, s));
      if (g.userData.target === 0 && s < 0.02) { g.visible = false; faders.delete(g); }
      if (g.userData.target === 1 && s > 0.995) { g.scale.setScalar(1); faders.delete(g); }
    });
    // Partikel
    const pa = pGeo.attributes.position.array;
    for (let i = 0; i < PN; i++) {
      if (pMode === "embers") {
        pa[i * 3 + 1] += pSpd[i] * dt * 1.6;
        pa[i * 3] += Math.sin(t + i) * dt * 0.3;
        if (pa[i * 3 + 1] > 14) pa[i * 3 + 1] = 0;
      } else {
        pa[i * 3 + 1] += Math.sin(t * 0.5 + i) * dt * 0.08;
      }
    }
    pGeo.attributes.position.needsUpdate = true;
    pMat.size = pMode === "embers" ? 0.14 : 0.09;

    // Menü
    if (menuG.visible) {
      island.position.y = 0.2 + Math.sin(t * 0.8) * 0.12;
      island.rotation.y = Math.sin(t * 0.2) * 0.15;
      [[crysW, "wissen"], [crysA, "arena"]].forEach(([c, side], i) => {
        const act = menuSide === side;
        c.m.rotation.y = t * (act ? 1.6 : 0.6);
        c.c.position.y = 2.6 + Math.sin(t * 1.3 + i * 2) * 0.2;
        const s = lerp(c.c.scale.x, act ? 1.35 : 0.9, 0.08);
        c.c.scale.setScalar(s);
        c.l.intensity = act ? 3.2 : 1.2;
        c.halo.material.opacity = act ? 0.9 : 0.4;
      });
      rocks.forEach((r, i) => { const a = r.a + t * 0.12; r.r.position.set(Math.cos(a) * r.rad, r.y + Math.sin(t + i) * 0.3, Math.sin(a) * r.rad - 1); r.r.rotation.x = t * 0.3 + i; });
      menuHeroes.forEach((h, i) => animateChar(h, t, (menuSide === "wissen" && i === 1) || (menuSide === "arena" && i === 0), dt));
    }
    // Wissen
    if (wissenG.visible) {
      wBooks.forEach((b, i) => { const a = b.a + t * b.s; b.b.position.set(Math.cos(a) * b.rad * 1.3, b.y + Math.sin(t * 0.7 + i) * 0.3, Math.sin(a) * b.rad * 0.6 - 8); b.b.rotation.set(Math.sin(t + i) * 0.3, -a, 0); });
      ring.material.opacity = 0.35 + Math.sin(t * 2) * 0.15;
    }
    // Arena
    if (arenaG.visible) {
      torches.forEach((tc, i) => { const f = 1.2 + Math.sin(t * 13 + i) * 0.15 + Math.sin(t * 7 + i * 3) * 0.1; tc.f.scale.setScalar(f); tc.l.intensity = 1.2 + Math.sin(t * 11 + i) * 0.3; });
      arenaRing.material.opacity = 0.4 + Math.sin(t * 3) * 0.15;
      if (arenaHero) animateChar(arenaHero, t, true, dt);
    }
    // Karussell
    if (carousel.visible && carChars.length) {
      const n = carChars.length;
      carAngle = lerp(carAngle, -carTurn * ((Math.PI * 2) / n), Math.min(1, dt * 5));
      carousel.rotation.y = carAngle;
      carChars.forEach((ch, i) => {
        const act = i === carIndex;
        const bs = ch.obj.userData.baseScale;
        const s = lerp(ch.obj.scale.x, bs * (act ? 1.18 : 0.95), 0.1);
        ch.obj.scale.setScalar(s);
        animateChar(ch, t, act, dt);
      });
      platRing.material.color.copy(cur.grid);
    }
    // Bühne
    if (stage.visible && stageChar) {
      animateChar(stageChar, t, true, dt);
      stageChar.obj.rotation.y = 0.35 + Math.sin(t * 0.4) * 0.25;
    }
    tickers.forEach((fn) => fn(t, dt));

    // Drache, Projektil, Effekte
    dragonUpdate(t, dt);
    if (projectile) {
      dragon.head.getWorldPosition(tmp);
      projectile.life += dt;
      projectile.p.lerp(tmp, Math.min(1, dt * 5));
      emit(projectile.p, new THREE.Vector3(rnd(-0.5, 0.5), rnd(-0.5, 0.5), rnd(-0.5, 0.5)), 0.35, "bolt", 0.9);
      if (projectile.p.distanceTo(tmp) < 0.5 || projectile.life > 1.2) {
        for (let k = 0; k < 50; k++) emit(tmp, new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize().multiplyScalar(rnd(2, 6)), rnd(0.4, 0.8), k % 2 ? "bolt" : "gold", rnd(0.3, 0.6));
        dragon.state = "hit";
        dragon.t0 = t;
        shake = 0.15;
        projectile = null;
        World.onImpact && World.onImpact();
      }
    }
    fx.forEach((p) => {
      if (p.life <= 0) { if (p.s.visible) p.s.visible = false; return; }
      p.life -= dt;
      const k = 1 - p.life / p.max;
      p.s.position.addScaledVector(p.v, dt);
      if (p.kind === "fire") {
        p.v.multiplyScalar(0.985);
        p.s.material.color.setHSL(0.13 - k * 0.13, 1, 0.65 - k * 0.35);
        p.s.scale.setScalar(p.size * (0.6 + k * 2.4));
      } else if (p.kind === "bolt") {
        p.s.material.color.setHSL(0.55, 1, 0.75 - k * 0.3);
        p.s.scale.setScalar(p.size * (1 - k * 0.7));
      } else {
        p.v.y -= 4 * dt;
        p.s.material.color.setHSL(0.12, 1, 0.65);
        p.s.scale.setScalar(p.size * (1 - k));
      }
      p.s.material.opacity = Math.min(1, (1 - k) * 1.4);
    });

    // Kamera
    orbit += dt;
    const k = Math.min(1, dt * 2.2);
    camPos.lerp(camTgtPos, k);
    camLook.lerp(camTgtLook, k);
    camera.position.copy(camPos);
    if (curMode === "wissen") { camera.position.x += Math.sin(orbit * 0.15) * 1.2; camera.position.y += Math.sin(orbit * 0.2) * 0.2; }
    if (curMode === "arena") camera.position.x += Math.sin(orbit * 0.2) * 0.8;
    if (shake > 0) {
      shake = Math.max(0, shake - dt * 0.8);
      camera.position.x += rnd(-1, 1) * shake;
      camera.position.y += rnd(-1, 1) * shake;
    }
    camera.lookAt(camLook);

    renderer.render(scene, camera);
    frames++;
    if (DBG && frames % 5 === 0) DBG.textContent = `sim ${t.toFixed(1)}s · ${frames} frames · drache y ${dragon.g.position.y.toFixed(2)}`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return api;
})();
