# Conversation Language Coach — clickable prototype

**Live preview:** https://conversation-language-coach.vercel.app/

Built from the team PRD draft in [`docs/PRD.md`](docs/PRD.md) (Oct 20, 2026).
Visual design comes from the team's Figma Make prototype; behaviour and sample data
come from the first clickable build. Plain HTML/CSS/JS, no build step:
open `index.html` in a browser (the AI practice partner needs the Vercel deploy; opened
as a local file, Practice uses the fixed script).

**Golden path:** Home → open "Coffee chat with Maya" → tap *Practice this* on a few
items (or *I know this*) → *Practice this conversation* → reply to Maya (type, tap a
phrase chip, or tap the mic for a simulated spoken reply) → *See how you did* → the
celebration fires when the week reaches 5 learned terms (2 are seeded as already learned).

## Where things live (who edits what)

| File | What it controls |
|---|---|
| `js/data.js` | Conversations, phrases, suggestions, AI partner scripts, sample history. No coding needed beyond keeping the format. |
| `style.css` | All colors, fonts and layout (from the Figma Make design). |
| `js/core.js` | Shared state, helpers, icons, bottom nav, page header. Change with care: every screen uses it. |
| `js/screens/home.js` | Home: coach greeting, featured conversation, more from your day, weekly nudge |
| `js/screens/conversation.js` | Conversation detail: new phrases, "You could also say", context switch |
| `js/screens/bank.js` | Vocab bank |
| `js/screens/practice.js` | Coach suggestion, AI practice session, recap, scripted fallback |
| `api/practice.mjs` | Vercel serverless function that calls the AI model (Groq). Holds the only use of the API key. |
| `prompts/practice.mjs` | The live prompts for the coach suggestion and each practice turn |
| `js/screens/progress.js` | Progress report |
| `js/screens/celebrate.js` | Celebration screen |

Each screen file adds one entry to `SCREENS` and its buttons to `ACTIONS`, so two people
working on different screens don't touch the same file.

## PRD requirement → screen

| PRD requirement | Where it shows up |
|---|---|
| FR-1/2/3 pick up, save, review phrases | Conversation detail + Vocab bank (*Practice this* / *I know this*) |
| FR-4 conversation context | Context tag on each conversation; switch Casual/Professional in the detail view |
| FR-5/6 "You could also say" + save | *You could also say* cards; wording changes with context |
| FR-7/8 practice with AI + light feedback | Practice replay with Maya / Daniel, coach notes after each reply |
| FR-9 cheer on progress | Weekly progress card + celebration screen |
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

Background recording, transcription and speaker ID; phrase detection and "you could also
say" suggestions (hand-written in `js/data.js`); the AI partner whenever it falls back to
the script. Weeks before Oct 19 in the Progress
chart are sample history. Progress is kept in the browser's localStorage; *Reset demo*
clears it.
