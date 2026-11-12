// Progress (PRD v2 §6.6, §6.8): reports kept inside this tab. Real conversations and AI
// practice are separate (RPT-02, SKL-05); This Week by default, This Month and All Time too.
// Skill bars open to show the evidence: an earlier and a recent line in the learner's words.
// Scores and earlier weeks are sample data (SKILLS, EARLIER in data.js); nothing is scored yet.

const usesOf = id => USES.filter(u => u.item === id);
const PERIODS = { week: "This week", month: "This month", all: "All time" };

// ---------- The mascot with a prop, for stat tiles and badges ----------
// The mascot sits in an 80 x 70 scene; each prop sits around it and says what the tile means.
const PROPS = {
  waves: `<path d="M71 24q4 6 0 12M75 19q7 11 0 22" fill="none" stroke="#f08a5d" stroke-width="2.6" stroke-linecap="round"/>`,
  mic: `<g transform="rotate(-18 66 40)"><rect x="61" y="25" width="10" height="17" rx="5" fill="#5b3ec4"/>
    <path d="M62.5 30.5h7M62.5 34.5h7" stroke="#b39cf0" stroke-width="1.6"/><path d="M66 42v10" stroke="#2d2440" stroke-width="3" stroke-linecap="round"/></g>`,
  chat: `<path d="M64 6h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6l-4 3v-3h-2a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z" fill="#fff" stroke="#f08a5d" stroke-width="2"/>
    <circle cx="66.5" cy="12" r="1.2" fill="#f08a5d"/><circle cx="70" cy="12" r="1.2" fill="#f08a5d"/><circle cx="73.5" cy="12" r="1.2" fill="#f08a5d"/>`
};
const mascotScene = (prop, mood, size = 72) =>
  `<svg class="scene" width="${size}" height="${Math.round(size * 70 / 80)}" viewBox="0 0 80 70" aria-hidden="true">
    <g transform="translate(${prop === "trophy" ? "12 18" : "10 15"})">${mascot(58, false, mood)}</g>${PROPS[prop]}
  </svg>`;

const statTile = (scene, value, label, cls) =>
  `<div class="stat ${cls}">${mascotScene(scene, scene === "waves" ? "talk" : "happy", 56)}<strong>${value}</strong><small>${label}</small></div>`;

// A full bar = shown consistently in observed conversations, not mastery of the language.
const levelWord = n => n < 35 ? "Starting out" : n < 55 ? "Getting there" : n < 75 ? "Often" : "Consistently";

function skillRow(k, p) {
  const n = k.level[p], ev = k.evidence[p];
  return `<details class="skill">
    <summary>
      <span class="skill-top"><span class="skill-name">${esc(k.name)}</span><span class="skill-level">${levelWord(n)}</span></span>
      <span class="skill-bar" role="img" aria-label="${esc(k.name)}: ${levelWord(n)}"><span style="width:${n}%"></span></span>
      <small>Based on ${plural(ev, "example")} · <u>See examples</u></small>
    </summary>
    <div class="skill-evidence">
      <div class="ev ev-then"><span>${esc(k.earlier.when)}</span><p>“${esc(k.earlier.text)}”</p></div>
      <div class="ev ev-now"><span>${esc(k.recent.when)}</span><p>“${esc(k.recent.text)}”</p></div>
    </div>
  </details>`;
}

function realReport(p) {
  const extra = p === "week" ? { conversations: 0, minutes: 0 } : EARLIER[p];
  const minutes = CONVOS.reduce((a, c) => a + (c.mine || 0), 0) + extra.minutes;
  return `
    <div class="stat-row">
      ${statTile("waves", `${minutes} min`, "you spoke", "stat-spoke")}
      ${statTile("chat", CONVOS.length + extra.conversations, "conversations", "stat-practiced")}
    </div>
    <div class="section-heading compact"><div><p class="eyebrow">YOUR OWN SPEECH ONLY</p><h2>Skill clusters</h2></div></div>
    <p class="section-intro">A full bar means you show the skill consistently in your conversations, not that you’ve mastered the language. Tap a skill to see your examples.</p>
    <div class="skill-list">${SKILLS.map(k => skillRow(k, p)).join("")}</div>
    <div class="section-heading compact"><div><p class="eyebrow">TRANSFER</p><h2>Used in real conversations</h2></div></div>
    <div class="used-list">${USES.map(u => `<div class="used-row"><span>⭐</span><p><strong>“${esc(bare(practiceText(byId[u.item])))}”</strong><small>${esc(convoById[u.convo].title)} · “${esc(u.said)}”</small></p></div>`).join("")}</div>`;
}

function aiReport(p) {
  const extra = p === "week" ? { sessions: 0, practiced: 0 } : EARLIER[p];
  const sessions = (S.sessions || 0) + extra.sessions;
  const chats = CONVOS.filter(c => (S.history || {})[c.id]?.length);
  const practiced = learnedItems();
  return `
    <div class="stat-row">
      ${statTile("mic", sessions, plural(sessions, "practice chat").replace(/^\d+ /, ""), "stat-practiced")}
      ${statTile("chat", practiced.length + extra.practiced, "phrases used in practice", "stat-spoke")}
    </div>
    <p class="section-intro sep-note">${icon("spark", 14)} Practice results stay separate from your real-conversation progress.</p>
    <div class="section-heading compact"><div><p class="eyebrow">LATEST CHAT WITH EACH PERSON</p><h2>Your practice chats</h2></div></div>
    ${chats.length ? `<div class="stack">${chats.map(c => {
      const h = S.history[c.id], last = h[h.length - 1], prev = h[h.length - 2];
      return `<div class="chat-row"><span class="chat-face face-${ctxOf(c.id)}">${person(c, 34)}</span>
        <p><strong>${esc(c.partner)}</strong><small>${last.targets ? `${last.used} of ${plural(last.targets, "phrase")} used` : "Free chat"}${prev && prev.targets ? ` · ${prev.used} last time` : ""}</small></p></div>`;
    }).join("")}</div>`
    : `<div class="empty">${mascot(56, false, "think")}<p>No practice chats ${p === "week" ? "this week" : "yet"}. Practice is optional, whenever you like.</p>
        <button class="button button-secondary" type="button" data-act="go" data-to="practice">Open Practice</button></div>`}
    ${practiced.length ? `<div class="section-heading compact"><div><p class="eyebrow">PRACTICED</p><h2>Phrases you used in practice</h2></div></div>
      <div class="hint-row">${practiced.map(i => `<span class="hint-chip">${icon("check", 13)} ${esc(bare(practiceText(i)))}</span>`).join("")}</div>` : ""}`;
}

SCREENS.report = () => {
  const view = UI.report || "real", p = UI.period || "week";
  return `
    ${pageHeader({ eyebrow: "PROGRESS", title: "How you’re doing" })}
    <div class="tabs report-tabs" role="group" aria-label="Report">
      ${[["real", "Real conversations"], ["ai", "AI practice"]].map(([k, l]) => `<button type="button" class="${view === k ? "active" : ""}" aria-pressed="${view === k}" data-act="reportView" data-v="${k}">${l}</button>`).join("")}
    </div>
    <div class="period-chips" role="group" aria-label="Time period">
      ${Object.entries(PERIODS).map(([k, l]) => `<button type="button" class="${p === k ? "on" : ""}" aria-pressed="${p === k}" data-act="period" data-v="${k}">${l}</button>`).join("")}
    </div>
    ${view === "real" ? realReport(p) : aiReport(p)}
    <p class="footnote">Sample data: skill levels, examples and earlier weeks are simulated in this prototype.</p>`;
};

ACTIONS.reportView = el => { UI.report = el.dataset.v; render(); };
ACTIONS.period = el => { UI.period = el.dataset.v; render(); };
