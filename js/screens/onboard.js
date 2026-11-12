// Onboarding (PRD v2 §6.0): language, level and contexts, a sample of the feedback, then
// turning on recording. Every step but the last can be skipped. Answers go to S.profile.
// Shown on first launch and after Reset demo.

const OB_STEPS = 4;
const OB_LANGS = ["English", "Spanish", "Japanese", "Mandarin"];
const OB_SPEAKS = ["Mandarin", "Japanese", "Korean", "Spanish", "Hindi", "Other"];
const OB_LEVELS = [
  ["getby", "I get by", "I can handle everyday things, but often search for words."],
  ["comfortable", "I'm comfortable", "I keep up in most conversations."],
  ["natural", "I'm fluent", "I want to sound more natural."]
];
const OB_CONTEXTS = ["Work", "School", "Friends", "Errands & services"];

const obProfile = () => (UI.ob = UI.ob || { step: 0, lang: "English", speaks: [], level: null, contexts: [] });
const chip = (act, value, on, label = value) =>
  `<button type="button" class="ob-chip ${on ? "on" : ""}" aria-pressed="${on}" data-act="${act}" data-v="${esc(value)}">${esc(label)}</button>`;

function obBody(p) {
  if (p.step === 0) return `
    <div class="ob-hero">${mascot(96, true)}</div>
    <h1>Hi! I turn your real conversations into feedback you can use.</h1>
    <p class="ob-lead">A few quick questions so the feedback starts at your level.</p>
    <p class="ob-q">Which language are you practicing?</p>
    <div class="ob-chips">${OB_LANGS.map(l => chip("obLang", l, p.lang === l)).join("")}</div>
    <p class="ob-q">Which languages do you already speak?</p>
    <div class="ob-chips">${OB_SPEAKS.map(l => chip("obSpeak", l, p.speaks.includes(l))).join("")}</div>`;
  if (p.step === 1) return `
    <h1>How do you feel speaking ${esc(p.lang)}?</h1>
    <div class="ob-levels" role="radiogroup" aria-label="Your speaking level">
      ${OB_LEVELS.map(([k, name, hint]) => `<button type="button" class="ob-level ${p.level === k ? "on" : ""}" role="radio" aria-checked="${p.level === k}" data-act="obLevel" data-v="${k}">
        <strong>${name}</strong><small>${hint}</small></button>`).join("")}
    </div>
    <p class="ob-q">Where do you speak it?</p>
    <div class="ob-chips">${OB_CONTEXTS.map(c => chip("obContext", c, p.contexts.includes(c))).join("")}</div>
    <p class="ob-note">This is a starting point. Your first few conversations will fine-tune it, and you can change it anytime.</p>`;
  if (p.step === 2) {
    const i = byId["maya-r1"];
    return `
    <h1>After each conversation, you get up to 3 things to try.</h1>
    <p class="ob-lead">Here's what one looks like:</p>
    <article class="top-card ob-sample">
      <div class="top-head"><span class="top-num">1</span><span class="area-chip area-${i.area}">${AREA[i.area]}</span><span class="top-ctx">Coffee chat · 01:40</span></div>
      <p class="top-said"><span>You said</span>“${esc(i.said)}”</p>
      <p class="top-try"><span>Try</span>“${esc(i.alt.casual)}”</p>
      <details class="why"><summary>Why?</summary><p>${esc(i.why.casual)}</p></details>
    </article>
    <p class="ob-note">Only your own words are scored. Phrases other people say can still become things you save and learn.</p>`;
  }
  return `
    <div class="ob-hero">${mascot(84, false, "happy")}</div>
    <h1>Turn on recording</h1>
    <ul class="ob-points">
      <li>${icon("mic", 18)}<span>Once it's on, it keeps running in the background. No daily prompts.</span></li>
      <li>${icon("pause", 18)}<span>Pause anytime with one tap. It stays paused until you tap Resume.</span></li>
      <li>${icon("lock", 18)}<span>Only your own speech is scored. Other people's audio isn't kept, only the text of useful phrases.</span></li>
    </ul>
    <p class="ob-note">Prototype: nothing is actually recorded. Let people know when you're recording them.</p>`;
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
        ? `<button class="button-cta" type="button" data-act="obDone">${icon("mic", 18)} Turn on recording</button>`
        : `<button class="button-cta" type="button" data-act="obNext">Continue ${icon("next", 18)}</button>`}
    </div>`;
};

const obToggle = (list, v) => list.includes(v) ? list.filter(x => x !== v) : [...list, v];
ACTIONS.obLang = el => { obProfile().lang = el.dataset.v; render(); };
ACTIONS.obSpeak = el => { const p = obProfile(); p.speaks = obToggle(p.speaks, el.dataset.v); render(); };
ACTIONS.obLevel = el => { obProfile().level = el.dataset.v; render(); };
ACTIONS.obContext = el => { const p = obProfile(); p.contexts = obToggle(p.contexts, el.dataset.v); render(); };
ACTIONS.obNext = () => { const p = obProfile(); p.step = Math.min(OB_STEPS - 1, p.step + 1); go({ name: "onboard" }); };
ACTIONS.obBack = () => { const p = obProfile(); p.step = Math.max(0, p.step - 1); go({ name: "onboard" }); };
ACTIONS.obDone = () => {
  const { lang, speaks, level, contexts } = obProfile();
  S.profile = { lang, speaks, level, contexts };
  S.onboarded = true;
  S.recording = "on";
  save();
  UI.ob = null;
  UI.waved = false;
  go({ name: "home" });
};
