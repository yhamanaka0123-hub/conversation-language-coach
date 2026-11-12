// Home: recording control, a feedback-ready push banner, the coach greeting, the latest
// conversation's Top 3 to try next, and the rest of the day (PRD v2 §5).

// Small illustrations for conversation cards, keyed by CONVOS[].art.
const ART = {
  coffee: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M15 6c-1.5 2 1.5 3 0 5M21 6c-1.5 2 1.5 3 0 5" fill="none" stroke="#c98a6b" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M27 18h2.5a4 4 0 0 1 0 8H26" fill="none" stroke="#8a4b2e" stroke-width="2.4"/>
    <path d="M8 15h20v9a9 9 0 0 1-9 9h-2a9 9 0 0 1-9-9v-9Z" fill="#fff" stroke="#8a4b2e" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M10.5 20h15" stroke="#f3b597" stroke-width="3" stroke-linecap="round"/>
    <path d="M6 35h26" stroke="#8a4b2e" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  meeting: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="5" y="8" width="30" height="20" rx="4" fill="#fff" stroke="#2f6b52" stroke-width="2.2"/>
    <circle cx="14" cy="16" r="3" fill="#8fd0b3"/><path d="M9.5 24a4.5 4.5 0 0 1 9 0" fill="#8fd0b3"/>
    <circle cx="26" cy="16" r="3" fill="#b9d3f0"/><path d="M21.5 24a4.5 4.5 0 0 1 9 0" fill="#b9d3f0"/>
    <path d="M14 33h12M20 28v5" stroke="#2f6b52" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  bowl: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M14 7c-1.5 2 1.5 3 0 5M20 6c-1.5 2 1.5 3 0 5M26 7c-1.5 2 1.5 3 0 5" fill="none" stroke="#c98a6b" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 18h28a14 14 0 0 1-28 0Z" fill="#fff" stroke="#8a4b2e" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M10 21h20" stroke="#f3b597" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 34h12" stroke="#8a4b2e" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  book: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M6 10c5-2 10-2 14 1v21c-4-3-9-3-14-1V10Z" fill="#fff" stroke="#2f6b52" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M34 10c-5-2-10-2-14 1v21c4-3 9-3 14-1V10Z" fill="#fff" stroke="#2f6b52" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M10 16h6M10 21h6M24 16h6M24 21h6" stroke="#8fd0b3" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  chat: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M8 9h24a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H17l-7 6v-6H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z" fill="#fff" stroke="#5b4a8a" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M12 16h16M12 21h10" stroke="#b39cf0" stroke-width="2.4" stroke-linecap="round"/></svg>`
};
const artTile = c => `<div class="art-tile art-${ctxOf(c.id)}">${ART[c.art] || ART.chat}</div>`;
const whenLine = c => `${esc(c.when.replace(" · ", ", "))} · ${esc(c.length)}`;
const homeTag = c => `<span class="home-tag home-tag-${ctxOf(c.id)}">${ctxLabel(ctxOf(c.id))}</span>`;
const itemsWith = (cid, status) => itemsIn(cid).filter(i => statusOf(i.id) === status);

// What a small card says about a conversation: points to review and phrases to explore.
function learningSummary(c) {
  const points = topOf(c.id).filter(i => statusOf(i.id) === "new").length;
  const phrases = itemsWith(c.id, "new").filter(i => i.kind === "phrase").length;
  const parts = [];
  if (points) parts.push(plural(points, "point to review", "points to review"));
  if (phrases) parts.push(`${plural(phrases, "phrase")} to explore`);
  return parts.length ? parts.join(" · ") : `${icon("check", 14)} All reviewed`;
}

function featureCard(c, body, cta) {
  return `<section class="feature-card" aria-labelledby="feature-title">
    <div class="feature-top">
      ${artTile(c)}
      <div class="feature-heading">
        ${!S.seen[c.id] && topOf(c.id).length ? `<span class="new-chip">New · ${plural(topOf(c.id).length, "point")} to review</span>` : ""}
        <h2 id="feature-title">${esc(c.title)}</h2>
        <p class="card-meta">${homeTag(c)}<span>${whenLine(c)}</span></p>
      </div>
    </div>
    ${body}
    ${cta}
  </section>`;
}

// One line per Top 3 point: the better way to say it (pronunciation: how to say the word).
const topLine = i => isPron(i) ? `Say “${esc(i.sayModel)}” as ${esc(practiceText(i))}` : `“${esc(bare(practiceText(i)))}”`;

// Featured: the latest conversation's Top 3 to try next (FDB-02), then all its feedback.
function topPreview(c) {
  const top = topOf(c.id);
  return featureCard(c, top.length ? `<div class="feature-preview">
      <p class="feature-label">Top ${top.length} to try next</p>
      <ol class="top-mini">${top.map(i => `<li class="${statusOf(i.id) !== "new" ? "done" : ""}"><span class="area-chip area-${i.area}">${AREA[i.area]}</span><span class="top-mini-text">${topLine(i)}</span></li>`).join("")}</ol>
    </div>` : "",
    `<button class="button-cta" type="button" data-act="openfb" data-id="${c.id}">See all feedback ${icon("next", 18)}</button>`);
}

function smallCard(c) {
  return `<button class="small-card" type="button" data-act="openfb" data-id="${c.id}">
    ${artTile(c)}
    <span class="small-body">
      <span class="small-title">${esc(c.title)}</span>
      <span class="card-meta">${homeTag(c)}<span>${whenLine(c)}</span></span>
      <span class="small-summary">${learningSummary(c)}</span>
    </span>
    ${icon("chevron", 18)}
  </button>`;
}

// Recording control (REC-03..05): on or paused; a pause lasts until Resume. Simulated.
function recordingControl() {
  const on = S.recording !== "paused";
  return `<button class="rec-pill ${on ? "on" : "paused"}" type="button" data-act="rec" aria-pressed="${!on}" title="Recording is simulated in this prototype">
    ${on ? `<span class="dot"></span>Recording` : `${icon("pause", 13)} Paused`}<span class="rec-action">${on ? "Pause" : "Resume"}</span><span class="sr-only"> (simulated)</span>
  </button>`;
}

// Feedback-ready notification (NTF-01..04), shown the way a phone push would be: a banner
// that slides in once per new conversation and hides itself. No quotations; turned on and off
// with the bell. Tapping it opens the feedback.
UI.pushShown = UI.pushShown || {};
function notification(c) {
  if (!S.notify || !c || S.seen[c.id] || UI.pushShown[c.id] || !topOf(c.id).length) return "";
  return `<div class="push" role="status">
    <button class="push-body" type="button" data-act="openfb" data-id="${c.id}">
      ${mascot(26)}<span><span class="push-app"><strong>Coach</strong><small>now</small></span>
      Your latest conversation has ${plural(topOf(c.id).length, "point")} to review.</span>
    </button>
    <button class="push-close" type="button" data-act="pushClose" aria-label="Dismiss">×</button>
  </div>`;
}

// The first line on Home: a warm, factual note about today; a cheer only at milestones.
// The sample conversations all fall in the current week.
function cheerLine() {
  const today = CONVOS.filter(c => c.when.startsWith("Today"));
  const mins = today.reduce((a, c) => a + parseInt(c.length, 10), 0);
  if (CONVOS.length && CONVOS.length % 5 === 0) return { html: `Wow, ${CONVOS.length} conversations this week! 🎉`, milestone: true };
  if (mins >= 60) return { html: `Wow, ${mins} minutes of conversation today! 🎉`, milestone: true };
  if (today.length === 1) return { html: `You talked with ${esc(today[0].partner)} for <strong>${mins} minutes</strong> today.` };
  if (today.length > 1) return { html: `<strong>${today.length} conversations</strong> today, ${mins} minutes in all.` };
  return null;
}

// What the coach says, in order, as you tap it. Lines are trusted markup.
function coachLines(fresh, cheer) {
  const first = cheer ? cheer.html : fresh ? "Feedback from your day is ready." : CONVOS.length ? "All caught up." : "Ready when you are.";
  if (fresh) return [first, esc(`${fresh.summary.split(". ")[0].replace(/\.$/, "")}.`),
    "Your Top 3 are the best place to start.", "About to have a private chat? Tap Pause first."];
  return [first, "New feedback shows up after your next conversation."];
}

SCREENS.home = () => {
  const fresh = CONVOS.find(c => itemsWith(c.id, "new").length);
  const featured = fresh || CONVOS[0];
  const rest = CONVOS.filter(c => c !== featured);
  const cheer = cheerLine();
  const lines = coachLines(fresh, cheer);
  const wave = !UI.waved;
  const paused = S.recording === "paused";

  return `
    <header class="home-header">
      <p class="home-date">${esc(TODAY)}</p>
      <div class="home-controls">
        <button class="icon-button bell ${S.notify ? "on" : ""}" type="button" data-act="notify" data-on="${S.notify ? 0 : 1}" aria-pressed="${S.notify}" aria-label="Feedback-ready notifications ${S.notify ? "on" : "off"}">${icon("bell", 18)}</button>
        ${recordingControl()}
      </div>
    </header>
    ${paused ? `<p class="paused-note">${icon("pause", 14)} Recording is paused. It stays off until you tap Resume.</p>` : ""}

    ${notification(fresh)}

    <div class="greeting">
      <button class="mascot-button ${UI.wiggle ? "wiggle" : ""}" type="button" data-act="tip" aria-label="Ask the coach">${mascot(60, wave, cheer?.milestone ? "cheer" : "happy")}</button>
      <div>
        <h1>Hey ${esc(USER)}!</h1>
        <p class="${UI.wiggle ? "tip-in" : ""} ${cheer && !((UI.tip || 0) % lines.length) ? "cheer-line" : ""}" aria-live="polite">${lines[(UI.tip || 0) % lines.length]}</p>
      </div>
    </div>

    ${featured ? topPreview(featured) : `<section class="empty-home">
      <h2>Your next conversation is a starting point.</h2>
      <p>After a conversation, you’ll find things to try and phrases to learn here.</p>
    </section>`}

    ${rest.length ? `
      <h2 class="home-section">More from your day</h2>
      <div class="small-list">${rest.map(smallCard).join("")}</div>` : ""}`;
};

afterRender.home = () => {
  UI.waved = true;
  const push = document.querySelector(".push");
  if (push) {
    UI.pushShown[document.querySelector(".push-body").dataset.id] = true;
    setTimeout(() => { push.classList.add("out"); setTimeout(() => push.remove(), 300); }, 5000);
  }
  UI.wiggle = false;
  if (UI.refocus) { document.querySelector(UI.refocus)?.focus({ preventScroll: true }); UI.refocus = null; }
};

ACTIONS.openfb = el => { S.seen[el.dataset.id] = true; save(); go({ name: "convo", id: el.dataset.id }); };
ACTIONS.rec = () => { S.recording = S.recording === "paused" ? "on" : "paused"; save(); UI.refocus = ".rec-pill"; render(); };
ACTIONS.notify = el => { S.notify = el.dataset.on === "1"; save(); UI.refocus = ".bell"; render(); };
ACTIONS.pushClose = el => el.closest(".push")?.remove();
ACTIONS.tip = () => {
  UI.tip = (UI.tip || 0) + 1;
  UI.wiggle = true;
  UI.refocus = ".mascot-button";
  render();
};
