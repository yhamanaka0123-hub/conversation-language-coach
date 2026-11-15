// Phone demo (PRD §6.1, §6.11): how the product reaches the learner outside the app.
// Lock screen: the recording prompt arrives as a notification, and an active recording shows as
// a live countdown where the learner can add a minute or stop. Control Center: a one-tap button
// to start or stop a manual recording. Both are simulated drawings of the phone; nothing is
// recorded, and whether a platform lets an app do this is TBD (§12). They share the recording
// state with Home, so a recording started here shows up in the app too.

const PHONE_TIME = "3:38";
const phoneTab = () => UI.phoneTab || "lock";

function lockPrompt() {
  if (!S.prompts || UI.promptOff || (S.captures || 0) >= perDay())
    return `<p class="lock-quiet">No recording prompt right now.${S.prompts ? "" : " Prompts are off in Settings."}</p>`;
  return `<div class="lock-note">
    <div class="lock-app">${mascot(22)}<strong>Coach</strong><small>now</small></div>
    <p>About to chat? Record ${S.duration} min for feedback.</p>
    <small class="lock-sub">Nothing is recorded until you tap Record.</small>
    <div class="lock-actions">
      <button type="button" data-act="recPrompt">${icon("mic", 15)} Record ${S.duration} min</button>
      <button type="button" data-act="promptLater">Not now</button>
    </div>
  </div>`;
}

// The live countdown on the lock screen (REC-03, REC-08). No conversation text (NTF-05).
function liveActivity() {
  const r = UI.rec, sec = Math.floor((Date.now() - r.start) / 1000);
  return `<div class="lock-live" role="status">
    <div class="lock-app">${mascot(22, false, "talk")}<strong>Recording</strong><span class="dot"></span></div>
    <p class="lock-time" id="rec-time">${r.limit ? `${clock(sec)} / ${clock(r.limit)}` : clock(sec)}</p>
    <small class="lock-sub">${r.limit ? "Stops on its own" : "Runs until you stop it"}</small>
    <div class="lock-actions">
      ${r.limit ? `<button type="button" data-act="recExtend">${icon("clock", 15)} +1 min</button>` : ""}
      <button type="button" class="lock-stop" data-act="recStop">${icon("stop", 13)} Stop</button>
    </div>
  </div>`;
}

function lockScreen() {
  const fresh = CONVOS.find(c => !S.seen[c.id] && topOf(c.id).length);
  return `<div class="phone-screen lock">
    <p class="lock-clock">${PHONE_TIME}</p>
    <p class="lock-date">${esc(TODAY)}</p>
    <div class="lock-stack">
      ${UI.rec ? liveActivity() : lockPrompt()}
      ${S.notify && fresh && !UI.rec ? `<button class="lock-note lock-fb" type="button" data-act="openfb" data-id="${fresh.id}">
        <span class="lock-app">${mascot(22)}<strong>Coach</strong><small>2m ago</small></span>
        <p>Your latest conversation has ${plural(topOf(fresh.id).length, "point")} to review.</p></button>` : ""}
    </div>
  </div>`;
}

// Control Center: the other tiles are only there to make it recognizable.
function controlCenter() {
  const r = UI.rec, sec = r ? Math.floor((Date.now() - r.start) / 1000) : 0;
  const tile = glyph => `<span class="cc-tile" aria-hidden="true">${glyph}</span>`;
  return `<div class="phone-screen cc">
    <div class="cc-grid">
      <span class="cc-block" aria-hidden="true">${tile("✈︎")}${tile("📶")}${tile("ᯤ")}${tile("ᛒ")}</span>
      <span class="cc-block cc-media" aria-hidden="true"><small>Not playing</small></span>
      ${tile("🔦")}${tile("⏱")}${tile("🧮")}${tile("📷")}
      <button type="button" class="cc-coach ${r ? "on" : ""}" data-act="ccRecord" aria-pressed="${!!r}">
        ${icon(r ? "stop" : "mic", 24)}
        <span>${r ? `Recording <b id="rec-time">${r.limit ? `${clock(sec)} / ${clock(r.limit)}` : clock(sec)}</b>` : "Coach · Record"}</span>
      </button>
    </div>
    <p class="cc-hint">${r ? "Tap again to stop." : "One tap starts a recording that runs until you stop it."}</p>
  </div>`;
}

SCREENS.phone = () => `
  ${pageHeader({ eyebrow: "OUTSIDE THE APP", title: "Lock screen and Control Center", back: "home" })}
  <div class="tabs report-tabs" role="group" aria-label="Phone screen">
    ${[["lock", "Lock screen"], ["cc", "Control Center"]].map(([k, l]) => `<button type="button" class="${phoneTab() === k ? "active" : ""}" aria-pressed="${phoneTab() === k}" data-act="phoneTab" data-v="${k}">${l}</button>`).join("")}
  </div>
  ${phoneTab() === "lock" ? lockScreen() : controlCenter()}
  ${UI.captured && !UI.rec ? `<p class="phone-done">${icon("check", 15)} ${UI.captured.usable ? `Captured ${clock(UI.captured.sec)}. Feedback will appear on Home.` : "Too short to analyze, so it wasn't kept."}</p>` : ""}
  <p class="footnote">Simulated: nothing is recorded. Whether an app can add a lock-screen countdown or a Control Center button differs by platform and is still to check.</p>`;

ACTIONS.phoneTab = el => { UI.phoneTab = el.dataset.v; render(); };
ACTIONS.ccRecord = () => { if (UI.rec) stopRec(); else startRec("manual"); };
