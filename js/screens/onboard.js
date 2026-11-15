// Onboarding (PRD §6.0): language (with what it supports), level (self-rated, plus an optional
// CEFR level, test score or linked learning app), how often and where the learner speaks it,
// how recording works and how many prompts a day (2 recommended), and an optional calendar.
// AI-only mode is not offered here; prompts can be turned off later in Settings (§6.10).
// Answers go to S.profile.
// Shown on first launch and after Reset demo.

const OB_STEPS = 4;
const OB_LANGS = ["English", "Spanish", "Japanese", "Mandarin"];
const OB_SPEAKS = ["Mandarin", "Japanese", "Korean", "Spanish", "Hindi", "Other"];
const OB_LEVELS = [
  ["getby", "I get by", "Everyday things, with some searching for words"],
  ["comfortable", "I'm comfortable", "I keep up in most conversations"],
  ["natural", "I'm fluent", "I want to sound more natural"]
];
// Optional, more objective level (ONB-09). Linking an app is simulated.
const OB_CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];
const OB_TESTS = ["TOEFL", "IELTS", "Duolingo English Test"];
const OB_APPS = ["Duolingo", "Speak", "Memrise"];
// Prompts a day (ONB-04, REC-04). The first is recommended and preselected.
const OB_PER_DAY = [[2, "2 a day", "Recommended"], [1, "1 a day", "A lighter start"], [5, "Up to 5 a day", "For days full of conversations"]];
const OB_FREQ = ["Every day", "A few times a week", "About once a week", "Rarely"];
const OB_CONTEXTS = ["Work", "School or classes", "Friends", "Errands & services", "Online", "Community", "Travel"];
const CAP_MARK = { yes: ["✓", "available"], limited: ["◐", "limited"], no: ["×", "not yet"] };

const obProfile = () => (UI.ob = UI.ob || { step: 0, lang: "English", speaks: [], level: null, freq: null, contexts: [], cefr: null, test: "TOEFL", score: "", apps: [], perDay: 2 });
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
    <h1>How do you use ${esc(p.lang)}?</h1>
    <div class="ob-levels" role="radiogroup" aria-label="Your speaking level">
      ${OB_LEVELS.map(([k, name, hint]) => `<button type="button" class="ob-level ${p.level === k ? "on" : ""}" role="radio" aria-checked="${p.level === k}" data-act="obLevel" data-v="${k}">
        <strong>${name}</strong><small>${hint}</small></button>`).join("")}
    </div>
    <details class="ob-more" ${p.cefr || p.score || p.apps.length ? "open" : ""}>
      <summary>Know your level? <small>Optional · helps match feedback to you</small></summary>
      <p class="ob-q">CEFR level</p>
      <div class="ob-chips">${OB_CEFR.map(l => chip("obCefr", l, p.cefr === l)).join("")}</div>
      <p class="ob-q">Or a test score</p>
      <div class="ob-score">
        <select id="ob-test" aria-label="Test">${OB_TESTS.map(t => `<option ${p.test === t ? "selected" : ""}>${t}</option>`).join("")}</select>
        <input id="ob-score" inputmode="numeric" placeholder="Score" value="${esc(p.score)}" aria-label="Score">
      </div>
      <p class="ob-q">Or link a learning app <small>(simulated)</small></p>
      <div class="ob-chips">${OB_APPS.map(a => chip("obApp", a, p.apps.includes(a), p.apps.includes(a) ? `✓ ${a}` : a)).join("")}</div>
    </details>
    <p class="ob-q">How often do you speak it?</p>
    <div class="ob-chips">${OB_FREQ.map(f => chip("obFreq", f, p.freq === f)).join("")}</div>
    <p class="ob-q">Where do you speak it?</p>
    <div class="ob-chips">${OB_CONTEXTS.map(c => chip("obContext", c, p.contexts.includes(c))).join("")}</div>
    <p class="ob-note">You can change this anytime.</p>`;
  if (p.step === 2) return `
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
ACTIONS.obLevel = el => { obProfile().level = el.dataset.v; render(); };
ACTIONS.obFreq = el => { obProfile().freq = el.dataset.v; render(); };
ACTIONS.obContext = el => { const p = obProfile(); p.contexts = obToggle(p.contexts, el.dataset.v); render(); };
ACTIONS.obCefr = el => { const p = obProfile(); p.cefr = p.cefr === el.dataset.v ? null : el.dataset.v; render(); };
ACTIONS.obApp = el => { const p = obProfile(); p.apps = obToggle(p.apps, el.dataset.v); render(); };
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
  const { lang, speaks, level, freq, contexts, cefr, test, score, apps, perDay } = obProfile();
  S.profile = { lang, speaks, level, freq, contexts, cefr, test: score ? test : null, score, apps };
  S.prompts = true;
  S.perDay = perDay;
  S.calendar = el.dataset.cal === "1";
  S.onboarded = true;
  save();
  UI.ob = null;
  UI.waved = false;
  go({ name: "home" });
};
