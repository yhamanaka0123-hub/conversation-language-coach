// Home: a coach greeting, one featured conversation, the rest of the day, and a weekly nudge.
// Featured: the latest conversation with unexplored items; else saved items waiting for
// practice; else a calm "all caught up" card.

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

function featureCard(c, { label, chips, cta }) {
  return `<section class="feature-card" aria-labelledby="feature-title">
    <div class="feature-top">
      ${artTile(c)}
      <div class="feature-heading">
        <h2 id="feature-title">${esc(c.title)}</h2>
        <p class="card-meta">${homeTag(c)}<span>${whenLine(c)}</span></p>
      </div>
    </div>
    <div class="feature-preview">
      <p class="feature-label">${label}</p>
      ${chips}
    </div>
    ${cta}
  </section>`;
}

// State A: something new to explore in this conversation.
function exploreFeature(c) {
  const heard = itemsWith(c.id, "new").filter(i => i.kind === "phrase").slice(0, 2);
  const speakers = [...new Set(heard.map(i => i.speaker))];
  return featureCard(c, {
    label: !heard.length ? "Phrases and fresh ways to say things" : speakers.length === 1 ? `${esc(speakers[0])} said` : "You heard",
    chips: heard.length ? quoteChips(heard.map(i => ({ text: i.text, note: speakers.length > 1 ? i.speaker : "" }))) : "",
    cta: `<button class="button-cta" type="button" data-act="go" data-to="convo" data-id="${c.id}">
      ${c.short ? `Explore my ${esc(c.short)}` : "Explore conversation"} ${icon("next", 18)}</button>`
  });
}

// State B: everything explored, but saved items are waiting for practice.
function practiceFeature(c) {
  const saved = itemsWith(c.id, "practice");
  const shown = saved.slice(0, 2);
  const more = saved.length - shown.length;
  return featureCard(c, {
    label: "Saved",
    chips: quoteChips(shown.map(i => ({ text: practiceText(i) }))).replace("</ul>", more ? `<li class="more-chip">+${more} more</li></ul>` : "</ul>"),
    cta: `<button class="button-cta" type="button" data-act="go" data-to="practice">Practice my saved phrases ${icon("next", 18)}</button>`
  });
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

function weekCard(n) {
  const filled = Math.min(n, GOAL);
  return `<section class="week-card">
    <div class="week-top">
      <div>
        <h2>Little by little</h2>
        <p class="week-count">${n >= GOAL ? `Weekly goal reached · <strong>${n}</strong> of ${GOAL} practiced` : `<strong>${n}</strong> of ${GOAL} phrases practiced this week`}</p>
      </div>
      <button class="text-link" type="button" data-act="go" data-to="report">See progress</button>
    </div>
    <div class="week-dots" role="img" aria-label="${filled} of ${GOAL} practiced">
      ${Array.from({ length: GOAL }, (_, k) => `<span class="${k < filled ? "on" : ""}"></span>`).join("")}
    </div>
  </section>`;
}

SCREENS.home = () => {
  const fresh = CONVOS.find(c => itemsWith(c.id, "new").length);
  const plan = !fresh && pickPlan();
  const featured = fresh || (plan && convoById[plan.cid]);
  const rest = CONVOS.filter(c => c !== featured);
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
      ${mascot(60, wave)}
      <div>
        <h1>Hey ${esc(USER)}!</h1>
        <p>${fresh ? "New phrases from your day."
          : featured ? "Saved phrases, ready when you are."
          : CONVOS.length ? "All caught up." : "Ready when you are."}</p>
      </div>
    </div>

    ${main}

    ${rest.length ? `
      <h2 class="home-section">${featured ? "More from your day" : "Your conversations"}</h2>
      <div class="small-list">${rest.map(smallCard).join("")}</div>` : ""}

    ${weekCard(learnedCount())}`;
};

// Animate the weekly dots only when the practiced count went up since Home was last shown.
afterRender.home = () => {
  const n = learnedCount();
  if (UI.homeSeen != null && n > UI.homeSeen) {
    document.querySelectorAll(".week-dots span.on").forEach((d, k) => { if (k >= UI.homeSeen) d.classList.add("pop"); });
  }
  UI.homeSeen = n;
  UI.waved = true;
};
