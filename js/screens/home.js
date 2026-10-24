// Home: a coach greeting, one featured conversation, and the rest of the day.
// Featured: the latest conversation with unexplored items, replayed one moment at a time;
// else saved items waiting for practice; else a calm "all caught up" card.

// Small illustrations for conversation cards, keyed by CONVOS[].art.
const ART = {
  coffee: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M15 6c-1.5 2 1.5 3 0 5M21 6c-1.5 2 1.5 3 0 5" fill="none" stroke="#c98a6b" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M27 18h2.5a4 4 0 0 1 0 8H26" fill="none" stroke="#8a4b2e" stroke-width="2.4"/>
    <path d="M8 15h20v9a9 9 0 0 1-9 9h-2a9 9 0 0 1-9-9v-9Z" fill="#fff" stroke="#8a4b2e" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M10.5 20h15" stroke="#f3b597" stroke-width="3" stroke-linecap="round"/>
    <path d="M6 35h26" stroke="#8a4b2e" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  meeting: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <rect x="5" y="8" width="30" height="20" rx="4" fill="#fff" stroke="#2f6b52" stroke-width="2.2"/>
    <circle cx="14" cy="16" r="3" fill="#8fd0b3"/><path d="M9.5 24a4.5 4.5 0 0 1 9 0" fill="#8fd0b3"/>
    <circle cx="26" cy="16" r="3" fill="#b9d3f0"/><path d="M21.5 24a4.5 4.5 0 0 1 9 0" fill="#b9d3f0"/>
    <path d="M14 33h12M20 28v5" stroke="#2f6b52" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  chat: `<svg viewBox="0 0 40 40" aria-hidden="true">
    <path d="M8 9h24a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H17l-7 6v-6H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z" fill="#fff" stroke="#5b4a8a" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M12 16h16M12 21h10" stroke="#b39cf0" stroke-width="2.4" stroke-linecap="round"/></svg>`
};
const artTile = c => `<div class="art-tile art-${ctxOf(c.id)}">${ART[c.art] || ART.chat}</div>`;
const whenLine = c => `${esc(c.when.replace(" · ", ", "))} · ${esc(c.length)}`;
const homeTag = c => `<span class="home-tag home-tag-${ctxOf(c.id)}">${ctxLabel(ctxOf(c.id))}</span>`;
const itemsWith = (cid, status) => itemsIn(cid).filter(i => statusOf(i.id) === status);

// What a small card says about a conversation, from current item status.
function learningSummary(c) {
  const open = itemsWith(c.id, "new");
  const phrases = open.filter(i => i.kind === "phrase").length;
  const ways = open.length - phrases;
  const saved = itemsWith(c.id, "practice").length;
  const parts = [];
  if (phrases) parts.push(`${plural(phrases, "phrase")} to explore`);
  if (ways) parts.push(plural(ways, "fresh way to say it", "fresh ways to say it"));
  if (parts.length) return parts.join(" · ");
  if (saved) return `${plural(saved, "phrase")} ready to practice`;
  return `${icon("check", 14)} All explored`;
}

function quoteChips(list) {
  return `<ul class="quote-chips">${list.map(q => `
    <li><span class="quote-text">“${esc(bare(q.text))}”</span>${q.note ? `<span class="quote-note">${esc(q.note)}</span>` : ""}</li>`).join("")}
  </ul>`;
}

function featureCard(c, body, cta) {
  return `<section class="feature-card" aria-labelledby="feature-title">
    <div class="feature-top">
      ${artTile(c)}
      <div class="feature-heading">
        <h2 id="feature-title">${esc(c.title)}</h2>
        <p class="card-meta">${homeTag(c)}<span>${whenLine(c)}</span></p>
      </div>
    </div>
    ${body}
    ${cta}
  </section>`;
}

// ---------- Moments: the featured conversation, one bubble at a time ----------
// Phrases the other person said come first, then another way to say the learner's own words.
// Home shows a few (two heard phrases and one rephrase when both exist); the rest wait in
// the conversation detail.
const HOME_MOMENTS = 3;
UI.moments = UI.moments || {};   // conversation id -> slide index
const momentsFor = c => {
  const open = itemsWith(c.id, "new");
  const heard = open.filter(i => i.kind === "phrase"), ways = open.filter(i => i.kind === "rephrase");
  const shown = [...heard.slice(0, HOME_MOMENTS - Math.min(ways.length, 1)), ...ways].slice(0, HOME_MOMENTS);
  return { shown, total: open.length };
};
const canSpeak = "speechSynthesis" in window;
const speakButton = text => canSpeak
  ? `<button class="speak" type="button" data-act="speak" data-text="${esc(text)}" aria-label="Listen">${icon("sound", 17)}</button>` : "";

// Front: what was said. Back (after a tap): what it means, or why the other way works.
function momentSlide(i, c) {
  const open = UI.flip === i.id;
  const ctx = ctxOf(c.id);
  const [label, front, backLabel, back, say] = i.kind === "phrase"
    ? [`${esc(i.speaker)} said`, highlight(i.sentence, i.hl), `“${esc(i.text)}” means`, esc(i.meaning), i.sentence]
    : ["Another way to say it", `“${esc(i.alt[ctx])}”`, `Instead of “${esc(bare(i.said))}”`, esc(i.why[ctx]), i.alt[ctx]];
  return `${mascot(40, false, open ? "cheer" : "think").replace('class="mascot', 'class="moment-peek mascot')}
    <button class="moment-bubble ${i.kind} ${open ? "flipped" : ""}" type="button" data-act="flip" data-id="${i.id}" aria-expanded="${open}">
      <span class="moment-label">${open ? backLabel : label}</span>
      <span class="moment-quote">${open ? back : front}</span>
    </button>
    ${speakButton(say)}`;
}

// State A: something new to explore in this conversation.
function exploreFeature(c) {
  const { shown: list, total } = momentsFor(c);
  const k = Math.min(UI.moments[c.id] || 0, list.length);
  const more = total - list.length;
  const slide = k < list.length ? momentSlide(list[k], c)
    : `<div class="moment-done">${mascot(48, false, "cheer")}<p>${more ? `${plural(more, "more thing")} inside your ${esc(c.short || "conversation")}.` : `That’s everything new from your ${esc(c.short || "conversation")}.`}</p></div>`;
  const body = `<div class="moments" role="group" aria-roledescription="carousel" aria-label="Moments from ${esc(c.title)}">
      <div class="moment-stage ${UI.momentAnim ? `anim-${UI.momentAnim}` : ""}" data-cid="${c.id}">${slide}</div>
      <div class="moment-nav">
        <div class="moment-dots">
          ${list.map((_, n) => `<button type="button" class="${n === k ? "on" : n < k ? "seen" : ""}" data-act="moment" data-id="${c.id}" data-to="${n}" aria-label="Moment ${n + 1} of ${list.length}" ${n === k ? 'aria-current="true"' : ""}></button>`).join("")}
        </div>
        ${k < list.length ? `<button class="next-pill" type="button" data-act="moment" data-id="${c.id}" data-to="${k + 1}">Next ${icon("next", 15)}</button>` : ""}
      </div>
    </div>`;
  return featureCard(c, body, `<button class="button-cta" type="button" data-act="go" data-to="convo" data-id="${c.id}">
      ${c.short ? `Explore my ${esc(c.short)}` : "Explore conversation"} ${icon("next", 18)}</button>`);
}

// State B: everything explored, but saved items are waiting for practice.
function practiceFeature(c) {
  const saved = itemsWith(c.id, "practice");
  const shown = saved.slice(0, 2);
  const more = saved.length - shown.length;
  return featureCard(c, `<div class="feature-preview">
      <p class="feature-label">Saved</p>
      ${quoteChips(shown.map(i => ({ text: practiceText(i) }))).replace("</ul>", more ? `<li class="more-chip">+${more} more</li></ul>` : "</ul>")}
    </div>`,
    `<button class="button-cta" type="button" data-act="go" data-to="practice">Practice my saved phrases ${icon("next", 18)}</button>`);
}

function smallCard(c) {
  return `<button class="small-card" type="button" data-act="go" data-to="convo" data-id="${c.id}">
    ${artTile(c)}
    <span class="small-body">
      <span class="small-title">${esc(c.title)}</span>
      <span class="card-meta">${homeTag(c)}<span>${whenLine(c)}</span></span>
      <span class="small-summary">${learningSummary(c)}</span>
    </span>
    ${icon("chevron", 18)}
  </button>`;
}

// The first line on Home: a warm, factual note about today; a cheer only at milestones.
// The sample conversations all fall in the current week.
function cheerLine() {
  const today = CONVOS.filter(c => c.when.startsWith("Today"));
  const mins = today.reduce((a, c) => a + parseInt(c.length, 10), 0);
  if (learnedCount() >= GOAL) return { html: "Wow, weekly goal reached! 🎉", milestone: true };
  if (CONVOS.length && CONVOS.length % 5 === 0) return { html: `Wow, ${CONVOS.length} conversations this week! 🎉`, milestone: true };
  if (mins >= 60) return { html: `Wow, ${mins} minutes of conversation today! 🎉`, milestone: true };
  if (today.length === 1) return { html: `You talked with ${esc(today[0].partner)} for <strong>${mins} minutes</strong> today.` };
  if (today.length > 1) return { html: `<strong>${today.length} conversations</strong> today, ${mins} minutes in all.` };
  return null;
}

// What the coach says, in order, as you tap it. Lines are trusted markup.
function coachLines(fresh, featured, cheer) {
  const first = cheer ? cheer.html : fresh ? "New phrases from your day."
    : featured ? "Saved phrases, ready when you are." : CONVOS.length ? "All caught up." : "Ready when you are.";
  if (fresh) return [first, esc(`${fresh.summary.split(". ")[0].replace(/\.$/, "")}.`),
    "Tap a bubble to flip it.", ...(canSpeak ? ["Tap the speaker to hear it."] : [])];
  if (featured) return [first, esc(`About 3 minutes with ${featured.partner}, played by AI.`)];
  return [first, "New phrases show up after your next conversation."];
}

SCREENS.home = () => {
  const fresh = CONVOS.find(c => itemsWith(c.id, "new").length);
  const plan = !fresh && pickPlan();
  const featured = fresh || (plan && convoById[plan.cid]);
  const rest = CONVOS.filter(c => c !== featured);
  const cheer = cheerLine();
  const lines = coachLines(fresh, featured, cheer);
  const wave = !UI.waved;

  let main;
  if (!CONVOS.length) {
    main = `<section class="empty-home">
      <h2>Your next conversation is a starting point.</h2>
      <p>After a conversation, you’ll find phrases and fresh ways to express yourself here.</p>
    </section>`;
  } else if (featured) {
    main = fresh ? exploreFeature(fresh) : practiceFeature(featured);
  } else {
    main = `<section class="feature-card calm"><p>You’ve explored everything. New phrases show up after your next conversation.</p></section>`;
  }

  return `
    <header class="home-header">
      <p class="home-date">${esc(TODAY)}</p>
      <span class="listening" title="Background listening is simulated in this prototype"><span class="dot"></span>Listening<span class="sr-only"> (simulated)</span></span>
    </header>

    <div class="greeting">
      <button class="mascot-button ${UI.wiggle ? "wiggle" : ""}" type="button" data-act="tip" aria-label="Ask the coach">${mascot(60, wave, cheer?.milestone ? "cheer" : "happy")}</button>
      <div>
        <h1>Hey ${esc(USER)}!</h1>
        <p class="${UI.wiggle ? "tip-in" : ""} ${cheer && !((UI.tip || 0) % lines.length) ? "cheer-line" : ""}" aria-live="polite">${lines[(UI.tip || 0) % lines.length]}</p>
      </div>
    </div>

    ${main}

    ${rest.length ? `
      <h2 class="home-section">${featured ? "More from your day" : "Your conversations"}</h2>
      <div class="small-list">${rest.map(smallCard).join("")}</div>` : ""}`;
};

// One-shot flags are cleared after each render; swipe and focus are wired here.
afterRender.home = () => {
  UI.waved = true;
  UI.wiggle = false;
  UI.momentAnim = null;
  if (UI.refocus) { document.querySelector(UI.refocus)?.focus({ preventScroll: true }); UI.refocus = null; }
  const stage = document.querySelector(".moment-stage");
  if (!stage) return;
  let x0 = null;
  stage.addEventListener("pointerdown", e => { x0 = e.clientX; });
  stage.addEventListener("pointerup", e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    const k = UI.moments[stage.dataset.cid] || 0;
    const to = dx < 0 ? document.querySelector(".next-pill") : document.querySelector(`.moment-dots [data-to="${k - 1}"]`);
    if (Math.abs(dx) > 45 && to) to.click();
  });
};

ACTIONS.moment = el => {
  const from = UI.moments[el.dataset.id] || 0, to = Math.max(0, Number(el.dataset.to));
  UI.moments[el.dataset.id] = to;
  UI.flip = null;
  UI.momentAnim = to >= from ? "next" : "prev";
  render();
  // Keep keyboard focus on what was pressed; past the last moment, Next is gone, so use the dots.
  const pill = el.classList.contains("next-pill") && document.querySelector(".next-pill");
  (pill || document.querySelector(`.moment-dots [data-to="${Math.min(to, UI.moments[el.dataset.id] - 1)}"]`) || document.querySelector(".moment-dots button"))?.focus({ preventScroll: true });
};
ACTIONS.flip = el => {
  UI.flip = UI.flip === el.dataset.id ? null : el.dataset.id;
  UI.momentAnim = "flip";
  UI.refocus = `[data-act="flip"][data-id="${el.dataset.id}"]`;
  render();
};
ACTIONS.speak = el => {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(el.dataset.text);
  u.lang = "en-US";
  u.rate = 0.95;
  el.classList.add("speaking");
  u.onend = u.onerror = () => el.classList.remove("speaking");
  speechSynthesis.speak(u);
};
ACTIONS.tip = () => {
  UI.tip = (UI.tip || 0) + 1;
  UI.wiggle = true;
  UI.refocus = ".mascot-button";
  render();
};
