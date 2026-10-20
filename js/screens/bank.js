// Vocab bank: every captured phrase, filtered by review state.

const BANK_GROUPS = { new: "New", practice: "To practice", learned: "Learned" };

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
    <div class="tabs tabs-3" role="group" aria-label="Filter">
      ${Object.entries(BANK_GROUPS).map(([k, label]) => `<button type="button" class="${f === k ? "active" : ""}" aria-pressed="${f === k}" data-act="filter" data-f="${k}">${label} <span>${counts[k]}</span></button>`).join("")}
    </div>
    <div class="vocab-list">
      ${list.length ? list.map(i => i.kind === "phrase" ? phraseCard(i, 0, true) : suggestionCard(i, true)).join("") : `<div class="empty">${empty}</div>`}
    </div>
    ${known ? `<p class="footnote">${plural(known, "phrase")} marked as known and hidden.</p>` : ""}
    ${counts.practice ? `<div class="sticky-action">
        <button class="button button-primary full-button" type="button" data-act="go" data-to="practice">Practice ${plural(counts.practice, "saved phrase")} ${icon("next", 18)}</button>
        <p>About 3 minutes · a relaxed conversation</p>
      </div>` : ""}`;
};

ACTIONS.filter = el => { UI.bankFilter = el.dataset.f; render(); };
