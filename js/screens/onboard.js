// Onboarding (PRD §6.0): language (with what it supports), level, how often and where the
// learner speaks it, the two opt-in recording modes (prompts or AI-only), and an optional
// calendar. Every step but the recording choice can be skipped. Answers go to S.profile.
// Shown on first launch and after Reset demo.

const OB_STEPS = 4;
const OB_LANGS = ["English", "Spanish", "Japanese", "Mandarin"];
const OB_SPEAKS = ["Mandarin", "Japanese", "Korean", "Spanish", "Hindi", "Other"];
const OB_LEVELS = [
  ["getby", "I get by", "Everyday things, with some searching for words"],
  ["comfortable", "I'm comfortable", "I keep up in most conversations"],
  ["natural", "I'm fluent", "I want to sound more natural"]
];
const OB_FREQ = ["Every day", "A few times a week", "About once a week", "Rarely"];
const OB_CONTEXTS = ["Work", "School or classes", "Friends", "Errands & services", "Online", "Community", "Travel"];
const CAP_MARK = { yes: ["✓", "available"], limited: ["◐", "limited"], no: ["×", "not yet"] };

const obProfile = () => (UI.ob = UI.ob || { step: 0, lang: "English", speaks: [], level: null, freq: null, contexts: [], mode: null });
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
    <p class="ob-q">How often do you speak it?</p>
    <div class="ob-chips">${OB_FREQ.map(f => chip("obFreq", f, p.freq === f)).join("")}</div>
    <p class="ob-q">Where do you speak it?</p>
    <div class="ob-chips">${OB_CONTEXTS.map(c => chip("obContext", c, p.contexts.includes(c))).join("")}</div>
    <p class="ob-note">You can change this anytime.</p>`;
  if (p.step === 2) return `
    <h1>You decide what gets recorded</h1>
    <ul class="ob-points">
      <li>${icon("mic", 18)}<span><strong>Quick record:</strong> tap to start, tap to stop</span></li>
      <li>${icon("bell", 18)}<span><strong>Prompts:</strong> 2–3 min, only if you accept, up to 2 a day</span></li>
      <li>${icon("lock", 18)}<span>Audio and full transcripts are deleted after analysis</span></li>
    </ul>
    <p class="ob-q">Would you like recording prompts?</p>
    <div class="ob-levels" role="radiogroup" aria-label="Recording prompts">
      <button type="button" class="ob-level ${p.mode === "prompts" ? "on" : ""}" role="radio" aria-checked="${p.mode === "prompts"}" data-act="obMode" data-v="prompts">
        <strong>Yes, prompt me</strong><small>Quick record works too.</small></button>
      <button type="button" class="ob-level ${p.mode === "ai" ? "on" : ""}" role="radio" aria-checked="${p.mode === "ai"}" data-act="obMode" data-v="ai">
        <strong>No prompts, AI practice for now</strong><small>You can still record anytime.</small></button>
    </div>`;
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
  const mustChoose = p.step === 2 && !p.mode;
  return `
    <div class="ob-top">
      ${p.step ? `<button class="icon-button" type="button" data-act="obBack" aria-label="Back">${icon("back")}</button>` : "<span></span>"}
      <div class="ob-dots" role="img" aria-label="Step ${p.step + 1} of ${OB_STEPS}">${Array.from({ length: OB_STEPS }, (_, k) => `<span class="${k <= p.step ? "on" : ""}"></span>`).join("")}</div>
      ${p.step === 2 || last ? "<span></span>" : `<button class="text-link" type="button" data-act="obNext">Skip</button>`}
    </div>
    <div class="ob-body">${obBody(p)}</div>
    <div class="ob-actions">
      ${last
        ? `<button class="button-cta" type="button" data-act="obDone" data-cal="1">${icon("calendar", 18)} Connect calendar <small>(simulated)</small></button>
           <button class="button button-quiet full-button ob-skip" type="button" data-act="obDone" data-cal="0">Not now</button>`
        : `<button class="button-cta" type="button" data-act="obNext" ${mustChoose ? "disabled" : ""}>Continue ${icon("next", 18)}</button>`}
    </div>`;
};

const obToggle = (list, v) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];
ACTIONS.obLang = el => { obProfile().lang = el.dataset.v; render(); };
ACTIONS.obSpeak = el => { const p = obProfile(); p.speaks = obToggle(p.speaks, el.dataset.v); render(); };
ACTIONS.obLevel = el => { obProfile().level = el.dataset.v; render(); };
ACTIONS.obFreq = el => { obProfile().freq = el.dataset.v; render(); };
ACTIONS.obContext = el => { const p = obProfile(); p.contexts = obToggle(p.contexts, el.dataset.v); render(); };
ACTIONS.obMode = el => { obProfile().mode = el.dataset.v; render(); };
ACTIONS.obNext = () => { const p = obProfile(); if (p.step === 2 && !p.mode) return; p.step = Math.min(OB_STEPS - 1, p.step + 1); go({ name: "onboard" }); };
ACTIONS.obBack = () => { const p = obProfile(); p.step = Math.max(0, p.step - 1); go({ name: "onboard" }); };
ACTIONS.obDone = el => {
  const { lang, speaks, level, freq, contexts, mode } = obProfile();
  S.profile = { lang, speaks, level, freq, contexts, mode };
  S.prompts = mode !== "ai";
  S.calendar = el.dataset.cal === "1";
  S.onboarded = true;
  save();
  UI.ob = null;
  UI.waved = false;
  go({ name: "home" });
};
