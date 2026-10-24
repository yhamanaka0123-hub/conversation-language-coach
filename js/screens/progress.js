// Progress: the goal is new phrases used in real conversations, not practice.
// Ring: new phrases used for real this week. Then time you spoke, a sticker collection where
// each phrase moves saved -> practiced -> used for real, and badges for real actions. Home is "what's new today"; this is "how you're growing".

const RING_C = 2 * Math.PI * 58;   // circumference of the ring (r = 58)
const usesOf = id => USES.filter(u => u.item === id);
const usedIds = () => [...new Set(USES.map(u => u.item))];
const FEELS = [["tense", "😬", "Tense"], ["okay", "🙂", "Okay"], ["great", "😄", "Great"]];

function goalRing(n) {
  const p = Math.min(1, n / USE_GOAL);
  const left = USE_GOAL - n;
  return `<section class="ring-card">
    <div class="ring" role="img" aria-label="${Math.min(n, USE_GOAL)} of ${USE_GOAL} new phrases used in real conversations this week">
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <circle class="ring-track" cx="70" cy="70" r="58"/>
        <circle class="ring-fill" cx="70" cy="70" r="58" stroke-dasharray="${RING_C.toFixed(1)}" stroke-dashoffset="${(RING_C * (1 - p)).toFixed(1)}" style="--ring-c:${RING_C.toFixed(1)}"/>
      </svg>
      <div class="ring-mascot">${mascot(66, n >= USE_GOAL, n ? "cheer" : "happy")}</div>
    </div>
    <div class="ring-copy">
      <p class="ring-count"><strong>${n}</strong> of ${USE_GOAL}</p>
      <p class="ring-label">new ${n === 1 ? "phrase" : "phrases"} used in real conversations</p>
      <p class="ring-note">${n >= USE_GOAL ? "Ring closed. You’re making them yours!" : n ? `${left} more to close the ring.` : "Use one in your next chat."}</p>
    </div>
  </section>`;
}

function weekStats() {
  const spoke = CONVOS.reduce((a, c) => a + (c.mine || 0), 0);
  return `<div class="stat-row">
    <div class="stat"><span aria-hidden="true">🗣️</span><strong>${spoke} min</strong><small>you spoke this week</small></div>
    <div class="stat"><span aria-hidden="true">🎙️</span><strong>${learnedCount()}</strong><small>${learnedCount() === 1 ? "phrase" : "phrases"} practiced</small></div>
  </div>`;
}

// ---------- Sticker collection, grouped by who you heard each phrase from ----------
// Stages: saved (locked) -> practiced -> used for real (gold).
// New and known items stay out: Home and Vocab handle those.
const stageOf = i => usesOf(i.id).length ? 3 : statusOf(i.id) === "learned" ? 2 : statusOf(i.id) === "practice" ? 1 : 0;

function collectionGroups() {
  const groups = new Map();
  const add = (key, head, i) => { if (!groups.has(key)) groups.set(key, { head, items: [] }); groups.get(key).items.push(i); };
  ITEMS.filter(i => stageOf(i)).forEach(i => {
    if (!i.convo) return add(`src:${i.source}`, { name: esc(i.source), initial: "", ctx: i.sourceContext }, i);
    const c = convoById[i.convo];
    if (i.kind === "rephrase") return add("you", { name: "Your own words", initial: "✦", ctx: "you" }, i);
    add(`p:${i.speaker}`, { name: `From ${esc(i.speaker)}`, initial: esc(i.speaker[0]), ctx: ctxOf(c.id), where: esc(c.title) }, i);
  });
  groups.forEach(g => g.items.sort((a, b) => stageOf(b) - stageOf(a)));
  // People first, then your own words, then earlier sources.
  const rank = k => k.startsWith("p:") ? 0 : k === "you" ? 1 : 2;
  return [...groups.entries()].sort((a, b) => rank(a[0]) - rank(b[0])).map(([, g]) => g);
}

function sticker(i) {
  const text = esc(bare(practiceText(i)));
  const stage = stageOf(i);
  if (stage === 3) {
    const u = usesOf(i.id)[0], c = convoById[u.convo];
    return `<button class="sticker gold" type="button" data-act="go" data-to="bank" data-filter="learned">
      <span>⭐ ${text}</span><small>Used in ${esc(c.title)}</small></button>`;
  }
  if (stage === 2) return `<button class="sticker sticker-${ctxOfItem(i)}" type="button" data-act="go" data-to="bank" data-filter="learned">🎙️ ${text}</button>`;
  return `<button class="sticker locked" type="button" data-act="go" data-to="practice" aria-label="${text}, saved. Practice it to move it forward.">${icon("lock", 13)} ${text}</button>`;
}

function collection() {
  const groups = collectionGroups();
  const gold = usedIds().length;
  return `<section class="collection">
    <div class="section-heading compact">
      <div><p class="eyebrow">YOUR COLLECTION</p><h2>From heard to yours</h2></div>
      <span class="collection-count">⭐ ${gold}</span>
    </div>
    <p class="stage-key"><span>${icon("lock", 12)} saved</span><span>🎙️ practiced</span><span>⭐ used for real</span></p>
    ${groups.length ? groups.map(g => `
      <div class="sticker-group">
        <div class="group-head">
          <span class="group-avatar group-${g.head.ctx}" aria-hidden="true">${g.head.initial || icon("message", 14)}</span>
          <span><strong>${g.head.name}</strong>${g.head.where ? `<small>${g.head.where}</small>` : ""}</span>
        </div>
        <div class="sticker-row">${g.items.map(sticker).join("")}</div>
      </div>`).join("")
    : `<div class="empty">${mascot(64, false, "think")}<p>Save a phrase from a conversation and it starts here.</p></div>`}
    <p class="footnote">Real-conversation use is detected from your recordings (simulated in this prototype).</p>
  </section>`;
}

// ---------- Badges: each one tied to something you actually did ----------
function badges() {
  const realCtx = USES.map(u => ctxOf(u.convo));
  const list = [
    { icon: "⭐", name: "First real use", hint: "Use a new phrase in a real chat", got: USES.length >= 1 },
    { icon: "🎙️", name: "First practice", hint: "Finish a practice", got: (S.sessions || 0) >= 1 },
    { icon: "☕💼", name: "Both worlds", hint: "Use new phrases at work and with friends", got: ["casual", "professional"].every(k => realCtx.includes(k)) },
    { icon: "🏆", name: `${USE_GOAL} for real`, hint: `Use ${USE_GOAL} new phrases in one week`, got: usedIds().length >= USE_GOAL }
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
  const n = usedIds().length;
  return `
    ${pageHeader({ eyebrow: "OCT 19–25", title: n >= USE_GOAL ? "You’re on a roll" : "Your week so far" })}
    ${goalRing(n)}
    ${weekStats()}
    ${collection()}
    ${badges()}`;
};
