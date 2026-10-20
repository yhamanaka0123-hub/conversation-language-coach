// Conversation detail: new phrases, "you could also say" suggestions, context switch.
// phraseCard / suggestionCard are also used by the Vocab screen.

function itemActions(i) {
  const s = statusOf(i.id);
  if (s === "new") return `<div class="phrase-actions">
      <button class="button button-secondary" type="button" data-act="mark" data-id="${i.id}" data-status="practice">${icon(i.kind === "phrase" ? "spark" : "bookmark", 16)} ${i.kind === "phrase" ? "Practice this" : "Save to practice"}</button>
      <button class="button button-quiet" type="button" data-act="mark" data-id="${i.id}" data-status="known">${icon("check", 16)} I know this</button>
    </div>`;
  const label = { practice: ["state-saved", "bookmark", "Saved to practice"], known: ["state-known", "check", "Got it, hidden from review"], learned: ["state-learned", "check", "Learned"] }[s];
  return `<div class="item-state">
      <span class="state-pill ${label[0]}">${icon(label[1], 14)} ${label[2]}</span>
      ${s !== "learned" ? `<button class="undo" type="button" data-act="mark" data-id="${i.id}" data-status="new">Undo</button>` : ""}
    </div>`;
}

function sourceLine(i) {
  if (!i.convo) return `<div class="source">${icon("message", 14)} from ${esc(i.source)}</div>`;
  return `<div class="source">${icon("message", 14)} from ${esc(convoById[i.convo].title)} ${tag(ctxOf(i.convo))}</div>`;
}

function phraseCard(i, n, withSource) {
  return `<article class="phrase-card ${statusOf(i.id) === "known" ? "known" : ""}">
    <div class="phrase-index">${n ? String(n).padStart(2, "0") : ""}</div>
    <div class="phrase-content">
      <h3>“${esc(i.text)}”</h3>
      ${i.sentence ? `<blockquote>${highlight(i.sentence, i.hl)}</blockquote>` : ""}
      <p class="meaning">${esc(i.meaning)}${i.speaker ? ` <span class="said-by">· ${esc(i.speaker)}, ${i.at}</span>` : ""}</p>
      ${withSource ? sourceLine(i) : ""}
      ${itemActions(i)}
    </div>
  </article>`;
}

function suggestionCard(i, withSource) {
  const c = ctxOf(i.convo);
  return `<article class="suggestion-card ${statusOf(i.id) === "known" ? "known" : ""}">
    <div class="said-row">
      <span class="said-label">You said · ${i.at}</span>
      <p>“${esc(i.said)}”</p>
    </div>
    <div class="alternative-row">
      <div class="alternative-icon">${icon("spark", 17)}</div>
      <div>
        <span class="said-label">You could try</span>
        <h3>“${esc(i.alt[c])}”</h3>
        <p>${esc(i.why[c])}</p>
      </div>
    </div>
    <div class="suggestion-foot">
      ${withSource ? sourceLine(i) : ""}
      ${itemActions(i)}
    </div>
  </article>`;
}

SCREENS.convo = () => {
  const c = convoById[UI.route.id];
  const items = itemsIn(c.id);
  const ctx = ctxOf(c.id);
  const saved = items.filter(i => statusOf(i.id) === "practice").length;
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
        <p class="subtle">${ctx === c.context ? "Auto-detected." : "Changed by you."} Suggestions below follow this.</p>
      </div>
      <div class="tabs tabs-small" role="group" aria-label="Conversation context">
        ${["casual", "professional"].map(k => `<button type="button" class="${ctx === k ? "active" : ""}" aria-pressed="${ctx === k}" data-act="ctx" data-id="${c.id}" data-ctx="${k}">${ctxLabel(k)}</button>`).join("")}
      </div>
    </div>

    <div class="section-heading compact">
      <div><p class="eyebrow">PICKED UP FOR YOU</p><h2>New phrases you heard</h2></div>
    </div>
    <div class="phrase-list">
      ${items.filter(i => i.kind === "phrase").map((i, n) => phraseCard(i, n + 1)).join("")}
    </div>

    <div class="section-heading suggestion-heading">
      <div><p class="eyebrow">ANOTHER WAY TO SAY IT</p><h2>You could also say</h2></div>
    </div>
    <p class="section-intro">Not a correction, just another option that might feel natural in a ${ctxLabel(ctx).toLowerCase()} conversation.</p>
    <div class="phrase-list">
      ${items.filter(i => i.kind === "rephrase").map(i => suggestionCard(i)).join("")}
    </div>

    <div class="sticky-action">
      <button class="button button-primary full-button" type="button" data-act="start" data-id="${c.id}" ${saved ? "" : "disabled"}>
        Practice this conversation${saved ? ` · ${saved} saved` : ""} ${icon("next", 18)}
      </button>
      <p>${saved ? `About 3 minutes · ${esc(c.partner)}, played by AI` : "Tap “Practice this” on at least one phrase to start."}</p>
    </div>`;
};

ACTIONS.ctx = el => { S.ctx[el.dataset.id] = el.dataset.ctx; save(); render(); };
