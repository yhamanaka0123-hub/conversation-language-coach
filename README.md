# Conversation Language Coach — clickable prototype

**Live preview:** https://conversation-language-coach.vercel.app/
**Prototype v1 (as used in user testing, frozen):** https://conversation-language-coach.vercel.app/v1/ · git tag `v1-prototype`

`v1/` is an archived copy: don't edit it. New work happens in the root files. v1 keeps its own demo progress (`clc-proto-v1` in localStorage) and shares `/api/practice` with the latest version.

The current PRD is v2.3 (Nov 12, 2026): [`docs/PRD.md`](docs/PRD.md). The v1 prototype was built from [`docs/PRD-v1.md`](docs/PRD-v1.md) (Oct 20, 2026).
Visual design comes from the team's Figma Make prototype; behaviour and sample data
come from the first clickable build. Plain HTML/CSS/JS, no build step:
open `index.html` in a browser (the AI practice partner needs the Vercel deploy; opened
as a local file, Practice uses the fixed script).

**Golden path (per [PRD v2.3](docs/PRD.md)):** onboarding (language and what it supports, level,
how often and where you speak it, recording prompts or AI-only, optional calendar) → Home: accept
the recording prompt (2–3 min, stop early) or tap *Record* (runs until you stop) → *See all
feedback* (context → you said → try, model pronunciation) → *Save* → Learn: This week's picks,
Expressions / Pronunciation / Speaking Tips, suggested vs saved, delete an item → *Try it in a chat
with Maya* → recap → Insights: Real conversations / AI practice, This week / month / all time.
The gear on Home opens Settings (prompts, prompted length, notifications, calendar). Prompts stop
after 2 captures a day; Record always works. Choosing AI-only in onboarding shows the empty states.
*Reset demo* restarts onboarding.

## Where things live (who edits what)

| File | What it controls |
|---|---|
| `js/data.js` | Conversations, phrases, suggestions, AI partner scripts. No coding needed beyond keeping the format. |
| `style.css` | All colors, fonts and layout (from the Figma Make design). |
| `js/core.js` | Shared state, helpers, icons, bottom nav, page header. Change with care: every screen uses it. |
| `js/screens/onboard.js` | Onboarding: language with its (sample) capabilities, level, frequency, contexts, recording prompts or AI-only, optional calendar |
| `js/screens/home.js` | Home: quick record, recording prompt (stops after 2 captures a day), live recording bar, Settings, feedback-ready notification, tappable coach, latest conversation's Top 3, more from your day; AI-only empty state |
| `js/screens/conversation.js` | Conversation detail: Top 3 to try next (context → you said → try; pronunciation cue and model audio), then all learning points; Save is separate from practice; deletion note |
| `js/screens/bank.js` | Learn: This week's picks, Expressions / Pronunciation / Speaking Tips (each its own format), suggested vs saved, delete an item, optional flashcard review |
| `js/screens/cards.js` | Flashcard review: situation + meaning on the front, the phrase on the back; Got it / Not yet; familiarity 🌱 new → 🌿 getting there → 🌳 remembered |
| `js/screens/practice.js` | Pick anyone to chat with (character cards drawn from `look` in data.js; saved phrases first, otherwise phrases from that chat, or a free chat), AI practice session, recap (then vs now, compared with your last chat with that person), scripted fallback |
| `api/practice.mjs` | Vercel serverless function that calls the AI model (Groq). Holds the only use of the API key. |
| `prompts/practice.mjs` | The live prompts for the coach suggestion and each practice turn |
| `js/screens/progress.js` | Insights: Real conversations vs AI practice, This week / month / all time, skill bars with earlier vs recent examples (sample data); AI-only empty state |

Each screen file adds one entry to `SCREENS` and its buttons to `ACTIONS`, so two people
working on different screens don't touch the same file.

## PRD requirement → screen

| PRD requirement | Where it shows up |
|---|---|
| FR-1/2/3 pick up, save, review phrases | Conversation detail + Learn (*Save* / *I know this*) |
| FR-4 conversation context | Context tag on each conversation; switch Casual/Professional in the detail view |
| FR-5/6 "You could also say" + save | *You could also say* cards; wording changes with context |
| FR-7/8 practice with AI + light feedback | Practice replay with Maya / Daniel, coach notes after each reply |
| FR-9 cheer on progress (no quotas) | Coach greeting milestones; Insights reports with evidence |

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

Recording (prompts, quick record, the timer: nothing is recorded), the calendar connection,
deletion after analysis, transcription and speaker ID; language coverage (`LANG_SUPPORT`, sample
values); phrase detection, the Top 3, weekly picks and other suggestions (hand-written in
`js/data.js`); the feedback-ready notification; skill levels, their examples and earlier weeks in Insights (`SKILLS`, `EARLIER`); the AI
partner whenever it falls back to the script. Progress is kept in the browser's localStorage; *Reset demo*
clears it
