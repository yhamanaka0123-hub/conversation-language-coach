// Home: opt-in recording (quick record, recording prompts), a feedback-ready push banner, the
// coach greeting, the latest conversation's Top 3 to try next, and the rest of the day (PRD §5).

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

// ---------- Recording (PRD §6.1): opt-in only, simulated ----------
// Two modes: a prompt the learner accepts (default 2–3 min, can stop early) and manual
// quick-record (runs until stopped). Nothing is captured before the learner acts. Two usable
// captures in a day stop proactive prompts; manual recording always stays available. The count
// is never shown as a goal (REC-11..14).
const MIN_USABLE = 5;   // seconds; the real definition of a usable capture is TBD
const clock = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

function startRec(mode) {
  stopRec(true);
  UI.rec = { mode, start: Date.now(), limit: mode === "prompted" ? S.duration * 60 : null };
  UI.captured = null;
  UI.rec.timer = setInterval(() => {
    const r = UI.rec; if (!r) return;
    const sec = Math.floor((Date.now() - r.start) / 1000);
    if (r.limit && sec >= r.limit) { stopRec(); return; }
    const el = document.getElementById("rec-time");
    if (el) el.textContent = r.limit ? `${clock(sec)} / ${clock(r.limit)}` : clock(sec);
  }, 500);
  render();
}
// quiet: stop without counting (Reset demo, or starting another recording).
function stopRec(quiet) {
  const r = UI.rec; if (!r) return;
  clearInterval(r.timer);
  UI.rec = null;
  if (quiet) return;
  const sec = Math.floor((Date.now() - r.start) / 1000);
  const usable = sec >= MIN_USABLE;
  if (usable) { S.captures = (S.captures || 0) + 1; S.recorded = true; save(); }
  UI.captured = { sec, usable, mode: r.mode };
  if (UI.route.name === "home") render();
}

function recordingBar() {
  const r = UI.rec;
  if (!r) return "";
  const sec = Math.floor((Date.now() - r.start) / 1000);
  return `<section class="rec-live" role="status" aria-live="polite">
    <span class="dot"></span>
    <p><strong>Recording</strong><small>${r.mode === "prompted" ? "Stops on its own, or stop it now" : "Quick record · runs until you stop it"}</small></p>
    <span class="rec-time" id="rec-time">${r.limit ? `${clock(sec)} / ${clock(r.limit)}` : clock(sec)}</span>
    <button class="rec-stop" type="button" data-act="recStop">${icon("stop", 14)} Stop</button>
  </section>`;
}

// A recording prompt (REC-01, NTF-01), shown in-app here the way a notification would arrive.
function recordPrompt() {
  if (UI.rec || UI.captured || !S.prompts || UI.promptOff || (S.captures || 0) >= 2) return "";
  return `<section class="rec-prompt">
    ${mascot(40, false, "talk")}
    <div>
      <p class="rec-prompt-q">About to chat with someone? Record the next ${S.duration} minutes for feedback.</p>
      <p class="rec-prompt-note">${icon("lock", 13)} Nothing is recorded until you tap Record.</p>
      <div class="rec-prompt-actions">
        <button class="button button-primary" type="button" data-act="recPrompt">${icon("mic", 16)} Record ${S.duration} min</button>
        <button class="button button-quiet" type="button" data-act="promptLater">Not now</button>
      </div>
    </div>
  </section>`;
}

// After a capture: what happens next, and what is deleted (DAT-01..03).
function capturedNote() {
  const c = UI.captured;
  if (!c || UI.rec) return "";
  const note = c.usable
    ? `<strong>Captured ${clock(c.sec)}.</strong> Feedback will appear here after analysis. Then the audio and the full transcript are deleted; only the learning points are kept.`
    : `<strong>That was too short to analyze</strong>, so it wasn't kept.`;
  const promptsDone = c.usable && S.prompts && (S.captures || 0) === 2
    ? `<br><span class="captured-sub">Recording prompts are off for the rest of today. Quick record still works anytime.</span>` : "";
  return `<div class="captured" role="status">${icon(c.usable ? "check" : "clock", 16)}<p>${note}${promptsDone}
    <span class="captured-sub">Prototype: nothing is actually recorded.</span></p>
    <button class="push-close" type="button" data-act="capturedClose" aria-label="Dismiss">×</button></div>`;
}

// Settings sheet: prompts (off = AI-only mode), prompted length, notifications, calendar, data.
function settingsPanel() {
  if (!UI.settings) return "";
  const toggle = (act, on, label, sub) => `<button class="set-row" type="button" data-act="${act}" role="switch" aria-checked="${on}">
      <span><strong>${label}</strong><small>${sub}</small></span><span class="switch ${on ? "on" : ""}" aria-hidden="true"></span></button>`;
  return `<section class="settings" aria-label="Settings">
    <div class="settings-head"><h2>Settings</h2><button class="push-close" type="button" data-act="settings" aria-label="Close settings">×</button></div>
    ${toggle("setPrompts", S.prompts, "Recording prompts", S.prompts ? "Suggests moments to record. Stops after 2 captures a day." : "Off (AI-only mode). Quick record still works.")}
    <div class="set-row set-static"><span><strong>Prompted recording length</strong><small>You can always stop early.</small></span>
      <span class="set-chips">${[2, 3].map(m => `<button type="button" class="ob-chip ${S.duration === m ? "on" : ""}" aria-pressed="${S.duration === m}" data-act="setDuration" data-v="${m}">${m} min</button>`).join("")}</span></div>
    ${toggle("setNotify", S.notify, "Feedback-ready notifications", "No quotes from your conversations on the lock screen.")}
    ${toggle("setCalendar", S.calendar, "Calendar (optional)", S.calendar ? "Connected (simulated). Only used to time prompts; it never starts recording." : "Helps time prompts. It never starts recording.")}
    <p class="set-data">${icon("lock", 14)} After analysis, the audio and the full transcript are deleted. Kept: short excerpts, brief context, expressions, and feedback. You can delete any item in Learn.</p>
  </section>`;
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
    "Your Top 3 are the best place to start.", "Recording only starts when you tap Record."];
  return [first, "New feedback shows up after your next conversation."];
}

SCREENS.home = () => {
  const fresh = CONVOS.find(c => itemsWith(c.id, "new").length);
  const featured = fresh || CONVOS[0];
  const rest = CONVOS.filter(c => c !== featured);
  const cheer = aiOnly() ? null : cheerLine();
  const lines = aiOnly() ? ["Ready when you are.", "Practice is optional, whenever you like."] : coachLines(fresh, cheer);
  const wave = !UI.waved;

  return `
    <header class="home-header">
      <p class="home-date">${esc(TODAY)}</p>
      <div class="home-controls">
        <button class="icon-button gear ${UI.settings ? "on" : ""}" type="button" data-act="settings" aria-expanded="${!!UI.settings}" aria-label="Settings">${icon("gear", 18)}</button>
        ${UI.rec ? "" : `<button class="rec-quick" type="button" data-act="recQuick" title="Recording is simulated in this prototype">${icon("mic", 15)} Record</button>`}
      </div>
    </header>
    ${settingsPanel()}
    ${recordingBar()}
    ${capturedNote()}
    ${recordPrompt()}

    ${aiOnly() ? "" : notification(fresh)}

    <div class="greeting">
      <button class="mascot-button ${UI.wiggle ? "wiggle" : ""}" type="button" data-act="tip" aria-label="Ask the coach">${mascot(60, wave, cheer?.milestone ? "cheer" : "happy")}</button>
      <div>
        <h1>Hey ${esc(USER)}!</h1>
        <p class="${UI.wiggle ? "tip-in" : ""} ${cheer && !((UI.tip || 0) % lines.length) ? "cheer-line" : ""}" aria-live="polite">${lines[(UI.tip || 0) % lines.length]}</p>
      </div>
    </div>

    ${aiOnly() ? `<section class="empty-home">
      <h2>No real conversations yet.</h2>
      <p>You're in AI-only mode. Practice with an AI partner anytime. If you'd like feedback on a real conversation, tap Record.</p>
      <button class="button-cta" type="button" data-act="go" data-to="practice">Practice with AI ${icon("next", 18)}</button>
    </section>` : featured ? topPreview(featured) : `<section class="empty-home">
      <h2>Your next conversation is a starting point.</h2>
      <p>After a conversation, you’ll find things to try and phrases to learn here.</p>
    </section>`}

    ${rest.length && !aiOnly() ? `
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
ACTIONS.recQuick = () => startRec("manual");
ACTIONS.recPrompt = () => startRec("prompted");
ACTIONS.recStop = () => stopRec();
ACTIONS.promptLater = () => { UI.promptOff = true; render(); };   // no penalty (REC-12)
ACTIONS.capturedClose = () => { UI.captured = null; render(); };
ACTIONS.settings = () => { UI.settings = !UI.settings; UI.refocus = ".gear"; render(); };
ACTIONS.setPrompts = () => { S.prompts = !S.prompts; S.profile.mode = S.prompts ? "prompts" : "ai"; save(); render(); };
ACTIONS.setDuration = el => { S.duration = Number(el.dataset.v); save(); render(); };
ACTIONS.setNotify = () => { S.notify = !S.notify; save(); render(); };
ACTIONS.setCalendar = () => { S.calendar = !S.calendar; save(); render(); };
ACTIONS.pushClose = el => el.closest(".push")?.remove();
ACTIONS.tip = () => {
  UI.tip = (UI.tip || 0) + 1;
  UI.wiggle = true;
  UI.refocus = ".mascot-button";
  render();
};
