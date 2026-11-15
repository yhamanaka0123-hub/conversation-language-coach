// Onboarding (PRD §6.0): language (with what it supports), level (a test score or linked app sets
// it when the learner has one; otherwise they pick from five levels, each with its CEFR range),
// how often and where the learner speaks it,
// how recording works and how many prompts a day (2 recommended), and an optional calendar.
// AI-only mode is not offered here; prompts can be turned off later in Settings (§6.10).
// Answers go to S.profile.
// Shown on first launch and after Reset demo.

const OB_STEPS = 5;   // language, level, how and where, recording, calendar
const OB_LANGS = ["English", "Spanish", "Japanese", "Mandarin"];
const OB_SPEAKS = ["Mandarin", "Japanese", "Korean", "Spanish", "Hindi", "Other"];
// Five levels, each with its CEFR range so a learner who knows theirs can match it (ONB-09).
const OB_LEVELS = [
  ["beginner", "Beginner", "A1", "Simple phrases and greetings"],
  ["elementary", "Elementary", "A2", "Everyday things, with some searching for words"],
  ["intermediate", "Intermediate", "B1", "I keep up in most everyday conversations"],
  ["upper", "Upper-intermediate", "B2", "Fine at work or school; I want to sound more natural"],
  ["advanced", "Advanced", "C1–C2", "Fluent; I want to fine-tune"]
];
const levelName = k => (OB_LEVELS.find(l => l[0] === k) || [])[1];
// A test score sets a starting level (approximate bands; the real mapping is TBD, §12).
// Each: [name, max score, [lowest score for elementary, intermediate, upper, advanced]].
const OB_TESTS = [
  ["TOEFL iBT", 120, [0, 42, 72, 95]],
  ["IELTS", 9, [0, 4, 5.5, 7]],
  ["Duolingo English Test", 160, [10, 60, 100, 130]]
];
function levelFromScore(test, score) {
  const t = OB_TESTS.find(x => x[0] === test), n = Number(score);
  if (!t || !score || isNaN(n) || n < 0 || n > t[1]) return null;
  const band = t[2].filter(min => n >= min).length;   // 0..4
  return ["beginner", "elementary", "intermediate", "upper", "advanced"][band];
}
// Learning apps the learner can connect (simulated): what the app would share, and the
// starting level it suggests. Real integrations and what each app can share are TBD (§12).
const OB_APPS = {
  Duolingo: { color: "#58cc02", level: "intermediate", cefr: "B1", detail: "English course · Unit 12" },
  Speak: { color: "#1f6feb", level: "intermediate", cefr: "B1", detail: "Level 3 of 5" },
  Memrise: { color: "#ffbb00", level: "elementary", cefr: "A2", detail: "English · Beginner 2" }
};
const appBadge = a => `<span class="app-badge" style="background:${OB_APPS[a].color}" aria-hidden="true">${a[0]}</span>`;

// One row per app: Connect, or what it shared once connected.
function appRow(p, a) {
  const on = p.app === a, x = OB_APPS[a];
  return `<div class="app-row ${on ? "on" : ""}">
    ${appBadge(a)}
    <span class="app-name"><strong>${a}</strong>${on ? `<small>${icon("check", 12)} Connected · ${esc(x.detail)} · about ${x.cefr}</small>` : ""}</span>
    ${on ? `<button type="button" class="text-link" data-act="obDisconnect">Disconnect</button>`
      : `<button type="button" class="button button-secondary app-connect" data-act="obConnect" data-v="${a}">Connect</button>`}
  </div>`;
}

// The permission step a real connection would ask for (simulated).
function connectSheet(p) {
  const a = p.connecting; if (!a) return "";
  return `<section class="connect-sheet" role="dialog" aria-label="Connect ${a}">
    <div class="connect-head">${appBadge(a)}<span>${icon("next", 16)}</span>${mascot(30)}</div>
    <h2>Connect ${a} to ${APP_NAME}?</h2>
    <p>${APP_NAME} will read:</p>
    <ul><li>Your course level</li><li>Your progress in the course</li></ul>
    <p class="connect-note">It won't post anything or change your ${a} account. You can disconnect anytime.</p>
    <div class="connect-actions">
      <button type="button" class="button button-primary" data-act="obAllow">Allow</button>
      <button type="button" class="button button-quiet" data-act="obCancelConnect">Cancel</button>
    </div>
    <small class="lang-sample">Simulated: nothing is connected</small>
  </section>`;
}
// Prompts a day (ONB-04, REC-04). The first is recommended and preselected.
const OB_PER_DAY = [[2, "2 a day", "Recommended"], [1, "1 a day", "A lighter start"], [5, "Up to 5 a day", "For days full of conversations"]];
const OB_FREQ = ["Every day", "A few times a week", "About once a week", "Rarely"];
// Same four as the Practice topics (TOPICS in data.js), plus Other.
const OB_CONTEXTS = ["Work", "School", "Friends", "Family", "Other"];
const CAP_MARK = { yes: ["✓", "available"], limited: ["◐", "limited"], no: ["×", "not yet"] };

const obProfile = () => (UI.ob = UI.ob || { step: 0, lang: "English", speaks: [], level: null, freq: null, contexts: [], levelFrom: null, test: "TOEFL iBT", score: "", app: null, perDay: 2 });
const chip = (act, value, on, label = value) =>
  `<button type="button" class="ob-chip ${on ? "on" : ""}" aria-pressed="${on}" data-act="${act}" data-v="${esc(value)}">${esc(label)}</button>`;

// What the chosen language supports (LNG-01..03), as one line of chips. A note appears only
// when something is limited. Sample values; real coverage is TBD.
function langSupport(lang) {
  const l = LANG_SUPPORT[lang];
  return `<div class="lang-caps" aria-label="What ${esc(lang)} supports">
    <p class="cap-line">${CAPS.map((c, k) => { const [mark, word] = CAP_MARK[l.caps[k]];
      return `<span class="cap cap-${l.caps[k]}"><span aria-hidden="true">${mark}</span> ${c}<span class="sr-only">: ${word}</span></span>`; }).join("")}
      <small class="lang-sample">sample</small></p>
    ${l.note ? `<p class="cap-note">${esc(l.note)}</p>` : ""}
  </div>`;
}

function obBody(p) {
  if (p.step === 0) return `
    <div class="ob-hero">${mascot(84, true)}</div>
    <h1>Hi! Let's set up your coach.</h1>
    <p class="ob-q">Which language are you practicing?</p>
    <div class="ob-chips">${OB_LANGS.map(l => chip("obLang", l, p.lang === l)).join("")}</div>
    ${langSupport(p.lang)}
    <p class="ob-q">Which languages do you already speak?</p>
    <div class="ob-chips">${OB_SPEAKS.map(l => chip("obSpeak", l, p.speaks.includes(l))).join("")}</div>`;
  if (p.step === 1) return `
    <h1>What's your ${esc(p.lang)} level?</h1>
    <section class="ob-proof">
      <p class="ob-q">Connect a learning app <small>Optional · we'll start from your level there</small></p>
      <div class="app-list">${Object.keys(OB_APPS).map(a => appRow(p, a)).join("")}</div>
      ${connectSheet(p)}
    </section>
    <section class="ob-proof">
      <p class="ob-q">Or enter a test score <small>Optional</small></p>
      <div class="ob-score">
        <select id="ob-test" aria-label="Test">${OB_TESTS.map(([t]) => `<option ${p.test === t ? "selected" : ""}>${t}</option>`).join("")}</select>
        <input id="ob-score" inputmode="decimal" placeholder="Score" value="${esc(p.score)}" aria-label="Score">
        <button type="button" class="button button-secondary" data-act="obUseScore">Use</button>
      </div>
      ${p.scoreError ? `<p class="ob-error">${esc(p.scoreError)}</p>` : ""}
    </section>
    ${p.levelFrom ? `<p class="ob-from">${icon("check", 15)}<span>Set from ${esc(p.levelFrom)}: <strong>${esc(levelName(p.level))}</strong>. It's a starting point; change it below if it doesn't feel right.</span></p>` : ""}
    <p class="ob-q">${p.levelFrom ? "Your level" : "No app or score? Pick the one closest to you"}</p>
    <div class="ob-levels" role="radiogroup" aria-label="Your speaking level">
      ${OB_LEVELS.map(([k, name, cefr, hint]) => `<button type="button" class="ob-level ${p.level === k ? "on" : ""}" role="radio" aria-checked="${p.level === k}" data-act="obLevel" data-v="${k}">
        <strong>${name} <span class="cefr">${cefr}</span></strong><small>${hint}</small></button>`).join("")}
    </div>
    <p class="ob-note">We'll fine-tune it from your first conversations.</p>`;
  if (p.step === 2) return `
    <h1>How do you use ${esc(p.lang)}?</h1>
    <p class="ob-q">How often do you speak it?</p>
    <div class="ob-chips">${OB_FREQ.map(f => chip("obFreq", f, p.freq === f)).join("")}</div>
    <p class="ob-q">Where do you speak it?</p>
    <div class="ob-chips">${OB_CONTEXTS.map(c => chip("obContext", c, p.contexts.includes(c))).join("")}</div>
    <p class="ob-note">You can change this anytime.</p>`;
  if (p.step === 3) return `
    <h1>You decide what gets recorded</h1>
    <ul class="ob-points">
      <li>${icon("bell", 18)}<span><strong>Prompts:</strong> we'll ask before a chat. It records 2–3 min, only if you accept.</span></li>
      <li>${icon("mic", 18)}<span><strong>Quick record:</strong> start it yourself from the app or Control Center.</span></li>
      <li>${icon("lock", 18)}<span>Audio is deleted after analysis. Transcripts are kept so you can replay a chat, and you can delete any of them.</span></li>
    </ul>
    <p class="ob-q">How many prompts a day?</p>
    <div class="ob-levels" role="radiogroup" aria-label="Prompts a day">
      ${OB_PER_DAY.map(([n, name, hint]) => `<button type="button" class="ob-level ${p.perDay === n ? "on" : ""}" role="radio" aria-checked="${p.perDay === n}" data-act="obPerDay" data-v="${n}">
        <strong>${name}${n === 2 ? ' <span class="rec-badge">Recommended</span>' : ""}</strong><small>${n === 2 ? "Enough to learn without getting in the way" : hint}</small></button>`).join("")}
    </div>
    <p class="ob-note">Prompts stop for the day after that many recordings. It's not a goal: skipping one is fine. Change it anytime in Settings.</p>`;
  return `
    <div class="ob-hero">${mascot(84, false, "happy")}</div>
    <h1>Connect your calendar?</h1>
    <p class="ob-lead">Helps time prompts. Optional.</p>
    <ul class="ob-points">
      <li>${icon("calendar", 18)}<span>It never starts recording. You can change this in Settings.</span></li>
    </ul>`;
}

SCREENS.onboard = () => {
  const p = obProfile();
  const last = p.step === OB_STEPS - 1;
  return `
    <div class="ob-top">
      ${p.step ? `<button class="icon-button" type="button" data-act="obBack" aria-label="Back">${icon("back")}</button>` : "<span></span>"}
      <div class="ob-dots" role="img" aria-label="Step ${p.step + 1} of ${OB_STEPS}">${Array.from({ length: OB_STEPS }, (_, k) => `<span class="${k <= p.step ? "on" : ""}"></span>`).join("")}</div>
      ${last ? "<span></span>" : `<button class="text-link" type="button" data-act="obNext">Skip</button>`}
    </div>
    <div class="ob-body">${obBody(p)}</div>
    <div class="ob-actions">
      ${last
        ? `<button class="button-cta" type="button" data-act="obDone" data-cal="1">${icon("calendar", 18)} Connect calendar <small>(simulated)</small></button>
           <button class="button button-quiet full-button ob-skip" type="button" data-act="obDone" data-cal="0">Not now</button>`
        : `<button class="button-cta" type="button" data-act="obNext">Continue ${icon("next", 18)}</button>`}
    </div>`;
};

const obToggle = (list, v) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];
ACTIONS.obLang = el => { obProfile().lang = el.dataset.v; render(); };
ACTIONS.obSpeak = el => { const p = obProfile(); p.speaks = obToggle(p.speaks, el.dataset.v); render(); };
// Picking a level by hand overrides one set from a score or app.
ACTIONS.obLevel = el => { const p = obProfile(); p.level = el.dataset.v; p.levelFrom = null; render(); };
ACTIONS.obFreq = el => { obProfile().freq = el.dataset.v; render(); };
ACTIONS.obContext = el => { const p = obProfile(); p.contexts = obToggle(p.contexts, el.dataset.v); render(); };
ACTIONS.obUseScore = () => {
  const p = obProfile(), lvl = levelFromScore(p.test, p.score);
  const max = OB_TESTS.find(t => t[0] === p.test)[1];
  p.scoreError = lvl ? null : `Enter a ${p.test} score between 0 and ${max}.`;
  if (lvl) { p.level = lvl; p.levelFrom = `${p.test} ${p.score}`; }
  render();
};
// Connecting asks for permission first; allowing sets the starting level from the app.
ACTIONS.obConnect = el => { obProfile().connecting = el.dataset.v; render(); };
ACTIONS.obCancelConnect = () => { obProfile().connecting = null; render(); };
ACTIONS.obAllow = () => {
  const p = obProfile(), a = p.connecting;
  p.app = a; p.connecting = null; p.level = OB_APPS[a].level; p.levelFrom = `your ${a} course`; p.scoreError = null;
  render();
};
ACTIONS.obDisconnect = () => {
  const p = obProfile();
  if (p.levelFrom === `your ${p.app} course`) p.levelFrom = null;
  p.app = null;
  render();
};
ACTIONS.obPerDay = el => { obProfile().perDay = Number(el.dataset.v); render(); };
// The test and score fields keep their values without re-rendering while typing.
document.addEventListener("input", e => {
  if (e.target.id === "ob-score") obProfile().score = e.target.value.replace(/[^\d.]/g, "").slice(0, 5);
  if (e.target.id === "ob-test") obProfile().test = e.target.value;
});
document.addEventListener("change", e => { if (e.target.id === "ob-test") obProfile().test = e.target.value; });
ACTIONS.obNext = () => { const p = obProfile(); p.step = Math.min(OB_STEPS - 1, p.step + 1); go({ name: "onboard" }); };
ACTIONS.obBack = () => { const p = obProfile(); p.step = Math.max(0, p.step - 1); go({ name: "onboard" }); };
ACTIONS.obDone = el => {
  const { lang, speaks, level, levelFrom, freq, contexts, test, score, app, perDay } = obProfile();
  S.profile = { lang, speaks, level, levelFrom, freq, contexts, test: levelFrom && score ? test : null, score: levelFrom && score ? score : "", app };
  S.prompts = true;
  S.perDay = perDay;
  S.calendar = el.dataset.cal === "1";
  S.onboarded = true;
  save();
  UI.ob = null;
  UI.waved = false;
  go({ name: "home" });
};
