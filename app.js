"use strict";
(() => {
  // ───────── course data ─────────
  const COURSE = window.COURSE;
  const PRACTICE = window.PRACTICE || {};
  const PROJECTS = window.PROJECTS || [];
  const GLOSSARY = window.GLOSSARY || [];

  const LESSONS = [];
  COURSE.forEach((u, ui) => {
    u.lessons.forEach((l, li) => {
      const p = PRACTICE[l.id];
      if (p) {
        const steps = l.steps.slice();
        if (p.order) {
          const ci = steps.findIndex(s => s.t === "code");
          steps.splice(ci < 0 ? steps.length : ci, 0, { t: "order", ...p.order });
        }
        if (p.fill) {
          const fi = steps.findIndex(s => s.t === "learn");
          steps.splice(fi + 1, 0, { t: "fill", ...p.fill });
        }
        l.steps = steps;
      }
      l.unit = u; l.ui = ui; l.li = li; l.idx = LESSONS.length; LESSONS.push(l);
    });
    const proj = PROJECTS.find(p => p.unit === u.id);
    if (proj) { proj.unit = u; proj.ui = ui; proj.isProject = true; u.project = proj; }
  });
  const FINAL = window.FINAL_PROJECT || null;
  if (FINAL) { FINAL.isProject = true; FINAL.isFinal = true; }
  const byId = Object.fromEntries([...LESSONS, ...PROJECTS, ...(FINAL ? [FINAL] : [])].map(l => [l.id, l]));

  // ───────── helpers ─────────
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const md = s => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<i>$2</i>");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ───────── state ─────────
  const STORE = "pyquest:v1";
  const MAX_HEARTS = 5, REFILL_MS = 30 * 60 * 1000;
  const defaults = {
    xp: 0, done: {}, streak: 0, bestStreak: 0, lastDay: null, badges: [], codeSolved: 0, reviews: 0, perfects: 0,
    sound: true, play: "", hearts: MAX_HEARTS, heartAt: null, goal: 50, day: null, dayXP: 0,
  };
  let S;
  try { S = Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORE) || "{}")); } catch (e) { S = Object.assign({}, defaults); }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } };

  const need = L => 50 * L * (L - 1);
  function levelInfo(xp) {
    let L = 1;
    while (xp >= need(L + 1)) L++;
    return { L, into: xp - need(L), span: need(L + 1) - need(L) };
  }
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
  const streakNow = () => (S.lastDay === dayKey() || S.lastDay === yesterday()) ? S.streak : 0;
  function bumpStreak() {
    const t = dayKey();
    if (S.lastDay === t) return;
    S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1;
    S.lastDay = t;
    S.bestStreak = Math.max(S.bestStreak, S.streak);
  }
  const todayXP = () => (S.day === dayKey() ? S.dayXP : 0);
  function gainXP(n) {
    const before = todayXP();
    if (S.day !== dayKey()) { S.day = dayKey(); S.dayXP = 0; }
    S.dayXP += n; S.xp += n;
    return before < S.goal && S.dayXP >= S.goal; // goal reached just now
  }

  // hearts
  function refreshHearts() {
    if (S.hearts >= MAX_HEARTS) { S.hearts = MAX_HEARTS; S.heartAt = null; return; }
    if (!S.heartAt) S.heartAt = Date.now();
    const gained = Math.floor((Date.now() - S.heartAt) / REFILL_MS);
    if (gained > 0) {
      S.hearts = Math.min(MAX_HEARTS, S.hearts + gained);
      S.heartAt = S.hearts >= MAX_HEARTS ? null : S.heartAt + gained * REFILL_MS;
      save();
    }
  }
  function loseHeart() {
    refreshHearts();
    if (S.hearts >= MAX_HEARTS) S.heartAt = Date.now();
    S.hearts = Math.max(0, S.hearts - 1);
    save(); renderHearts(true);
  }
  function addHeart() {
    refreshHearts();
    if (S.hearts >= MAX_HEARTS) return false;
    S.hearts++;
    if (S.hearts >= MAX_HEARTS) S.heartAt = null;
    save(); renderHearts(true);
    return true;
  }
  function nextHeartIn() {
    if (S.hearts >= MAX_HEARTS || !S.heartAt) return "";
    const ms = REFILL_MS - (Date.now() - S.heartAt);
    const m = Math.max(1, Math.ceil(ms / 60000));
    return `${m} min`;
  }

  const isDone = l => !!S.done[l.id];
  const doneCount = () => LESSONS.filter(isDone).length;
  const isOpen = l => l.isFinal ? doneCount() === LESSONS.length
    : l.isProject ? l.unit.lessons.every(isDone)
    : (l.idx === 0 || isDone(LESSONS[l.idx - 1]) || isDone(l));
  const projectsDone = () => PROJECTS.filter(isDone).length;

  const BADGES = [
    { id: "first", icon: "🐣", name: "Hello, World", desc: "Finish your first lesson", ok: () => doneCount() >= 1 },
    { id: "perfect", icon: "💎", name: "Flawless", desc: "Finish a lesson with no mistakes", ok: () => S.perfects >= 1 },
    { id: "goal", icon: "🎯", name: "Goal Getter", desc: "Hit your daily XP goal", ok: () => todayXP() >= S.goal },
    { id: "coder5", icon: "⌨️", name: "Coder", desc: "Pass 5 code challenges", ok: () => S.codeSolved >= 5 },
    { id: "coder20", icon: "🧠", name: "Problem Solver", desc: "Pass 20 code challenges", ok: () => S.codeSolved >= 20 },
    { id: "builder", icon: "🛠️", name: "Builder", desc: "Finish a project", ok: () => projectsDone() >= 1 },
    { id: "architect", icon: "🏗️", name: "Architect", desc: "Finish 5 projects", ok: () => projectsDone() >= 5 },
    { id: "unit", icon: "🏅", name: "Unit Cleared", desc: "Finish a whole unit", ok: () => COURSE.some(u => u.lessons.every(isDone)) },
    { id: "streak3", icon: "🔥", name: "On Fire", desc: "3-day streak", ok: () => S.bestStreak >= 3 },
    { id: "streak7", icon: "🌋", name: "Unstoppable", desc: "7-day streak", ok: () => S.bestStreak >= 7 },
    { id: "review", icon: "🔁", name: "Sharp Memory", desc: "Finish a review session", ok: () => S.reviews >= 1 },
    { id: "lvl5", icon: "⭐", name: "Level 5", desc: "Reach level 5", ok: () => levelInfo(S.xp).L >= 5 },
    { id: "half", icon: "🧭", name: "Halfway", desc: "Finish half the lessons", ok: () => doneCount() >= Math.ceil(LESSONS.length / 2) },
    { id: "stars", icon: "🌟", name: "Star Collector", desc: "3 stars on 10 lessons", ok: () => LESSONS.filter(l => isDone(l) && S.done[l.id].stars === 3).length >= 10 },
    { id: "grad", icon: "🎓", name: "Pythonista", desc: "Finish every lesson", ok: () => doneCount() === LESSONS.length },
    { id: "capstone", icon: "🏁", name: "Graduate", desc: "Finish the final project", ok: () => !!FINAL && isDone(FINAL) },
  ];
  function checkBadges() {
    const fresh = BADGES.filter(b => !S.badges.includes(b.id) && b.ok());
    fresh.forEach(b => S.badges.push(b.id));
    return fresh;
  }

  // ───────── sound ─────────
  let actx = null;
  function beep(notes) {
    if (!S.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      let t = actx.currentTime;
      notes.forEach(([f, d]) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
        t += d * 0.8;
      });
    } catch (e) { /* audio unavailable */ }
  }
  const sfx = {
    tap: () => beep([[520, .05]]),
    good: () => beep([[660, .12], [990, .18]]),
    bad: () => beep([[220, .22]]),
    win: () => beep([[523, .14], [659, .14], [784, .14], [1047, .3]]),
  };

  // ───────── toast & confetti ─────────
  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }
  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = $("#confetti"), ctx = c.getContext("2d"), dpr = devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#4f6bff", "#ffc53d", "#16a34a", "#ff7a1a", "#9b5cff", "#ec4899"];
    const parts = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .35,
      vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4,
      r: Math.random() * 6 + 4, rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
      c: colors[(Math.random() * colors.length) | 0],
    }));
    const start = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => {
        p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore();
      });
      if (now - start < 2600) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }

  // ───────── Python runner (Pyodide in a worker) ─────────
  const Py = {
    worker: null, ready: null, status: "idle", seq: 0, pending: new Map(),
    start() {
      if (this.worker) return this.ready;
      this.status = "loading"; pyStatusUI();
      this.worker = new Worker("py-worker.js");
      this.ready = new Promise((resolve, reject) => {
        this.worker.onmessage = e => {
          const m = e.data;
          if (m.type === "ready") { this.status = "ready"; pyStatusUI(); resolve(); }
          else if (m.type === "init-error") { this.status = "error"; pyStatusUI(); this.worker.terminate(); this.worker = null; reject(new Error(m.error)); }
          else if (m.type === "result") {
            const p = this.pending.get(m.id);
            if (p) { clearTimeout(p.timer); this.pending.delete(m.id); p.resolve(m.result); }
          }
        };
        this.worker.onerror = () => { this.status = "error"; pyStatusUI(); this.worker = null; reject(new Error("worker failed")); };
      });
      this.ready.catch(() => {});
      return this.ready;
    },
    async run(code, tests = "") {
      try { await this.start(); }
      catch (e) { return { ok: false, out: "", error: "Couldn't load Python. Check your connection and try again." }; }
      const id = ++this.seq;
      return new Promise(resolve => {
        const timer = setTimeout(() => {
          this.pending.delete(id);
          this.kill();
          resolve({ ok: false, out: "", error: "Stopped after 5 seconds. Is there an infinite loop?" });
        }, 5000);
        this.pending.set(id, { resolve, timer });
        this.worker.postMessage({ id, code, tests });
      });
    },
    kill() {
      if (this.worker) this.worker.terminate();
      this.worker = null; this.status = "idle";
      this.pending.forEach(p => { clearTimeout(p.timer); p.resolve({ ok: false, out: "", error: "Stopped." }); });
      this.pending.clear(); pyStatusUI();
    },
  };
  window.PyRunner = Py; // handy for debugging
  function pyStatusUI() {
    const txt = {
      idle: "🐍 Python starts when you run code.",
      loading: "🐍 Loading Python… (first time takes a few seconds)",
      ready: "🐍 Python ready",
      error: "⚠️ Python failed to load. Check your connection.",
    }[Py.status];
    $$(".pystatus").forEach(el => el.textContent = txt);
  }

  // ───────── code panels & editor ─────────
  function panel(inner, { run = false, name = "main.py", id = "" } = {}) {
    return `<div class="panel"${id ? ` id="${id}"` : ""}>
      <div class="panel-bar"><span class="dots"><i></i><i></i><i></i></span><span class="fname">${esc(name)}</span>
        ${run ? `<button class="runbtn" type="button">▶ Run</button>` : ""}</div>
      <div class="panel-body">${inner}</div>
      <pre class="console" hidden></pre>
    </div>`;
  }
  function showConsole(el, res, extra) {
    el.hidden = false;
    let html = `<span class="console-label">Output</span>`;
    let body = res.out ? esc(res.out) : "";
    if (res.error) body += `<span class="err">${esc(res.error)}</span>`;
    if (extra) body += extra;
    if (!body) body = `<span class="dim">(no output)</span>`;
    el.innerHTML = html + body;
  }
  async function runInto(panelEl, code) {
    const out = $(".console", panelEl), btn = $(".runbtn", panelEl);
    if (btn) btn.disabled = true;
    out.hidden = false;
    out.innerHTML = `<span class="console-label">Output</span><span class="dim">${Py.status === "ready" ? "Running…" : "Loading Python…"}</span>`;
    const res = await Py.run(code);
    showConsole(out, res);
    if (btn) btn.disabled = false;
    return res;
  }

  const KEYS = ["⇥", ":", "(", ")", "\"", "'", "[", "]", "=", "_", ".", ",", "#", "+", "-", "*", "/", "%", "<", ">", "{", "}", "!"];
  function editorInner(code) {
    return `<textarea class="editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Python code editor">${esc(code)}</textarea>`;
  }
  function keysHTML() {
    return `<div class="keys">${KEYS.map(k => `<button type="button" data-k="${esc(k)}" aria-label="Insert ${k === "⇥" ? "indent" : esc(k)}">${esc(k)}</button>`).join("")}</div>`;
  }
  function insertAt(ta, text) {
    ta.focus();
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
    ta.dispatchEvent(new Event("input"));
  }
  function wireEditor(root, onChange) {
    const ta = $(".editor", root);
    $$(".keys button", root).forEach(b => {
      b.addEventListener("pointerdown", e => e.preventDefault()); // keep the keyboard open
      b.addEventListener("click", () => {
        const k = b.dataset.k;
        if (k === "⇥") return insertAt(ta, "    ");
        const pairs = { "(": ")", "[": "]", "{": "}" };
        if (pairs[k] && ta.selectionStart !== ta.selectionEnd) {
          return insertAt(ta, k + ta.value.slice(ta.selectionStart, ta.selectionEnd) + pairs[k]);
        }
        insertAt(ta, k);
      });
    });
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab") { e.preventDefault(); insertAt(ta, "    "); }
      else if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        const before = ta.value.slice(0, ta.selectionStart);
        const line = before.slice(before.lastIndexOf("\n") + 1);
        let indent = (line.match(/^ */) || [""])[0];
        if (/:\s*(#.*)?$/.test(line)) indent += "    ";
        e.preventDefault(); insertAt(ta, "\n" + indent);
      }
    });
    if (onChange) ta.addEventListener("input", () => onChange(ta.value));
    return ta;
  }

  // ───────── header & tabs ─────────
  function ring(pct, R, stroke, color, track = "var(--surface-2)") {
    const C = 2 * Math.PI * R, size = 2 * (R + stroke / 2);
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="${track}" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${R}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, pct))}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
  }
  function renderTop() {
    refreshHearts();
    const li = levelInfo(S.xp), st = streakNow();
    $("#topbar").innerHTML = `
      <div class="brand">🐍 Python Quest</div>
      <div class="chip flame ${st ? "" : "off"}" title="Day streak">🔥 ${st}</div>
      <div class="chip hearts-chip" title="Hearts${S.hearts < MAX_HEARTS ? `, next in ${nextHeartIn()}` : ""}">❤️ ${S.hearts}</div>
      <div class="lvl" title="Level ${li.L}: ${li.into}/${li.span} XP">${ring(li.into / li.span, 15, 4, "var(--gold)")}<b>${li.L}</b></div>`;
  }
  function renderHearts(pop) {
    const h = $("#lhearts");
    if (h) {
      h.textContent = `❤️ ${S.hearts}`;
      h.hidden = !L || L.mode !== "lesson";
      if (pop) { h.classList.remove("pop"); void h.offsetWidth; h.classList.add("pop"); }
    }
    renderTop();
  }
  let tab = "learn";
  function setTab(t) {
    tab = t;
    $$("#tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === t));
    render();
    window.scrollTo(0, 0);
  }
  $("#tabs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setTab(b.dataset.tab); });

  function render() {
    renderTop();
    ({ learn: renderLearn, review: renderReview, glossary: renderGlossary, play: renderPlay, profile: renderProfile })[tab]();
  }

  // ───────── Learn (map) ─────────
  const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46];
  function goalCard() {
    const t = todayXP(), pct = t / S.goal;
    return `<div class="goal">${ring(pct, 22, 6, pct >= 1 ? "var(--good)" : "var(--accent)")}
      <div class="goal-txt"><b>${pct >= 1 ? "Daily goal done! 🎯" : "Daily goal"}</b><span>${Math.min(t, S.goal)} / ${S.goal} XP today</span></div></div>`;
  }
  function renderLearn() {
    const next = LESSONS.find(l => !isDone(l));
    const hero = next ? `
      <div class="hero">
        <div class="hero-row">
          <div><h1>${doneCount() ? "Keep going!" : "Welcome to Python Quest"}</h1>
          <p>Next up: <b>${esc(next.title)}</b> · Unit ${next.ui + 1}</p></div>
        </div>
        ${goalCard()}
        <button class="btn" data-lesson="${next.id}">${doneCount() ? "Continue" : "Start learning"} →</button>
      </div>` : FINAL && !isDone(FINAL) ? `
      <div class="hero"><h1>🏁 All lessons done!</h1><p>Your final project is unlocked: build a <b>${esc(FINAL.title)}</b> using everything you've learned.</p>
        ${goalCard()}<button class="btn" data-lesson="${FINAL.id}">Start final project →</button></div>` : `
      <div class="hero"><h1>🎓 Course complete!</h1><p>Replay lessons for more stars, build the projects, or keep sharp in Review.</p>${goalCard()}</div>`;
    const finalCard = FINAL ? (() => {
      const open = isOpen(FINAL), done = isDone(FINAL);
      return `<section class="final ${done ? "done" : open ? "open" : "locked"}">
        <div class="final-icon">${open || done ? FINAL.icon : "🔒"}</div>
        <div class="final-kicker">Final project</div>
        <h2>${esc(FINAL.title)}</h2>
        <p>${done ? "Complete. You built a full Python program! 🎓" : open ? "Build a full program using classes, loops, dicts, error handling and more." : `Finish all ${LESSONS.length} lessons to unlock (${doneCount()}/${LESSONS.length}).`}</p>
        ${open || done ? `<button class="btn" data-lesson="${FINAL.id}">${done ? "Build it again" : "Start final project"} →</button>` : ""}
      </section>`;
    })() : "";
    $("#view").innerHTML = hero + COURSE.map((u, ui) => {
      const d = u.lessons.filter(isDone).length;
      const p = u.project;
      const pOpen = p && isOpen(p), pDone = p && isDone(p);
      return `<section class="unit" style="--hue:${u.hue}">
        <div class="unit-head"><div class="unit-icon">${u.icon}</div>
          <div><div class="unit-kicker">Unit ${ui + 1}</div><h2>${esc(u.title)}</h2></div>
          <div class="unit-count">${d}/${u.lessons.length}</div></div>
        <div class="path">${u.lessons.map((l, li) => {
          const done = isDone(l), open = isOpen(l), cur = next === l;
          const stars = done ? S.done[l.id].stars : 0;
          return `<button class="node ${done ? "done" : open ? "open" : "locked"} ${cur ? "current" : ""}" data-lesson="${l.id}" style="--x:${OFFSETS[li % OFFSETS.length]}px" aria-label="${esc(l.title)}${done ? `, ${stars} stars` : open ? "" : ", locked"}">
            ${cur ? `<span class="start-tag">START</span>` : ""}
            <span class="bubble">${done ? "✓" : open ? li + 1 : "🔒"}</span>
            ${done ? `<span class="stars">${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}</span>` : ""}
            <span class="label">${esc(l.title)}</span>
          </button>`;
        }).join("")}</div>
        ${p ? `<button class="project ${pDone ? "done" : pOpen ? "open" : "locked"}" data-lesson="${p.id}">
            <span class="picon">${pOpen || pDone ? p.icon : "🔒"}</span>
            <span class="ptxt"><small>${pDone ? "Project complete ✓" : pOpen ? "Project unlocked" : "Project · finish the unit to unlock"}</small><b>${esc(p.title)}</b></span>
            <span class="pgo">${pOpen || pDone ? "›" : ""}</span></button>` : ""}
      </section>`;
    }).join("") + finalCard;
  }
  $("#view").addEventListener("click", e => {
    const b = e.target.closest("[data-lesson]");
    if (!b) return;
    const l = byId[b.dataset.lesson];
    if (!isOpen(l)) return toast(l.isFinal ? "🔒 Finish every lesson to unlock the final project." : l.isProject ? "🔒 Finish this unit's lessons to unlock the project." : "🔒 Finish the lesson before this one first.");
    startLesson(l, l.isProject ? "project" : "lesson");
  });

  // ───────── Review ─────────
  const REVIEWABLE = ["mcq", "fill", "order"];
  function reviewPool() {
    return LESSONS.filter(isDone).flatMap(l => l.steps.filter(s => REVIEWABLE.includes(s.t)).map(s => ({ ...s, from: l.title })));
  }
  function startReview(pool) {
    const steps = shuffle(pool.slice()).slice(0, 6);
    startLesson({ id: "review", title: "Review", steps }, "review");
  }
  function renderReview() {
    refreshHearts();
    const pool = reviewPool();
    const weak = LESSONS.filter(l => isDone(l) && S.done[l.id].stars < 3);
    $("#view").innerHTML = `
      <div class="card"><h2>🔁 Quick review</h2>
        <p>${pool.length ? `Up to 6 mixed questions from lessons you've finished. Each right answer refills a heart ❤️.` : `Finish a lesson first, then its questions show up here.`}</p>
        <button class="btn block" id="startReview" ${pool.length ? "" : "disabled"}>Start review</button></div>
      <div class="card"><h2>⭐ Earn more stars</h2>
        ${weak.length ? `<p>Replay these for 3 stars:</p>` + weak.map(l => `<button class="list-btn" data-lesson="${l.id}"><span>${l.unit.icon}</span><span style="flex:1"><b>${esc(l.title)}</b></span><span>${"⭐".repeat(S.done[l.id].stars)}</span></button>`).join("")
          : `<p>${doneCount() ? "Every finished lesson has 3 stars. Nice!" : "Nothing yet."}</p>`}
      </div>`;
    const b = $("#startReview");
    if (b) b.onclick = () => startReview(pool);
  }

  // ───────── Glossary ─────────
  function renderGlossary() {
    $("#view").innerHTML = `
      <div class="card gloss-search"><h2>📖 Glossary</h2>
        <input type="search" id="gq" placeholder="Search ${GLOSSARY.length} terms…" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Search glossary"></div>
      <div id="glist"></div>`;
    const list = $("#glist"), q = $("#gq");
    const draw = () => {
      const s = q.value.trim().toLowerCase();
      const items = GLOSSARY.filter(g => !s || g.term.toLowerCase().includes(s) || g.def.toLowerCase().includes(s))
        .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));
      list.innerHTML = items.length ? items.map(g => `
        <div class="gterm"><b>${esc(g.term)}</b><p>${md(g.def)}</p>${g.code ? `<pre class="code mini">${esc(g.code)}</pre>` : ""}</div>`).join("")
        : `<p class="muted" style="text-align:center">No terms match “${esc(q.value)}”.</p>`;
    };
    q.addEventListener("input", draw);
    draw();
  }

  // ───────── Playground ─────────
  function renderPlay() {
    $("#view").innerHTML = `
      <div class="card"><h2>🧪 Playground</h2><p>Try anything. Your code is saved on this device.</p>
        ${panel(editorInner(S.play || `# Try some Python!\nname = "World"\nprint(f"Hello, {name}!")\n`), { run: true, id: "pPanel" })}
        ${keysHTML()}
        <div class="pystatus"></div></div>`;
    const ta = wireEditor($("#view"), v => { S.play = v; save(); });
    $("#pPanel .runbtn").onclick = () => runInto($("#pPanel"), ta.value);
    pyStatusUI();
  }

  // ───────── Profile ─────────
  const GOALS = [[30, "Casual"], [50, "Regular"], [100, "Serious"], [150, "Intense"]];
  function renderProfile() {
    refreshHearts();
    const li = levelInfo(S.xp);
    const stars = LESSONS.filter(isDone).reduce((a, l) => a + S.done[l.id].stars, 0);
    $("#view").innerHTML = `
      <div class="card"><h2>Level ${li.L}</h2>
        <div class="xpbar"><i style="width:${(li.into / li.span * 100).toFixed(1)}%"></i></div>
        <div class="muted">${S.xp} XP total · ${li.span - li.into} XP to level ${li.L + 1}</div></div>
      <div class="card"><div class="stats">
        <div class="stat"><b>${doneCount()}/${LESSONS.length}</b><span>Lessons done</span></div>
        <div class="stat"><b>${projectsDone()}/${PROJECTS.length}</b><span>Projects built</span></div>
        <div class="stat"><b>${stars}</b><span>Stars earned</span></div>
        <div class="stat"><b>${S.codeSolved}</b><span>Code challenges passed</span></div>
        <div class="stat"><b>${S.bestStreak}</b><span>Best streak (days)</span></div>
        <div class="stat"><b>❤️ ${S.hearts}</b><span>${S.hearts < MAX_HEARTS ? `Next heart in ${nextHeartIn()}` : "Hearts full"}</span></div>
      </div></div>
      <div class="card"><h2>🎯 Daily goal</h2><p>${todayXP()} / ${S.goal} XP today</p>
        <div class="seg">${GOALS.map(([x, n]) => `<button class="${S.goal === x ? "on" : ""}" data-goal="${x}"><b>${n}</b><small>${x} XP</small></button>`).join("")}</div></div>
      <div class="card"><h2>Badges · ${S.badges.length}/${BADGES.length}</h2>
        <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges.includes(b.id) ? "" : "locked"}"><span class="bi">${b.icon}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div>`).join("")}</div></div>
      <div class="card"><h2>Settings</h2>
        <div class="switch"><span>Sound effects</span><button class="btn small ghost" id="sndBtn">${S.sound ? "On" : "Off"}</button></div>
        <div class="switch"><span>Reset all progress</span><button class="btn small bad" id="resetBtn">Reset</button></div>
        <p class="muted" style="margin:10px 0 0;font-size:13px">Progress is saved in this browser only. Tip: in Safari, tap Share → Add to Home Screen to use it like an app.</p></div>`;
    $$("[data-goal]").forEach(b => b.onclick = () => { S.goal = +b.dataset.goal; save(); renderProfile(); toast(`Daily goal set to ${S.goal} XP`); });
    $("#sndBtn").onclick = () => { S.sound = !S.sound; save(); renderProfile(); };
    $("#resetBtn").onclick = () => {
      if (confirm("Reset all XP, stars, streaks, hearts and badges? This can't be undone.")) {
        const keep = { play: S.play, goal: S.goal, sound: S.sound };
        S = Object.assign({}, defaults, keep); save(); render(); toast("Progress reset");
      }
    };
  }

  // ───────── Lesson player ─────────
  let L = null;
  const lessonEl = $("#lesson"), body = $("#lbody"), foot = $("#lfoot");

  function startLesson(lesson, mode = "lesson") {
    refreshHearts();
    L = {
      lesson, mode, queue: lesson.steps.map(s => ({ ...s })), pos: 0, total: lesson.steps.length, done: 0,
      mistakes: 0, combo: 0, bestCombo: 0, xp: 0, heartsWon: 0, lastCode: null,
      mult: mode === "review" ? 0.5 : isDone(lesson) ? 0.5 : 1,
      levelBefore: levelInfo(S.xp).L, codePassed: 0,
    };
    lessonEl.hidden = false;
    document.body.style.overflow = "hidden";
    renderCombo(); renderHearts();
    if (mode === "lesson" && S.hearts <= 0) return outOfHearts();
    if (L.queue.some(s => s.t === "code" || s.t === "fill" || s.t === "order" || (s.t === "learn" && s.code))) Py.start().catch(() => {});
    renderStep();
  }
  function closeLesson() {
    lessonEl.hidden = true; document.body.style.overflow = ""; L = null; render();
  }
  $("#quit").onclick = () => {
    if (!L || L.finished || L.mode === "review" || L.outOfHearts || confirm("Quit this lesson? You'll lose progress in it.")) closeLesson();
  };

  function progress() { $("#pfill").style.width = `${(L.done / L.total) * 100}%`; }
  function renderCombo(pop) {
    const c = $("#combo");
    c.textContent = L && L.combo >= 2 ? `🔥×${L.combo}` : "";
    if (pop && L.combo >= 2) { c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); }
  }
  function award(base) {
    const bonus = Math.min(Math.max(L.combo - 1, 0), 5) * 2;
    const x = Math.round((base + bonus) * L.mult);
    L.xp += x; return x;
  }
  function setFoot(html, cls = "") {
    foot.className = "l-foot " + cls;
    foot.innerHTML = `<div>${html}</div>`;
  }
  function feedback(ok, title, text, xp, btnLabel = "Continue", onBtn = next) {
    setFoot(`<div class="fb-title">${ok ? "✅" : "❌"} ${esc(title)}${xp ? `<span class="xp-float">+${xp} XP</span>` : ""}</div>
      ${text ? `<div class="fb-text">${text}</div>` : ""}
      <button class="btn block ${ok ? "good" : "bad"}" id="fbBtn">${esc(btnLabel)}</button>`, ok ? "good" : "bad");
    const b = $("#fbBtn", foot); b.onclick = onBtn; setTimeout(() => b.focus({ preventScroll: true }), 50);
  }
  function next() {
    if (L.mode === "lesson" && S.hearts <= 0) return outOfHearts();
    L.pos++;
    if (L.pos >= L.queue.length) return finish();
    renderStep();
  }
  // shared bookkeeping for right / wrong answers on mcq, fill and order
  function answeredRight() {
    L.combo++; L.bestCombo = Math.max(L.bestCombo, L.combo); L.done++;
    const x = award(10); renderCombo(true); progress(); sfx.good();
    let extra = "";
    if (L.mode === "review" && addHeart()) { L.heartsWon++; extra = " +1 ❤️"; }
    return { x, extra };
  }
  function answeredWrong(s) {
    L.combo = 0; L.mistakes++; renderCombo(); sfx.bad();
    if (L.mode === "lesson") loseHeart();
    L.queue.push({ ...s }); // comes back until it's answered right
  }
  const PRAISE = ["Nice!", "Correct!", "You got it!", "Great job!", "Spot on!"];
  const praise = () => PRAISE[Math.random() * PRAISE.length | 0];

  function renderStep() {
    progress();
    const s = L.queue[L.pos];
    body.scrollTop = 0;
    ({ learn: stepLearn, mcq: stepMcq, fill: stepFill, order: stepOrder, code: stepCode })[s.t](s);
  }
  function kicker(fallback) {
    if (L.mode === "review") return `Review · ${esc(L.queue[L.pos].from || "")}`;
    if (L.mode === "project") return `${L.lesson.isFinal ? "🏁 Final project" : "🛠️ Project"} · ${esc(L.lesson.title)}`;
    return fallback;
  }

  function stepLearn(s) {
    body.innerHTML = `<div class="kicker">${kicker(L.lesson.unit ? `${L.lesson.unit.icon} ${esc(L.lesson.title)}` : "Learn")}</div>
      <h3>${esc(s.title)}</h3>
      <ul class="learn">${s.body.map(p => `<li>${md(p)}</li>`).join("")}</ul>
      ${s.code ? panel(`<pre class="code">${esc(s.code)}</pre>`, { run: true, id: "lp" }) + `<p class="tip">Tap ▶ Run to see what it prints.</p>` : ""}`;
    if (s.code) $("#lp .runbtn").onclick = () => runInto($("#lp"), s.code);
    setFoot(`<button class="btn block" id="go">Continue</button>`);
    $("#go").onclick = () => { L.done++; progress(); next(); };
  }

  function stepMcq(s) {
    const order = shuffle(s.options.map((o, i) => i));
    let sel = null;
    body.innerHTML = `<div class="kicker">${kicker(s.code ? "What happens?" : "Quiz")}</div>
      <h3>${md(s.q)}</h3>
      ${s.code ? panel(`<pre class="code">${esc(s.code)}</pre>`) : ""}
      <div class="options" id="opts">${order.map((i, n) => `<button class="opt" data-i="${i}"><span class="k">${n + 1}</span><span>${md(s.options[i])}</span></button>`).join("")}</div>`;
    setFoot(`<button class="btn block" id="check" disabled>Check</button>`);
    const opts = $("#opts"), check = $("#check");
    opts.onclick = e => {
      const b = e.target.closest(".opt"); if (!b) return;
      $$(".opt", opts).forEach(o => o.classList.remove("sel")); b.classList.add("sel");
      sel = +b.dataset.i; check.disabled = false; sfx.tap();
    };
    check.onclick = () => {
      opts.classList.add("opts-locked");
      $$(".opt", opts).forEach(o => {
        if (+o.dataset.i === s.a) o.classList.add("right");
        else if (+o.dataset.i === sel) o.classList.add("wrong");
      });
      if (sel === s.a) {
        const { x, extra } = answeredRight();
        feedback(true, praise() + extra, md(s.why), x);
      } else {
        answeredWrong(s);
        feedback(false, "Not quite", `Answer: <b>${md(s.options[s.a])}</b><br>${md(s.why)}<br><span class='muted'>You'll see this one again.</span>`, 0, "Got it");
      }
    };
  }

  // Fill in the blanks by tapping chips
  function stepFill(s) {
    const parts = s.code.split("___");
    const nBlanks = parts.length - 1;
    const filled = Array(nBlanks).fill(null); // chip index per blank
    const chips = shuffle(s.chips.map((text, i) => ({ text, i })));
    const accepts = b => [].concat(s.answers[b]);
    let locked = false;
    body.innerHTML = `<div class="kicker">${kicker("✍️ Fill in the blank" + (nBlanks > 1 ? "s" : ""))}</div>
      <h3>${md(s.q)}</h3>
      ${panel(`<pre class="code" id="fcode"></pre>`, { id: "fp" })}
      <div class="chips" id="chips"></div>`;
    const codeEl = $("#fcode"), chipsEl = $("#chips");
    function draw() {
      codeEl.innerHTML = parts.map((p, i) => esc(p) + (i < nBlanks
        ? `<button class="blank ${filled[i] === null ? "empty" : ""}" data-b="${i}" aria-label="Blank ${i + 1}">${filled[i] === null ? "&nbsp;" : esc(s.chips[filled[i]])}</button>`
        : "")).join("");
      chipsEl.innerHTML = chips.map(c => `<button class="chip-btn" data-c="${c.i}" ${filled.includes(c.i) ? "disabled" : ""}>${esc(c.text)}</button>`).join("");
      $("#check").disabled = filled.includes(null);
    }
    setFoot(`<button class="btn block" id="check" disabled>Check</button>`);
    chipsEl.onclick = e => {
      const b = e.target.closest(".chip-btn"); if (!b || locked) return;
      const slot = filled.indexOf(null); if (slot < 0) return;
      filled[slot] = +b.dataset.c; sfx.tap(); draw();
    };
    codeEl.onclick = e => {
      const b = e.target.closest(".blank"); if (!b || locked) return;
      filled[+b.dataset.b] = null; draw();
    };
    $("#check").onclick = () => {
      locked = true;
      const results = filled.map((ci, b) => accepts(b).includes(s.chips[ci]));
      $$(".blank", codeEl).forEach((el, b) => el.classList.add(results[b] ? "right" : "wrong"));
      chipsEl.classList.add("opts-locked");
      if (results.every(Boolean)) {
        const { x, extra } = answeredRight();
        feedback(true, praise() + extra, "", x);
        let full = parts[0];
        filled.forEach((ci, b) => { full += s.chips[ci] + parts[b + 1]; });
        runInto($("#fp"), full);
      } else {
        answeredWrong(s);
        const fixed = parts.map((p, i) => esc(p) + (i < nBlanks ? `<b>${esc(accepts(i)[0])}</b>` : "")).join("");
        feedback(false, "Not quite", `Correct code:<pre class="code mini">${fixed}</pre><span class='muted'>You'll see this one again.</span>`, 0, "Got it");
      }
    };
    draw();
  }

  // Put code lines in order by tapping them
  function stepOrder(s) {
    let pool = s.lines.map((text, i) => ({ text, i }));
    do { shuffle(pool); } while (pool.length > 1 && pool.every((p, k) => p.i === k));
    const picked = [];
    let locked = false;
    body.innerHTML = `<div class="kicker">${kicker("🧩 Put it in order")}</div>
      <h3>${md(s.q)}</h3>
      ${panel(`<div class="slots" id="slots"></div>`, { id: "op" })}
      <div class="pool" id="pool"></div>`;
    const slots = $("#slots"), poolEl = $("#pool");
    function draw() {
      slots.innerHTML = picked.length ? picked.map((p, k) => `<button class="line" data-k="${k}"><span class="ln">${k + 1}</span><code>${esc(p.text)}</code></button>`).join("")
        : `<div class="slot-hint">Tap the lines below in the right order</div>`;
      poolEl.innerHTML = pool.map((p, k) => `<button class="line" data-k="${k}"><code>${esc(p.text)}</code></button>`).join("");
      $("#check").disabled = pool.length > 0;
    }
    setFoot(`<button class="btn block" id="check" disabled>Check</button>`);
    poolEl.onclick = e => {
      const b = e.target.closest(".line"); if (!b || locked) return;
      picked.push(pool.splice(+b.dataset.k, 1)[0]); sfx.tap(); draw();
    };
    slots.onclick = e => {
      const b = e.target.closest(".line"); if (!b || locked) return;
      pool.push(picked.splice(+b.dataset.k, 1)[0]); draw();
    };
    $("#check").onclick = () => {
      locked = true;
      const ok = picked.every((p, k) => p.text === s.lines[k]);
      $$(".line", slots).forEach((el, k) => el.classList.add(picked[k].text === s.lines[k] ? "right" : "wrong"));
      if (ok) {
        const { x, extra } = answeredRight();
        feedback(true, praise() + extra, "", x);
        runInto($("#op"), s.lines.join("\n"));
      } else {
        answeredWrong(s);
        feedback(false, "Not quite", `Correct order:<pre class="code mini">${esc(s.lines.join("\n"))}</pre><span class='muted'>You'll see this one again.</span>`, 0, "Got it");
      }
    };
    draw();
  }

  function stepCode(s) {
    let fails = 0, usedSolution = false;
    const starter = s.carry && L.lastCode != null ? L.lastCode.replace(/\s*$/, "\n") + (s.add || "") : (s.starter || "");
    body.innerHTML = `<div class="kicker">${kicker("⌨️ Code challenge")}</div>
      <h3>${md(s.q)}</h3>
      ${panel(editorInner(starter), { run: true, id: "cp" })}
      ${keysHTML()}
      <div class="row">
        <button class="btn ghost small" id="hint">💡 Hint</button>
        <button class="btn ghost small" id="sol" hidden>👀 Show solution</button>
        <button class="btn ghost small" id="reset">↺ Reset</button>
      </div>
      <div id="hintArea"></div>
      <div class="pystatus"></div>`;
    pyStatusUI();
    const ta = wireEditor(body), cp = $("#cp"), out = $(".console", cp);
    const setCheck = () => {
      setFoot(`<button class="btn block" id="check">Check</button>`);
      $("#check").onclick = check;
    };
    $(".runbtn", cp).onclick = () => runInto(cp, ta.value);
    $("#hint").onclick = () => { $("#hintArea").innerHTML = `<div class="hintbox">💡 ${md(s.hint)}</div>`; };
    $("#sol").onclick = () => {
      usedSolution = true; ta.value = s.solution;
      $("#hintArea").innerHTML = `<div class="hintbox">👀 Solution loaded. Read it, then tap Check. (No XP for this one.)</div>`;
    };
    $("#reset").onclick = () => { ta.value = starter; ta.focus(); };
    async function check() {
      const b = $("#check"); b.disabled = true;
      b.textContent = Py.status === "ready" ? "Checking…" : "Loading Python…";
      const res = await Py.run(ta.value, s.tests);
      if (res.passed) {
        showConsole(out, res, `<span class="ok">${res.out ? "\n" : ""}✓ All checks passed</span>`);
        L.done++; L.lastCode = ta.value;
        let x = 0;
        if (!usedSolution) { L.combo++; L.bestCombo = Math.max(L.bestCombo, L.combo); x = award(25); L.codePassed++; }
        renderCombo(true); progress(); sfx.good();
        feedback(true, usedSolution ? "Done" : "It works!", usedSolution ? "Try writing it yourself next time." : "", x);
      } else {
        fails++; L.combo = 0; renderCombo(); sfx.bad();
        if (fails === 1) { L.mistakes++; if (L.mode === "lesson") loseHeart(); }
        if (fails >= 2) $("#sol").hidden = false;
        showConsole(out, res);
        const msg = res.error ? `Your code hit an error: <code>${esc(res.error)}</code>` : esc(res.fail || "Not quite.");
        feedback(false, "Not yet", msg + (fails >= 2 ? "<br><span class='muted'>Stuck? Use Hint or Show solution.</span>" : ""), 0, "Try again", () => {
          if (L.mode === "lesson" && S.hearts <= 0) return outOfHearts();
          setCheck(); ta.focus();
        });
      }
    }
    setCheck();
  }

  function outOfHearts() {
    L.outOfHearts = true;
    $("#pfill").style.width = "0";
    const pool = reviewPool();
    const practicePool = pool.length ? pool : (L.lesson.steps || []).filter(s => REVIEWABLE.includes(s.t)).map(s => ({ ...s, from: L.lesson.title }));
    body.innerHTML = `<div class="result">
      <div class="big">💔</div>
      <h3>Out of hearts</h3>
      <p class="muted">Hearts refill one every 30 minutes${S.heartAt ? `. Next one in <b>${nextHeartIn()}</b>` : ""}.</p>
      <p>Or practice now: every right answer in Review earns a heart back.</p>
    </div>`;
    setFoot(`<button class="btn block good" id="earn">❤️ Practice to earn hearts</button>
      <button class="btn block ghost" id="later" style="margin-top:10px">Come back later</button>`);
    $("#earn").onclick = () => startReview(practicePool);
    $("#later").onclick = closeLesson;
  }

  function finish() {
    L.finished = true;
    progress();
    const { mode } = L;
    const stars = L.mistakes === 0 ? 3 : L.mistakes <= 2 ? 2 : 1;
    let bonus = 0;
    if (mode === "lesson" || mode === "project") {
      bonus += Math.round((L.lesson.isFinal ? 200 : mode === "project" ? 50 : 20) * L.mult);
      if (L.mistakes === 0) { bonus += Math.round(15 * L.mult); if (mode === "lesson") S.perfects++; }
      const prev = S.done[L.lesson.id];
      S.done[L.lesson.id] = { stars: Math.max(stars, prev ? prev.stars : 0), at: Date.now() };
    } else {
      S.reviews++;
    }
    S.codeSolved += L.codePassed;
    const total = L.xp + bonus;
    const goalHit = gainXP(total);
    bumpStreak();
    const newBadges = checkBadges();
    save();
    const lvlAfter = levelInfo(S.xp).L;
    const leveled = lvlAfter > L.levelBefore;
    confetti(); sfx.win();
    const head = mode === "review" ? `<div class="big">🧠</div>` : mode === "project" ? `<div class="big">${L.lesson.icon}</div>`
      : `<div class="big">${[0, 1, 2].map(i => `<span class="s ${i < stars ? "" : "off"}" style="animation-delay:${.15 + i * .2}s">⭐</span>`).join("")}</div>`;
    const title = mode === "review" ? "Review complete!" : L.lesson.isFinal ? "🎓 You finished Python Quest!" : mode === "project" ? `You built ${L.lesson.title}!` : L.mistakes === 0 ? "Flawless!" : "Lesson complete!";
    body.innerHTML = `<div class="result">
      ${head}<h3>${esc(title)}</h3>
      <div class="gain">
        <div class="stat"><b>+${total}</b><span>XP earned</span></div>
        <div class="stat"><b>🔥 ${streakNow()}</b><span>Day streak</span></div>
        ${L.heartsWon ? `<div class="stat"><b>+${L.heartsWon} ❤️</b><span>Hearts earned</span></div>` : ""}
        ${L.bestCombo >= 2 ? `<div class="stat"><b>×${L.bestCombo}</b><span>Best combo</span></div>` : ""}
      </div>
      <div class="goal-wide">${goalCard()}</div>
      ${goalHit ? `<div class="levelup">🎯 Daily goal reached!</div>` : ""}
      ${leveled ? `<div class="levelup">🎉 Level up! You're now level ${lvlAfter}</div>` : ""}
      ${newBadges.map(b => `<div class="newbadge">${b.icon} New badge: ${esc(b.name)}</div>`).join("")}
      ${L.mult < 1 && mode !== "review" ? `<p class="muted" style="font-size:14px">Replays earn half XP.</p>` : ""}
    </div>`;
    setFoot(`<button class="btn block" id="done">Continue</button>`);
    $("#done").onclick = closeLesson;
  }

  // keyboard shortcuts for desktop
  document.addEventListener("keydown", e => {
    if (lessonEl.hidden || e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (/^[1-9]$/.test(e.key)) { const o = $$(".opt", body)[+e.key - 1]; if (o && !$(".opts-locked", body)) o.click(); }
    if (e.key === "Enter") { const b = $("#check:not(:disabled), #fbBtn, #go, #done", foot); if (b && document.activeElement !== b) { e.preventDefault(); b.click(); } }
  });

  // refresh the heart count now and then
  setInterval(() => { const h = S.hearts; refreshHearts(); if (S.hearts !== h) renderTop(); }, 60000);

  render();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
