// Conversation detail (PRD §6.5): up to 3 points to try next from the learner's own words, each
// as brief context → what you said → what to try (no "Why?" field, FDB-06), then all other
// learning points (phrases other people said, more ways to improve), each attributed.
// phraseCard / suggestionCard are also used by Learn.

// Save keeps an item in Learn; it never starts practice (EXP-06). Practicing is its own,
// optional action (PRA-02).
function itemActions(i, practice) {
  const s = statusOf(i.id);
  const chat = practice && !isPron(i) && i.convo
    ? `<button class="text-link" type="button" data-act="practiceItem" data-id="${i.id}">Try it in a chat with ${esc(convoById[i.convo].partner)}</button>` : "";
  if (s === "new") return `<div class="phrase-actions">
      <button class="button button-secondary" type="button" data-act="mark" data-id="${i.id}" data-status="practice">${icon("bookmark", 16)} Save</button>
      <button class="button button-quiet" type="button" data-act="mark" data-id="${i.id}" data-status="known">${icon("check", 16)} I know this</button>
      ${chat}
    </div>`;
  const label = { practice: ["state-saved", "bookmark", "Saved to Learn"], known: ["state-known", "check", "Got it, hidden from review"], learned: ["state-learned", "check", "Practiced"] }[s];
  return `<div class="item-state">
      <span class="state-pill ${label[0]}">${icon(label[1], 14)} ${label[2]}</span>
      ${s !== "learned" ? `<button class="undo" type="button" data-act="mark" data-id="${i.id}" data-status="new">Undo</button>` : ""}
      ${s === "practice" ? chat : ""}
    </div>`;
}

function sourceLine(i) {
  if (!i.convo) return `<div class="source">${icon("message", 14)} from ${esc(i.source)}</div>`;
  return `<div class="source">${icon("message", 14)} from ${esc(convoById[i.convo].title)} ${tag(ctxOf(i.convo))}</div>`;
}

// A phrase another person said: attributed to them (CON-05). No audio of their voice (CON-06).
function phraseCard(i, n, withSource) {
  return `<article class="phrase-card ${statusOf(i.id) === "known" ? "known" : ""}">
    <div class="phrase-index">${n ? String(n).padStart(2, "0") : ""}</div>
    <div class="phrase-content">
      <span class="said-label">${i.speaker ? `${esc(i.speaker)} said · ${i.at}` : "Heard earlier"}</span>
      <h3>“${esc(i.text)}”</h3>
      ${i.sentence ? `<blockquote>${highlight(i.sentence, i.hl)}</blockquote>` : ""}
      <p class="meaning">${esc(i.meaning)}</p>
      ${withSource ? sourceLine(i) : ""}
      ${itemActions(i)}
    </div>
  </article>`;
}

// Model pronunciation only, played on tap (PRO-04, PRO-06). The learner's own audio is deleted
// after analysis, so there is no playback of it.
const audioButton = (text, label, rate) => canSpeak
  ? `<button class="audio-btn" type="button" data-act="speak" data-text="${esc(text)}"${rate ? ` data-rate="${rate}"` : ""}>${icon("play", 14)} ${label}</button>` : "";
const pronAudio = i => `<div class="audio-row">${audioButton(i.sayModel, "Hear the model", 0.85)}</div>`;

// An improvement from the learner's own words: context, what they said, what to try (FDB-05).
// Pronunciation adds a short text cue and the model's audio (PRO-04, PRO-05). n = its place
// in the Top 3.
function suggestionCard(i, withSource, n) {
  const c = ctxOf(i.convo);
  const pron = isPron(i);
  return `<article class="suggestion-card ${n ? "top-card" : ""} ${statusOf(i.id) === "known" ? "known" : ""}">
    <div class="top-head">
      ${n ? `<span class="top-num">${n}</span>` : ""}
      <span class="area-chip area-${i.area || "expression"}">${AREA[i.area] || "Expression"}</span>
      <span class="top-ctx">You · ${i.at}</span>
    </div>
    <p class="top-said"><span>You said</span>“${esc(i.said)}”${pron ? ` <em>“${esc(i.sayModel)}” came out as ${esc(i.heard)}</em>` : ""}</p>
    <p class="top-try"><span>Try</span>${pron ? `${esc(i.sayModel)}: <strong>${esc(i.alt[c])}</strong>` : `“${esc(i.alt[c])}”`}</p>
    ${pron ? `<p class="pron-cue">${icon("sound", 14)} ${esc(i.why[c])}</p>${pronAudio(i)}` : ""}
    <div class="suggestion-foot">
      ${withSource ? sourceLine(i) : ""}
      ${itemActions(i, !withSource)}
    </div>
  </article>`;
}

SCREENS.convo = () => {
  const c = convoById[UI.route.id];
  const items = itemsIn(c.id);
  const ctx = ctxOf(c.id);
  const top = topOf(c.id);
  const heard = items.filter(i => i.kind === "phrase");
  const more = items.filter(i => i.kind === "rephrase" && !top.includes(i));
  return `
    ${pageHeader({ eyebrow: c.when.toUpperCase(), title: esc(c.title), back: "home", action: tag(ctx) })}
    <p class="detail-meta">${icon("clock", 15)} ${c.length} · ${esc(c.place)} · with ${esc(c.people)}</p>

    <div class="scene-context">
      ${icon("message", 17)}
      <p><strong>Summary.</strong> ${esc(c.summary)}</p>
    </div>

    <div class="context-switch">
      <div>
        <span class="said-label">Detected context</span>
        <p class="subtle">${ctx === c.context ? "Auto-detected" : "Changed by you"}</p>
      </div>
      <div class="tabs tabs-small" role="group" aria-label="Conversation context">
        ${["casual", "professional"].map(k => `<button type="button" class="${ctx === k ? "active" : ""}" aria-pressed="${ctx === k}" data-act="ctx" data-id="${c.id}" data-ctx="${k}">${ctxLabel(k)}</button>`).join("")}
      </div>
    </div>

    ${top.length ? `
      <div class="section-heading compact">
        <div><p class="eyebrow">FROM YOUR OWN WORDS</p><h2>Top ${top.length} to try next</h2></div>
      </div>
      <p class="section-intro">Options for a ${ctxLabel(ctx).toLowerCase()} chat, not corrections.</p>
      <div class="phrase-list">${top.map((i, n) => suggestionCard(i, false, n + 1)).join("")}</div>` : ""}

    <div class="section-heading all-points">
      <div><p class="eyebrow">EVERYTHING FROM THIS CHAT</p><h2>All learning points</h2></div>
    </div>
    ${heard.length ? `<h3 class="sub-heading">${icon("message", 16)} Phrases you heard <small>said by others</small></h3>
      <div class="phrase-list">${heard.map((i, n) => phraseCard(i, n + 1)).join("")}</div>` : ""}
    ${more.length ? `<h3 class="sub-heading">${icon("spark", 16)} More ways to improve <small>from your own words</small></h3>
      <div class="phrase-list">${more.map(i => suggestionCard(i)).join("")}</div>` : ""}

    <p class="data-note">${icon("lock", 14)} Audio and full transcript deleted after analysis. Only the lines above are kept.</p>

    <div class="sticky-action">
      <button class="button button-primary full-button" type="button" data-act="start" data-id="${c.id}">
        Practice with ${esc(c.partner)} ${icon("next", 18)}
      </button>
      <p>Optional · ~3 min · AI plays ${esc(c.partner)}</p>
    </div>`;
};

ACTIONS.ctx = el => { S.ctx[el.dataset.id] = el.dataset.ctx; save(); render(); };
