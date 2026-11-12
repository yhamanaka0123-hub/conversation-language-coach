# Conversation Language Coach — clickable prototype

**Live preview:** https://conversation-language-coach.vercel.app/
**Prototype v1 (as used in user testing, frozen):** https://conversation-language-coach.vercel.app/v1/ · git tag `v1-prototype`

`v1/` is an archived copy: don't edit it. New work happens in the root files. v1 keeps its own demo progress (`clc-proto-v1` in localStorage) and shares `/api/practice` with the latest version.

The current PRD is v2 (Nov 12, 2026): [`docs/PRD.md`](docs/PRD.md). The v1 prototype was built from [`docs/PRD-v1.md`](docs/PRD-v1.md) (Oct 20, 2026).
Visual design comes from the team's Figma Make prototype; behaviour and sample data
come from the first clickable build. Plain HTML/CSS/JS, no build step:
open `index.html` in a browser (the AI practice partner needs the Vercel deploy; opened
as a local file, Practice uses the fixed script).

**Golden path (v2, per [PRD v2](docs/PRD.md)):** short onboarding (language, level, contexts) →
turn on recording → Home shows the feedback-ready notification and the coffee chat's Top 3 →
*See all feedback* → open a *Why?*, *Save* a point or phrase, play *Your audio* vs *Model* on the
pronunciation point → *Try it in a chat with Maya* → recap → *See your practice report* → Progress:
switch Real conversations / AI practice and This week / month / all time; tap a skill to see examples.
Pause recording from Home; it stays paused until Resume. *Reset demo* restarts onboarding.

## Where things live (who edits what)

| File | What it controls |
|---|---|
| `js/data.js` | Conversations, phrases, suggestions, AI partner scripts. No coding needed beyond keeping the format. |
| `style.css` | All colors, fonts and layout (from the Figma Make design). |
| `js/core.js` | Shared state, helpers, icons, bottom nav, page header. Change with care: every screen uses it. |
| `js/screens/onboard.js` | Onboarding: language, level, contexts, turn on recording |
| `js/screens/home.js` | Home: recording Pause/Resume, feedback-ready notification (can be turned off), tappable coach, latest conversation's Top 3, more from your day |
| `js/screens/conversation.js` | Conversation detail: Top 3 to try next (optional one-line *Why?*, pronunciation audio), then all learning points; Save is separate from practice |
| `js/screens/bank.js` | Vocab bank, with the flashcard review entry on top |
| `js/screens/cards.js` | Flashcard review: situation + meaning on the front, the phrase on the back; Got it / Not yet; familiarity 🌱 new → 🌿 getting there → 🌳 remembered |
| `js/screens/practice.js` | Pick anyone to chat with (character cards drawn from `look` in data.js; saved phrases first, otherwise phrases from that chat, or a free chat), AI practice session, recap (then vs now, compared with your last chat with that person), scripted fallback |
| `api/practice.mjs` | Vercel serverless function that calls the AI model (Groq). Holds the only use of the API key. |
| `prompts/practice.mjs` | The live prompts for the coach suggestion and each practice turn |
| `js/screens/progress.js` | Progress reports: Real conversations vs AI practice, This week / month / all time, skill bars with earlier vs recent examples (sample data) |

Each screen file adds one entry to `SCREENS` and its buttons to `ACTIONS`, so two people
working on different screens don't touch the same file.

## PRD requirement → screen

| PRD requirement | Where it shows up |
|---|---|
| FR-1/2/3 pick up, save, review phrases | Conversation detail + Vocab bank (*Practice this* / *I know this*) |
| FR-4 conversation context | Context tag on each conversation; switch Casual/Professional in the detail view |
| FR-5/6 "You could also say" + save | *You could also say* cards; wording changes with context |
| FR-7/8 practice with AI + light feedback | Practice replay with Maya / Daniel, coach notes after each reply |
| FR-9 cheer on progress (v2: no weekly quotas) | Coach greeting milestones; Progress reports with evidence |
| Progress report (PRD lists "reviewing progress over time" as later; see PRD §12) | *Progress* tab |

## AI practice partner

Practice uses a real model through `api/practice.mjs`:

- **What to practice** is chosen by a rule (the conversation with the most saved phrases,
  up to 3 of them). The AI only words the suggestion and writes the partner's first line.
- **Each turn** is one model call that returns the partner's next line, a short coach note,
  and which saved phrases the learner used. A session is at most 5 learner replies.
- **Model:** Groq free tier. The function asks Groq which models exist and uses the first
  available of `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `llama-3.1-8b-instant`, trying a
  second model if the first call fails. Set `GROQ_MODEL` in Vercel to put another model first.
  Failures are logged in Vercel → the deployment → Logs.
- **Key:** `GROQ_API_KEY` in Vercel → Settings → Environment Variables. Never put it in the
  code, GitHub, or chat.
- **Fallback:** if the key is missing, the free-tier limit is reached, or the call fails,
  the page says so and continues with the fixed script and keyword-match feedback.
  The badge on the Practice screen shows which mode is on.
- **Data:** free tiers may use requests to improve their service. Use only sample or
  invented conversations, never a real person's conversation.
- **Mic:** real speech-to-text where the browser supports it (Chrome, Edge, Safari);
  otherwise it types a sample answer.

To run the AI locally: `npx vercel dev` with `GROQ_API_KEY` in `.env.local` (git-ignored).

## Simulated (not real)

Background recording and its Pause/Resume state, transcription and speaker ID; phrase
detection, the Top 3 and other suggestions (hand-written in `js/data.js`); the feedback-ready
notification; "Your audio" on pronunciation points (a synthetic voice, nothing is recorded);
skill levels, their examples and earlier weeks in Progress (`SKILLS`, `EARLIER`); the AI
partner whenever it falls back to the script. Progress is kept in the browser's localStorage; *Reset demo*
clears it
