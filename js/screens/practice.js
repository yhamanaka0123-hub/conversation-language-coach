// Practice: pick a conversation, replay it with the AI partner, then recap.
// The partner follows a fixed script from data.js; feedback is a keyword match
// on the saved phrases. No model is called.

SCREENS.practice = () => `
  ${pageHeader({ eyebrow: "PRACTICE", title: "Replay a real conversation" })}
  <p class="section-intro">The AI plays the other person in a version of the same conversation. Try your saved phrases out loud.</p>
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
          ? `<div class="hint-row">${saved.map(i => `<span class="hint-chip">${icon("spark", 14)} ${esc(bare(practiceText(i)))}</span>`).join("")}</div>
             <button class="button button-primary full-button" type="button" data-act="start" data-id="${c.id}">Start practice ${icon("next", 18)}</button>`
          : `<button class="button button-quiet full-button" type="button" data-act="go" data-to="convo" data-id="${c.id}">Pick phrases to practice</button>`}
      </article>`;
    }).join("")}
  </div>`;

SCREENS.session = () => {
  const s = UI.session, c = convoById[s.cid];
  const step = c.script[s.turn];
  const nextHint = !s.done && s.targets.includes(step.hint) && !s.used.includes(step.hint) ? step.hint : null;
  return `
    <div class="practice-header">
      <button class="icon-button" type="button" data-act="quit" aria-label="End practice">${icon("back")}</button>
      <div>
        <h1>Practice with ${esc(c.partner)}</h1>
        <p><span class="online-dot"></span>${esc(c.partnerNote)}</p>
      </div>
      <button class="finish-link" type="button" data-act="finish">Finish</button>
    </div>

    <div class="scene-context">
      ${icon("message", 17)}
      <p><strong>${esc(c.scene[0])}</strong><br>${esc(c.scene[1])}</p>
    </div>

    <div class="target-row">
      <span class="said-label">Try to use</span>
      <div class="hint-row">
        ${s.targets.map(id => {
          const used = s.used.includes(id);
          return `<button type="button" class="hint-chip ${used ? "success-hint" : ""}" data-act="insert" data-id="${id}" ${used ? "disabled" : ""}>${icon(used ? "check" : "spark", 14)} ${esc(bare(practiceText(byId[id])))}</button>`;
        }).join("")}
      </div>
    </div>

    <div class="chat">
      ${s.log.map(m => m.who === "ai" ? `
        <div class="message-row">${avatar(c, true)}<div><span class="speaker">${esc(c.partner.toUpperCase())} · AI</span><div class="bubble ai-bubble">${esc(m.text)}</div></div></div>`
      : m.who === "me" ? `
        <div class="message-row user-row"><div><span class="speaker">YOU</span><div class="bubble user-bubble">${esc(m.text)}</div></div></div>`
      : `<div class="feedback ${m.tone}">${icon("spark", 17)}<p>${m.html}</p></div>`).join("")}
    </div>

    <div class="practice-controls">
      ${s.done ? `
        <div class="hint-chip success-hint">${icon("check", 14)} Practice complete</div>
        <button class="button button-primary full-button" type="button" data-act="finish">See how you did ${icon("next", 18)}</button>`
      : `
        ${nextHint ? `<div class="hint-chip">${icon("spark", 14)} Try “${esc(bare(practiceText(byId[nextHint])))}”</div>` : ""}
        <form id="say" class="composer" autocomplete="off">
          <button class="mic-button ${UI.micTimer ? "listening" : ""}" type="button" data-act="mic" aria-label="Speak your reply (simulated)">${icon("mic", 24)}</button>
          <input id="reply" name="reply" placeholder="Say or type your reply" aria-label="Your reply">
          <button class="send-button" type="submit" aria-label="Send">${icon("send", 18)}</button>
        </form>
        <p>Tap the mic for a simulated spoken reply, or tap a phrase above</p>`}
    </div>`;
};

afterRender.session = () => window.scrollTo(0, document.body.scrollHeight);

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
function startPractice(cid) {
  const c = convoById[cid];
  const targets = itemsIn(cid).filter(i => statusOf(i.id) === "practice").map(i => i.id);
  if (!targets.length) return go({ name: "convo", id: cid });
  UI.session = { cid, turn: 0, targets, used: [], done: false, log: [{ who: "ai", text: c.script[0].ai }] };
  go({ name: "session" });
}

function reply(text) {
  const s = UI.session, c = convoById[s.cid];
  const step = c.script[s.turn];
  s.log.push({ who: "me", text });
  const hits = s.targets.filter(id => !s.used.includes(id) && uses(text, byId[id]));
  s.used.push(...hits);
  if (hits.length) {
    s.log.push({ who: "coach", tone: "good", html: `<strong>That sounded natural.</strong> Nice use of “${hits.map(id => esc(bare(practiceText(byId[id])))).join("” and “")}” in a ${ctxLabel(ctxOf(c.id)).toLowerCase()} conversation.` });
  } else if (s.targets.includes(step.hint) && !s.used.includes(step.hint)) {
    s.log.push({ who: "coach", tone: "nudge", html: `<strong>Good reply.</strong> This was a natural spot for “${esc(bare(practiceText(byId[step.hint])))}”. Try it next time.` });
  }
  s.turn++;
  if (s.turn < c.script.length) s.log.push({ who: "ai", text: c.script[s.turn].ai });
  else { s.log.push({ who: "ai", text: c.closing }); s.done = true; }
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

function simulateMic(btn) {
  if (UI.micTimer) return;
  const input = document.getElementById("reply");
  const text = convoById[UI.session.cid].script[UI.session.turn].sample;
  let k = 0;
  input.value = "";
  input.placeholder = "Listening…";
  btn.classList.add("listening");
  UI.micTimer = setInterval(() => {
    k += 2;
    input.value = text.slice(0, k);
    if (k >= text.length) { clearInterval(UI.micTimer); UI.micTimer = null; btn.classList.remove("listening"); input.focus(); }
  }, 35);
}

ACTIONS.start = el => startPractice(el.dataset.id);
ACTIONS.quit = () => { UI.session = null; go({ name: "practice" }); };
ACTIONS.finish = () => finishPractice();
ACTIONS.mic = el => simulateMic(el);
ACTIONS.insert = el => {
  const input = document.getElementById("reply");
  if (!input) return;
  input.value = (input.value ? input.value.trim() + " " : "") + practiceText(byId[el.dataset.id]);
  input.focus();
};
FORMS.say = form => {
  const text = form.reply.value.trim();
  if (text && !UI.micTimer) reply(text);
};
