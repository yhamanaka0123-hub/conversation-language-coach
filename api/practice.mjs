// Vercel serverless function: the only place the Groq API key is used.
//   GET  /api/practice                  -> { configured, ok, model }   (is the AI partner available?)
//   POST /api/practice {mode:"suggest"} -> { message, opener }
//   POST /api/practice {mode:"turn"}    -> { used, feedback, reply, done }
// The key comes from the GROQ_API_KEY environment variable set in Vercel. It never reaches
// the browser. If anything fails, the page falls back to the scripted practice.

import { SUGGEST_PROMPT, TURN_PROMPT } from "../prompts/practice.mjs";

const GROQ_URL = "https://api.groq.com/openai/v1";
// Groq retires models from time to time (llama-3.3-70b-versatile went in Aug 2026), so the
// function asks Groq which models exist and uses the first one from this list that does.
// GROQ_MODEL in Vercel overrides the order.
const PREFERRED = [process.env.GROQ_MODEL, "openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.1-8b-instant"].filter(Boolean);
const NOT_CHAT = /whisper|tts|guard|orpheus|playai|compound|embed/i;

const cut = (v, n) => String(v ?? "").slice(0, n);
const fill = (template, vars) => template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || "{}");
}

// Only the fields the prompts need, with length caps so the endpoint can't be used
// to send arbitrary large prompts.
function cleanConvo(c = {}) {
  return {
    title: cut(c.title, 80), partner: cut(c.partner, 30), partnerNote: cut(c.partnerNote, 80),
    people: cut(c.people, 80), place: cut(c.place, 60), scene: cut(c.scene, 160), summary: cut(c.summary, 500)
  };
}
function cleanTargets(list) {
  return (Array.isArray(list) ? list : []).slice(0, 5).map(t => ({
    id: cut(t.id, 20), phrase: cut(t.phrase, 80), meaning: cut(t.meaning, 120), original: cut(t.original, 160)
  }));
}
const targetLines = ts => ts.map(t => `- ${t.id}: "${t.phrase}" (${t.meaning}). From the real conversation: ${t.original}`).join("\n");
const context = c => (c === "professional" ? "professional" : "casual");

const auth = () => ({ Authorization: `Bearer ${process.env.GROQ_API_KEY}` });

// Cached for the life of a warm function instance.
let modelsCache = null;
async function chatModels() {
  if (modelsCache) return modelsCache;
  const r = await fetch(`${GROQ_URL}/models`, { headers: auth(), signal: AbortSignal.timeout(5000) });
  if (!r.ok) throw Object.assign(new Error(`models ${r.status}`), { status: r.status });
  const ids = ((await r.json()).data || []).map(m => m.id).filter(id => !NOT_CHAT.test(id));
  const ordered = [...PREFERRED.filter(id => ids.includes(id)), ...ids.filter(id => !PREFERRED.includes(id))];
  modelsCache = ordered.length ? ordered : PREFERRED;
  return modelsCache;
}

// Models may wrap the JSON in text or code fences; take the outermost {...}.
function parseJson(text) {
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a < 0 || b <= a) throw new Error("no json in reply");
  return JSON.parse(text.slice(a, b + 1));
}

async function callModel(model, prompt, plain = false) {
  const reasoning = model.startsWith("openai/gpt-oss") && !plain;
  const r = await fetch(`${GROQ_URL}/chat/completions`, {
    method: "POST",
    headers: { ...auth(), "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      // Reasoning models spend tokens thinking before they answer, so give them room.
      max_completion_tokens: model.startsWith("openai/gpt-oss") ? 1500 : 400,
      ...(reasoning ? { reasoning_effort: "low" } : {})
    }),
    signal: AbortSignal.timeout(20000)
  });
  if (!r.ok) {
    const detail = cut(await r.text(), 300);
    throw Object.assign(new Error(`groq ${r.status} ${model}: ${detail}`), { status: r.status });
  }
  const data = await r.json();
  return parseJson(data.choices?.[0]?.message?.content || "");
}

// Try up to two models; a rate limit (429) stops at once, since the next model shares the quota.
async function groq(prompt) {
  const models = (await chatModels()).slice(0, 2);
  let last;
  for (const model of models) {
    try { return await callModel(model, prompt); }
    catch (e) {
      last = e;
      console.error(e.message);
      if (e.status === 429) break;
      // If Groq rejects the reasoning setting, retry the same model without it.
      if (e.status === 400 && model.startsWith("openai/gpt-oss")) {
        try { return await callModel(model, prompt, true); } catch (e2) { last = e2; console.error(e2.message); }
      }
    }
  }
  throw last;
}

async function suggest(body) {
  const convo = cleanConvo(body.convo);
  const targets = cleanTargets(body.targets);
  const out = await groq(fill(SUGGEST_PROMPT, {
    ...convo, user: cut(body.user, 30), context: context(body.context), targets: targetLines(targets)
  }));
  if (!out.message || !out.opener) throw new Error("bad suggestion");
  return { message: cut(out.message, 300), opener: cut(out.opener, 220) };
}

async function turn(body) {
  const convo = cleanConvo(body.convo);
  const targets = cleanTargets(body.targets);
  const ids = targets.map(t => t.id);
  const history = (Array.isArray(body.history) ? body.history : []).slice(-12)
    .map(m => `${m.role === "user" ? "Learner" : convo.partner}: ${cut(m.text, 400)}`).join("\n");
  const turnsLeft = Math.max(0, Math.min(10, Number(body.turnsLeft) || 0));
  const out = await groq(fill(TURN_PROMPT, {
    ...convo, context: context(body.context), targets: targetLines(targets),
    used: (Array.isArray(body.used) ? body.used : []).filter(id => ids.includes(id)).join(", ") || "none",
    turnsLeft: String(turnsLeft), history, reply: cut(body.reply, 400)
  }));
  if (!out.reply) throw new Error("bad turn");
  return {
    used: (Array.isArray(out.used) ? out.used : []).filter(id => ids.includes(id)),
    feedback: cut(out.feedback, 240),
    reply: cut(out.reply, 300),
    done: turnsLeft === 0 || out.done === true
  };
}

export default async function handler(req, res) {
  const configured = Boolean(process.env.GROQ_API_KEY);
  try {
    if (req.method === "GET") {
      if (!configured) return send(res, 200, { configured, ok: false });
      const models = await chatModels();
      return send(res, 200, { configured, ok: models.length > 0, model: models[0] });
    }
    if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
    if (!configured) return send(res, 503, { error: "not_configured" });
    const body = await readBody(req);
    if (body.mode === "suggest") return send(res, 200, await suggest(body));
    if (body.mode === "turn") return send(res, 200, await turn(body));
    return send(res, 400, { error: "unknown_mode" });
  } catch (e) {
    // 429 = Groq free-tier limit reached; the page shows the scripted practice instead.
    // The reason is logged in Vercel → Deployments → Logs (never includes the key).
    console.error("practice api failed:", e.message);
    if (req.method === "GET") return send(res, 200, { configured, ok: false });
    return send(res, e.status === 429 ? 429 : 502, { error: e.status === 429 ? "rate_limited" : "ai_unavailable" });
  }
}
