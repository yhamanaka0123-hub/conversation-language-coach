// Vocab bank: a flashcard review entry on top, then every captured phrase, filtered by state.

const BANK_GROUPS = { new: "New", practice: "To practice", learned: "Practiced" };

SCREENS.bank = () => {
  const visible = ITEMS.filter(i => statusOf(i.id) !== "known");
  const counts = Object.fromEntries(Object.keys(BANK_GROUPS).map(k => [k, visible.filter(i => statusOf(i.id) === k).length]));
  const f = UI.bankFilter || (counts.practice ? "practice" : counts.new ? "new" : "learned");
  const list = visible.filter(i => statusOf(i.id) === f);
  const known = ITEMS.filter(i => statusOf(i.id) === "known").length;
  const empty = {
    new: "Nothing new to review. Phrases arrive after your next conversation.",
    practice: "Nothing saved yet. Open a conversation and tap “Practice this”.",
    learned: "Use a saved phrase in practice and it lands here."
  }[f];
  return `
    ${pageHeader({ eyebrow: "YOUR COLLECTION", title: "Words worth keeping" })}
    ${reviewCard()}
    <div class="tabs tabs-3" role="group" aria-label="Filter">
      ${Object.entries(BANK_GROUPS).map(([k, label]) => `<button type="button" class="${f === k ? "active" : ""}" aria-pressed="${f === k}" data-act="filter" data-f="${k}">${label} <span>${counts[k]}</span></button>`).join("")}
    </div>
    <div class="vocab-list">
      ${list.length ? list.map(i => i.kind === "phrase" ? phraseCard(i, 0, true) : suggestionCard(i, true)).join("") : `<div class="empty">${mascot(64, false, "think")}<p>${empty}</p></div>`}
    </div>
    ${known ? `<p class="footnote">${plural(known, "phrase")} marked as known and hidden.</p>` : ""}
    ${counts.practice ? `<div class="sticky-action">
        <button class="button button-primary full-button" type="button" data-act="go" data-to="practice">Practice ${plural(counts.practice, "saved phrase")} ${icon("next", 18)}</button>
        <p>About 3 minutes · a relaxed conversation</p>
      </div>` : ""}`;
};

ACTIONS.filter = el => { UI.bankFilter = el.dataset.f; render(); };

// Entry to flashcard review (js/screens/cards.js): how many cards, and how familiar they are.
function reviewCard() {
  const deck = deckItems();
  if (!deck.length) return "";
  const n = Math.min(ROUND, deck.length);
  const count = f => deck.filter(i => famOf(i.id) === f).length;
  return `<section class="review-card">
    <div class="review-stack" aria-hidden="true"><span></span><span></span><span>${mascot(40, false, "happy")}</span></div>
    <div class="review-copy">
      <h2>${plural(n, "card")} ready</h2>
      <p>About ${Math.max(1, Math.round(n / 5))} min · no talking needed</p>
      <p class="review-fam">${Object.entries(FAM).map(([k, [leaf, label]]) => `<span title="${label}">${leaf} ${count(k)}<span class="sr-only"> ${label}</span></span>`).join("")}</p>
    </div>
    <button class="button button-primary review-start" type="button" data-act="cards">Start review ${icon("next", 16)}</button>
  </section>`;
}
