// Flashcards: a low-effort way to review without talking to the AI.
// Front: who said it and what it means ("How would Maya say it?"). Back: the phrase in the
// original sentence, with a listen button. "Got it" / "Not yet" by button or swipe.
// Familiarity is about remembering a card, not about speaking: new -> getting there -> remembered.

const ROUND = 10;          // cards per round
const REMEMBERED = 3;      // "Got it" in a row to count as remembered

// Every phrase except the ones marked "I know this".
const deckItems = () => ITEMS.filter(i => statusOf(i.id) !== "known");
const cardOf = id => (S.cards || {})[id] || { seen: 0, streak: 0 };
const famOf = id => { const k = cardOf(id); return !k.seen ? "new" : k.streak >= REMEMBERED ? "remembered" : "growing"; };
const FAM = { new: ["🌱", "New"], growing: ["🌿", "Getting there"], remembered: ["🌳", "Remembered"] };

// A round mixes up to 6 getting-there cards (least sure first), new cards to fill, and a
// couple of remembered ones to keep them fresh, so new cards keep showing up.
function buildRound() {
  const by = f => deckItems().filter(i => famOf(i.id) === f).map(i => i.id);
  const growing = by("growing").sort((a, b) => cardOf(a).streak - cardOf(b).streak);
  const remembered = by("remembered").sort((a, b) => cardOf(a).seen - cardOf(b).seen).slice(0, 2);
  const room = ROUND - remembered.length;
  const picked = [...growing.slice(0, 6), ...by("new"), ...growing.slice(6)].slice(0, room);
  return [...picked, ...remembered, ...growing, ...by("new")].filter((id, n, all) => all.indexOf(id) === n).slice(0, ROUND);
}

function cardFaces(i) {
  if (i.kind === "phrase") {
    const c = i.convo && convoById[i.convo];
    const who = i.speaker || "Someone";
    return {
      where: c ? `${esc(who)} · ${esc(c.short || c.title)}` : esc(i.source),
      front: `<p class="fc-meaning">${esc(i.meaning)}</p><p class="fc-ask">How would ${esc(who)} say it?</p>`,
      back: `<p class="fc-phrase">“${esc(i.text)}”</p>${i.sentence ? `<p class="fc-sentence">${highlight(i.sentence, i.hl)}</p>` : ""}`,
      say: i.sentence || i.text
    };
  }
  const ctx = ctxOf(i.convo), c = convoById[i.convo];
  return {
    where: `You · ${esc(c.short || c.title)}`,
    front: `<p class="fc-label">You said</p><p class="fc-meaning">“${esc(i.said)}”</p><p class="fc-ask">A more natural ${ctxLabel(ctx).toLowerCase()} way?</p>`,
    back: `<p class="fc-phrase">“${esc(i.alt[ctx])}”</p><p class="fc-sentence">${esc(i.why[ctx])}</p>`,
    say: i.alt[ctx]
  };
}

function startCards() {
  UI.deck = { queue: buildRound(), k: 0, flipped: false, got: [], again: [], retried: [], grown: [] };
  go({ name: "cards" });
}

SCREENS.cards = () => {
  const d = UI.deck;
  if (!d || !d.queue.length) return `
    ${pageHeader({ eyebrow: "REVIEW", title: "No cards yet", back: "bank" })}
    <div class="empty">${mascot(64, false, "think")}<p>Phrases from your conversations become cards here.</p></div>`;
  if (d.k >= d.queue.length) return roundDone(d);
  const i = byId[d.queue[d.k]], f = cardFaces(i), fam = FAM[famOf(i.id)];
  return `
    <div class="cards-top">
      <button class="icon-button" type="button" data-act="go" data-to="bank" aria-label="Stop reviewing">${icon("back")}</button>
      <div class="cards-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${d.queue.length}" aria-valuenow="${d.k}" aria-label="Card ${d.k + 1} of ${d.queue.length}">
        <span style="width:${d.k / d.queue.length * 100}%"></span>
      </div>
      <span class="cards-count">${d.k + 1}/${d.queue.length}</span>
    </div>

    <div class="fc-wrap ${UI.cardAnim ? `fc-${UI.cardAnim}` : ""}">
      <button class="flashcard ${d.flipped ? "flipped" : ""}" type="button" data-act="flipcard" aria-label="${d.flipped ? "Card back. Tap to see the front." : "Card front. Tap to flip."}">
        <span class="fc-where">${f.where}</span>
        ${d.flipped ? f.back : `${f.front}<span class="fc-hint">Tap to flip</span>`}
      </button>
      ${d.flipped ? speakButton(f.say) : ""}
    </div>
    <p class="fc-fam">${fam[0]} ${fam[1]}</p>

    <div class="fc-actions">
      ${d.flipped ? `
        <button class="fc-btn again" type="button" data-act="grade" data-ok="0">↺ Not yet</button>
        <button class="fc-btn got" type="button" data-act="grade" data-ok="1">✓ Got it</button>`
      : `<button class="fc-btn flip" type="button" data-act="flipcard">Show answer</button>`}
    </div>
    <p class="fc-tip">${d.flipped ? "Swipe right if you remembered, left to see it again." : "Try saying it out loud before you flip."}</p>`;
};

function roundDone(d) {
  // Remembered: got it without a miss this round. Missed ones count as "to see again".
  const remembered = d.got.filter(id => !d.again.includes(id)).length;
  const grown = d.grown.map(id => byId[id]).filter(i => i.convo);
  const g = grown[0];
  return `
    ${pageHeader({ eyebrow: "ROUND DONE", title: `${remembered} remembered${d.again.length ? `, ${d.again.length} to see again` : ""}`, back: "bank" })}
    ${coachSays(d.again.length
      ? `Nice round. <strong>${plural(d.again.length, "card")}</strong> will come up first next time.`
      : "Every card this round. <strong>Nicely done!</strong>", "cheer")}
    ${g ? `<section class="fc-nudge">
        <span class="fc-nudge-face face-${ctxOf(g.convo)}">${person(convoById[g.convo], 52)}</span>
        <div><p>You remember <strong>“${esc(bare(practiceText(g)))}”</strong> now. Want to try saying it to ${esc(convoById[g.convo].partner)}?</p>
        <button class="text-link" type="button" data-act="chatwith" data-id="${g.convo}">Chat with ${esc(convoById[g.convo].partner)}</button></div>
      </section>` : ""}
    <div class="stack recap-actions">
      <button class="button button-primary full-button" type="button" data-act="cards">Another round</button>
      <button class="button button-quiet full-button" type="button" data-act="go" data-to="bank">Back to Vocab</button>
    </div>`;
}

function grade(ok) {
  const d = UI.deck, id = d.queue[d.k];
  S.cards = S.cards || {};
  const before = famOf(id), k = cardOf(id);
  S.cards[id] = { seen: k.seen + 1, streak: ok ? k.streak + 1 : 0 };
  save();
  if (ok) {
    if (!d.got.includes(id)) d.got.push(id);
    if (before !== "remembered" && famOf(id) === "remembered") d.grown.push(id);
  } else {
    if (!d.again.includes(id)) d.again.push(id);
    // A missed card comes back once at the end of this round.
    if (!d.retried.includes(id)) { d.retried.push(id); d.queue.push(id); }
  }
  d.k++;
  d.flipped = false;
  UI.cardAnim = ok ? "right" : "left";
  render();
}

afterRender.cards = () => {
  UI.cardAnim = null;
  const card = document.querySelector(".flashcard");
  if (!card) return;
  let x0 = null;
  card.addEventListener("pointerdown", e => { x0 = e.clientX; });
  card.addEventListener("pointerup", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 60 && UI.deck.flipped) { UI.swiped = true; grade(dx > 0); }
  });
};

ACTIONS.cards = () => startCards();
ACTIONS.flipcard = () => {
  if (UI.swiped) { UI.swiped = false; return; }   // the click that ends a swipe
  UI.deck.flipped = !UI.deck.flipped;
  UI.cardAnim = "flip";
  render();
};
ACTIONS.grade = el => grade(el.dataset.ok === "1");
ACTIONS.chatwith = el => { UI.pick = el.dataset.id; go({ name: "practice" }); };
