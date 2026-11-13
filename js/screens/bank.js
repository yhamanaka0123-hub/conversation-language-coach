// Learn (PRD §6.6): This week's picks, then three categories, each in its own format:
// Expressions (expression, meaning, context), Pronunciation (word, model audio, text cue) and
// Speaking Tips (what you said → what to try). Suggested items (extracted, not saved yet) are
// kept apart from saved ones (LRN-03); the Saved tab lists everything saved, and the review card
// on top turns saved items into flashcards. Any item can be deleted (proposed safeguard SAF-03).

const LEARN_CATS = { expr: "Expressions", pron: "Pronunciation", tips: "Speaking Tips", saved: "Saved" };
const catOf = i => i.kind === "phrase" || i.area === "expression" ? "expr" : i.area === "pronunciation" ? "pron" : "tips";
const isSaved = i => ["practice", "learned"].includes(statusOf(i.id));
const inLearn = i => !["known", "deleted"].includes(statusOf(i.id));

// Save / I know this / delete. Deleting asks once, in place.
function learnActions(i) {
  if (UI.confirmDel === i.id) return `<div class="del-confirm">
      <p>Delete this learning point? It can't be undone.</p>
      <button class="button button-danger" type="button" data-act="del" data-id="${i.id}">Delete</button>
      <button class="button button-quiet" type="button" data-act="delCancel">Cancel</button>
    </div>`;
  const trash = `<button class="icon-button del-btn" type="button" data-act="delAsk" data-id="${i.id}" aria-label="Delete this learning point">${icon("trash", 16)}</button>`;
  const s = statusOf(i.id);
  if (s === "new") return `<div class="phrase-actions">
      <button class="button button-secondary" type="button" data-act="mark" data-id="${i.id}" data-status="practice">${icon("bookmark", 16)} Save</button>
      <button class="button button-quiet" type="button" data-act="mark" data-id="${i.id}" data-status="known">${icon("check", 16)} I know this</button>
      ${trash}
    </div>`;
  return `<div class="item-state">
      <span class="state-pill ${s === "learned" ? "state-learned" : "state-saved"}">${icon(s === "learned" ? "check" : "bookmark", 14)} ${s === "learned" ? "Practiced" : "Saved"}</span>
      ${s === "practice" ? `<button class="undo" type="button" data-act="mark" data-id="${i.id}" data-status="new">Unsave</button>` : ""}
      ${trash}
    </div>`;
}

// Expressions: the expression, what it means, and where it came from.
function exprCard(i) {
  const ctx = i.convo ? ctxOf(i.convo) : i.sourceContext;
  const head = i.kind === "phrase"
    ? `<h3>“${esc(i.text)}”</h3><p class="meaning">${esc(i.meaning)}</p>${i.sentence ? `<blockquote>${highlight(i.sentence, i.hl)}</blockquote>` : ""}`
    : `<h3>“${esc(bare(i.alt[ctx]))}”</h3><p class="meaning">Instead of “${esc(i.said)}”</p>`;
  return `<article class="learn-card">
    <span class="said-label">${i.kind === "phrase" ? (i.speaker ? `${esc(i.speaker)} said` : "Heard earlier") : "From your own words"}</span>
    ${head}${sourceLine(i)}${learnActions(i)}
  </article>`;
}

// Pronunciation: the word, the model's audio, and a short text cue. No learner audio (PRO-04).
function pronCard(i) {
  const c = ctxOf(i.convo);
  return `<article class="learn-card">
    <span class="said-label">Pronunciation</span>
    <h3>${esc(i.sayModel)} <span class="pron-say">${esc(i.alt[c])}</span></h3>
    <p class="pron-cue">${icon("sound", 14)} ${esc(i.why[c])}</p>
    ${pronAudio(i)}${sourceLine(i)}${learnActions(i)}
  </article>`;
}

// Speaking Tips: brief context, what you said, what to try.
function tipCard(i) {
  const c = ctxOf(i.convo);
  return `<article class="learn-card">
    <span class="area-chip area-${i.area}">${AREA[i.area]}</span>
    <p class="top-said"><span>You said</span>“${esc(i.said)}”</p>
    <p class="top-try"><span>Try</span>“${esc(i.alt[c])}”</p>
    ${sourceLine(i)}${learnActions(i)}
  </article>`;
}
const CARD = { expr: exprCard, pron: pronCard, tips: tipCard };

function picksSection() {
  const picks = PICKS.map(p => ({ ...p, i: byId[p.item] })).filter(p => inLearn(p.i));
  if (!picks.length) return "";
  return `<section class="picks">
    <div class="picks-head"><p class="eyebrow">THIS WEEK'S PICKS</p><small>${aiOnly() ? "Based on your AI practice and goals" : "Picked from your recent conversations"}</small></div>
    ${picks.map(({ i, why }) => `<article class="pick">
      <h3>“${esc(i.text)}”</h3>
      <p class="meaning">${esc(i.meaning)}</p>
      <p class="pick-why">${icon("spark", 13)} ${esc(why)}</p>
      ${isSaved(i) ? `<span class="state-pill state-saved">${icon("bookmark", 14)} Saved</span>`
        : `<button class="button button-secondary" type="button" data-act="mark" data-id="${i.id}" data-status="practice">${icon("bookmark", 16)} Save</button>`}
    </article>`).join("")}
  </section>`;
}

SCREENS.bank = () => {
  const all = ITEMS.filter(inLearn);
  const counts = Object.fromEntries(Object.keys(LEARN_CATS).map(k => [k, all.filter(i => k === "saved" ? isSaved(i) : catOf(i) === k).length]));
  const cat = UI.learnCat || "expr";
  const list = all.filter(i => catOf(i) === cat);
  const suggested = list.filter(i => statusOf(i.id) === "new");
  const saved = list.filter(isSaved);
  const savedAll = all.filter(i => statusOf(i.id) === "practice").length;
  const hidden = ITEMS.filter(i => statusOf(i.id) === "known").length;
  const group = (title, sub, items, empty) => `
    <h3 class="sub-heading">${title} <small>${sub}</small></h3>
    ${items.length ? `<div class="vocab-list">${items.map(i => CARD[catOf(i)](i)).join("")}</div>` : `<p class="empty-line">${empty}</p>`}`;
  // Saved: everything saved, grouped by category (each in its own format).
  const savedView = () => {
    const mine = all.filter(isSaved);
    if (!mine.length) return `<p class="empty-line saved-empty">Nothing saved yet. Tap Save on anything in Expressions, Pronunciation or Speaking Tips.</p>`;
    return ["expr", "pron", "tips"].map(k => { const items = mine.filter(i => catOf(i) === k);
      return items.length ? group(LEARN_CATS[k], plural(items.length, "item"), items, "") : ""; }).join("");
  };
  return `
    ${pageHeader({ eyebrow: "LEARN", title: "Things worth keeping" })}
    ${picksSection()}
    ${reviewCard()}
    <div class="tabs tabs-4" role="group" aria-label="Category">
      ${Object.entries(LEARN_CATS).map(([k, label]) => `<button type="button" class="${cat === k ? "active" : ""}" aria-pressed="${cat === k}" data-act="learnCat" data-c="${k}">${label} <span>${counts[k]}</span></button>`).join("")}
    </div>
    ${cat === "saved" ? savedView() : `
    ${group("Suggested", "from your conversations, not saved yet", suggested, "Nothing new here. More arrives after your next conversation.")}
    ${group("Saved", "kept to revisit or practice", saved, "Nothing saved yet. Tap Save on anything above.")}`}
    ${hidden ? `<p class="footnote">${plural(hidden, "item")} marked as known and hidden.</p>` : ""}
    ${savedAll ? `<div class="sticky-action">
        <button class="button button-primary full-button" type="button" data-act="go" data-to="practice">Practice ${plural(savedAll, "saved item")} ${icon("next", 18)}</button>
        <p>Optional · about 3 minutes</p>
      </div>` : ""}`;
};

ACTIONS.learnCat = el => { UI.learnCat = el.dataset.c; UI.confirmDel = null; render(); };
ACTIONS.delAsk = el => { UI.confirmDel = el.dataset.id; render(); };
ACTIONS.delCancel = () => { UI.confirmDel = null; render(); };
ACTIONS.del = el => { S.status[el.dataset.id] = "deleted"; UI.confirmDel = null; save(); render(); };

// Review your saved items as flashcards (js/screens/cards.js), from all three categories.
function reviewCard() {
  const deck = deckItems();
  if (!deck.length) return `<section class="review-card review-empty">
    <div class="review-stack" aria-hidden="true"><span></span><span></span><span>${mascot(40, false, "think")}</span></div>
    <div class="review-copy"><h2>Review your saved items</h2><p>Save something below to review it here.</p></div>
  </section>`;
  const n = Math.min(ROUND, deck.length);
  const count = f => deck.filter(i => famOf(i.id) === f).length;
  return `<section class="review-card">
    <div class="review-stack" aria-hidden="true"><span></span><span></span><span>${mascot(40, false, "happy")}</span></div>
    <div class="review-copy">
      <h2>${plural(deck.length, "saved item")}</h2>
      <p>Review as cards · about ${Math.max(1, Math.round(n / 5))} min</p>
      <p class="review-fam">${Object.entries(FAM).map(([k, [leaf, label]]) => `<span title="${label}">${leaf} ${count(k)}<span class="sr-only"> ${label}</span></span>`).join("")}</p>
    </div>
    <button class="button button-primary review-start" type="button" data-act="cards">Review them ${icon("next", 16)}</button>
  </section>`;
}
