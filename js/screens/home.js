// Home: weekly progress and the list of captured conversations.

SCREENS.home = () => {
  const n = learnedCount();
  const left = GOAL - n;
  return `
    ${pageHeader({
      eyebrow: TODAY,
      title: `Hi ${USER}, two conversations are ready`,
      action: `<span class="listening"><span class="dot"></span>Listening</span>`
    })}

    <section class="progress-card">
      <div class="progress-copy">
        <div class="progress-number">${n}</div>
        <div>
          <p class="progress-title">new ${n === 1 ? "term" : "terms"} this week</p>
          <p class="subtle">Every one came from your own conversations.</p>
        </div>
      </div>
      <div class="progress-track" aria-label="${n} of ${GOAL} weekly terms">
        <div class="progress-fill" style="width:${Math.min(100, n / GOAL * 100)}%"></div>
      </div>
      <div class="progress-foot">
        <p class="progress-caption">${left > 0 ? `Just ${left} more to reach your weekly goal of ${GOAL}` : "Weekly goal reached. Nice rhythm."}</p>
        <button class="see-all" type="button" data-act="go" data-to="report">See report</button>
      </div>
    </section>

    <div class="section-heading">
      <div><p class="eyebrow">YOUR DAY</p><h2>Recent conversations</h2></div>
      <span class="count-badge">${CONVOS.length}</span>
    </div>

    ${CONVOS.map(c => {
      const items = itemsIn(c.id);
      const phrases = items.filter(i => i.kind === "phrase").length;
      const recs = items.filter(i => i.kind === "rephrase").length;
      const open = items.filter(i => statusOf(i.id) === "new").length;
      return `
      <button class="conversation-card" type="button" data-act="go" data-to="convo" data-id="${c.id}">
        <div class="conversation-top">
          ${avatar(c)}
          <div class="conversation-title">
            <h3>${esc(c.title)}</h3>
            <span class="time">${icon("clock", 15)} ${c.when} · ${c.length}</span>
          </div>
          ${icon("chevron", 18)}
        </div>
        <div class="card-divider"></div>
        <div class="conversation-meta">
          ${tag(ctxOf(c.id))}
          <span>${phrases} new phrases · ${recs} suggestions${open ? ` · <strong>${open} to review</strong>` : " · reviewed"}</span>
        </div>
      </button>`;
    }).join("")}

    <div class="coach-note">
      <div class="coach-icon">${icon("spark", 17)}</div>
      <p><strong>A little goes a long way.</strong><br>Reviewing one conversation today keeps your momentum going.</p>
    </div>`;
};
