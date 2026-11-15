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
// Two modes: a prompt the learner accepts (set length, can stop early; extending happens on the
// lock screen, see phone.js) and manual quick-record (runs until stopped). Nothing is captured
// before the learner acts. Once the learner has as many usable captures as prompts a day they
// chose (1, 2 or 5), proactive prompts stop; manual recording always stays available. The
// count is never shown as a goal (REC-11..14).
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
  if (["home", "phone"].includes(UI.route.name)) render();
}

function recordingBar() {
  const r = UI.rec;
  if (!r) return "";
  const sec = Math.floor((Date.now() - r.start) / 1000);
  return `<section class="rec-live" role="status" aria-live="polite">
    <span class="dot"></span>
    <p><strong>Recording</strong><small>${r.mode === "prompted" ? "Stops on its own" : "No time limit · runs until you stop it"}</small></p>
    <span class="rec-time" id="rec-time">${r.limit ? `${clock(sec)} / ${clock(r.limit)}` : clock(sec)}</span>
    <span class="rec-buttons">
      <button class="rec-stop" type="button" data-act="recStop">${icon("stop", 14)} Stop</button>
    </span>
  </section>`;
}

// A recording prompt (REC-01, NTF-01), shown in-app here the way a notification would arrive.
function recordPrompt() {
  if (UI.rec || UI.captured || !S.prompts || UI.promptOff || (S.captures || 0) >= perDay()) return "";
  return `<section class="rec-prompt">
    ${mascot(40, false, "talk")}
    <div>
      <p class="rec-prompt-q">About to chat? Record ${S.duration} min for feedback.</p>
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
    ? `<strong>Captured ${clock(c.sec)}.</strong> Feedback will appear here. The audio is deleted after analysis; the transcript is kept for replay.`
    : `<strong>That was too short to analyze</strong>, so it wasn't kept.`;
  const promptsDone = c.usable && S.prompts && (S.captures || 0) === perDay()
    ? `<br><span class="captured-sub">No more prompts today. Record still works.</span>` : "";
  return `<div class="captured" role="status">${icon(c.usable ? "check" : "clock", 16)}<p>${note}${promptsDone}</p>
    <button class="push-close" type="button" data-act="capturedClose" aria-label="Dismiss">×</button></div>`;
}

// Settings sheet: your level and where you speak (ONB-06, ONB-08), prompts (off = AI-only mode),
// prompts a day, prompted length (a number, in minutes), notifications, calendar, data.
function settingsPanel() {
  if (!UI.settings) return "";
  const toggle = (act, on, label, sub) => `<button class="set-row" type="button" data-act="${act}" role="switch" aria-checked="${on}">
      <span><strong>${label}</strong><small>${sub}</small></span><span class="switch ${on ? "on" : ""}" aria-hidden="true"></span></button>`;
  return `<section class="settings" aria-label="Settings">
    <div class="settings-head"><h2>Settings</h2><button class="push-close" type="button" data-act="settings" aria-label="Close settings">×</button></div>
    <div class="set-row set-static"><span><strong>Your level</strong><small>${S.profile.levelFrom ? `Set from ${esc(S.profile.levelFrom)}. Pick another to change it.` : "A starting point; we fine-tune it from your conversations."}</small></span>
      <span class="set-chips set-wrap">${OB_LEVELS.map(([k, name, cefr]) => `<button type="button" class="ob-chip ${S.profile.level === k ? "on" : ""}" aria-pressed="${S.profile.level === k}" data-act="setLevel" data-v="${k}">${name} · ${cefr}</button>`).join("")}</span></div>
    <div class="set-row set-static"><span><strong>Where you speak it</strong><small>Starred topics in Practice follow this.</small></span>
      <span class="set-chips set-wrap">${OB_CONTEXTS.map(c => { const on = (S.profile.contexts || []).includes(c); return `<button type="button" class="ob-chip ${on ? "on" : ""}" aria-pressed="${on}" data-act="setContext" data-v="${c}">${c}</button>`; }).join("")}</span></div>
    ${toggle("setPrompts", S.prompts, "Recording prompts", S.prompts ? `Up to ${perDay()} a day` : "Off (AI-only mode). Record still works.")}
    ${S.prompts ? `<div class="set-row set-static"><span><strong>Prompts a day</strong></span>
      <span class="set-chips">${[2, 1, 5].map(n => `<button type="button" class="ob-chip ${perDay() === n ? "on" : ""}" aria-pressed="${perDay() === n}" data-act="setPerDay" data-v="${n}">${n === 5 ? "Up to 5" : n}${n === 2 ? " · recommended" : ""}</button>`).join("")}</span></div>` : ""}
    <div class="set-row set-static"><span><strong>Prompted recording length</strong><small>Ends on its own. Add time from the lock screen.</small></span>
      <span class="stepper" role="group" aria-label="Minutes">
        <button type="button" data-act="setDuration" data-v="${S.duration - 1}" ${S.duration <= 1 ? "disabled" : ""} aria-label="One minute less">−</button>
        <output aria-live="polite">${S.duration} min</output>
        <button type="button" data-act="setDuration" data-v="${S.duration + 1}" ${S.duration >= 10 ? "disabled" : ""} aria-label="One minute more">+</button>
      </span></div>
    ${toggle("setNotify", S.notify, "Feedback-ready notifications", "No quotes on the lock screen")}
    ${toggle("setCalendar", S.calendar, "Calendar (optional)", S.calendar ? "Connected (simulated). Never starts recording." : "Never starts recording")}
    <p class="set-data">${icon("lock", 14)} Audio is deleted after analysis. Transcripts are kept so you can replay a chat; delete one from its conversation page. Delete any saved item in Learn.</p>
    <button class="text-link" type="button" data-act="go" data-to="phone">See the lock screen and Control Center ${icon("next", 14)}</button>
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
      ${mascot(26)}<span><span class="push-app"><strong>${APP_NAME}</strong><small>now</small></span>
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
  // Settings open: show only Settings (and an active recording, which stays visible, REC-08).
  if (UI.settings) return `${recordingBar()}${settingsPanel()}`;
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
        ${UI.rec ? "" : `<button class="rec-quick" type="button" data-act="recQuick">${icon("mic", 15)} Record</button>`}
      </div>
    </header>
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
      <p>Recording prompts are off (AI-only mode). Practice with the AI partner anytime. If you'd like feedback on a real conversation, tap Record.</p>
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
// A prompted recording can run longer: each tap on the lock screen adds a minute (REC-03).
ACTIONS.recExtend = () => {
  const r = UI.rec; if (!r || !r.limit) return;
  r.limit += 60;
  const el = document.getElementById("rec-time");
  if (el) el.textContent = `${clock(Math.floor((Date.now() - r.start) / 1000))} / ${clock(r.limit)}`;
};
ACTIONS.promptLater = () => { UI.promptOff = true; render(); };   // no penalty (REC-12)
ACTIONS.capturedClose = () => { UI.captured = null; render(); };
ACTIONS.settings = () => { UI.settings = !UI.settings; UI.refocus = UI.settings ? ".settings .push-close" : ".gear"; window.scrollTo(0, 0); render(); };
ACTIONS.setPrompts = () => { S.prompts = !S.prompts; save(); render(); };
ACTIONS.setPerDay = el => { S.perDay = Number(el.dataset.v); save(); render(); };
ACTIONS.setDuration = el => { S.duration = Math.max(1, Math.min(10, Number(el.dataset.v))); save(); render(); };
ACTIONS.setNotify = () => { S.notify = !S.notify; save(); render(); };
ACTIONS.setLevel = el => { S.profile = { ...S.profile, level: el.dataset.v, levelFrom: null }; save(); render(); };
ACTIONS.setContext = el => {
  const list = S.profile.contexts || [], v = el.dataset.v;
  S.profile = { ...S.profile, contexts: list.includes(v) ? list.filter(x => x !== v) : [...list, v] };
  save(); render();
};
ACTIONS.setCalendar = () => { S.calendar = !S.calendar; save(); render(); };
ACTIONS.pushClose = el => el.closest(".push")?.remove();
ACTIONS.tip = () => {
  UI.tip = (UI.tip || 0) + 1;
  UI.wiggle = true;
  UI.refocus = ".mascot-button";
  render();
};
