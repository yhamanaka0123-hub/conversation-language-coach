// Celebration: shown once, when the week first reaches the goal.

SCREENS.celebrate = () => {
  const learned = learnedItems();
  return `
    <canvas id="confetti" aria-hidden="true"></canvas>
    <div class="celebration-art" aria-hidden="true">
      <span class="ray ray-one"></span><span class="ray ray-two"></span><span class="ray ray-three"></span>
      <div class="celebration-icon">${icon("spark", 31)}</div>
    </div>
    <p class="eyebrow">A WEEK OF REAL PROGRESS</p>
    <h1>You learned ${learned.length} new terms this week!</h1>
    <p class="celebration-copy">Each one came from a real moment in your life. That makes them easier to remember, and truly yours.</p>
    <div class="learned-list">
      ${learned.map((i, k) => `
        <div class="learned-item"><span>${k + 1}</span><p>${esc(bare(practiceText(i)))}</p>${icon("check", 18)}</div>`).join("")}
    </div>
    <div class="celebration-footer">
      <button class="button button-primary full-button" type="button" data-act="recap">See this session ${icon("next", 18)}</button>
      <p>Small conversations. Lasting confidence.</p>
    </div>`;
};

afterRender.celebrate = () => {
  const cv = document.getElementById("confetti");
  if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = cv.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = cv.width = cv.offsetWidth * dpr, h = cv.height = cv.offsetHeight * dpr;
  const colors = ["#eaa28e", "#315f50", "#86a696", "#d3e2d7"];
  const bits = Array.from({ length: 70 }, () => ({
    x: Math.random() * w, y: -Math.random() * h * .4, r: (3 + Math.random() * 3) * dpr,
    vy: (1.2 + Math.random() * 2) * dpr, vx: (Math.random() - .5) * dpr, a: Math.random() * 6,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, w, h);
    bits.forEach(b => {
      b.y += b.vy; b.x += b.vx; b.a += .08;
      ctx.fillStyle = b.c; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a);
      ctx.fillRect(-b.r, -b.r / 2, b.r * 2, b.r); ctx.restore();
    });
    if (++frames < 200 && document.getElementById("confetti") === cv) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, w, h);
  })();
};

ACTIONS.recap = () => go({ name: "recap", r: UI.route.r });
