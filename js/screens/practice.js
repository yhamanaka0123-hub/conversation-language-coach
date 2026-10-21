// Practice: the AI coach suggests what to practice, then the AI plays the other person.
// The AI runs through /api/practice (see api/practice.mjs). When it is unavailable
// (opened as a local file, no key, free-tier limit reached) the session falls back to the
// fixed script in data.js with keyword-match feedback.

const MAX_TURNS = 5;           // learner replies per session
const AI = { status: "checking", suggestions: {}, fetching: {} };   // status: checking | live | offline

// ---------- Talking to the server ----------
async function api(body) {
  const r = await fetch("/api/practice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`api ${r.status}`);
  return r.json();
}

async function checkAI() {
  try {
    const r = await fetch("/api/practice", { cache: "no-store" });
    AI.status = r.ok && (await r.json()).ok ? "live" : "offline";
  } catch (e) { AI.status = "offline"; }
  if (["practice", "session"].includes(UI.route.name)) render();
}
document.addEventListener("DOMContentLoaded", checkAI);

const convoPayload = c => ({
  title: c.title, partner: c.partner, partnerNote: c.partnerNote, people: c.people,
  place: c.place, scene: c.scene.join(" "), summary: c.summary
});
const targetPayload = ids => ids.map(id => {
  const i = byId[id];
  return { id, phrase: bare(practiceText(i)), meaning: i.kind === "phrase" ? i.meaning : i.why[ctxOf(i.convo)],
    original: i.kind === "phrase" ? `${i.speaker} said "${i.sentence}"` : `The learner said "${i.said}"` };
});

function aiBadge() {
  const label = { checking: "Connecting to AI partner…", live: "AI partner live", offline: "Practice script (AI offline)" }[AI.status];
  return `<span class="ai-badge ai-${AI.status}"><span class="ai-dot"></span>${label}</span>`;
}

// ---------- What to practice (chosen by rules, worded by the AI) ----------
// Rule: the conversation with the most saved-but-not-learned phrases, up to 3 of them.
function pickPlan(cid, one) {
  const pool = cid ? [convoById[cid]] : CONVOS;
  let best = null;
  pool.forEach(c => {
    const saved = itemsIn(c.id).filter(i => statusOf(i.id) === "practice");
    if (saved.length && (!best || saved.length > best.saved.length)) best = { c, saved };
  });
  return best && { cid: best.c.id, targets: best.saved.slice(0, one ? 1 : 3).map(i => i.id) };
}
const planKey = p => `${p.cid}:${p.targets.join(",")}:${ctxOf(p.cid)}`;

function templateSuggestion(p) {
  const c = convoById[p.cid];
  const names = p.targets.map(id => `“${bare(practiceText(byId[id]))}”`);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
  return { message: `${USER}, you saved ${list} from ${c.title}. Want to try ${names.length > 1 ? "them" : "it"} in a quick follow-up with ${c.partner}?`,
    opener: c.script[0].ai, fromAI: false };
}
const suggestionFor = p => AI.suggestions[planKey(p)] || templateSuggestion(p);

async function fetchSuggestion(p) {
  const key = planKey(p);
  if (AI.status !== "live" || AI.suggestions[key] || AI.fetching[key]) return;
  AI.fetching[key] = true;
  const c = convoById[p.cid];
  try {
    const out = await api({ mode: "suggest", user: USER, context: ctxOf(c.id), convo: convoPayload(c), targets: targetPayload(p.targets) });
    AI.suggestions[key] = { ...out, fromAI: true };
  } catch (e) { AI.suggestions[key] = templateSuggestion(p); }
  AI.fetching[key] = false;
  if (UI.route.name === "practice") render();
}

SCREENS.practice = () => {
  const plan = pickPlan();
  const s = plan && suggestionFor(plan);
  const loading = plan && AI.status === "live" && !AI.suggestions[planKey(plan)];
  return `
  ${pageHeader({ eyebrow: "PRACTICE", title: "Talk it through again", action: aiBadge() })}
  ${plan ? `
    <section class="suggest-card ${loading ? "loading" : ""}">
      <div class="suggest-top">
        <div class="coach-icon">${icon("spark", 17)}</div>
        <span class="said-label">Coach suggests</span>
      </div>
      <p class="suggest-message">${loading ? "Looking at what you saved…" : esc(s.message)}</p>
      <div class="hint-row">${plan.targets.map(id => `<span class="hint-chip">${icon("spark", 14)} ${esc(bare(practiceText(byId[id])))}</span>`).join("")}</div>
      <div class="suggest-actions">
        <button class="button button-primary" type="button" data-act="start" data-id="${plan.cid}">Start with ${esc(convoById[plan.cid].partner)} ${icon("next", 18)}</button>
        ${plan.targets.length > 1 ? `<button class="button button-quiet" type="button" data-act="start" data-id="${plan.cid}" data-one="1">Just one phrase</button>` : ""}
      </div>
    </section>`
  : `<div class="empty">Save a few phrases from a conversation first, and the coach will suggest a practice.
       <br><br><button class="button button-secondary" type="button" data-act="go" data-to="home">Review conversations</button></div>`}

  <div class="section-heading compact">
    <div><p class="eyebrow">OR PICK A CONVERSATION</p><h2>Replay a real conversation</h2></div>
  </div>
  <div class="phrase-list">
    ${CONVOS.map(c => {
      const saved = itemsIn(c.id).filter(i => statusOf(i.id) === "practice");
      return `<article class="vocab-card">
        <div class="conversation-top">
          ${avatar(c)}
          <div class="conversation-title"><h3 class="sans">${esc(c.title)}</h3><span class="time">${esc(c.partnerNote)}</span></div>
          ${tag(ctxOf(c.id))}
        </div>
        ${saved.length
          ? `<button class="button button-secondary full-button" type="button" data-act="start" data-id="${c.id}">Practice ${plural(saved.length, "saved phrase")}</button>`
          : `<button class="button button-quiet full-button" type="button" data-act="go" data-to="convo" data-id="${c.id}">Pick phrases to practice</button>`}
      </article>`;
    }).join("")}
  </div>`;
};

afterRender.practice = () => { const p = pickPlan(); if (p) fetchSuggestion(p); };

// ---------- Session screen ----------
SCREENS.session = () => {
  const s = UI.session, c = convoById[s.cid];
  const left = MAX_TURNS - s.userTurns;
  return `
    <div class="practice-header">
      <button class="icon-button" type="button" data-act="quit" aria-label="End practice">${icon("back")}</button>
      <div>
        <h1>Practice with ${esc(c.partner)}</h1>
        <p>${s.mode === "ai" ? `<span class="online-dot"></span>AI plays ${esc(c.partner)}` : "Practice script (AI offline)"}</p>
      </div>
      <button class="finish-link" type="button" data-act="finish">Finish</button>
    </div>

    <div class="scene-context">
      ${icon("message", 17)}
      <p><strong>${esc(c.scene[0])}</strong><br>${esc(c.scene[1])}</p>
    </div>

    <div class="target-row">
      <div class="row-between"><span class="said-label">Try to use</span><span class="turns">${s.done ? "Done" : `${plural(left, "reply", "replies")} left`}</span></div>
      <div class="hint-row">
        ${s.targets.map(id => {
          const used = s.used.includes(id), open = s.peek === id, i = byId[id];
          return `<button type="button" class="hint-chip ${used ? "success-hint" : ""}" data-act="peek" data-id="${id}" ${used ? "disabled" : ""} aria-expanded="${open}">${icon(used ? "check" : "spark", 14)} ${esc(bare(practiceText(i)))}</button>`;
        }).join("")}
      </div>
      ${s.peek && !s.used.includes(s.peek) ? `<p class="peek">${esc(byId[s.peek].kind === "phrase" ? byId[s.peek].meaning : byId[s.peek].why[ctxOf(s.cid)])}</p>` : ""}
    </div>

    <div class="chat">
      ${s.log.map(m => m.who === "ai" ? `
        <div class="message-row">${avatar(c, true)}<div><span class="speaker">${esc(c.partner.toUpperCase())} · AI</span><div class="bubble ai-bubble">${esc(m.text)}</div></div></div>`
      : m.who === "me" ? `
        <div class="message-row user-row"><div><span class="speaker">YOU</span><div class="bubble user-bubble">${esc(m.text)}</div></div></div>`
      : `<div class="feedback ${m.tone}">${icon("spark", 17)}<p>${m.html}</p></div>`).join("")}
      ${s.pending ? `<div class="message-row">${avatar(c, true)}<div><span class="speaker">${esc(c.partner.toUpperCase())} · AI</span><div class="bubble ai-bubble typing" aria-label="${esc(c.partner)} is typing"><i></i><i></i><i></i></div></div></div>` : ""}
    </div>

    <div class="practice-controls">
      ${s.done ? `
        <div class="hint-chip success-hint">${icon("check", 14)} Practice complete</div>
        <button class="button button-primary full-button" type="button" data-act="finish">See how you did ${icon("next", 18)}</button>`
      : `
        <form id="say" class="composer" autocomplete="off">
          <button class="mic-button ${UI.micTimer ? "listening" : ""}" type="button" data-act="mic" aria-label="Speak your reply" ${s.pending ? "disabled" : ""}>${icon("mic", 24)}</button>
          <input id="reply" name="reply" placeholder="${s.pending ? `${esc(c.partner)} is replying…` : "Say or type your reply"}" aria-label="Your reply" ${s.pending ? "disabled" : ""}>
          <button class="send-button" type="submit" aria-label="Send" ${s.pending ? "disabled" : ""}>${icon("send", 18)}</button>
        </form>
        <p>${speechSupported() ? "Tap the mic and speak, or type" : "Tap the mic for a sample spoken reply, or type"}. Tap a phrase above to see what it means.</p>`}
    </div>`;
};

afterRender.session = () => {
  window.scrollTo(0, document.body.scrollHeight);
  const input = document.getElementById("reply");
  if (input && !UI.session.pending) input.focus({ preventScroll: true });
};

SCREENS.recap = () => {
  const r = UI.route.r, c = convoById[r.cid];
  const n = learnedCount();
  return `
    ${pageHeader({ eyebrow: "PRACTICE RECAP", title: `You used ${r.used.length} of ${r.targets.length} with ${esc(c.partner)}` })}
    <div class="learned-list">
      ${r.targets.map((id, k) => {
        const ok = r.used.includes(id);
        return `<div class="learned-item ${ok ? "" : "pending"}">
          <span>${k + 1}</span><p>${esc(bare(practiceText(byId[id])))}</p>
          <em>${ok ? `${icon("check", 16)} Learned` : "Next time"}</em>
        </div>`;
      }).join("")}
    </div>
    <section class="progress-card spaced">
      <div class="progress-copy">
        <div class="progress-number">${n}</div>
        <div><p class="progress-title">of ${GOAL} terms this week</p><p class="subtle">${n >= GOAL ? "Weekly goal reached." : `${GOAL - n} to go.`}</p></div>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, n / GOAL * 100)}%"></div></div>
    </section>
    <div class="stack">
      ${r.used.length < r.targets.length ? `<button class="button button-primary full-button" type="button" data-act="start" data-id="${r.cid}">Practice again</button>` : ""}
      <button class="button button-quiet full-button" type="button" data-act="go" data-to="report">See progress report</button>
    </div>`;
};

// ---------- Session logic ----------
function startPractice(cid, one) {
  const plan = pickPlan(cid, one);
  if (!plan) return go({ name: "convo", id: cid });
  const mode = AI.status === "live" ? "ai" : "script";
  const opener = mode === "ai" ? suggestionFor(plan).opener : convoById[cid].script[0].ai;
  UI.session = { cid, targets: plan.targets, used: [], mode, userTurns: 0, turn: 0, done: false, pending: false, peek: null, suggested: [],
    log: [{ who: "ai", text: opener }] };
  go({ name: "session" });
}

function praise(ids, cid) {
  return { who: "coach", tone: "good", html: `<strong>That sounded natural.</strong> Nice use of “${ids.map(id => esc(bare(practiceText(byId[id])))).join("” and “")}” in a ${ctxLabel(ctxOf(cid)).toLowerCase()} conversation.` };
}

// Scripted step: fixed next line, keyword-match feedback.
function scriptStep(text) {
  const s = UI.session, c = convoById[s.cid];
  const step = c.script[Math.min(s.turn, c.script.length - 1)];
  const hits = s.targets.filter(id => !s.used.includes(id) && uses(text, byId[id]));
  s.used.push(...hits);
  if (hits.length) s.log.push(praise(hits, s.cid));
  else if (s.targets.includes(step.hint) && !s.used.includes(step.hint))
    s.log.push({ who: "coach", tone: "nudge", html: `<strong>Good reply.</strong> This was a natural spot for “${esc(bare(practiceText(byId[step.hint])))}”. Try it next time.` });
  s.turn++;
  s.userTurns++;
  if (s.turn < c.script.length && s.userTurns < MAX_TURNS) s.log.push({ who: "ai", text: c.script[s.turn].ai });
  else { s.log.push({ who: "ai", text: c.closing }); s.done = true; }
}

async function reply(text) {
  const s = UI.session;
  if (!s || s.pending || s.done) return;
  s.log.push({ who: "me", text });
  if (s.mode !== "ai") { scriptStep(text); return render(); }

  const c = convoById[s.cid];
  s.pending = true;
  render();
  try {
    const out = await api({
      mode: "turn", context: ctxOf(c.id), convo: convoPayload(c), targets: targetPayload(s.targets), used: s.used, suggested: s.suggested,
      history: s.log.filter(m => m.who !== "coach").slice(0, -1).map(m => ({ role: m.who === "me" ? "user" : "partner", text: m.text })),
      reply: text, turnsLeft: MAX_TURNS - s.userTurns - 1
    });
    if (UI.session !== s) return;          // the learner left while waiting
    const hits = out.used.filter(id => s.targets.includes(id) && !s.used.includes(id));
    s.used.push(...hits);
    const f = out.feedback || {};
    // Praise only a phrase actually used; suggest each phrase at most once, two per session.
    if (f.type === "praise" && hits.includes(f.id)) s.log.push({ who: "coach", tone: "good", html: esc(f.text) });
    else if (hits.length) s.log.push(praise(hits, s.cid));
    else if (f.type === "suggest" && !s.used.includes(f.id) && !s.suggested.includes(f.id) && s.suggested.length < 2) {
      s.suggested.push(f.id);
      s.log.push({ who: "coach", tone: "nudge", html: esc(f.text) });
    }
    s.log.push({ who: "ai", text: out.reply });
    s.userTurns++;
    s.turn = s.userTurns;
    s.done = out.done || s.userTurns >= MAX_TURNS;
  } catch (e) {
    if (UI.session !== s) return;
    s.mode = "script";
    s.turn = s.userTurns;
    s.log.push({ who: "coach", tone: "nudge", html: "<strong>The AI partner is unavailable right now.</strong> Continuing with the practice script." });
    scriptStep(text);
  }
  s.pending = false;
  render();
}

function finishPractice() {
  const s = UI.session;
  s.used.forEach(id => { S.status[id] = "learned"; });
  S.sessions = (S.sessions || 0) + 1;
  const r = { cid: s.cid, targets: s.targets, used: s.used.slice() };
  UI.session = null;
  const hitGoal = learnedCount() >= GOAL && !S.celebrated;
  if (hitGoal) S.celebrated = true;
  save();
  go({ name: hitGoal ? "celebrate" : "recap", r });
}

// ---------- Mic: real speech-to-text where the browser supports it, otherwise a sample ----------
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = () => Boolean(Recognition);

function listen(btn) {
  if (UI.micTimer) { UI.micTimer.stop?.(); return; }
  const input = document.getElementById("reply");
  if (!Recognition) return typeSample(btn, input);
  const rec = new Recognition();
  rec.lang = "en-US";
  rec.interimResults = true;
  let heard = false;
  rec.onresult = e => { heard = true; input.value = Array.from(e.results).map(r => r[0].transcript).join(" "); };
  rec.onerror = () => { if (!heard) { UI.micTimer = null; btn.classList.remove("listening"); typeSample(btn, input); } };
  rec.onend = () => { if (UI.micTimer === rec) { UI.micTimer = null; btn.classList.remove("listening"); input.placeholder = "Say or type your reply"; input.focus(); } };
  UI.micTimer = rec;
  btn.classList.add("listening");
  input.value = "";
  input.placeholder = "Listening… tap the mic again to stop";
  rec.start();
}

// Types the script's sample answer, for browsers without speech recognition.
function typeSample(btn, input) {
  const c = convoById[UI.session.cid];
  const text = c.script[Math.min(UI.session.turn, c.script.length - 1)].sample;
  let k = 0;
  input.value = "";
  btn.classList.add("listening");
  const timer = setInterval(() => {
    k += 2;
    input.value = text.slice(0, k);
    if (k >= text.length) { clearInterval(timer); UI.micTimer = null; btn.classList.remove("listening"); input.focus(); }
  }, 35);
  UI.micTimer = { stop() {} };
}

ACTIONS.start = el => startPractice(el.dataset.id, el.dataset.one === "1");
ACTIONS.quit = () => { UI.micTimer?.stop?.(); UI.session = null; go({ name: "practice" }); };
ACTIONS.finish = () => { UI.micTimer?.stop?.(); finishPractice(); };
ACTIONS.mic = el => listen(el);
ACTIONS.peek = el => { UI.session.peek = UI.session.peek === el.dataset.id ? null : el.dataset.id; render(); };
FORMS.say = form => {
  const text = form.reply.value.trim();
  if (text && !UI.micTimer) reply(text);
};
