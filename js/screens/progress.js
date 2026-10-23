// Progress report: this week's numbers, terms per week, where terms came from.

SCREENS.report = () => {
  const learned = learnedItems();
  const n = learned.length;
  const weeks = [...HISTORY, { wk: "Oct 19", n, now: true }];
  const max = Math.max(GOAL, ...weeks.map(w => w.n)) + 1;
  const last = HISTORY[HISTORY.length - 1].n;
  const change = last ? Math.round((n - last) / last * 100) : 0;
  const casual = learned.filter(i => ctxOfItem(i) === "casual").length;
  const pro = n - casual;
  const lead = casual > pro ? "Casual" : "Professional";
  const total = weeks.reduce((a, w) => a + w.n, 0);
  return `
    ${pageHeader({ eyebrow: "YOUR WEEK IN WORDS", title: n >= GOAL ? "You’re finding your flow" : "A steady week so far" })}
    ${coachSays(n >= GOAL ? "Weekly goal reached. <strong>Nice rhythm.</strong>"
      : n ? `<strong>${GOAL - n} more</strong> to reach this week’s goal of ${GOAL}. A little practice goes a long way.`
      : "Your first practice this week is one conversation away.", n >= GOAL ? "cheer" : "happy")}

    <section class="report-hero">
      <div class="report-hero-top">
        <div><p class="eyebrow">OCT 19–25</p><h2>Weekly report</h2></div>
        <div class="trend-badge">${icon("trend", 15)} ${change >= 0 ? "+" : ""}${change}% vs last week</div>
      </div>
      <div class="report-stats">
        <div><strong>${n}</strong><span>phrases practiced</span></div>
        <div><strong>${CONVOS.length}</strong><span>conversations</span></div>
        <div><strong>${S.sessions || 0}</strong><span>practice sessions</span></div>
      </div>
    </section>

    <section class="activity-card">
      <div class="activity-heading">
        <div><p class="eyebrow">LAST 6 WEEKS · ${total} PHRASES</p><h2>Phrases practiced per week</h2></div>
        <span>Goal ${GOAL}</span>
      </div>
      <div class="chart" role="img" aria-label="Phrases practiced per week: ${weeks.map(w => `${w.wk} ${w.n}`).join(", ")}">
        <div class="goal-line" style="bottom:calc(${GOAL / max} * (100% - 22px) + 22px)"><span>goal</span></div>
        ${weeks.map(w => `
          <div class="chart-column ${w.now ? "now" : ""}">
            <div class="chart-track"><div class="chart-bar" style="height:${w.n / max * 100}%"><b>${w.n}</b></div></div>
            <span>${w.now ? "This wk" : w.wk}</span>
          </div>`).join("")}
      </div>
      <p class="footnote">Earlier weeks are sample history.</p>
    </section>

    <section class="insight-card">
      ${mascot(52, false, n ? "cheer" : "happy")}
      <div>
        <p class="eyebrow">COACH’S NOTE</p>
        <h3>${n ? `${lead} phrases are clicking` : "Your first phrases are on the way"}</h3>
        <div class="split" aria-hidden="true">${n ? `<span class="split-casual" style="width:${casual / n * 100}%"></span><span class="split-pro" style="width:${pro / n * 100}%"></span>` : ""}</div>
        <p>${casual} from casual chats, ${pro} from professional ones this week.</p>
      </div>
    </section>

    <div class="section-heading progress-phrases-heading">
      <div><p class="eyebrow">USED IN PRACTICE</p><h2>Practiced this week</h2></div>
      <button class="see-all" type="button" data-act="go" data-to="bank" data-filter="learned">See all</button>
    </div>
    <div class="recent-phrases">
      ${learned.map(i => `
        <div class="recent-phrase">
          <span>${icon("check", 15)}</span>
          <p>${esc(bare(practiceText(i)))}</p>
          <small>${esc(i.convo ? convoById[i.convo].title : i.source)}</small>
        </div>`).join("")}
    </div>`;
};
