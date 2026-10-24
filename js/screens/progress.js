// Progress: this week's goal ring, a sticker collection of practiced phrases grouped by who
// you heard them from (saved ones wait as locked stickers), and badges for real actions.
// Home is "what's new today"; this screen is "what you've collected this week".

const RING_C = 2 * Math.PI * 58;   // circumference of the ring (r = 58)

function goalRing(n) {
  const p = Math.min(1, n / GOAL);
  const left = GOAL - n;
  return `<section class="ring-card">
    <div class="ring" role="img" aria-label="${Math.min(n, GOAL)} of ${GOAL} phrases practiced this week">
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <circle class="ring-track" cx="70" cy="70" r="58"/>
        <circle class="ring-fill" cx="70" cy="70" r="58" stroke-dasharray="${RING_C.toFixed(1)}" stroke-dashoffset="${(RING_C * (1 - p)).toFixed(1)}" style="--ring-c:${RING_C.toFixed(1)}"/>
      </svg>
      <div class="ring-mascot">${mascot(66, n >= GOAL, n >= GOAL ? "cheer" : "happy")}</div>
    </div>
    <div class="ring-copy">
      <p class="ring-count"><strong>${n}</strong> of ${GOAL}</p>
      <p class="ring-label">phrases practiced this week</p>
      <p class="ring-note">${n >= GOAL ? "Weekly goal reached. Nice rhythm!" : n ? `${left} more to close the ring.` : "Your first practice fills it up."}</p>
    </div>
  </section>`;
}

// ---------- Sticker collection, grouped by who you heard each phrase from ----------
// Practiced items are colored stickers (tap: see them in Vocab); saved ones are locked
// (tap: go practice). New and known items stay out: Home and Vocab handle those.
function collectionGroups() {
  const groups = new Map();
  const add = (key, head, i) => { if (!groups.has(key)) groups.set(key, { head, items: [] }); groups.get(key).items.push(i); };
  ITEMS.filter(i => ["learned", "practice"].includes(statusOf(i.id))).forEach(i => {
    if (!i.convo) return add(`src:${i.source}`, { name: esc(i.source), initial: "", ctx: i.sourceContext }, i);
    const c = convoById[i.convo];
    if (i.kind === "rephrase") return add("you", { name: "Your own words", initial: "✦", ctx: "you" }, i);
    add(`p:${i.speaker}`, { name: `From ${esc(i.speaker)}`, initial: esc(i.speaker[0]), ctx: ctxOf(c.id), where: esc(c.title) }, i);
  });
  // People first, then your own words, then earlier sources.
  const rank = k => k.startsWith("p:") ? 0 : k === "you" ? 1 : 2;
  return [...groups.entries()].sort((a, b) => rank(a[0]) - rank(b[0])).map(([, g]) => g);
}

function sticker(i) {
  const ctx = ctxOfItem(i);
  return statusOf(i.id) === "learned"
    ? `<button class="sticker sticker-${ctx}" type="button" data-act="go" data-to="bank" data-filter="learned">${esc(bare(practiceText(i)))}</button>`
    : `<button class="sticker locked" type="button" data-act="go" data-to="practice" aria-label="${esc(bare(practiceText(i)))}, locked. Practice to unlock.">${icon("lock", 13)} ${esc(bare(practiceText(i)))}</button>`;
}

function collection() {
  const groups = collectionGroups();
  const got = ITEMS.filter(i => statusOf(i.id) === "learned").length;
  const locked = ITEMS.filter(i => statusOf(i.id) === "practice").length;
  return `<section class="collection">
    <div class="section-heading compact">
      <div><p class="eyebrow">YOUR COLLECTION</p><h2>Phrases you’ve practiced</h2></div>
      <span class="collection-count">${got}${locked ? ` · ${icon("lock", 12)} ${locked}` : ""}</span>
    </div>
    ${groups.length ? groups.map(g => `
      <div class="sticker-group">
        <div class="group-head">
          <span class="group-avatar group-${g.head.ctx}" aria-hidden="true">${g.head.initial || icon("message", 14)}</span>
          <span><strong>${g.head.name}</strong>${g.head.where ? `<small>${g.head.where}</small>` : ""}</span>
        </div>
        <div class="sticker-row">${g.items.map(sticker).join("")}</div>
      </div>`).join("")
    : `<div class="empty">${mascot(64, false, "think")}<p>Practice a saved phrase and it lands here as a sticker.</p></div>`}
    ${locked ? `<p class="footnote">${icon("lock", 12)} Saved phrases unlock when you use them in practice.</p>` : ""}
  </section>`;
}

// ---------- Badges: each one tied to something you actually did ----------
function badges() {
  const learned = learnedItems();
  const list = [
    { icon: "🎙️", name: "First replay", hint: "Finish a practice", got: (S.sessions || 0) >= 1 },
    { icon: "☕💼", name: "Both worlds", hint: "Practice casual and professional phrases",
      got: ["casual", "professional"].every(k => learned.some(i => ctxOfItem(i) === k)) },
    { icon: "✨", name: "Own words", hint: "Use another way to say it in practice", got: learned.some(i => i.kind === "rephrase") },
    { icon: "🏆", name: "Weekly goal", hint: `Practice ${GOAL} phrases in a week`, got: learned.length >= GOAL }
  ];
  return `<section class="badges">
    <div class="section-heading compact">
      <div><p class="eyebrow">BADGES</p><h2>${list.filter(b => b.got).length} of ${list.length} earned</h2></div>
    </div>
    <div class="badge-row">
      ${list.map(b => `<div class="badge ${b.got ? "got" : ""}">
        <span class="badge-icon" aria-hidden="true">${b.icon}</span>
        <strong>${b.name}</strong>
        <small>${b.got ? "Earned" : b.hint}</small>
      </div>`).join("")}
    </div>
  </section>`;
}

SCREENS.report = () => {
  const n = learnedCount();
  return `
    ${pageHeader({ eyebrow: "OCT 19–25", title: n >= GOAL ? "You’re on a roll" : "Your week so far" })}
    ${goalRing(n)}
    <p class="week-facts">${plural(CONVOS.length, "conversation")} · ${plural(S.sessions || 0, "practice session")}</p>
    ${collection()}
    ${badges()}`;
};
