/* 3D-Welt hinter der App – Three.js r149 (lokal in vendor/three.min.js, läuft offline).
   Alles ist prozedural gebaut: keine Modelle, keine Textur-Dateien.
   Kulisse: Vierwaldstättersee mit Kapellbrücke, Wasserturm, Altstadt, Museggmauer, Pilatus & Alpen.
   API für main.js:  World.mode(name, opts) · World.rotateTo(i) · World.menuSide(side) · World.cheer()
                     World.boss* (PrintNightmare-Drucker) · Callbacks World.onScorch / onImpact / onDefeated */
window.World = (() => {
  "use strict";
  const noop = () => {};
  const stub = { ok: false, mode: noop, rotateTo: noop, bossAttack: noop, bossHit: noop, bossDie: noop, bossRoar: noop, cheer: noop, menuSide: noop, onScorch: null, onImpact: null };
  if (!window.THREE) return stub;
  const canvas = document.getElementById("scene");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    return stub;
  }
  document.body.classList.add("has-3d");
  // Moderne Farb-Pipeline: Farben in sRGB angeben, linear rechnen, filmisch ausgeben
  if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  // Auflösung: max. 1.5× (scharf genug für Beamer), passt sich bei Ruckeln automatisch an
  let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const MAX_ANISO = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1400);
  const clock = new THREE.Clock();
  const C = (c) => new THREE.Color(c);
  const lerp = (a, b, k) => a + (b - a) * k;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const TAU = Math.PI * 2;

  /* ---------- Rauschen (für Gelände & Berge) ---------- */
  function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, o = 4) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < o; i++) { s += a * vnoise(x * f, y * f); f *= 2.03; a *= 0.5; } return s; }
  let seed = 7;
  const srnd = (a, b) => { seed = (seed * 16807) % 2147483647; return a + ((seed - 1) / 2147483646) * (b - a); };

  /* ---------- Material- & Mesh-Helfer ---------- */
  const matCache = {};
  function M(color, o = {}) {
    const key = color + JSON.stringify(o);
    if (!matCache[key]) matCache[key] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.62, metalness: 0.04 }, o));
    return matCache[key];
  }
  const F = (color, o = {}) => M(color, Object.assign({ flatShading: true }, o)); // Low-Poly-Look
  function mesh(geo, mat, x = 0, y = 0, z = 0, parent = null) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    if (parent) parent.add(m);
    return m;
  }
  // Geometrien werden geteilt (gleiche Masse = ein Puffer auf der Grafikkarte)
  const geoCache = {};
  const G = (key, make) => geoCache[key] || (geoCache[key] = make());
  const box = (w, h, d, mat, x, y, z, p) => mesh(G(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d)), mat, x, y, z, p);
  const cyl = (rt, rb, h, mat, x, y, z, p, seg = 20) => mesh(G(`c${rt},${rb},${h},${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg)), mat, x, y, z, p);
  const sph = (r, mat, x, y, z, p, seg = 20) => mesh(G(`s${r},${seg}`, () => new THREE.SphereGeometry(r, seg, Math.max(8, Math.round(seg * 0.7)))), mat, x, y, z, p);
  function prism(w, h, d, mat, x, y, z, p) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    return mesh(g, mat, x, y, z, p);
  }
  function gear(r, teeth, depth, mat) {
    const g = new THREE.Group();
    cyl(r, r, depth, mat, 0, 0, 0, g, 28).rotation.x = Math.PI / 2;
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * TAU;
      const t = box(r * 0.28, r * 0.34, depth, mat, Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08, 0, g);
      t.rotation.z = a;
    }
    cyl(r * 0.3, r * 0.3, depth * 1.2, M("#1b1f2e"), 0, 0, 0, g, 16).rotation.x = Math.PI / 2;
    return g;
  }
  function canvasTex(w, h, draw, srgb = true) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.encoding = THREE.sRGBEncoding;
    t.anisotropy = MAX_ANISO;
    return t;
  }
  const GLOW = canvasTex(64, 64, (x) => {
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.35, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
  }, false);
  const glowSprite = (color, s, opacity = 1) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity }));
    sp.scale.setScalar(s);
    return sp;
  };
  const isShown = (o) => { while (o) { if (!o.visible) return false; o = o.parent; } return true; };

  /* ---------- Fahnen (Stoff weht per Vertex-Welle) ---------- */
  const flags = [];
  function clothFlag(w, h, mat, phase = Math.random() * 6) {
    const geo = new THREE.PlaneGeometry(w, h, 14, 6);
    geo.translate(w / 2, 0, 0);
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.userData = { base: Float32Array.from(geo.attributes.position.array), w, phase };
    flags.push(m);
    return m;
  }
  function waveFlags(t) {
    flags.forEach((f) => {
      if (!isShown(f)) return;
      const pos = f.geometry.attributes.position, b = f.userData.base, w = f.userData.w;
      for (let i = 0; i < pos.count; i++) {
        const x = b[i * 3], k = x / w;
        pos.array[i * 3 + 2] = Math.sin(x * (7 / w) - t * 6.5 + f.userData.phase) * 0.09 * w * k + Math.sin(t * 2.1 + x * 3) * 0.02 * w * k;
        pos.array[i * 3 + 1] = b[i * 3 + 1] - k * k * 0.06 * w;
      }
      pos.needsUpdate = true;
      f.geometry.computeVertexNormals();
    });
  }
  const flagTex = {
    // Luzern wie im Wappen: senkrecht gespalten – Blau an der Stange, Weiss aussen
    luzern: canvasTex(128, 128, (x, w, h) => { x.fillStyle = "#1f6fc5"; x.fillRect(0, 0, w / 2, h); x.fillStyle = "#ffffff"; x.fillRect(w / 2, 0, w / 2, h); }),
    schweiz: canvasTex(128, 128, (x, w, h) => { x.fillStyle = "#d52b1e"; x.fillRect(0, 0, w, h); x.fillStyle = "#fff"; x.fillRect(w * 0.4, h * 0.19, w * 0.2, h * 0.62); x.fillRect(w * 0.19, h * 0.4, w * 0.62, h * 0.2); }),
    oda: canvasTex(256, 160, (x, w, h) => { x.fillStyle = "#d94848"; x.fillRect(0, 0, w, h); x.fillStyle = "#fff"; x.font = "bold 78px Segoe UI, Arial"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("OdA", w / 2, h / 2 + 4); }),
  };
  const flagMat = (tex) => new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.85 });
  function flagPole(h, tex, w = 1.1, fh = 0.72) {
    const g = new THREE.Group();
    cyl(0.04, 0.05, h, M("#e8e8ee", { metalness: 0.6, roughness: 0.3 }), 0, h / 2, 0, g, 10);
    sph(0.07, M("#ffd23f", { metalness: 0.7, roughness: 0.3 }), 0, h + 0.04, 0, g, 12);
    const f = clothFlag(w, fh, flagMat(tex));
    f.position.set(0.04, h - fh / 2 - 0.05, 0);
    g.add(f);
    return g;
  }

  /* ---------- Code-Textur (für Informatik) ---------- */
  const CODE = [
    "// Lehre Informatiker/in EFZ",
    "const lehre = new Grundbildung({",
    "  beruf: \"Informatiker/in EFZ\",",
    "  semester: 8, lernorte: 3",
    "});",
    "",
    "for (const sem of lehre.semester) {",
    "  bb.bildungsbericht(sem);",
    "  lernende.lerndoku.update();",
    "  if (sem.ende) bb.feedback();",
    "}",
    "",
    "const ipa = await lernende.ipa(80);",
    "if (ipa.note >= 4 && en.ict >= 4",
    "    && gesamt >= 4) {",
    "  qv.bestanden = true; // 🎉",
    "}",
    "",
    "deploy(lehre.fachrichtung, [",
    "  \"Plattformentwicklung\",",
    "  \"Applikationsentwicklung\",",
    "]);",
  ];
  const KW = /\b(const|new|for|if|await|true|of)\b/g;
  function codeTexture(bg = "rgba(6,14,28,0.0)") {
    return canvasTex(512, 512, (x, w, h) => {
      x.fillStyle = bg; x.fillRect(0, 0, w, h);
      x.font = "19px Consolas, 'Courier New', monospace";
      x.textBaseline = "top";
      CODE.concat(CODE).forEach((line, i) => {
        const y = 10 + i * 23;
        if (y > h) return;
        x.fillStyle = "rgba(120,160,200,0.45)";
        x.fillText(String((i % CODE.length) + 1).padStart(2, " "), 6, y);
        let xpos = 44;
        const parts = line.split(/(\b(?:const|new|for|if|await|true|of)\b|"[^"]*"|\/\/.*$)/);
        parts.forEach((p) => {
          if (!p) return;
          x.fillStyle = p.startsWith("//") ? "#6a9955" : p.startsWith("\"") ? "#ffb86b" : KW.test(p) ? "#c792ea" : "#d6f4ff";
          KW.lastIndex = 0;
          x.fillText(p, xpos, y);
          xpos += x.measureText(p).width;
        });
      });
    });
  }

  /* =====================================================================
     HIMMEL, LICHT, NEBEL
     ===================================================================== */
  const skyU = {
    top: { value: C("#16245e") }, hor: { value: C("#ff9f6b") }, bot: { value: C("#2b2340") },
    sunC: { value: C("#ffb070") }, sunDir: { value: new THREE.Vector3(-0.35, 0.06, -1).normalize() },
  };
  const skyMat = new THREE.ShaderMaterial({
    uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: [
      "uniform vec3 top; uniform vec3 hor; uniform vec3 bot; uniform vec3 sunC; uniform vec3 sunDir; varying vec3 vP;",
      "void main(){",
      "  vec3 d = normalize(vP); float h = d.y;",
      "  vec3 col = mix(hor, top, smoothstep(0.0, 0.5, h));",
      "  col = mix(col, bot, smoothstep(0.0, -0.18, h));",
      "  float sd = max(dot(d, normalize(sunDir)), 0.0);",
      "  col += sunC * (pow(sd, 1400.0) * 6.0 + pow(sd, 90.0) * 0.6 + pow(sd, 8.0) * 0.28 + pow(sd, 2.0) * 0.08);",
      "  gl_FragColor = vec4(col, 1.0);",
      "  #include <tonemapping_fragment>",
      "  #include <encodings_fragment>",
      "}",
    ].join("\n"),
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), skyMat);
  scene.add(sky);
  scene.fog = new THREE.Fog("#7d6488", 60, 520);

  // Umgebungslicht aus dem Himmel (Spiegelungen im See, weiches Licht)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), skyMat));
  let envRT = null;
  function updateEnv() {
    const rt = pmrem.fromScene(envScene, 0.02, 0.1, 200);
    scene.environment = rt.texture;
    if (envRT) envRT.dispose();
    envRT = rt;
  }

  const hemi = new THREE.HemisphereLight("#9fb2ff", "#3b2a33", 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight("#ffd6a8", 2.2);
  key.position.set(6, 11, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13, near: 1, far: 50 });
  scene.add(key);
  const back = new THREE.DirectionalLight("#ff9a62", 1.1); // Gegenlicht aus Richtung Sonne → Konturen
  back.position.set(-4, 5, -10);
  scene.add(back);
  const rim = new THREE.PointLight("#ff9a62", 1.2, 30);
  rim.position.set(-4, 4, -3);
  scene.add(rim);
  const spot = new THREE.SpotLight("#ffffff", 0, 22, 0.45, 0.6);
  spot.position.set(0, 8, 6);
  scene.add(spot, spot.target);

  /* =====================================================================
     LANDSCHAFT: Wiese, See, Hügel, Berge
     ===================================================================== */
  const LAKE = { x: -4, z: -66, rx: 72, rz: 21 };
  const WATER_Y = -1.25;
  function lakeMask(x, z) { const e = ((x - LAKE.x) / LAKE.rx) ** 2 + ((z - LAKE.z) / LAKE.rz) ** 2; return 1 - smooth(0.62, 1.0, e); }
  function groundH(x, z) {
    const d = Math.hypot(x, z);
    const flat = smooth(17, 34, d);
    const side = smooth(26, 62, Math.abs(x)), behind = smooth(-88, -104, z), backS = smooth(18, 46, z);
    const hill = Math.max(side * 0.9, behind, backS) * flat;
    let h = (fbm(x * 0.03 + 7, z * 0.03 - 3) * 22 - 6) * hill;
    h += (fbm(x * 0.11, z * 0.11) - 0.5) * 0.9 * flat;
    h -= smooth(-16, -46, z) * 1.4 * (1 - side) * flat;
    h += smooth(110, 200, d) * fbm(x * 0.014, z * 0.014) * 46;
    const m = lakeMask(x, z);
    return h * (1 - m) + (-3.2) * m;
  }
  const TER = 560;
  const terGeo = new THREE.PlaneGeometry(TER, TER, 170, 170);
  terGeo.rotateX(-Math.PI / 2);
  {
    const p = terGeo.attributes.position, col = new Float32Array(p.count * 3);
    const grass = C("#5f8f3a"), grass2 = C("#7aa548"), forest = C("#3e6230"), rock = C("#7d8087"), snow = C("#f1f4f8"), shore = C("#a19a70");
    const tmpC = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const h = groundH(x, z);
      p.setY(i, h);
      const n = fbm(x * 0.07, z * 0.07);
      tmpC.copy(grass).lerp(grass2, n);
      if (h > 7) tmpC.lerp(forest, smooth(7, 16, h));
      if (h > 26) tmpC.lerp(rock, smooth(26, 36, h));
      if (h > 46) tmpC.lerp(snow, smooth(46, 54, h));
      if (h < -0.6) tmpC.lerp(shore, smooth(-0.6, -1.4, h));
      col.set([tmpC.r, tmpC.g, tmpC.b], i * 3);
    }
    terGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    terGeo.computeVertexNormals();
  }
  const terMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0, flatShading: true });
  const terrain = new THREE.Mesh(terGeo, terMat);
  terrain.receiveShadow = true;
  scene.add(terrain);

  // Bergkränze (Pilatus links, Rigi rechts, dahinter die Alpen)
  const angDist = (a, b) => { let d = Math.abs(a - b) % TAU; return d > Math.PI ? TAU - d : d; };
  const PILATUS = Math.atan2(-1, -0.62), RIGI = Math.atan2(-1, 0.95);
  function mountainRing(radius, base, amp, snowLine, extra, seedOff) {
    const SEG = 260, ROWS = 9;
    const pos = [], col = [], idx = [];
    const rock = C("#6f7a8a"), rock2 = C("#8a8f98"), green = C("#41633a"), snow = C("#f4f7fb"), c = new THREE.Color();
    for (let i = 0; i <= SEG; i++) {
      const a = (i / SEG) * TAU;
      const ca = Math.cos(a), sa = Math.sin(a);
      let H = base + fbm(ca * 2.2 + seedOff, sa * 2.2 + seedOff, 5) * amp;
      H += extra(a);
      for (let j = 0; j <= ROWS; j++) {
        const t = j / ROWS;
        const jag = (fbm(i * 0.35 + seedOff, j * 0.6, 3) - 0.5) * 6 * t;
        const r = radius - Math.pow(t, 0.8) * H * 0.85 + jag;
        const y = -6 + t * H + jag * 0.4;
        pos.push(ca * r, y, sa * r);
        c.copy(green).lerp(rock, smooth(0.08, 0.35, t)).lerp(rock2, fbm(i * 0.2, j * 0.3) * 0.6);
        if (y > snowLine) c.lerp(snow, smooth(snowLine, snowLine + 8, y));
        col.push(c.r, c.g, c.b);
      }
    }
    for (let i = 0; i < SEG; i++) for (let j = 0; j < ROWS; j++) {
      const a = i * (ROWS + 1) + j, b = a + ROWS + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  const mtnMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, flatShading: true, side: THREE.DoubleSide });
  const near = new THREE.Mesh(mountainRing(210, 10, 24, 46, (a) => {
    const p = Math.exp(-((angDist(a, PILATUS) / 0.12) ** 2));
    const r = Math.exp(-((angDist(a, RIGI) / 0.3) ** 2));
    return p * (40 + (fbm(a * 40, 1.3) - 0.5) * 22) + r * 18;
  }, 3.1), mtnMat);
  const far = new THREE.Mesh(mountainRing(340, 26, 62, 52, () => 0, 11.7), mtnMat);
  scene.add(near, far);

  // Bäume & Wiesen-Details (Instancing = viele Objekte, wenig Aufwand)
  function scatter(count, test, place) {
    let n = 0, guard = 0;
    while (n < count && guard++ < count * 40) {
      const a = srnd(0, TAU), d = srnd(16, 175);
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (!test(x, z, d)) continue;
      place(n++, x, groundH(x, z), z, d);
    }
    return n;
  }
  {
    const TREES = 520;
    const crownGeo = new THREE.ConeGeometry(1, 2.8, 7);
    crownGeo.translate(0, 2.3, 0);
    const crown2 = new THREE.ConeGeometry(0.78, 2.1, 7);
    crown2.translate(0, 3.6, 0);
    const trunkGeo = new THREE.CylinderGeometry(0.16, 0.22, 1.2, 6);
    trunkGeo.translate(0, 0.6, 0);
    const iC = new THREE.InstancedMesh(crownGeo, F("#ffffff", { roughness: 0.9 }), TREES);
    const iC2 = new THREE.InstancedMesh(crown2, F("#ffffff", { roughness: 0.9 }), TREES);
    const iT = new THREE.InstancedMesh(trunkGeo, F("#5b3a24"), TREES);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3(), c = new THREE.Color();
    const n = scatter(TREES, (x, z, d) => {
      const h = groundH(x, z);
      if (lakeMask(x, z) > 0.02 || h < -0.4 || h > 34) return false;
      if (d < 24) return false;
      if (Math.abs(x) < 30 && z < 0 && z > -50) return false; // Sicht zum See frei lassen
      if (Math.abs(x) < 16 && z > 0 && d < 40) return false;
      return true;
    }, (i, x, y, z) => {
      const k = srnd(1.1, 2.6);
      q.setFromAxisAngle(v.set(0, 1, 0), srnd(0, TAU));
      m4.compose(v.set(x, y - 0.2, z), q, s.set(k, k * srnd(0.9, 1.3), k));
      iC.setMatrixAt(i, m4); iC2.setMatrixAt(i, m4); iT.setMatrixAt(i, m4);
      c.setHSL(srnd(0.26, 0.36), srnd(0.35, 0.55), srnd(0.18, 0.3));
      iC.setColorAt(i, c);
      iC2.setColorAt(i, c.offsetHSL(0, 0, 0.05));
    });
    [iC, iC2, iT].forEach((im) => { im.count = n; im.castShadow = true; im.receiveShadow = true; scene.add(im); });
    // Grasbüschel und Blumen nahe der Spielfläche
    const TUFTS = 700;
    const tuftGeo = new THREE.ConeGeometry(0.09, 0.42, 4);
    tuftGeo.translate(0, 0.2, 0);
    const tufts = new THREE.InstancedMesh(tuftGeo, F("#ffffff", { roughness: 1 }), TUFTS);
    const flowerGeo = new THREE.IcosahedronGeometry(0.09, 0);
    flowerGeo.translate(0, 0.3, 0);
    const flowers = new THREE.InstancedMesh(flowerGeo, F("#ffffff", { roughness: 0.7 }), 260);
    let fi = 0;
    const fcol = ["#ffffff", "#ffd23f", "#ff8fb1", "#b48cff", "#ff6b6b"];
    let ti = 0;
    for (let i = 0; i < TUFTS; i++) {
      const a = srnd(0, TAU), d = srnd(7.5, 46);
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      if (lakeMask(x, z) > 0) continue;
      if (z > 2 && Math.abs(x) < 10) continue; // nichts direkt vor der Kamera
      if (Math.hypot(x, z + 2) < 8.3) continue; // nicht durch Dorfplatz / Sägemehl-Ring wachsen
      const k = srnd(0.7, 1.6);
      m4.compose(v.set(x, groundH(x, z), z), q.setFromAxisAngle(v.set(0, 1, 0).normalize(), srnd(0, TAU)), s.set(k, k, k));
      m4.setPosition(x, groundH(x, z), z);
      tufts.setMatrixAt(ti, m4);
      tufts.setColorAt(ti++, c.setHSL(srnd(0.24, 0.32), 0.5, srnd(0.26, 0.38)));
      if (fi < 260 && srnd(0, 1) < 0.4) {
        flowers.setMatrixAt(fi, m4);
        flowers.setColorAt(fi, c.set(fcol[fi % fcol.length]));
        fi++;
      }
    }
    flowers.count = fi;
    tufts.count = ti;
    tufts.receiveShadow = flowers.receiveShadow = true;
    scene.add(tufts, flowers);
  }

  // Der See (Vierwaldstättersee) – sanfte Wellen, spiegelt den Himmel
  const waterGeo = new THREE.PlaneGeometry(LAKE.rx * 2.2, LAKE.rz * 2.4, 64, 22);
  waterGeo.rotateX(-Math.PI / 2);
  const waterBase = Float32Array.from(waterGeo.attributes.position.array);
  const waterMat = new THREE.MeshStandardMaterial({ color: "#2b4b7a", roughness: 0.06, metalness: 0.35, envMapIntensity: 1.2 });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(LAKE.x, WATER_Y, LAKE.z);
  water.receiveShadow = true;
  scene.add(water);
  const sunGlint = glowSprite("#ffd2a0", 1, 0.5);
  sunGlint.scale.set(22, 2.4, 1);
  sunGlint.position.set(-14, WATER_Y + 0.3, -78);
  scene.add(sunGlint);

  /* ---------- Luzern: Kapellbrücke, Wasserturm, Altstadt, Museggmauer, Hofkirche ---------- */
  const litWin = M("#ffe08a", { emissive: "#ffb830", emissiveIntensity: 1.6 });
  const town = new THREE.Group();
  scene.add(town);
  {
    const wood = M("#8a5a33", { roughness: 0.85 }), woodD = M("#5c3a22", { roughness: 0.9 }), roof = M("#8f3f27", { roughness: 0.8 });
    const flowerM = [M("#ff4d5e", { emissive: "#5a0010", emissiveIntensity: 0.4 }), M("#ff8fb1"), M("#ffd23f")];
    const pts = [[-40, -51], [-27, -56.5], [-14, -55], [2, -60.5], [17, -57.5], [27, -53]];
    const deckY = WATER_Y + 1.1;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, z1] = pts[i], [x2, z2] = pts[i + 1];
      const L = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(z2 - z1, x2 - x1);
      const seg = new THREE.Group();
      seg.position.set((x1 + x2) / 2, deckY, (z1 + z2) / 2);
      seg.rotation.y = -ang;
      box(L + 0.3, 0.3, 2.4, woodD, 0, 0, 0, seg);
      const posts = Math.round(L / 1.6);
      for (let k = 0; k <= posts; k++) {
        const px = -L / 2 + (k / posts) * L;
        [-1.1, 1.1].forEach((pz) => {
          box(0.16, 2.0, 0.16, wood, px, 1.1, pz, seg);
          if (k % 3 === 0) cyl(0.12, 0.14, 2.4, woodD, px, -1.3, pz, seg, 6);
        });
        if (k < posts) [-1.25, 1.25].forEach((pz) => {
          const fb = box(1.2, 0.18, 0.22, wood, px + L / posts / 2, 0.75, pz, seg);
          fb.castShadow = false;
          for (let f = 0; f < 4; f++) sph(0.1, flowerM[(k + f) % 3], px + L / posts / 2 - 0.45 + f * 0.3, 0.9, pz, seg, 6).castShadow = false;
        });
      }
      box(L + 0.3, 0.12, 0.12, wood, 0, 0.75, -1.1, seg);
      box(L + 0.3, 0.12, 0.12, wood, 0, 0.75, 1.1, seg);
      const r = prism(3.2, 1.25, L + 0.5, roof, 0, 2.05, 0, seg);
      r.rotation.y = Math.PI / 2;
      town.add(seg);
    }
    // Wasserturm (achteckig) mit Luzerner Fahne
    const stone = M("#b8a689", { roughness: 0.9 }), stone2 = M("#a08d70", { roughness: 0.9 });
    const tower = new THREE.Group();
    tower.position.set(-17, WATER_Y, -59.5);
    cyl(2.5, 2.8, 1.4, stone2, 0, 0.5, 0, tower, 8);
    cyl(2.3, 2.45, 10.5, stone, 0, 6, 0, tower, 8).rotation.y = Math.PI / 8;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * TAU + Math.PI / 8;
      [4.5, 7.5, 10].forEach((y, j) => { if ((k + j) % 2 === 0) box(0.35, 0.6, 0.1, j === 2 ? litWin : M("#2a2620"), Math.cos(a) * 2.32, y, Math.sin(a) * 2.32, tower).rotation.y = -a + Math.PI / 2; });
    }
    cyl(2.75, 2.75, 0.35, stone2, 0, 11.3, 0, tower, 8);
    const tr = mesh(new THREE.ConeGeometry(2.95, 4.6, 8), M("#7c3a24", { roughness: 0.8 }), 0, 13.75, 0, tower);
    tr.rotation.y = Math.PI / 8;
    const fp = flagPole(2.6, flagTex.luzern, 1.3, 1.3);
    fp.position.y = 15.9;
    tower.add(fp);
    town.add(tower);
    // Altstadt am Nordufer + linkes Ufer
    const facade = ["#ead7b1", "#d9a87c", "#c9735a", "#f2e4c6", "#a9c3c9", "#e6c27a", "#cf9a8b", "#f5efe0"];
    const roofs = [M("#5a3328", { roughness: 0.85 }), M("#6d3a2a", { roughness: 0.85 }), M("#4a3a36", { roughness: 0.85 })];
    const house = (x, z, rot, w, h, d, i) => {
      const y = Math.max(WATER_Y + 0.4, groundH(x, z));
      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.rotation.y = rot;
      box(w, h, d, M(facade[i % facade.length], { roughness: 0.9 }), 0, h / 2, 0, g);
      const r = prism(w + 0.4, h * 0.55, d + 0.3, roofs[i % 3], 0, h, 0, g);
      if (i % 2) r.rotation.y = Math.PI / 2;
      const rows = Math.max(1, Math.floor(h / 1.6));
      for (let a = 0; a < rows; a++) for (let b = 0; b < Math.floor(w / 1.1); b++) {
        box(0.42, 0.55, 0.06, (a + b + i) % 3 ? litWin : M("#3a332c"), -w / 2 + 0.7 + b * 1.1, 1.1 + a * 1.6, d / 2 + 0.02, g).castShadow = false;
      }
      town.add(g);
    };
    let i = 0;
    for (let x = -60; x < 34; x += srnd(3.2, 4.6)) { house(x, -89.5 - srnd(0, 3) + Math.abs(x) * 0.02, srnd(-0.08, 0.08), srnd(3, 4.2), srnd(4.2, 7), 3.6, i++); }
    for (let z = -62; z < -44; z += srnd(3.4, 4.4)) { house(-48 - srnd(0, 2), z, Math.PI / 2 + srnd(-0.1, 0.1), srnd(3, 4), srnd(4, 6.5), 3.4, i++); }
    // Hofkirche (zwei schlanke Türme)
    [36, 40.5].forEach((x) => {
      const y = groundH(x, -95);
      box(2.2, 17, 2.2, M("#d8ccb4", { roughness: 0.9 }), x, y + 8.5, -95, town);
      mesh(new THREE.ConeGeometry(1.5, 7.5, 8), M("#4c6b63", { metalness: 0.3, roughness: 0.5 }), x, y + 20.7, -95, town);
    });
    box(5, 9, 9, M("#e2d7c0", { roughness: 0.9 }), 38.2, groundH(38, -101) + 4.5, -101, town);
    // Museggmauer mit Türmen auf dem Hügel
    const wallPts = [-44, -30, -16, -2, 12, 24];
    wallPts.forEach((x, k) => {
      const z = -110 - Math.sin(k) * 2;
      const y = groundH(x, z);
      box(2.4, 8.5, 2.4, stone, x, y + 4.25, z, town);
      const cap = mesh(new THREE.ConeGeometry(2.0, 3.8, 4), roofs[k % 3], x, y + 10.4, z, town);
      cap.rotation.y = Math.PI / 4;
      if (k < wallPts.length - 1) {
        const nx = wallPts[k + 1], nz = -110 - Math.sin(k + 1) * 2, ny = groundH(nx, nz);
        const L = Math.hypot(nx - x, nz - z);
        const w = box(L, 3.6, 0.8, stone2, (x + nx) / 2, (y + ny) / 2 + 1.8, (z + nz) / 2, town);
        w.rotation.y = -Math.atan2(nz - z, nx - x);
      }
    });
  }

  /* ---------- Wolken & Sterne ---------- */
  // Wolken: weich schattiert, ohne Nebel und kräftiger selbstleuchtend – sonst wirken sie wie dunkle, schwebende Felsbrocken
  const cloudMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, flatShading: false, emissive: "#ffffff", emissiveIntensity: 0.5, transparent: true, opacity: 0.92, fog: false });
  const clouds = new THREE.Group();
  scene.add(clouds);
  for (let i = 0; i < 16; i++) {
    const cl = new THREE.Group();
    const parts = 4 + Math.floor(srnd(0, 4));
    for (let k = 0; k < parts; k++) {
      const s = mesh(new THREE.IcosahedronGeometry(srnd(5, 9), 2), cloudMat, k * srnd(5, 7) - parts * 3, srnd(-1, 2), srnd(-3, 3), cl);
      s.scale.y = 0.55;
      s.castShadow = false;
    }
    const a = srnd(-Math.PI * 0.95, -Math.PI * 0.05) + (i % 3 === 0 ? Math.PI : 0), d = srnd(160, 330);
    cl.position.set(Math.cos(a) * d, srnd(48, 95), Math.sin(a) * d);
    cl.rotation.y = -a;
    clouds.add(cl);
  }
  const starGeo = new THREE.BufferGeometry();
  {
    const sp = [];
    for (let i = 0; i < 1400; i++) {
      const a = srnd(0, TAU), y = srnd(0.08, 1);
      const r = Math.sqrt(1 - y * y);
      sp.push(Math.cos(a) * r * 850, y * 850, Math.sin(a) * r * 850);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
  }
  const starMat = new THREE.PointsMaterial({ color: "#ffffff", size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false, fog: false });
  scene.add(new THREE.Points(starGeo, starMat));

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

  /* =====================================================================
     THEMEN (Tageszeiten / Farbwelten) – weich überblendet
     ===================================================================== */
  const THEMES = {
    menu: { top: "#152260", hor: "#ff9a62", bot: "#3a2c48", sun: "#ffad6a", sunDir: [-0.42, 0.05, -1], fog: "#8a6a86", fogN: 60, fogF: 560, key: "#ffd9b0", keyI: 2.1, back: "#ff9a62", backI: 1.3, hemiS: "#a9b8ff", hemiG: "#3b2a33", hemiI: 0.45, rim: "#ff9a62", p: "#ffd9a0", pm: "motes", tint: "#cbc3e8", water: "#2c4a7c", stars: 0.75, cloud: "#ffc7b0" },
    wissen: { top: "#1a5aa8", hor: "#a6d9f2", bot: "#5c7f99", sun: "#fff1d0", sunDir: [0.35, 0.42, -1], fog: "#9cc4dd", fogN: 80, fogF: 640, key: "#ffffff", keyI: 2.3, back: "#cfefff", backI: 0.7, hemiS: "#d2ecff", hemiG: "#3b4a3a", hemiI: 0.5, rim: "#6aa6ec", p: "#e4f0ff", pm: "motes", tint: "#ffffff", water: "#2f6fa0", stars: 0, cloud: "#ffffff" },
    // Abendstimmung am Schwingfest: Alpenglühen statt Lava-Hölle
    arena: { top: "#1c1844", hor: "#ff7a3a", bot: "#2a1a24", sun: "#ff8a3d", sunDir: [0.08, 0.05, -1], fog: "#6a4058", fogN: 40, fogF: 320, key: "#ffc49a", keyI: 1.8, back: "#ff7a3a", backI: 1.3, hemiS: "#b8a0e0", hemiG: "#2a1a1e", hemiI: 0.42, rim: "#ff8a3a", p: "#ffb347", pm: "embers", tint: "#d8aa9a", water: "#3a3462", stars: 0.55, cloud: "#ffa088" },
  };
  const COLOR_KEYS = ["top", "hor", "bot", "sun", "fog", "key", "back", "hemiS", "hemiG", "rim", "p", "tint", "water", "cloud"];
  const NUM_KEYS = ["fogN", "fogF", "keyI", "backI", "hemiI", "stars"];
  const parseTheme = (th) => {
    const o = { pm: th.pm, sunDir: new THREE.Vector3(...th.sunDir).normalize() };
    COLOR_KEYS.forEach((k) => (o[k] = C(th[k])));
    NUM_KEYS.forEach((k) => (o[k] = th[k]));
    return o;
  };
  const cur = parseTheme(THEMES.menu);
  let tgt = null, blend = 1, lastEnv = -1, envPending = true;
  function setTheme(th) {
    tgt = parseTheme(th);
    pMode = th.pm;
    blend = 0;
    envPending = true;
  }
  function themeFromColor(hex, base = "wissen") {
    const c = C(hex), b = THEMES[base];
    const mix = (a, k) => "#" + C(a).lerp(c, k).getHexString();
    return { ...b, top: mix(b.top, 0.35), hor: mix(b.hor, 0.18), fog: mix(b.fog, 0.15), rim: hex, p: hex, back: mix(b.back, 0.5) };
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
  const darkM = M("#1b1b25", { roughness: 0.4 });
  const whiteEye = M("#ffffff", { roughness: 0.25 });
  const shineM = M("#ffffff", { emissive: "#ffffff", emissiveIntensity: 1 });
  const beltM = M("#2a2420", { roughness: 0.6 });
  function person(L) {
    const root = new THREE.Group();
    const body = new THREE.Group();
    root.add(body);
    const skin = M(L.skin, { roughness: 0.55 }), shirt = M(L.shirt, { roughness: 0.78 }), pants = M(L.pants, { roughness: 0.82 }), hair = M(L.hair, { roughness: 0.7 });
    const legGeo = G("leg", () => new THREE.CapsuleGeometry(0.115, 0.46, 6, 16));
    const legL = mesh(legGeo, pants, -0.13, 0.43, 0, body);
    const legR = mesh(legGeo, pants, 0.13, 0.43, 0, body);
    const shoeGeo = G("shoe", () => new THREE.SphereGeometry(0.12, 18, 12));
    [-0.13, 0.13].forEach((x) => mesh(shoeGeo, darkM, x, 0.075, 0.055, body).scale.set(0.95, 0.6, 1.55));
    cyl(0.268, 0.268, 0.055, beltM, 0, 0.81, 0, body, 24).scale.z = 0.76;
    sph(0.272, pants, 0, 0.7, 0, body, 24).scale.set(1, 0.62, 0.76); // Hüfte in Hosenfarbe
    const torso = mesh(G("torso", () => new THREE.CapsuleGeometry(0.28, 0.4, 10, 24)), shirt, 0, 1.09, 0, body);
    torso.scale.z = 0.74;
    const armGeo = G("arm", () => new THREE.CapsuleGeometry(0.078, 0.42, 6, 14));
    const handGeo = G("hand", () => new THREE.SphereGeometry(0.088, 16, 12));
    function arm(side) {
      const p = new THREE.Group();
      p.position.set(side * 0.37, 1.38, 0);
      body.add(p);
      mesh(armGeo, shirt, 0, -0.29, 0, p);
      mesh(handGeo, skin, 0, -0.6, 0, p);
      p.rotation.z = side * 0.12;
      return p;
    }
    const armL = arm(-1), armR = arm(1);
    cyl(0.085, 0.095, 0.16, skin, 0, 1.6, 0, body, 16);
    const head = new THREE.Group();
    head.position.set(0, 1.88, 0);
    body.add(head);
    sph(0.285, skin, 0, 0, 0, head, 36).scale.set(1, 1.0, 0.95);
    [-1, 1].forEach((s) => sph(0.065, skin, s * 0.278, -0.01, 0, head, 12).scale.set(0.5, 1, 0.8));
    // Gesicht
    const eyes = new THREE.Group();
    head.add(eyes);
    eyes.position.y = 0.03;
    [-1, 1].forEach((s) => {
      sph(0.056, whiteEye, s * 0.1, 0, 0.228, eyes, 16).scale.set(1, 1.12, 0.55);
      sph(0.034, darkM, s * 0.1, -0.006, 0.256, eyes, 14).scale.z = 0.6;
      sph(0.012, shineM, s * 0.1 + 0.013, 0.014, 0.272, eyes, 8).castShadow = false;
      const brow = box(0.1, 0.022, 0.03, hair, s * 0.1, 0.1, 0.246, eyes);
      brow.rotation.z = s * -0.14;
      brow.castShadow = false;
    });
    sph(0.038, skin, 0, -0.035, 0.272, head, 12).scale.set(0.85, 0.9, 0.75);
    const mouth = new THREE.Mesh(G("mouth", () => new THREE.TorusGeometry(0.058, 0.014, 8, 18, Math.PI)), M("#7a2a36", { roughness: 0.5 }));
    mouth.position.set(0, -0.105, 0.252);
    mouth.rotation.z = Math.PI;
    head.add(mouth);
    const ch = M("#ff9aa8", { roughness: 1, transparent: true, opacity: 0.75 });
    [-1, 1].forEach((s) => (sph(0.048, ch, s * 0.17, -0.065, 0.205, head, 10).scale.z = 0.35));
    // Haare / Kopfbedeckung
    const cap = (r, mat, tilt = -0.32, cut = 0.45) => {
      const m = mesh(G(`cap${r},${cut}`, () => new THREE.SphereGeometry(r, 36, 18, 0, TAU, 0, Math.PI * cut)), mat, 0, 0.035, -0.012, head);
      m.rotation.x = tilt;
      return m;
    };
    const st = L.hairStyle || "short";
    // Kopfbedeckungen sitzen als eigene Gruppe AUF dem Kopf: Rand vorne über den Brauen
    // (Brauen enden bei y≈0.14), hinten tiefer – sonst stecken sie in Kopf und Augen.
    const hat = (y, tilt) => { const g = new THREE.Group(); g.position.set(0, y, -0.01); g.rotation.x = tilt; head.add(g); return g; };
    const dome = (r, mat, p) => mesh(G(`dome${r}`, () => new THREE.SphereGeometry(r, 36, 14, 0, TAU, 0, Math.PI / 2)), mat, 0, 0, 0, p);
    if (st === "cap") {
      const cm = M(L.cap || "#ff8a3d", { roughness: 0.7 });
      const g = hat(0.07, -0.3);
      dome(0.305, cm, g);
      // Schirm: halbe Scheibe vorne, leicht nach unten geneigt
      const visor = mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.024, 24, 1, false, -Math.PI / 2, Math.PI), cm, 0, 0.004, 0.2, g);
      visor.rotation.x = 0.36;
      sph(0.032, cm, 0, 0.305, 0, g, 8);
      // Haare schauen unter der Cap hervor
      [-1, 1].forEach((s) => box(0.05, 0.12, 0.14, hair, s * 0.27, -0.02, -0.04, head).castShadow = false);
    } else if (st === "helmet") {
      const hm = M("#ffd23f", { metalness: 0.25, roughness: 0.35 });
      const g = hat(0.1, -0.26);
      const shell = new THREE.Group();
      shell.scale.y = 0.92;
      g.add(shell);
      dome(0.33, hm, shell);
      // Mittelgrat über den Helm (Bogen von vorne nach hinten)
      const ridge = mesh(new THREE.TorusGeometry(0.33, 0.03, 6, 24, Math.PI), hm, 0, 0, 0, shell);
      ridge.rotation.y = Math.PI / 2;
      // umlaufende Krempe + vorne ein kurzer Schild
      const brim = mesh(new THREE.TorusGeometry(0.34, 0.03, 6, 36), hm, 0, 0, 0, g);
      brim.rotation.x = Math.PI / 2;
      brim.scale.z = 0.6;
      const peak = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.024, 24, 1, false, -Math.PI / 2, Math.PI), hm, 0, -0.005, 0.24, g);
      peak.rotation.x = 0.2;
      peak.scale.z = 0.6;
    } else {
      cap(0.298, hair);
      if (st === "short" || st === "curly") {
        const fr = mesh(new THREE.CapsuleGeometry(0.055, 0.26, 4, 10), hair, 0.03, 0.2, 0.2, head);
        fr.rotation.set(0.5, 0, Math.PI / 2 + 0.25);
      }
      if (st === "curly") for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; sph(0.085, hair, Math.cos(a) * 0.2, 0.2 + Math.sin(i * 1.7) * 0.03, Math.sin(a) * 0.18 - 0.03, head, 10); }
      if (st === "long") { const b = mesh(new THREE.CapsuleGeometry(0.2, 0.32, 6, 16), hair, 0, -0.14, -0.13, head); b.scale.set(1.3, 1, 0.62); }
      if (st === "bun") sph(0.12, hair, 0, 0.22, -0.2, head, 16);
    }
    return { root, body, torso, armL, armR, legL, legR, head, eyes, itemsL: [], itemsR: [], phase: Math.random() * 10, jump: 0, pose: L.pose || null };
  }

  const laptopTex = codeTexture("#0b1324");
  laptopTex.wrapT = THREE.RepeatWrapping;
  function addExtras(rig, L) {
    const ex = L.extra || [];
    const hold = (o, arm, list) => { o.position.y -= 0.62; arm.add(o); o.userData.baseQ = o.quaternion.clone(); list.push(o); return o; };
    const handR = (o) => hold(o, rig.armR, rig.itemsR);
    const handL = (o) => hold(o, rig.armL, rig.itemsL);
    const g = () => new THREE.Group();
    if (ex.includes("backpack")) {
      const bp = mesh(new THREE.CapsuleGeometry(0.2, 0.22, 6, 14), M("#1f5fa0", { roughness: 0.8 }), 0, 1.12, -0.28, rig.body);
      bp.scale.z = 0.55;
      box(0.3, 0.16, 0.06, M("#2a74bf"), 0, 0.98, -0.4, rig.body);
    }
    if (ex.includes("tie")) {
      box(0.07, 0.36, 0.04, M("#d63031"), 0, 1.13, 0.2, rig.body);
      box(0.24, 0.08, 0.05, M("#f5f6fa"), 0, 1.36, 0.17, rig.body);
    }
    if (ex.includes("badge")) box(0.12, 0.16, 0.03, M("#ffffff", { emissive: "#666" }), -0.13, 1.18, 0.205, rig.body);
    if (ex.includes("swiss")) {
      box(0.2, 0.2, 0.03, M("#d52b1e"), -0.12, 1.2, 0.2, rig.body);
      box(0.12, 0.04, 0.035, M("#ffffff"), -0.12, 1.2, 0.205, rig.body);
      box(0.04, 0.12, 0.035, M("#ffffff"), -0.12, 1.2, 0.205, rig.body);
    }
    if (ex.includes("glasses")) {
      const fr = M("#222", { metalness: 0.5, roughness: 0.3 });
      [-0.1, 0.1].forEach((x) => (mesh(new THREE.TorusGeometry(0.062, 0.012, 8, 20), fr, x, 0.03, 0.272, rig.head).castShadow = false));
      box(0.06, 0.012, 0.012, fr, 0, 0.04, 0.275, rig.head);
    }
    if (ex.includes("hoodie")) {
      const dark = M(L.shirt, { roughness: 0.85 }), hood = M("#" + C(L.shirt).multiplyScalar(0.7).getHexString(), { roughness: 0.85 });
      const hd = mesh(new THREE.TorusGeometry(0.17, 0.08, 10, 20), hood, 0, 1.52, -0.12, rig.body);
      hd.rotation.x = Math.PI / 2 - 0.5;
      [-0.07, 0.07].forEach((x) => cyl(0.012, 0.012, 0.2, M("#f0f0f0"), x, 1.36, 0.215, rig.body, 6));
      box(0.34, 0.14, 0.03, dark, 0, 0.94, 0.215, rig.body);
      const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.1), new THREE.MeshBasicMaterial({ transparent: true, map: canvasTex(128, 64, (x, w, h) => { x.font = "bold 44px Consolas, monospace"; x.fillStyle = "#5fd4ff"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("</>", w / 2, h / 2); }) }));
      logo.position.set(0, 1.2, 0.212);
      rig.body.add(logo);
    }
    if (ex.includes("headset")) {
      const hs = M("#22262e", { metalness: 0.4, roughness: 0.4 });
      mesh(new THREE.TorusGeometry(0.305, 0.022, 8, 28, Math.PI), hs, 0, 0.02, -0.01, rig.head);
      [-1, 1].forEach((s) => { const cup = cyl(0.085, 0.085, 0.07, hs, s * 0.3, -0.02, 0, rig.head, 18); cup.rotation.z = Math.PI / 2; });
      const mic = cyl(0.012, 0.012, 0.3, hs, -0.23, -0.12, 0.14, rig.head, 6);
      mic.rotation.set(1.1, 0, 0.5);
      sph(0.03, M("#5fd4ff", { emissive: "#5fd4ff", emissiveIntensity: 1.5 }), -0.13, -0.15, 0.25, rig.head, 8);
    }
    if (ex.includes("laptop")) {
      const lp = g();
      const al = M("#c9ced8", { metalness: 0.75, roughness: 0.3 });
      box(0.5, 0.025, 0.34, al, 0, 0, 0, lp);
      box(0.44, 0.005, 0.18, M("#2a2f3a"), 0, 0.015, -0.04, lp).castShadow = false;
      // Deckel nur leicht nach hinten gekippt und das Notebook weiter vorne –
      // vorher ragte der Deckel in den Oberkörper
      const lid = new THREE.Group();
      lid.position.set(0, 0.01, -0.17);
      lid.rotation.x = -0.1;
      lp.add(lid);
      box(0.5, 0.33, 0.02, al, 0, 0.165, 0, lid);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.29), new THREE.MeshBasicMaterial({ map: laptopTex }));
      scr.position.set(0, 0.165, 0.012);
      lid.add(scr);
      const glow = glowSprite("#5fd4ff", 0.9, 0.35);
      glow.position.set(0, 0.2, 0.2);
      lid.add(glow);
      lp.position.set(0, 1.0, 0.55);
      rig.body.add(lp);
    }
    if (ex.includes("clipboard")) {
      const o = g();
      box(0.28, 0.36, 0.03, M("#8b5a2b"), 0, -0.05, 0.08, o);
      box(0.22, 0.28, 0.035, M("#ffffff"), 0, -0.06, 0.09, o);
      box(0.1, 0.04, 0.04, M("#b8bcc6", { metalness: 0.7 }), 0, 0.12, 0.09, o);
      o.rotation.x = -0.6;
      handL(o);
    }
    if (ex.includes("briefcase")) {
      const o = g();
      box(0.42, 0.3, 0.12, M("#5a3b22", { roughness: 0.5 }), 0, -0.2, 0, o);
      box(0.43, 0.03, 0.125, M("#c9a227", { metalness: 0.8, roughness: 0.3 }), 0, -0.1, 0, o);
      mesh(new THREE.TorusGeometry(0.06, 0.015, 6, 14, Math.PI), M("#2b1b10"), 0, -0.05, 0, o);
      handR(o);
    }
    if (ex.includes("stamp")) {
      const o = g();
      cyl(0.04, 0.05, 0.2, M("#2d2a4a"), 0, 0, 0, o, 12);
      sph(0.06, M("#2d2a4a"), 0, 0.1, 0, o, 12);
      box(0.18, 0.06, 0.12, M("#6c5ce7"), 0, -0.12, 0, o);
      box(0.17, 0.02, 0.11, M("#d63031"), 0, -0.16, 0, o);
      handR(o);
    }
    if (ex.includes("book")) {
      const o = g();
      const l = box(0.22, 0.3, 0.03, M("#c0392b"), -0.1, 0, 0.05, o); l.rotation.y = 0.5;
      const r = box(0.22, 0.3, 0.03, M("#c0392b"), 0.1, 0, 0.05, o); r.rotation.y = -0.5;
      box(0.2, 0.28, 0.02, M("#fbf6e9"), -0.08, 0, 0.065, o).rotation.y = 0.5;
      box(0.2, 0.28, 0.02, M("#fbf6e9"), 0.08, 0, 0.065, o).rotation.y = -0.5;
      o.rotation.x = -0.9;
      handL(o);
    }
    if (ex.includes("wrench")) {
      const o = g();
      const st = M("#a4b0be", { metalness: 0.8, roughness: 0.25 });
      box(0.05, 0.38, 0.04, st, 0, 0.12, 0, o);
      mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 14, Math.PI * 1.5), st, 0, 0.33, 0, o);
      handR(o);
    }
    if (ex.includes("flag")) {
      // Fahne in der Hand: Stange zeigt immer nach oben (Gegenrotation zum Arm), Stoff weht
      const o = g();
      cyl(0.022, 0.022, 1.5, M("#e5e5ea", { metalness: 0.5, roughness: 0.35 }), 0, 0.45, 0, o, 8);
      sph(0.045, M("#ffd23f", { metalness: 0.7, roughness: 0.3 }), 0, 1.22, 0, o, 10);
      const f = clothFlag(0.62, 0.4, flagMat(flagTex.oda));
      f.position.set(0.02, 0.98, 0);
      o.add(f);
      handR(o);
    }
    if (ex.includes("scroll")) {
      const o = g();
      const s = cyl(0.05, 0.05, 0.36, M("#f3e5c0"), 0, 0, 0.06, o, 12);
      s.rotation.z = Math.PI / 2;
      [-0.19, 0.19].forEach((x) => { const e = cyl(0.03, 0.03, 0.03, M("#8b5a2b"), x, 0, 0.06, o, 10); e.rotation.z = Math.PI / 2; });
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
      a.root.position.x = -0.5;
      b.root.position.x = 0.5;
      a.root.rotation.y = 0.12;
      b.root.rotation.y = -0.12;
      holder.add(b.root);
      rigs.push(b);
      const heart = new THREE.Group();
      const hm = M("#ff4d6d", { emissive: "#661020", roughness: 0.35 });
      sph(0.1, hm, -0.07, 0, 0, heart, 16);
      sph(0.1, hm, 0.07, 0, 0, heart, 16);
      const tip = mesh(new THREE.ConeGeometry(0.135, 0.2, 16), hm, 0, -0.12, 0, heart);
      tip.rotation.z = Math.PI;
      heart.position.set(0, 2.5, 0);
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

  const qInv = new THREE.Quaternion();
  function animateChar(ch, t, active, dt) {
    ch.rigs.forEach((r, n) => {
      const p = t + r.phase;
      r.torso.scale.y = 1 + Math.sin(p * 2.2) * 0.022;
      r.head.rotation.y = Math.sin(p * 0.7) * 0.25;
      r.head.rotation.z = Math.sin(p * 1.1) * 0.05;
      r.eyes.scale.y = (p * 0.9) % 4.1 < 0.12 ? 0.12 : 1; // blinzeln
      if (r.jump > 0) r.jump = Math.max(0, r.jump - dt);
      const jy = r.jump > 0 ? Math.sin((1 - r.jump / 0.8) * Math.PI) * 0.55 : 0;
      r.body.position.y = jy + (active ? Math.abs(Math.sin(p * 2.4)) * 0.03 : 0);
      r.body.rotation.z = Math.sin(p * 0.9) * 0.02;
      const waving = active && n === 0;
      const ka = 1 - Math.exp(-dt * 9); // bildratenunabhängig weich
      if (waving) {
        r.armR.rotation.z = lerp(r.armR.rotation.z, 2.55 + Math.sin(p * 8) * 0.32, ka);
        r.armR.rotation.x = lerp(r.armR.rotation.x, 0, ka);
      } else if (r.pose === "laptop") {
        r.armR.rotation.z = lerp(r.armR.rotation.z, 0.05, ka);
        r.armR.rotation.x = -0.98 + Math.sin(p * 17) * 0.025;
      } else {
        r.armR.rotation.z = lerp(r.armR.rotation.z, 0.12, ka);
        r.armR.rotation.x = Math.sin(p * 1.6) * 0.16;
      }
      if (r.pose === "laptop") {
        r.armL.rotation.x = -0.98 + Math.cos(p * 15) * 0.025;
        r.armL.rotation.z = -0.05;
        r.head.rotation.x = 0.18;
      } else {
        r.armL.rotation.x = active ? Math.sin(p * 1.6) * 0.15 : -Math.sin(p * 1.6) * 0.16;
        r.armL.rotation.z = -0.12;
      }
      // Gegenstände in den Händen bleiben aufrecht (z. B. Fahnenstange zeigt nach oben)
      qInv.copy(r.armR.quaternion).invert();
      r.itemsR.forEach((o) => o.quaternion.copy(qInv).multiply(o.userData.baseQ));
      qInv.copy(r.armL.quaternion).invert();
      r.itemsL.forEach((o) => o.quaternion.copy(qInv).multiply(o.userData.baseQ));
    });
    const hrt = ch.obj.userData.heart;
    if (hrt) { hrt.position.y = 2.5 + Math.sin(t * 2) * 0.08; hrt.rotation.y = t * 1.5; }
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
        cyl(1.1, 0.6, 0.5, F("#2b3550"), 0, 0.15, 0, p, 10);
        cyl(1.12, 1.12, 0.06, M(pl.c, { emissive: pl.c, emissiveIntensity: 0.35 }), 0, 0.42, 0, p, 32);
        pl.b(p);
        g.add(p);
        tickers.push((t) => { if (!g.visible) return; p.position.y = 0.6 + Math.sin(t + i * 2) * 0.15; if (p.userData.gear) p.userData.gear.rotation.z = t; });
      });
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
        cyl(0.25, 0.32, 3.2, M("#a33"), x, 1.6, -7, g, 16);
        const puffs = [];
        for (let k = 0; k < 6; k++) puffs.push(sph(0.25, new THREE.MeshStandardMaterial({ color: "#cfd8dc", transparent: true, opacity: 0.6, roughness: 1 }), x, 3.3, -7, g, 10));
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
      const r = mesh(new THREE.ConeGeometry(2.4, 1.5, 4), F("#c0392b"), 0, 2.75, -6, g);
      r.rotation.y = Math.PI / 4;
      box(0.6, 1.1, 0.06, M("#7a4b2a"), 0, 0.55, -4.78, g);
      box(0.6, 0.5, 0.06, litWin, -0.95, 1.3, -4.78, g);
      box(0.6, 0.5, 0.06, litWin, 0.95, 1.3, -4.78, g);
      [[-3.6, -5], [3.8, -6.5], [-5, -8]].forEach(([x, z], i) => {
        cyl(0.15, 0.2, 1.2, M("#6b4226"), x, 0.6, z, g, 8);
        const crown = mesh(new THREE.IcosahedronGeometry(0.9, 1), F("#3fae5a"), x, 1.7, z, g);
        tickers.push((t) => { crown.rotation.y = Math.sin(t * 0.5 + i) * 0.2; });
      });
      for (let i = 0; i < 9; i++) box(0.08, 0.5, 0.08, M("#e8e8e8"), -4 + i, 0.25, -3.2, g);
      box(8.2, 0.06, 0.06, M("#e8e8e8"), 0, 0.42, -3.2, g);
    },
    amt(g, col) {
      const stone = M("#dcdde1", { roughness: 0.85 });
      box(6, 0.3, 3.2, stone, 0, 0.15, -6, g);
      box(5.6, 0.3, 2.9, stone, 0, 0.45, -6, g);
      for (let i = 0; i < 6; i++) cyl(0.2, 0.22, 2.4, stone, -2.25 + i * 0.9, 1.8, -4.9, g, 16);
      box(5.6, 2.4, 1.8, M("#b2b6c2"), 0, 1.8, -6.5, g);
      box(5.8, 0.3, 3, stone, 0, 3.15, -6, g);
      prism(5.8, 1, 3, stone, 0, 3.3, -6, g);
      const fp = flagPole(1.6, flagTex.luzern, 0.75, 0.75);
      fp.position.set(2.4, 3.3, -6);
      g.add(fp);
      const docs = [];
      for (let i = 0; i < 6; i++) docs.push(box(0.5, 0.7, 0.02, M("#ffffff", { emissive: col, emissiveIntensity: 0.2, side: THREE.DoubleSide }), 0, 0, 0, g));
      tickers.push((t) => {
        if (!g.visible) return;
        docs.forEach((d, i) => { const a = t * 0.4 + (i / docs.length) * TAU; d.position.set(Math.cos(a) * 4.2, 3 + Math.sin(t + i) * 0.4, -5 + Math.sin(a) * 1.5); d.rotation.y = a; d.rotation.z = Math.sin(t + i) * 0.3; });
      });
    },
    schule(g) {
      const wall = M("#e7d7b5");
      box(6, 2.2, 2.2, wall, 0, 1.1, -6.5, g);
      windows(g, 0.45, 0.45, 6, 2, -2.4, 0.7, -5.38, litWin);
      box(1.2, 3.8, 1.2, wall, 0, 1.9, -6.2, g);
      const r = mesh(new THREE.ConeGeometry(1, 1.2, 4), F("#2fb67a"), 0, 4.4, -6.2, g);
      r.rotation.y = Math.PI / 4;
      cyl(0.38, 0.38, 0.05, M("#ffffff"), 0, 3.2, -5.58, g, 28).rotation.x = Math.PI / 2;
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
        const s = glowSprite("#ffb347", 0.15);
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
        box(1.05, h, 1.05, M(tones[i % 4], { roughness: 0.5, metalness: 0.2 }), x, h / 2, z, g);
        windows(g, 0.16, 0.18, 3, Math.floor(h / 0.5), x - 0.29, 0.4, z + 0.53, litWin);
        if (i % 3 === 1) {
          cyl(0.02, 0.02, 0.8, M("#ddd"), x, h + 0.4, z, g, 6);
          const f = clothFlag(0.5, 0.3, M(col, { side: THREE.DoubleSide, roughness: 0.85 }));
          f.position.set(x + 0.02, h + 0.65, z);
          g.add(f);
        }
      }
    },
    bundeshaus(g) {
      const stone = M("#c9b99a", { roughness: 0.85 }), green = M("#3f8f6b", { metalness: 0.35, roughness: 0.45 });
      box(8, 2.4, 2.6, stone, 0, 1.2, -7, g);
      windows(g, 0.35, 0.5, 8, 2, -3.2, 0.7, -5.68, litWin);
      box(2.6, 3, 2.8, stone, 0, 1.5, -6.8, g);
      cyl(1, 1.1, 0.6, stone, 0, 3.3, -6.8, g, 24);
      mesh(new THREE.SphereGeometry(1.05, 32, 16, 0, TAU, 0, Math.PI / 2), green, 0, 3.6, -6.8, g);
      [-3.4, 3.4].forEach((x) => mesh(new THREE.SphereGeometry(0.5, 20, 10, 0, TAU, 0, Math.PI / 2), green, x, 2.4, -7, g));
      const fp = flagPole(1.4, flagTex.schweiz, 0.7, 0.7);
      fp.position.set(0, 4.6, -6.8);
      g.add(fp);
    },
    serverraum(g, col) {
      // Informatik: Serverschränke mit blinkenden LEDs, Hologramm-Code, Datenpakete
      const rackM = M("#1a2130", { metalness: 0.6, roughness: 0.35 }), front = M("#0d121c", { metalness: 0.6, roughness: 0.25 }), unit = M("#273246", { metalness: 0.5, roughness: 0.4 });
      const ledOn = ["#5be3a0", "#5fd4ff", "#ffcc4d"].map((c) => M(c, { emissive: c, emissiveIntensity: 2.4 }));
      const ledOff = M("#1f2a3a", { emissive: "#0a0f18" });
      const leds = [];
      const tops = [];
      for (let r = 0; r < 4; r++) {
        const x = -4.4 + r * 1.32, z = -5.4;
        box(1.12, 2.9, 1.0, rackM, x, 1.45, z, g);
        box(1.0, 2.7, 0.04, front, x, 1.45, z + 0.51, g);
        for (let u = 0; u < 9; u++) {
          box(0.92, 0.2, 0.03, unit, x, 0.35 + u * 0.29, z + 0.54, g).castShadow = false;
          for (let k = 0; k < 4; k++) {
            const l = box(0.04, 0.04, 0.02, ledOff, x - 0.36 + k * 0.08, 0.35 + u * 0.29, z + 0.565, g);
            l.castShadow = false;
            leds.push(l);
          }
        }
        tops.push(new THREE.Vector3(x, 2.95, z));
      }
      tickers.push((t) => { if (!g.visible) return; leds.forEach((l, i) => { const on = Math.sin(t * (2.5 + (i % 7)) + i * 1.7) > 0.15; l.material = on ? ledOn[i % 3] : ledOff; }); });
      // Hologramm-Bildschirme mit Code
      const code = codeTexture();
      code.wrapT = THREE.RepeatWrapping;
      const holoM = new THREE.MeshBasicMaterial({ map: code, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
      const frameM = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
      const holos = [];
      [[-3.6, 4.4, -4.4, 0.25, 2.1, 1.35], [-0.9, 4.1, -4.2, -0.2, 1.6, 1.1]].forEach(([x, y, z, ry, w, h], i) => {
        const s = new THREE.Group();
        s.position.set(x, y, z);
        s.rotation.y = ry;
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), holoM);
        s.add(pl);
        const bg = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: "#062033", transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
        bg.position.z = -0.01;
        s.add(bg);
        [[0, h / 2, w, 0.025], [0, -h / 2, w, 0.025], [-w / 2, 0, 0.025, h], [w / 2, 0, 0.025, h]].forEach(([fx, fy, fw, fh]) => { const f = new THREE.Mesh(new THREE.PlaneGeometry(fw, fh), frameM); f.position.set(fx, fy, 0.005); s.add(f); });
        g.add(s);
        holos.push({ s, y, i });
      });
      // Schreibtisch mit Monitor
      box(1.8, 0.08, 0.8, M("#e9e4da", { roughness: 0.5 }), 1.4, 0.82, -3.4, g);
      [[0.6, -3.05], [2.2, -3.05], [0.6, -3.75], [2.2, -3.75]].forEach(([x, z]) => box(0.06, 0.8, 0.06, M("#3a3f4b", { metalness: 0.5 }), x, 0.41, z, g));
      box(0.9, 0.55, 0.04, M("#151a24", { metalness: 0.4 }), 1.4, 1.32, -3.6, g);
      const mon = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.49), new THREE.MeshBasicMaterial({ map: laptopTex }));
      mon.position.set(1.4, 1.32, -3.575);
      g.add(mon);
      box(0.06, 0.25, 0.06, M("#151a24"), 1.4, 0.98, -3.65, g);
      // Netzwerk-Bögen mit Datenpaketen
      const curves = [];
      const arcM = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.45 });
      for (let i = 0; i < tops.length - 1; i++) {
        const a = tops[i], b = tops[i + 1];
        const cv = new THREE.QuadraticBezierCurve3(a, new THREE.Vector3((a.x + b.x) / 2, 3.9, a.z + 0.3), b);
        g.add(new THREE.Mesh(new THREE.TubeGeometry(cv, 24, 0.018, 6), arcM));
        curves.push(cv);
      }
      const packets = [];
      for (let i = 0; i < 9; i++) { const s = glowSprite(i % 2 ? "#5fd4ff" : "#5be3a0", 0.28); g.add(s); packets.push({ s, c: curves[i % curves.length], o: i / 9 }); }
      // aufsteigende Bits
      const bitTex = ["0", "1"].map((d) => canvasTex(64, 64, (x, w, h) => { x.font = "bold 48px Consolas, monospace"; x.fillStyle = "#9feaff"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(d, w / 2, h / 2); }));
      const bits = [];
      for (let i = 0; i < 22; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: bitTex[i % 2], transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7 }));
        s.scale.setScalar(0.28);
        g.add(s);
        bits.push({ s, x: rnd(-5.5, 2.5), z: rnd(-5, -2.5), o: rnd(0, 1), sp: rnd(0.15, 0.35) });
      }
      tickers.push((t) => {
        if (!g.visible) return;
        code.offset.y = (t * 0.035) % 1;
        laptopTex.offset.y = (t * 0.05) % 1;
        holos.forEach((h) => { h.s.position.y = h.y + Math.sin(t * 0.9 + h.i * 2) * 0.08; });
        packets.forEach((p) => { p.c.getPoint((t * 0.45 + p.o) % 1, p.s.position); });
        bits.forEach((b) => { const k = (t * b.sp + b.o) % 1; b.s.position.set(b.x, 0.3 + k * 4.5, b.z); b.s.material.opacity = Math.sin(k * Math.PI) * 0.75; });
      });
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
  cyl(3.6, 3.3, 0.55, F("#4b5a7a"), 0, -0.05, 0, island, 11);
  cyl(3.5, 3.5, 0.12, F("#5f9e45"), 0, 0.28, 0, island, 11);
  mesh(new THREE.ConeGeometry(3.3, 4.2, 11), F("#3a4560"), 0, -2.42, 0, island).rotation.x = Math.PI;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU + 0.3;
    mesh(new THREE.DodecahedronGeometry(rnd(0.14, 0.26), 0), F("#6b7590"), Math.cos(a) * 3.15, 0.36, Math.sin(a) * 3.15, island);
  }
  // Luzerner Fahne auf der Wiese neben der Insel
  const luFlag = flagPole(4.2, flagTex.luzern, 1.2, 1.2);
  luFlag.position.set(-5.4, 0, -8);
  menuG.add(luFlag);
  island.position.y = 0.2;
  // Seitenlicht statt Kristallen: die gewählte Menü-Seite färbt die Insel leicht ein
  const sideLights = { wissen: new THREE.PointLight("#4a95e8", 0, 9), arena: new THREE.PointLight("#ff7a3d", 0, 9) };
  sideLights.wissen.position.set(-3.2, 2.6, 1.2);
  sideLights.arena.position.set(3.2, 2.6, 1.2);
  menuG.add(sideLights.wissen, sideLights.arena);
  let menuSide = null;

  /* ---------- Dorfplatz (Wissen): Kopfsteinpflaster, Brunnen, Laternen, Wimpelketten ---------- */
  const wissenG = new THREE.Group();
  scene.add(wissenG);
  wissenG.visible = false;
  const PZ = -2; // Mitte des Dorfplatzes
  const cobbleTex = canvasTex(1024, 1024, (x, w, h) => {
    const cx = w / 2, cy = h / 2;
    x.fillStyle = "#7d7466"; // Fugen
    x.fillRect(0, 0, w, h);
    // Fächerpflaster: Steinreihen in Kreisen um den Brunnen
    for (let r = 12, row = 0; r < w / 2 - 14; r += 17, row++) {
      const n = Math.max(6, Math.round((TAU * r) / 19));
      for (let k = 0; k < n; k++) {
        const a = ((k + (row % 2) * 0.5) / n) * TAU;
        x.fillStyle = `hsl(${rnd(26, 40)}, ${rnd(8, 18)}%, ${rnd(56, 72)}%)`;
        x.save();
        x.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        x.rotate(a + rnd(-0.06, 0.06));
        x.beginPath();
        x.roundRect(-6.5, -7.5, 13, 15, 4);
        x.fill();
        x.restore();
      }
    }
    // Randsteine
    x.strokeStyle = "#b3a68f";
    x.lineWidth = 22;
    x.beginPath(); x.arc(cx, cy, w / 2 - 11, 0, TAU); x.stroke();
  });
  const curbM = F("#a39780", { roughness: 0.95 });
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(7.8, 7.95, 0.14, 64), [curbM, new THREE.MeshStandardMaterial({ map: cobbleTex, roughness: 0.92 }), curbM]);
  plaza.position.set(0, 0.05, PZ);
  plaza.receiveShadow = true;
  wissenG.add(plaza);

  // Brunnen in der Platzmitte (achteckiger Trog, Säule, Luzerner Fähnchen)
  const fountain = new THREE.Group();
  fountain.position.set(0, 0.12, PZ);
  wissenG.add(fountain);
  const fStone = F("#bfae90", { roughness: 0.9 }), fStone2 = F("#a5916f", { roughness: 0.9 });
  const fIron = M("#3a3c42", { metalness: 0.7, roughness: 0.4 });
  cyl(1.75, 1.85, 0.66, fStone2, 0, 0.33, 0, fountain, 8);
  cyl(1.52, 1.52, 0.04, M("#3f86b8", { roughness: 0.08, metalness: 0.25, emissive: "#0d3a5a", emissiveIntensity: 0.35 }), 0, 0.67, 0, fountain, 8);
  cyl(0.24, 0.3, 2.1, fStone, 0, 1.7, 0, fountain, 8);
  cyl(0.62, 0.24, 0.26, fStone2, 0, 1.55, 0, fountain, 8);
  cyl(0.34, 0.27, 0.2, fStone2, 0, 2.82, 0, fountain, 8);
  const fFlag = flagPole(0.9, flagTex.luzern, 0.55, 0.4);
  fFlag.position.y = 2.92;
  fountain.add(fFlag);
  const spouts = [];
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * TAU + Math.PI / 4;
    const s = cyl(0.035, 0.035, 0.55, fIron, Math.cos(a) * 0.5, 1.25, Math.sin(a) * 0.5, fountain, 6);
    s.rotation.set(0, -a, Math.PI / 2 - 0.25);
    spouts.push({ p: new THREE.Vector3(Math.cos(a) * 0.78, 1.3, PZ + Math.sin(a) * 0.78), d: new THREE.Vector3(Math.cos(a), 0, Math.sin(a)) });
  }

  // Strassenlaternen im Halbkreis hinter dem Brunnen
  const lampM = M("#2b2d33", { metalness: 0.6, roughness: 0.45 });
  const lampGlass = M("#ffe2a0", { emissive: "#ffb84a", emissiveIntensity: 1.6 });
  const lampTops = [], lampGlows = [];
  [1.04, 1.22, 1.41, 1.59, 1.78, 1.96].forEach((k) => {
    const a = k * Math.PI, x = Math.cos(a) * 8.7, z = PZ + Math.sin(a) * 8.7;
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    wissenG.add(g);
    cyl(0.2, 0.26, 0.3, lampM, 0, 0.15, 0, g, 8);
    cyl(0.06, 0.08, 3.0, lampM, 0, 1.6, 0, g, 8);
    box(0.42, 0.05, 0.42, lampM, 0, 3.05, 0, g);
    box(0.32, 0.42, 0.32, lampGlass, 0, 3.28, 0, g).castShadow = false;
    mesh(new THREE.ConeGeometry(0.32, 0.26, 4), lampM, 0, 3.62, 0, g).rotation.y = Math.PI / 4;
    const gl = glowSprite("#ffc46b", 1.4, 0.65);
    gl.position.y = 3.28;
    g.add(gl);
    lampGlows.push(gl);
    lampTops.push(new THREE.Vector3(x, 3.05, z));
  });

  // Wimpelketten zwischen den Laternen (rot-weiss-blau wie an einem Dorffest)
  const pennantGeo = new THREE.BufferGeometry();
  pennantGeo.setAttribute("position", new THREE.Float32BufferAttribute([-0.15, 0, 0, 0.15, 0, 0, 0, -0.36, 0], 3));
  pennantGeo.computeVertexNormals();
  const pennantM = ["#d52b1e", "#ffffff", "#1f6fc5", "#ffd23f"].map((c) => F(c, { side: THREE.DoubleSide, roughness: 0.8 }));
  const ropeM = new THREE.LineBasicMaterial({ color: "#3a3026" });
  const pennants = [];
  for (let i = 0; i < lampTops.length - 1; i++) {
    const A = lampTops[i], B = lampTops[i + 1];
    const at = (u) => new THREE.Vector3().lerpVectors(A, B, u).add(new THREE.Vector3(0, -0.7 * 4 * u * (1 - u), 0));
    const pts = [];
    for (let k = 0; k <= 16; k++) pts.push(at(k / 16));
    wissenG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ropeM));
    const n = Math.round(A.distanceTo(B) / 0.45);
    const yaw = -Math.atan2(B.z - A.z, B.x - A.x);
    for (let k = 1; k < n; k++) {
      const p = new THREE.Mesh(pennantGeo, pennantM[(k + i) % 4]);
      p.position.copy(at(k / n));
      p.rotation.order = "YXZ";
      p.rotation.y = yaw;
      wissenG.add(p);
      pennants.push(p);
    }
  }

  // Sitzbänke und Geranien-Tröge am Platzrand
  const benchWood = F("#8a5a33", { roughness: 0.85 }), benchDark = F("#5c3a22", { roughness: 0.9 });
  [1.13, 1.87].forEach((k) => {
    const a = k * Math.PI, g = new THREE.Group();
    g.position.set(Math.cos(a) * 6.4, 0.12, PZ + Math.sin(a) * 6.4);
    g.rotation.y = -a - Math.PI / 2;
    box(1.8, 0.08, 0.45, benchWood, 0, 0.45, 0, g);
    box(1.8, 0.35, 0.06, benchWood, 0, 0.75, -0.22, g).rotation.x = -0.15;
    [-0.75, 0.75].forEach((lx) => box(0.08, 0.45, 0.4, benchDark, lx, 0.22, 0, g));
    wissenG.add(g);
  });
  const geranium = [F("#e8263c"), F("#ff5c7a"), F("#ffffff")];
  [1.31, 1.69].forEach((k) => {
    const a = k * Math.PI, g = new THREE.Group();
    g.position.set(Math.cos(a) * 7.2, 0.12, PZ + Math.sin(a) * 7.2);
    g.rotation.y = -a - Math.PI / 2;
    box(1.4, 0.4, 0.45, benchDark, 0, 0.2, 0, g);
    box(1.3, 0.12, 0.4, F("#3f6b2c"), 0, 0.44, 0, g);
    for (let f = 0; f < 9; f++) sph(0.09, geranium[f % 3], -0.6 + f * 0.15, 0.55 + (f % 2) * 0.05, rnd(-0.1, 0.1), g, 6).castShadow = false;
    wissenG.add(g);
  });
  const wissenProps = [...wissenG.children]; // beim Mühlerad ausgeblendet

  const arenaG = new THREE.Group();
  scene.add(arenaG);
  arenaG.visible = false;
  /* ---------- Arena: Sägemehl-Ring wie am Schwingfest, Feuerschalen, Tribünen ---------- */
  const AZ = -1.5, AR = 6.3; // Ringmitte & Radius
  const sawTex = canvasTex(512, 512, (x, w, h) => {
    x.fillStyle = "#d7b47a"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      x.fillStyle = `hsl(${rnd(30, 42)}, ${rnd(35, 60)}%, ${rnd(48, 82)}%)`;
      x.fillRect(rnd(0, w), rnd(0, h), rnd(1, 3), rnd(1, 3));
    }
    // vom Rechen gezogene Kreise
    x.strokeStyle = "rgba(120,80,40,0.16)";
    for (let r = 20; r < w / 2; r += 14) { x.lineWidth = rnd(2, 4); x.beginPath(); x.arc(w / 2, h / 2, r + rnd(-2, 2), 0, TAU); x.stroke(); }
  });
  const sawdust = new THREE.Mesh(new THREE.CylinderGeometry(AR, AR, 0.06, 64), [F("#b8955e"), new THREE.MeshStandardMaterial({ map: sawTex, roughness: 1 }), F("#b8955e")]);
  sawdust.position.set(0, 0.03, AZ);
  sawdust.receiveShadow = true;
  arenaG.add(sawdust);
  // Bretter-Umrandung, vorne offen als Eingang
  const plankM = [F("#8a5a33", { roughness: 0.85 }), F("#7a4e2c", { roughness: 0.88 })];
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * TAU;
    if (angDist(a, Math.PI / 2) < 0.42) continue;
    const b = box(0.98, 0.32, 0.12, plankM[k % 2], Math.cos(a) * (AR + 0.08), 0.16, AZ + Math.sin(a) * (AR + 0.08), arenaG);
    b.rotation.y = -a + Math.PI / 2;
  }
  // Findlinge und Heuballen – nur seitlich und hinten, nie zwischen Kamera und Drucker
  const granite = [F("#8f8b84", { roughness: 0.95 }), F("#77736d", { roughness: 0.95 })], hayM = F("#d9b45a", { roughness: 1 }), hayEnd = F("#c49a40", { roughness: 1 });
  for (let i = 0; i < 16; i++) {
    const a = Math.PI * 0.92 + (i / 15) * Math.PI * 1.16;
    const x = Math.cos(a) * rnd(10, 15), z = -6 + Math.sin(a) * rnd(7, 11);
    if (i % 3 === 0) {
      const hb = new THREE.Group();
      hb.position.set(x, 0.62, z);
      hb.rotation.y = rnd(0, TAU);
      cyl(0.62, 0.62, 1.15, [hayM, hayEnd, hayEnd], 0, 0, 0, hb, 14).rotation.z = Math.PI / 2;
      arenaG.add(hb);
    } else {
      const r = mesh(new THREE.DodecahedronGeometry(rnd(0.7, 1.9), 0), granite[i % 2], x, rnd(0, 0.6), z, arenaG);
      r.rotation.set(rnd(0, 3), rnd(0, 3), 0);
      r.scale.y = 0.7;
    }
  }
  // Holztribünen links und rechts
  [-1, 1].forEach((s) => {
    const g = new THREE.Group();
    g.position.set(s * 10.5, 0, AZ - 2.5);
    g.rotation.y = s * -Math.PI / 2 + s * 0.35;
    for (let k = 0; k < 3; k++) {
      box(5.5, 0.12, 0.7, plankM[0], 0, 0.5 + k * 0.5, -k * 0.75, g);
      box(5.5, 0.5 + k * 0.5, 0.08, plankM[1], 0, (0.5 + k * 0.5) / 2, -k * 0.75 + 0.3, g);
    }
    arenaG.add(g);
  });
  // Fahnen hinter dem Ring
  [[-3.6, flagTex.schweiz], [3.6, flagTex.luzern]].forEach(([x, tex]) => {
    const fp = flagPole(4.6, tex, 1.2, 1.2);
    fp.position.set(x, 0, AZ - AR - 1.6);
    arenaG.add(fp);
  });
  // Feuerschalen auf Holzpfosten
  const torches = [];
  const bowlM = M("#2c2f36", { metalness: 0.7, roughness: 0.45 }), logM = F("#4a2e1a");
  [[-5.2, -6.6], [5.2, -6.6], [-8.6, -3.2], [8.6, -3.2]].forEach(([x, z]) => {
    cyl(0.12, 0.16, 1.5, plankM[1], x, 0.75, z, arenaG, 6);
    cyl(0.5, 0.26, 0.32, bowlM, x, 1.62, z, arenaG, 10);
    for (let k = 0; k < 3; k++) box(0.55, 0.1, 0.1, logM, x, 1.82, z, arenaG).rotation.y = (k / 3) * Math.PI;
    const f = glowSprite("#ff9a2f", 1.4);
    f.position.set(x, 2.15, z);
    arenaG.add(f);
    const l = new THREE.PointLight("#ff8a3a", 1.6, 11);
    l.position.set(x, 2.3, z);
    arenaG.add(l);
    torches.push({ f, l, p: new THREE.Vector3(x, 1.95, z) });
  });
  // Markierung, wo die Figur steht
  const arenaRing = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.12, 48), new THREE.MeshBasicMaterial({ color: "#fff1cf", transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false }));
  arenaRing.rotation.x = -Math.PI / 2;
  arenaRing.position.y = 0.065;
  arenaG.add(arenaRing);

  /* =====================================================================
     MÜHLERAD (Rollenwahl) & BÜHNE
     Die Rollen stehen auf Gondeln vor einem grossen hölzernen Wasserrad.
     Die gewählte Rolle fährt nach oben ins Scheinwerferlicht, unten dreht
     das Rad durch den Mühlebach.
     ===================================================================== */
  const carousel = new THREE.Group();
  scene.add(carousel);
  carousel.visible = false;
  let carChars = [];
  let carIndex = 0, carTurn = 0, carAngle = 0, carPrev = 0;
  const WR = 4.2, WCY = 0.4, WZ = 1.3, WLVL = 0.2; // Radius, Achshöhe, Gondeln vor dem Rad, Wasserspiegel
  const WTOP = WCY + WR;
  const wheel = new THREE.Group();
  wheel.position.y = WCY;
  carousel.add(wheel);
  const woodM = F("#8a5a33", { roughness: 0.85 }), woodDM = F("#5c3a22", { roughness: 0.9 }), ironM = M("#2c2f36", { metalness: 0.7, roughness: 0.4 });
  const lanterns = [];
  {
    [-0.52, 0.52].forEach((z) => {
      // Felgen aussen + innen, Eisenreif, acht Speichen pro Seite
      [[WR, 0.14], [WR - 0.78, 0.09]].forEach(([r, tube]) => (mesh(new THREE.TorusGeometry(r, tube, 6, 72), woodM, 0, 0, z, wheel).castShadow = false));
      mesh(new THREE.TorusGeometry(WR + 0.03, 0.05, 4, 72), ironM, 0, 0, z + Math.sign(z) * 0.1, wheel).castShadow = false;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * TAU + Math.PI / 8;
        const sp = box(0.17, WR - 0.25, 0.15, woodDM, (Math.sin(a) * (WR - 0.25)) / 2, (Math.cos(a) * (WR - 0.25)) / 2, z, wheel);
        sp.rotation.z = -a;
        sp.castShadow = false;
      }
    });
    // Schaufeln zwischen den Felgen
    for (let k = 0; k < 30; k++) {
      const a = (k / 30) * TAU;
      const p = box(0.08, 0.74, 1.08, woodM, Math.sin(a) * (WR - 0.38), Math.cos(a) * (WR - 0.38), 0, wheel);
      p.rotation.z = -a;
      p.castShadow = false;
    }
    // Nabe mit Bolzen
    cyl(0.6, 0.6, 1.5, ironM, 0, 0, 0, wheel, 16).rotation.x = Math.PI / 2;
    for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU; sph(0.07, M("#c9a227", { metalness: 0.8, roughness: 0.3 }), Math.sin(a) * 0.42, Math.cos(a) * 0.42, 0.77, wheel, 8); }
    // Achse läuft nach hinten in einen Steinpfeiler (dreht nicht mit)
    cyl(0.22, 0.22, 2.4, ironM, 0, WCY, -1.7, carousel, 10).rotation.x = Math.PI / 2;
    box(1.6, WCY + 1.6, 1.2, F("#8d8272", { roughness: 0.95 }), 0, (WCY + 1.6) / 2 - 0.6, -3.2, carousel);
    box(1.8, 0.25, 1.4, F("#a0947f", { roughness: 0.95 }), 0, WCY + 1.05, -3.2, carousel);
  }
  // Mühlebach mit gemauertem Ufer
  const brookTex = canvasTex(256, 256, (x, w, h) => {
    x.fillStyle = "#1d6d9a"; x.fillRect(0, 0, w, h);
    x.strokeStyle = "rgba(200,240,255,0.45)"; x.lineCap = "round";
    for (let i = 0; i < 40; i++) { const px = rnd(0, w), py = rnd(0, h), l = rnd(14, 46); x.lineWidth = rnd(1.5, 3.5); x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + l / 2, py - 4, px + l, py); x.stroke(); }
  });
  brookTex.wrapS = brookTex.wrapT = THREE.RepeatWrapping;
  brookTex.repeat.set(4, 2);
  const brook = new THREE.Mesh(new THREE.PlaneGeometry(22, 6), new THREE.MeshStandardMaterial({ map: brookTex, roughness: 0.15, metalness: 0.1, emissive: "#0a3a5a", emissiveIntensity: 0.5, transparent: true, opacity: 0.92 }));
  brook.rotation.x = -Math.PI / 2;
  brook.position.set(0, WLVL, 0.4);
  carousel.add(brook);
  const wallM = F("#9a8e7c", { roughness: 0.95 });
  [-2.65, 3.45].forEach((z) => box(22.4, 0.6, 0.5, wallM, 0, WLVL - 0.12, z, carousel));
  // Gondeln: Holzbrett mit leuchtendem Sockel in der Rollenfarbe
  const gondolas = [];
  // Lichtkegel, Ring und Funken markieren den Platz oben am Rad
  const beamTex = canvasTex(4, 128, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,1)"); x.fillStyle = gr; x.fillRect(0, 0, w, h); }, false);
  const hiBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.15, 6, 32, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, color: "#ffffff", transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  hiBeam.position.set(0, WTOP + 3.1, WZ);
  carousel.add(hiBeam);
  const hiRing = new THREE.Mesh(new THREE.RingGeometry(0.66, 0.86, 48), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  hiRing.rotation.x = -Math.PI / 2;
  hiRing.position.set(0, WTOP + 0.13, WZ);
  carousel.add(hiRing);
  const hiSparks = [];
  for (let i = 0; i < 12; i++) { const s = glowSprite("#ffffff", 0.16, 0.9); carousel.add(s); hiSparks.push(s); }
  let charList = [];

  function buildCarousel(list) {
    if (carChars.length) return;
    charList = list;
    const n = list.length;
    list.forEach((c, i) => {
      const ch = getChar(c, "car");
      carousel.add(ch.obj);
      const gd = new THREE.Group();
      box(1.2, 0.1, 1.0, woodM, 0, -0.05, 0, gd);
      box(0.14, 0.12, WZ - 0.5, woodDM, 0, -0.08, -(WZ - 0.5) / 2 - 0.45, gd); // Halterung zum Rad
      cyl(0.5, 0.56, 0.08, M(c.color, { emissive: c.color, emissiveIntensity: 0.5, roughness: 0.3 }), 0, 0.04, 0, gd, 28);
      carousel.add(gd);
      gondolas.push(gd);
      carChars.push(ch);
      // Laterne auf der Felge zwischen zwei Gondeln
      const a = ((i + 0.5) / n) * TAU;
      const lg = new THREE.Group();
      lg.position.set(Math.sin(a) * WR, Math.cos(a) * WR, 0.68);
      sph(0.09, M("#ffd27a", { emissive: "#ffb340", emissiveIntensity: 2 }), 0, 0, 0, lg, 10);
      const gl = glowSprite("#ffb340", 0.9, 0.7);
      lg.add(gl);
      wheel.add(lg);
      lanterns.push(gl);
    });
  }

  const stage = new THREE.Group();
  scene.add(stage);
  let stageChar = null;
  const stagePed = cyl(0.95, 1.05, 0.25, M("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.25 }), 0, 0.125, 0, stage, 48);
  const stageGlow = glowSprite("#ffffff", 1, 0.45);
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
    stagePed.material = M(c.color, { emissive: c.color, emissiveIntensity: 0.4, roughness: 0.3 });
    stageGlow.material.color = C(c.color);
    stageChar.rigs.forEach((r) => (r.jump = 0.8));
  }

  let menuHeroes = [];

  /* =====================================================================
     DER PRINTNIGHTMARE-DRUCKER (Endgegner)
     Ein vom PrintNightmare-Virus befallener Bürodrucker: flattert mit Papier-
     flügeln, schnappt mit dem Scannerdeckel, zieht sein Stromkabel hinter sich
     her und spuckt bei falschen Antworten brennendes Papier ("lp0 on fire").
     ===================================================================== */
  const paperTex = canvasTex(64, 90, (x, w, h) => {
    x.fillStyle = "#fbfbf4"; x.fillRect(0, 0, w, h);
    x.fillStyle = "#d63031"; x.fillRect(6, 5, 22, 5);
    x.fillStyle = "#9aa3b5";
    for (let i = 0; i < 9; i++) x.fillRect(6, 16 + i * 8, 20 + ((i * 37) % 32), 3);
  });
  const paperMat = new THREE.MeshStandardMaterial({ map: paperTex, side: THREE.DoubleSide, roughness: 0.9, emissive: "#ffffff", emissiveIntensity: 0.12 });
  const printer = (() => {
    const g = new THREE.Group();
    const scale = new THREE.Group();
    g.add(scale);
    // eigene Materialien (nicht aus dem Cache) – der Treffer-Blitz verändert sie
    const body = new THREE.MeshStandardMaterial({ color: "#d9dce3", roughness: 0.45, metalness: 0.05, emissive: "#000000" });
    const dark = M("#3a3f4a", { roughness: 0.5 });
    const black = M("#15171c", { roughness: 0.4 });
    const core = new THREE.Object3D();
    scale.add(core);
    // Gehäuse + Papierschublade
    mesh(G("pBody", () => new THREE.BoxGeometry(1.7, 0.72, 1.25)), body, 0, 0, 0, scale);
    box(1.62, 0.3, 1.18, dark, 0, -0.5, 0.01, scale);
    box(0.5, 0.06, 0.04, black, 0, -0.5, 0.605, scale);
    // Ausgabeschlitz = Maul, darunter die Ablage
    box(1.25, 0.09, 0.05, black, 0, -0.2, 0.61, scale);
    const tray = box(1.1, 0.03, 0.5, M("#c3c7cf", { roughness: 0.5 }), 0, -0.27, 0.82, scale);
    tray.rotation.x = 0.18;
    // herausgestrecktes Blatt = Zunge
    const tongue = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.42), paperMat);
    tongue.rotation.x = -Math.PI / 2 + 0.35;
    tongue.position.set(0, -0.22, 0.8);
    scale.add(tongue);
    const mouthPos = new THREE.Object3D();
    mouthPos.position.set(0, -0.2, 0.8);
    scale.add(mouthPos);
    // Gesicht: Display vorne, wird laufend neu gezeichnet (Glitch)
    const faceC = document.createElement("canvas");
    faceC.width = 256; faceC.height = 112;
    const faceTex = new THREE.CanvasTexture(faceC);
    faceTex.encoding = THREE.sRGBEncoding;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.46), new THREE.MeshBasicMaterial({ map: faceTex }));
    face.position.set(0, 0.11, 0.645); // vor dem Rahmen (Rahmen-Front liegt bei z = 0.628)
    scale.add(face);
    box(1.13, 0.54, 0.02, black, 0, 0.11, 0.618, scale);
    const faceGlow = glowSprite("#ff2d2d", 2.2, 0.35);
    faceGlow.position.set(0, 0.11, 0.8);
    scale.add(faceGlow);
    // Bedienfeld mit blinkenden LEDs
    const leds = [];
    for (let i = 0; i < 4; i++) {
      const l = sph(0.035, new THREE.MeshBasicMaterial({ color: "#ff3030" }), 0.62 + (i % 2) * 0.1, 0.2 - Math.floor(i / 2) * 0.1, 0.63, scale, 8);
      l.castShadow = false;
      leds.push(l);
    }
    // Scannerdeckel = Kiefer (Scharnier hinten), darunter grün glühendes Virus-Glas
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.05), new THREE.MeshBasicMaterial({ color: "#39ff7a" }));
    glass.rotation.x = -Math.PI / 2;
    glass.position.set(0, 0.362, 0);
    scale.add(glass);
    const jaw = new THREE.Group();
    jaw.position.set(0, 0.36, -0.62);
    scale.add(jaw);
    const lid = mesh(G("pLid", () => new THREE.BoxGeometry(1.74, 0.13, 1.27)), body, 0, 0.065, 0.62, jaw);
    box(1.0, 0.02, 0.4, black, -0.15, 0.135, 0.75, jaw);
    // Virus: grüne Adern auf dem Gehäuse
    const veinTex = canvasTex(256, 128, (x, w, h) => {
      x.clearRect(0, 0, w, h);
      x.strokeStyle = "#5bff8f"; x.lineCap = "round"; x.lineJoin = "round";
      for (let i = 0; i < 9; i++) {
        let px = rnd(0, w), py = rnd(0, h);
        x.lineWidth = rnd(1.5, 3.5);
        x.beginPath(); x.moveTo(px, py);
        for (let k = 0; k < 6; k++) { if (k % 2) px += rnd(-40, 40); else py += rnd(-30, 30); x.lineTo(px, py); }
        x.stroke();
        x.fillStyle = "#b6ffcc"; x.beginPath(); x.arc(px, py, 3.5, 0, TAU); x.fill();
      }
    });
    const veinMat = new THREE.MeshBasicMaterial({ map: veinTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    [-1, 1].forEach((s) => {
      const v = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.72), veinMat);
      v.rotation.y = s * Math.PI / 2;
      v.position.set(s * 0.856, 0, 0);
      scale.add(v);
    });
    const vb = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.72), veinMat);
    vb.position.set(0, 0, -0.63);
    vb.rotation.y = Math.PI;
    scale.add(vb);
    // auch vorne sichtbar: Adern über Gehäuse und Schublade (das Display liegt davor)
    const vf = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.02), veinMat);
    vf.position.set(0, -0.15, 0.636);
    scale.add(vf);
    // giftgrünes Leuchten aus dem Ausgabeschlitz
    const slotGlow = glowSprite("#39ff7a", 1.3, 0.55);
    slotGlow.scale.set(1.9, 0.5, 1);
    slotGlow.position.set(0, -0.2, 0.7);
    scale.add(slotGlow);
    // Flügel aus aufgefächertem Papier
    const sheetGeo = new THREE.PlaneGeometry(0.95, 0.62);
    sheetGeo.translate(0.47, 0, 0);
    function wing(side) {
      const w = new THREE.Group();
      w.position.set(side * 0.86, 0.22, -0.1);
      for (let k = 0; k < 4; k++) {
        const sh = new THREE.Mesh(sheetGeo, paperMat);
        sh.castShadow = true;
        sh.rotation.set(Math.PI / 2 - 0.15, 0, side * (0.45 - k * 0.32));
        sh.position.set(0, k * 0.012, -k * 0.16);
        if (side < 0) sh.scale.x = -1;
        w.add(sh);
      }
      scale.add(w);
      return w;
    }
    const wL = wing(-1), wR = wing(1);
    // Stromkabel als Schwanz mit Schweizer Stecker (Typ J)
    const segs = [];
    for (let i = 0; i < 12; i++) {
      const s = sph(0.055, black, 0, -0.15 - i * 0.04, -0.68 - i * 0.2, scale, 8);
      s.userData.base = s.position.clone();
      segs.push(s);
    }
    const plug = new THREE.Group();
    box(0.2, 0.14, 0.22, M("#f2f2f2", { roughness: 0.5 }), 0, 0, -0.08, plug);
    [-0.05, 0.05, 0].forEach((x, k) => cyl(0.018, 0.018, 0.12, M("#c9a227", { metalness: 0.8, roughness: 0.3 }), x, k === 2 ? -0.035 : 0.015, -0.24, plug, 6).rotation.x = Math.PI / 2);
    segs[segs.length - 1].add(plug);
    scale.scale.setScalar(1.7);
    g.visible = false;
    scene.add(g);
    return { g, scale, segs, core, head: core, jaw, wL, wR, mouthPos, body, tongue, leds, face: { c: faceC, tex: faceTex, t: 0 }, faceGlow, glass, state: "fly", t0: 0, hp: 1 };
  })();
  // Display-Gesicht: böse Augen, Zickzack-Mund, Fehlermeldung – mit Glitch-Versatz
  function drawFace(mood, t) {
    const f = printer.face, x = f.c.getContext("2d"), w = f.c.width, h = f.c.height;
    const bg = mood === "hit" ? "#0b2a6b" : mood === "attack" ? "#3a0000" : "#050a06";
    x.fillStyle = bg; x.fillRect(0, 0, w, h);
    const gx = Math.random() < 0.25 ? rnd(-8, 8) : 0;
    x.save(); x.translate(gx, 0);
    const col = mood === "hit" ? "#9fd8ff" : "#ff2d2d";
    x.fillStyle = col; x.strokeStyle = col; x.lineWidth = 7; x.lineCap = "round";
    if (mood === "hit") {
      [[70, 40], [186, 40]].forEach(([cx, cy]) => { x.beginPath(); x.moveTo(cx - 14, cy - 14); x.lineTo(cx + 14, cy + 14); x.moveTo(cx + 14, cy - 14); x.lineTo(cx - 14, cy + 14); x.stroke(); });
    } else {
      const blink = Math.sin(t * 2.3) > 0.97;
      [[70, 1], [186, -1]].forEach(([cx, s]) => {
        x.beginPath();
        if (blink) { x.moveTo(cx - 20, 42); x.lineTo(cx + 20, 42); x.stroke(); return; }
        x.moveTo(cx - 22, 30 - s * 10); x.lineTo(cx + 22, 30 + s * 10); x.lineTo(cx + 16, 56); x.lineTo(cx - 16, 56); x.closePath(); x.fill();
      });
      x.fillStyle = "#ffe0e0";
      [[70, 46], [186, 46]].forEach(([cx, cy]) => x.fillRect(cx - 4, cy - 4, 8, 8));
    }
    x.strokeStyle = col; x.lineWidth = 5; x.beginPath();
    for (let i = 0; i <= 8; i++) x.lineTo(78 + i * 12.5, 76 + (i % 2 ? -7 : 7) * (mood === "attack" ? 1.6 : 1));
    x.stroke();
    x.font = "bold 15px Consolas, monospace"; x.textAlign = "center";
    x.fillStyle = mood === "hit" ? "#cfe9ff" : "#5bff8f";
    x.fillText(mood === "hit" ? "PATCH WIRD INSTALLIERT…" : mood === "attack" ? "lp0 on fire!" : "CVE-2021-34527", w / 2, 104);
    x.restore();
    // Scanlines
    x.fillStyle = "rgba(0,0,0,0.25)";
    for (let y = 0; y < h; y += 4) x.fillRect(0, y, w, 1);
    if (Math.random() < 0.3) { const y = rnd(0, h); x.drawImage(f.c, 0, y, w, 10, rnd(-14, 14), y, w, 10); }
    f.tex.needsUpdate = true;
  }
  // Papierblätter für die Salve und die Explosion
  const papers = [];
  const paperGeo = new THREE.PlaneGeometry(0.3, 0.42);
  for (let i = 0; i < 60; i++) {
    const m = new THREE.Mesh(paperGeo, paperMat);
    m.visible = false;
    scene.add(m);
    papers.push({ m, v: new THREE.Vector3(), spin: new THREE.Vector3(), life: 0, max: 1 });
  }
  let papi = 0;
  function emitPaper(pos, vel, life) {
    const p = papers[papi = (papi + 1) % papers.length];
    p.m.position.copy(pos);
    p.v.copy(vel);
    p.spin.set(rnd(-8, 8), rnd(-8, 8), rnd(-8, 8));
    p.life = p.max = life;
    p.m.scale.setScalar(1);
    p.m.visible = true;
  }

  /* ---------- Feuer & Effekte ---------- */
  const fx = [];
  const FXN = 260;
  for (let i = 0; i < FXN; i++) {
    const s = glowSprite("#ffffff", 1);
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
  let breathFired = false;
  let projectile = null;
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();

  function printerUpdate(t, dt) {
    const d = printer;
    if (!d.g.visible) return;
    const st = d.state;
    const el = t - d.t0;
    // Papierflügel flattern, Kabel schlängelt, Zunge (Blatt) wackelt, LEDs blinken
    const flap = st === "die" ? 0 : Math.sin(t * (st === "breath" ? 15 : 9));
    d.wL.rotation.z = 0.15 + flap * 0.6;
    d.wR.rotation.z = -0.15 - flap * 0.6;
    d.segs.forEach((s, i) => {
      const b = s.userData.base, k = i / d.segs.length;
      s.position.set(b.x + Math.sin(t * 2.4 - i * 0.6) * 0.2 * k, b.y + Math.sin(t * 3 - i * 0.5) * 0.15 * k - k * k * 0.5, b.z);
    });
    d.tongue.rotation.x = -Math.PI / 2 + 0.35 + Math.sin(t * 7) * 0.14;
    d.leds.forEach((l, i) => l.material.color.set(Math.sin(t * (5 + i * 2.3) + i) > 0 ? (i % 2 ? "#5bff8f" : "#ff3030") : "#301010"));
    d.glass.material.color.setHSL(0.38, 1, 0.42 + Math.sin(t * 6) * 0.12);
    // grüne Virus-Partikel steigen auf
    if (st !== "die" && Math.random() < dt * 16) {
      d.core.getWorldPosition(tmp);
      tmp.x += rnd(-1.5, 1.5); tmp.y += rnd(-0.6, 0.9); tmp.z += rnd(-1, 1);
      emit(tmp, tmp2.set(rnd(-0.3, 0.3), rnd(0.4, 1.1), rnd(-0.3, 0.3)), rnd(0.8, 1.5), "virus", rnd(0.18, 0.36));
    }
    // Display ca. 12× pro Sekunde neu zeichnen (Glitch)
    const mood = st === "hit" ? "hit" : st === "breath" || st === "roar" ? "attack" : "idle";
    if (t - d.face.t > 0.08 || mood !== d.face.mood) { d.face.t = t; d.face.mood = mood; drawFace(mood, t); }
    d.faceGlow.material.color.set(mood === "hit" ? "#6fc3ff" : mood === "attack" ? "#ff4d1f" : "#ff2d2d");
    let target;
    if (st === "fly" || st === "roar") {
      target = tmp2.set(Math.sin(t * 0.45) * 3.0, 2.75 + Math.sin(t * 1.1) * 0.45, -6 + Math.sin(t * 0.7) * 1.2).clone();
      d.g.rotation.y = lerp(d.g.rotation.y, Math.cos(t * 0.45) * 0.35, 0.05);
      d.g.rotation.z = lerp(d.g.rotation.z, -Math.cos(t * 0.45) * 0.22, 0.05);
      d.g.rotation.x = lerp(d.g.rotation.x, 0.08, 0.05);
      // Brüllen = Scannerdeckel klappert weit offen
      const open = st === "roar" ? 0.55 + Math.sin(t * 28) * 0.15 : 0.06 + Math.max(0, Math.sin(t * 1.3)) * 0.14;
      d.jaw.rotation.x = lerp(d.jaw.rotation.x, -open, 0.2);
      if (st === "roar" && el > 1.6) d.state = "fly";
    } else if (st === "breath") {
      // Papierstau-Salve: brennende Blätter, Toner-Feuer und Virus fliegen zur Kamera
      target = new THREE.Vector3(0, 2.3, -2.4);
      d.g.rotation.y = lerp(d.g.rotation.y, 0, 0.1);
      d.g.rotation.z = lerp(d.g.rotation.z, 0, 0.1);
      d.g.rotation.x = lerp(d.g.rotation.x, 0.22, 0.1);
      d.jaw.rotation.x = lerp(d.jaw.rotation.x, el > 0.5 ? -0.75 + Math.sin(t * 34) * 0.08 : -0.2, 0.2);
      if (el > 0.55 && el < 1.9) {
        d.mouthPos.getWorldPosition(tmp);
        const aim = () => tmp2.copy(camera.position).add(new THREE.Vector3(rnd(-0.9, 0.9), rnd(-0.9, 0.4), 0)).sub(tmp).normalize();
        const fire = Math.min(30, Math.ceil(dt * 160));
        for (let k = 0; k < fire; k++) {
          aim().multiplyScalar(rnd(7, 10));
          tmp2.x += rnd(-1, 1); tmp2.y += rnd(-0.8, 0.8);
          emit(tmp, tmp2, rnd(0.5, 0.8), k % 4 ? "fire" : "virus", rnd(0.35, 0.6));
        }
        if (Math.random() < dt * 34) emitPaper(tmp, aim().multiplyScalar(rnd(6, 9)), rnd(0.8, 1.2));
        if (!breathFired && el > 1.05) { breathFired = true; shake = 0.35; api.onScorch && api.onScorch(); }
      }
      if (el > 2.5) d.state = "fly";
    } else if (st === "hit") {
      target = d.g.position.clone();
      d.g.rotation.x = lerp(d.g.rotation.x, el < 0.4 ? -0.6 : 0.08, 0.15);
      d.jaw.rotation.x = lerp(d.jaw.rotation.x, -0.9, 0.3);
      d.body.emissive.setScalar(el < 0.25 ? 0.9 : 0);
      if (el > 1) { d.body.emissive.setScalar(0); d.state = "fly"; }
    } else if (st === "die") {
      target = d.g.position.clone();
      target.y = Math.max(0.4, 3.4 - el * el * 1.6);
      d.g.rotation.z += dt * 3;
      d.g.rotation.x = lerp(d.g.rotation.x, 0.9, 0.05);
      d.jaw.rotation.x = -0.9;
      if (el > 1.6 && !d.exploded) {
        // explodiert in Papier-Konfetti und Funken
        d.exploded = true;
        d.g.getWorldPosition(tmp);
        for (let k = 0; k < 110; k++) emit(tmp, new THREE.Vector3(rnd(-1, 1), rnd(-0.2, 1.2), rnd(-1, 1)).normalize().multiplyScalar(rnd(3, 9)), rnd(0.8, 1.6), k % 3 === 0 ? "virus" : k % 2 ? "fire" : "gold", rnd(0.4, 1));
        for (let k = 0; k < 45; k++) emitPaper(tmp, new THREE.Vector3(rnd(-1, 1), rnd(0.2, 1.4), rnd(-1, 1)).normalize().multiplyScalar(rnd(3, 7)), rnd(1.6, 2.6));
        shake = 0.5;
        d.g.visible = false;
        api.onDefeated && api.onDefeated();
      }
    }
    d.g.position.lerp(target, 1 - Math.exp(-dt * (st === "breath" ? 4 : st === "die" ? 6 : 1.8)));
  }
  function papersUpdate(dt) {
    papers.forEach((p) => {
      if (p.life <= 0) { if (p.m.visible) p.m.visible = false; return; }
      p.life -= dt;
      p.v.y -= 3 * dt;
      p.v.multiplyScalar(1 - Math.min(0.5, dt * 0.7));
      p.m.position.addScaledVector(p.v, dt);
      p.m.rotation.x += p.spin.x * dt;
      p.m.rotation.y += p.spin.y * dt;
      p.m.rotation.z += p.spin.z * dt;
      const k = 1 - p.life / p.max;
      p.m.scale.setScalar(k > 0.8 ? Math.max(0.01, (1 - k) * 5) : 1);
    });
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
    onImpact: null,
    onDefeated: null,
    mode(name, o = {}) {
      curMode = name;
      show(menuG, name === "menu");
      show(wissenG, name === "wissen" || name === "carousel");
      show(arenaG, name === "arena" || name === "boss");
      show(carousel, name === "carousel");
      show(stage, name === "character");
      wissenProps.forEach((o) => (o.visible = name !== "carousel"));
      Object.values(envs).forEach((e) => show(e, false));
      if (name !== "boss") printer.g.visible = false;
      if (arenaHero && !(name === "arena" && o.hero)) { arenaG.remove(arenaHero.obj); arenaHero = null; }
      spot.intensity = 0;
      if (name === "menu") {
        setTheme(THEMES.menu);
        if (!menuHeroes.length && o.heroes) {
          const spots = [[-1.25, 0.55, 0.55, 0.35], [1.25, 0.55, 0.55, -0.35], [0, 0.55, -0.55, 0]];
          o.heroes.forEach((c, i) => {
            if (!c) return;
            const ch = getChar(c, "menu");
            const [x, y, z, ry] = spots[i] || spots[0];
            ch.obj.position.set(x, y, z);
            ch.obj.rotation.y = ry;
            island.add(ch.obj);
            menuHeroes.push(ch);
          });
        }
        // Figuren etwas höher im Bild: unten stehen die Menü-Knöpfe
        if (o.title) { camTgtPos.set(0, 2.7, 11); camTgtLook.set(0, 2.15, 0); }
        else { camTgtPos.set(0, 2.45, 11.5); camTgtLook.set(0, 1.45, 0); }
        api.menuSide(o.side || null);
      } else if (name === "wissen") {
        setTheme(THEMES.wissen);
        camTgtPos.set(0, 3.2, 11);
        camTgtLook.set(0, 2.4, 0);
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
        camTgtPos.set(0, WTOP + 1.9, WZ + 11);
        camTgtLook.set(0, WTOP - 0.25, WZ);
        spot.intensity = 2.2;
        spot.position.set(0, WTOP + 7, WZ + 3);
        spot.target.position.set(0, WTOP, WZ);
      } else if (name === "character") {
        const c = o.char;
        setTheme(themeFromColor(c.color));
        putOnStage(c);
        const sx = o.stageX != null ? o.stageX : -2.2;
        stage.position.set(sx, 0, 1.2);
        const env = getEnv(c);
        env.position.set(sx - 0.4, 0, 0.8);
        show(env, true);
        camTgtPos.set(0.2, 2.1, 7.6);
        camTgtLook.set(0.2, 1.4, 0);
        spot.intensity = 2;
        spot.position.set(sx, 7, 4);
        spot.target.position.set(sx, 0, 1.2);
      } else if (name === "boss") {
        setTheme(THEMES.arena);
        printer.g.visible = true;
        printer.exploded = false;
        printer.state = "roar";
        printer.t0 = clock.elapsedTime;
        printer.g.position.set(0, 9, -16);
        printer.g.rotation.set(0, 0, 0);
        printer.body.emissive.setScalar(0);
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
      if (instant) carAngle = -carTurn * (TAU / n);
      const c = charList[i];
      if (c) {
        setTheme(themeFromColor(c.color));
        hiBeam.material.color.set(c.color).lerp(C("#ffffff"), 0.35);
        hiRing.material.color.set(c.color).lerp(C("#ffffff"), 0.2);
        hiSparks.forEach((s) => s.material.color.set(c.color).lerp(C("#ffffff"), 0.5));
      }
      const ch = carChars[i];
      if (ch) ch.rigs.forEach((r) => (r.jump = 0.8));
    },
    menuSide(side) {
      menuSide = side;
      camTgtPos.x = side === "wissen" ? -0.6 : side === "arena" ? 0.6 : 0;
    },
    cheer() {
      if (arenaHero) arenaHero.rigs.forEach((r) => (r.jump = 0.8));
      if (stageChar) stageChar.rigs.forEach((r) => (r.jump = 0.8));
    },
    bossRoar() { printer.state = "roar"; printer.t0 = clock.elapsedTime; shake = 0.15; },
    bossAttack() { printer.state = "breath"; printer.t0 = clock.elapsedTime; breathFired = false; },
    bossHit() {
      // Wissensblitz (Patch) fliegt von der Kamera zum Drucker
      projectile = { p: camera.position.clone().add(new THREE.Vector3(0, -0.6, -0.5)), life: 0 };
    },
    bossDie() { printer.state = "die"; printer.t0 = clock.elapsedTime; },
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

  function applyTheme() {
    skyU.top.value.copy(cur.top);
    skyU.hor.value.copy(cur.hor);
    skyU.bot.value.copy(cur.bot);
    skyU.sunC.value.copy(cur.sun);
    skyU.sunDir.value.copy(cur.sunDir);
    scene.fog.color.copy(cur.fog);
    scene.fog.near = cur.fogN;
    scene.fog.far = cur.fogF;
    key.color.copy(cur.key); key.intensity = cur.keyI;
    back.color.copy(cur.back); back.intensity = cur.backI;
    back.position.copy(cur.sunDir).multiplyScalar(20);
    hemi.color.copy(cur.hemiS); hemi.groundColor.copy(cur.hemiG); hemi.intensity = cur.hemiI;
    rim.color.copy(cur.rim);
    pMat.color.copy(cur.p);
    terMat.color.copy(cur.tint);
    mtnMat.color.copy(cur.tint);
    waterMat.color.copy(cur.water);
    starMat.opacity = cur.stars;
    cloudMat.color.copy(cur.cloud);
    cloudMat.emissive.copy(cur.cloud);
    sunGlint.material.color.copy(cur.sun);
    sunGlint.position.x = cur.sunDir.x / Math.max(0.2, -cur.sunDir.z) * 70;
  }
  applyTheme();

  let frames = 0, perfAcc = 0, perfN = 0;
  // Diagnose-Anzeige nur mit ?dbg in der URL
  const DBG = location.search.includes("dbg") ? document.body.appendChild(Object.assign(document.createElement("div"), { style: "position:fixed;left:8px;bottom:8px;z-index:99;font:12px monospace;color:#0f0;background:#000a;padding:4px 8px" })) : null;
  function tick() {
    const dt = Math.min(clock.getDelta(), DBG ? 0.6 : 0.1);
    const t = clock.elapsedTime;

    // Farbwelt weich überblenden
    if (tgt && blend < 1) {
      const k = Math.min(1, dt * 2.5);
      COLOR_KEYS.forEach((c) => cur[c].lerp(tgt[c], k));
      NUM_KEYS.forEach((n) => (cur[n] = lerp(cur[n], tgt[n], k)));
      cur.sunDir.lerp(tgt.sunDir, k).normalize();
      blend = 1 - (1 - blend) * (1 - k);
      if (blend > 0.997) blend = 1;
      applyTheme();
    }
    if (envPending && (t - lastEnv > 0.35 || blend === 1)) {
      updateEnv();
      lastEnv = t;
      if (blend === 1) envPending = false;
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

    // Landschaft: Wellen, Wolken
    const wp = waterGeo.attributes.position;
    for (let i = 0; i < wp.count; i++) {
      const x = waterBase[i * 3], z = waterBase[i * 3 + 2];
      wp.array[i * 3 + 1] = Math.sin(x * 0.35 + t * 1.2) * 0.07 + Math.sin(z * 0.6 - t * 0.9 + x * 0.1) * 0.06;
    }
    wp.needsUpdate = true;
    waterGeo.computeVertexNormals();
    clouds.rotation.y = t * 0.004;
    waveFlags(t);

    // Menü
    if (menuG.visible) {
      island.position.y = 0.35 + Math.sin(t * 0.8) * 0.12;
      island.rotation.y = Math.sin(t * 0.2) * 0.15;
      const kl = 1 - Math.exp(-dt * 5);
      Object.entries(sideLights).forEach(([side, l]) => { l.intensity = lerp(l.intensity, menuSide === side ? 2.6 : 0, kl); });
      menuHeroes.forEach((h, i) => animateChar(h, t, (menuSide === "wissen" && i === 1) || (menuSide === "arena" && i === 0), dt));
    }
    // Wissen
    if (wissenG.visible && fountain.visible) {
      // Wimpel flattern, Laternen flackern leicht, Brunnen plätschert
      pennants.forEach((p, i) => (p.rotation.x = Math.sin(t * 2.2 + i * 0.7) * 0.22 + Math.sin(t * 5.1 + i) * 0.06));
      lampGlows.forEach((g, i) => g.scale.setScalar(1.4 + Math.sin(t * 9 + i * 2) * 0.04 + Math.sin(t * 2.3 + i) * 0.05));
      for (let cnt = 40 * dt; cnt > 0; cnt--) {
        if (Math.random() >= cnt) break;
        const s = spouts[(Math.random() * 4) | 0];
        emit(s.p, tmp2.copy(s.d).multiplyScalar(rnd(0.7, 1.0)).add(tmp.set(rnd(-0.05, 0.05), rnd(0, 0.2), rnd(-0.05, 0.05))), rnd(0.35, 0.45), "spray", rnd(0.1, 0.16));
      }
    }
    // Arena
    if (arenaG.visible) {
      torches.forEach((tc, i) => {
        const f = 1.2 + Math.sin(t * 13 + i) * 0.15 + Math.sin(t * 7 + i * 3) * 0.1;
        tc.f.scale.setScalar(f);
        tc.l.intensity = 1.4 + Math.sin(t * 11 + i) * 0.35;
        if (Math.random() < dt * 6) emit(tc.p, tmp2.set(rnd(-0.15, 0.15), rnd(0.8, 1.5), rnd(-0.15, 0.15)), rnd(0.5, 0.9), "fire", rnd(0.18, 0.3));
      });
      arenaRing.material.opacity = 0.32 + Math.sin(t * 3) * 0.1;
      if (arenaHero) animateChar(arenaHero, t, true, dt);
    }
    // Mühlerad: Rad dreht, Gondeln bleiben waagrecht, Figuren stehen aufrecht
    if (carousel.visible && carChars.length) {
      const n = carChars.length;
      carAngle = lerp(carAngle, -carTurn * (TAU / n), Math.min(1, dt * 4));
      const spin = dt > 0 ? (carAngle - carPrev) / dt : 0;
      carPrev = carAngle;
      wheel.rotation.z = -carAngle;
      carChars.forEach((ch, i) => {
        const act = i === carIndex;
        const phi = (i / n) * TAU + carAngle;
        const x = Math.sin(phi) * WR, y = WCY + Math.cos(phi) * WR;
        const gd = gondolas[i];
        gd.position.set(x, y, WZ);
        const above = y > WLVL + 0.15;
        gd.visible = above;
        ch.obj.visible = above;
        ch.obj.position.set(x, y + 0.08, WZ);
        ch.obj.rotation.y = -Math.sin(phi) * 0.35;
        const bs = ch.obj.userData.baseScale;
        const s = lerp(ch.obj.scale.x, bs * (act ? 1.12 : 0.9), 1 - Math.exp(-dt * 6));
        ch.obj.scale.setScalar(s);
        animateChar(ch, t, act, dt);
      });
      lanterns.forEach((l, i) => l.scale.setScalar(0.8 + Math.sin(t * 3 + i * 1.3) * 0.12));
      // Highlight oben
      hiRing.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
      hiRing.material.opacity = 0.55 + Math.sin(t * 3) * 0.2;
      hiBeam.material.opacity = 0.18 + Math.sin(t * 1.7) * 0.04;
      hiSparks.forEach((s, i) => {
        const a = t * (0.8 + (i % 3) * 0.25) + (i / hiSparks.length) * TAU;
        s.position.set(Math.cos(a) * 0.95, WTOP + 0.3 + ((t * 0.45 + i / hiSparks.length) % 1) * 2.4, WZ + Math.sin(a) * 0.6);
        s.material.opacity = 0.5 + Math.sin(t * 5 + i) * 0.4;
      });
      // Wasser fliesst, spritzt wo das Rad eintaucht – beim Drehen stärker
      brookTex.offset.x = (t * 0.06) % 1;
      const wx = Math.sqrt(WR * WR - (WLVL - WCY) ** 2);
      const rate = 6 + Math.min(80, Math.abs(spin) * 120);
      for (let cnt = rate * dt; cnt > 0; cnt--) {
        if (Math.random() >= cnt) break;
        [-1, 1].forEach((side) => {
          tmp.set(side * wx + rnd(-0.2, 0.2), WLVL + 0.05, rnd(-0.5, 0.5));
          emit(tmp, tmp2.set(side * rnd(0.2, 1.2), rnd(1.6, 3.2), rnd(-0.3, 0.4)), rnd(0.5, 0.9), "spray", rnd(0.25, 0.45));
        });
      }
    }
    // Bühne
    if (stage.visible && stageChar) {
      animateChar(stageChar, t, true, dt);
      stageChar.obj.rotation.y = 0.35 + Math.sin(t * 0.4) * 0.25;
    }
    tickers.forEach((fn) => fn(t, dt));

    // Drucker, Projektil, Effekte
    printerUpdate(t, dt);
    papersUpdate(dt);
    if (projectile) {
      printer.core.getWorldPosition(tmp);
      projectile.life += dt;
      projectile.p.lerp(tmp, Math.min(1, dt * 5));
      emit(projectile.p, new THREE.Vector3(rnd(-0.5, 0.5), rnd(-0.5, 0.5), rnd(-0.5, 0.5)), 0.35, "bolt", 0.9);
      if (projectile.p.distanceTo(tmp) < 0.5 || projectile.life > 1.2) {
        for (let k = 0; k < 50; k++) emit(tmp, new THREE.Vector3(rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)).normalize().multiplyScalar(rnd(2, 6)), rnd(0.4, 0.8), k % 2 ? "bolt" : "gold", rnd(0.3, 0.6));
        printer.state = "hit";
        printer.t0 = t;
        shake = 0.15;
        projectile = null;
        api.onImpact && api.onImpact();
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
      } else if (p.kind === "spray") {
        p.v.y -= 7 * dt;
        p.s.material.color.setHSL(0.55, 0.7, 0.85);
        p.s.scale.setScalar(p.size * (0.7 + k * 0.6));
      } else if (p.kind === "virus") {
        p.v.multiplyScalar(0.97);
        p.s.material.color.setHSL(0.33, 1, 0.55 - k * 0.2);
        p.s.scale.setScalar(p.size * (0.5 + Math.sin(k * Math.PI)));
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
    if (curMode === "menu") camera.position.x += Math.sin(orbit * 0.12) * 0.35;
    if (shake > 0) {
      shake = Math.max(0, shake - dt * 0.8);
      camera.position.x += rnd(-1, 1) * shake;
      camera.position.y += rnd(-1, 1) * shake;
    }
    camera.lookAt(camLook);

    renderer.render(scene, camera);
    frames++;
    // Adaptive Auflösung: bei Ruckeln (< ~40 fps) etwas gröber rendern, bei Reserve wieder schärfer
    if (!DBG) {
      perfAcc += dt; perfN++;
      if (perfN >= 90) {
        const avg = perfAcc / perfN;
        const maxPR = Math.min(window.devicePixelRatio || 1, 1.5);
        if (avg > 0.026 && pixelRatio > 0.7) pixelRatio = Math.max(0.7, pixelRatio - 0.15);
        else if (avg < 0.014 && pixelRatio < maxPR) pixelRatio = Math.min(maxPR, pixelRatio + 0.15);
        if (renderer.getPixelRatio() !== pixelRatio) { renderer.setPixelRatio(pixelRatio); resize(); }
        perfAcc = 0; perfN = 0;
      }
    }
    if (DBG && frames % 5 === 0) DBG.textContent = `sim ${t.toFixed(1)}s · ${frames} frames · drucker y ${printer.g.position.y.toFixed(2)}`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return api;
})();
