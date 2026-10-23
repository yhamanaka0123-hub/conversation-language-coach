// Shared state, helpers, navigation and event wiring.
// Each file in js/screens/ adds its screen to SCREENS and its buttons to ACTIONS.

const SCREENS = {};   // route name -> () => HTML string
const ACTIONS = {};   // data-act value -> (element) => void
const FORMS = {};     // form id -> (form) => void

// ---------- State (saved in this browser only) ----------
const KEY = "clc-demo-v2";
const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const convoById = Object.fromEntries(CONVOS.map(c => [c.id, c]));

function freshState() {
  const status = {};
  ITEMS.forEach(i => { status[i.id] = i.seed || "new"; });
  return { v: 2, status, ctx: {}, celebrated: false, sessions: 0 };
}
function loadState() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 2) return s; } catch (e) {}
  return freshState();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

let S = loadState();
// UI-only state that is not saved.
const UI = { route: { name: "home" }, bankFilter: null, session: null, micTimer: null };

// ---------- Helpers ----------
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ctxOf = cid => S.ctx[cid] || convoById[cid].context;
const ctxOfItem = i => i.convo ? ctxOf(i.convo) : i.sourceContext;
const ctxLabel = c => c === "casual" ? "Casual" : "Professional";
const statusOf = id => S.status[id];
const learnedItems = () => ITEMS.filter(i => statusOf(i.id) === "learned");
const learnedCount = () => learnedItems().length;
const itemsIn = cid => ITEMS.filter(i => i.convo === cid);
const practiceText = i => i.kind === "phrase" ? i.text : i.alt[ctxOf(i.convo)];
const bare = s => s.replace(/[.?!…]+$/, "");
const matchWords = i => i.kind === "phrase" ? i.match : i.match[ctxOf(i.convo)];
const norm = s => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ");
const uses = (text, i) => matchWords(i).some(w => norm(text).includes(w));
const highlight = (s, h) => h ? esc(s).replace(esc(h), `<mark>${esc(h)}</mark>`) : esc(s);
const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

const tag = c => `<span class="tag tag-${c === "casual" ? "sage" : "blue"}">${ctxLabel(c)}</span>`;
const avatar = (c, small) => `<div class="avatar ${ctxOf(c.id) === "casual" ? "avatar-coral" : "avatar-blue"} ${small ? "small" : ""}" aria-hidden="true">${esc(c.partner[0])}</div>`;

const ICONS = {
  home: '<path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.3V21h13V9.3M9 21v-6h6v6"/>',
  book: '<path d="M4 4.8A3.8 3.8 0 0 1 7.8 1H11v18H7.5A3.5 3.5 0 0 0 4 22.5V4.8Z"/><path d="M20 4.8A3.8 3.8 0 0 0 16.2 1H13v18h3.5a3.5 3.5 0 0 1 3.5 3.5V4.8Z"/>',
  spark: '<path d="m12 2 1.3 5.1A5 5 0 0 0 17 10.7L22 12l-5 1.3a5 5 0 0 0-3.7 3.7L12 22l-1.3-5A5 5 0 0 0 7 13.3L2 12l5-1.3A5 5 0 0 0 10.7 7L12 2Z"/>',
  back: '<path d="m15 18-6-6 6-6"/><path d="M9 12h11"/>',
  next: '<path d="m9 18 6-6-6-6"/><path d="M15 12H4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4.2 4.2L19 6.5"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
  message: '<path d="M20 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v8Z"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/><path d="M2 20h22"/>',
  trend: '<path d="m4 16 6-6 4 4 6-7"/><path d="M15 7h5v5"/>',
  send: '<path d="M4 12 20 4l-6 16-3-7-7-1Z"/>'
};
const icon = (name, size = 20) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// The coach mascot: a lavender speech bubble with a face. wave: play the one-time hello.
// mood: "happy" (default), "cheer" (closed happy eyes, open smile, both arms up), "think".
const MASCOT_FACE = {
  happy: `<ellipse cx="26" cy="25" rx="3.2" ry="4.2" fill="#2d2440"/><ellipse cx="41" cy="25" rx="3.2" ry="4.2" fill="#2d2440"/>
    <circle cx="27" cy="23.5" r="1" fill="#fff"/><circle cx="42" cy="23.5" r="1" fill="#fff"/>
    <path d="M28.5 33.5q5 5 10 0" fill="none" stroke="#2d2440" stroke-width="2.4" stroke-linecap="round"/>`,
  cheer: `<path d="M22.5 26q3.5-5 7 0M37.5 26q3.5-5 7 0" fill="none" stroke="#2d2440" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M27 31.5h13q-1 8-6.5 8T27 31.5Z" fill="#2d2440"/><path d="M30 36.5q3.5-2 7 0q-1.5 3-3.5 3t-3.5-3Z" fill="#ff8f7a"/>`,
  think: `<ellipse cx="27" cy="23" rx="3" ry="3.8" fill="#2d2440"/><ellipse cx="42" cy="23" rx="3" ry="3.8" fill="#2d2440"/>
    <circle cx="28" cy="21.5" r="1" fill="#fff"/><circle cx="43" cy="21.5" r="1" fill="#fff"/>
    <ellipse cx="34" cy="35" rx="2.6" ry="2.2" fill="#2d2440"/>`
};
const mascot = (size = 56, wave = false, mood = "happy") => `
  <svg class="mascot mascot-${mood} ${wave ? "wave" : ""}" width="${size}" height="${Math.round(size * 64 / 72)}" viewBox="0 0 72 64" aria-hidden="true">
    <ellipse cx="33" cy="61" rx="20" ry="2.5" fill="#2d2440" opacity=".08"/>
    ${mood === "cheer" ? `<path d="M8 24C3 21 1 15 2 10" fill="none" stroke="#a78bec" stroke-width="6" stroke-linecap="round"/>` : ""}
    <g class="mascot-arm"><path d="${mood === "cheer" ? "M58 24c5-3 7-8 6-14" : "M58 30c6-2 9-7 9-13"}" fill="none" stroke="#a78bec" stroke-width="6" stroke-linecap="round"/></g>
    <path d="M17 44 13 57l15-10Z" fill="#b39cf0" stroke="#b39cf0" stroke-width="4" stroke-linejoin="round"/>
    <rect x="5" y="5" width="56" height="45" rx="20" fill="#b39cf0"/>
    <ellipse cx="22" cy="13" rx="9" ry="3" fill="#fff" opacity=".35"/>
    ${MASCOT_FACE[mood] || MASCOT_FACE.happy}
    <circle cx="19.5" cy="33" r="3.5" fill="#ffb59c" opacity=".75"/><circle cx="47.5" cy="33" r="3.5" fill="#ffb59c" opacity=".75"/>
  </svg>`;

// The coach talking: small mascot plus a speech bubble. html is trusted markup.
const coachSays = (html, mood = "happy", size = 46) =>
  `<div class="coach-says">${mascot(size, false, mood)}<p class="coach-bubble">${html}</p></div>`;

// Page header used by most screens. back: route name to return to.
function pageHeader({ eyebrow, title, back, action = "" }) {
  return `<header class="page-header">
    ${back || action ? `<div class="header-row">
      ${back ? `<button class="icon-button" type="button" data-act="go" data-to="${back}" aria-label="Go back">${icon("back")}</button>` : ""}
      ${action}
    </div>` : ""}
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
    <h1>${title}</h1>
  </header>`;
}

// ---------- Navigation ----------
const NAV = [
  { key: "home", label: "Home", icon: "home" },
  { key: "bank", label: "Vocab", icon: "book" },
  { key: "practice", label: "Practice", icon: "spark" },
  { key: "report", label: "Progress", icon: "chart" }
];
// Which bottom-nav item is highlighted for each route.
const NAV_FOR = { home: "home", convo: "home", bank: "bank", practice: "practice", session: "practice", recap: "practice", celebrate: "practice", report: "report" };
const NO_NAV = ["session", "celebrate"];

function go(route) { UI.route = route; UI.enter = true; render(); UI.enter = false; window.scrollTo(0, 0); }

function renderNav() {
  const nav = document.getElementById("nav");
  nav.hidden = NO_NAV.includes(UI.route.name);
  const review = ITEMS.filter(i => ["new", "practice"].includes(statusOf(i.id))).length;
  nav.innerHTML = NAV.map(n => `
    <button type="button" class="nav-item ${NAV_FOR[UI.route.name] === n.key ? "active" : ""}" data-act="go" data-to="${n.key}"
      ${NAV_FOR[UI.route.name] === n.key ? 'aria-current="page"' : ""}>
      ${icon(n.icon, 21)}<span>${n.label}${n.key === "bank" && review ? ` <b class="nav-badge">${review}</b>` : ""}</span>
    </button>`).join("");
}

function render() {
  const view = document.getElementById("view");
  view.className = `screen screen-${UI.route.name}${UI.enter ? " enter" : ""}`;
  view.innerHTML = SCREENS[UI.route.name]();
  renderNav();
  if (typeof afterRender[UI.route.name] === "function") afterRender[UI.route.name]();
}
const afterRender = {};   // optional per-screen hook, e.g. scroll or animation

// ---------- Shared actions ----------
ACTIONS.go = el => { UI.bankFilter = el.dataset.filter || null; go({ name: el.dataset.to, id: el.dataset.id }); };
ACTIONS.mark = el => { S.status[el.dataset.id] = el.dataset.status; save(); render(); };
ACTIONS.reset = () => { S = freshState(); save(); UI.session = null; UI.bankFilter = null; go({ name: "home" }); };

document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (el && ACTIONS[el.dataset.act]) ACTIONS[el.dataset.act](el);
});
document.addEventListener("submit", e => {
  if (!FORMS[e.target.id]) return;
  e.preventDefault();
  FORMS[e.target.id](e.target);
});
document.addEventListener("DOMContentLoaded", () => { UI.enter = true; render(); UI.enter = false; });
