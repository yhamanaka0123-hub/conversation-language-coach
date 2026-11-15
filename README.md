# Afterchat (tentative name) — clickable prototype

Formerly "Conversation Language Coach". The product name is tentative until the team confirms it; it is set in one place, `APP_NAME` in `js/data.js`. The AI partner is still called "Coach" (`PARTNER`).

**Live preview:** https://conversation-language-coach.vercel.app/
**Prototype v1 (as used in user testing, frozen):** https://conversation-language-coach.vercel.app/v1/ · git tag `v1-prototype`

`v1/` is an archived copy: don't edit it. New work happens in the root files. v1 keeps its own demo progress (`clc-proto-v1` in localStorage) and shares `/api/practice` with the latest version.

The current PRD is v2.4 (Nov 15, 2026, after the Nov 13 prototype review): [`docs/PRD.md`](docs/PRD.md). The v1 prototype was built from [`docs/PRD-v1.md`](docs/PRD-v1.md) (Oct 20, 2026).
Visual design comes from the team's Figma Make prototype; behaviour and sample data
come from the first clickable build. Plain HTML/CSS/JS, no build step:
open `index.html` in a browser (the AI practice partner needs the Vercel deploy; opened
as a local file, Practice uses the fixed script).

**Golden path (per [PRD v2.4](docs/PRD.md)):** onboarding (language and what it supports, level: connect a
learning app or enter a test score, otherwise pick Beginner to Advanced with its CEFR range; how often and where you speak it, how recording works and
prompts a day: 2 recommended, optional calendar) → Home: accept the recording prompt (ends at its
set length, stop early) or tap *Record* (runs until you stop) → *See all feedback* (context → you
said → try, model pronunciation) → *Save* → Learn → Practice: pick Work / School / Friends / Family
/ Surprise me, or replay a recorded conversation → recap → Insights: Real conversations / AI
practice, skills (pronunciation, grammar, structure, natural expressions), each opening to up to three
improvements and then what to work on to grow further.
*Phone demo* (top bar, or Settings) shows the lock screen (prompt notification, countdown with
+1 min and Stop) and the Control Center record button. The gear on Home opens Settings (your level,
where you speak it, prompts on or off = AI-only mode, prompts a day, length in minutes, notifications, calendar). A conversation
page can delete its kept transcript, which removes its replay. *Reset demo* restarts onboarding.

## Where things live (who edits what)

| File | What it controls |
|---|---|
| `js/data.js` | Conversations, phrases, suggestions, AI partner scripts. No coding needed beyond keeping the format. |
| `style.css` | All colors, fonts and layout (from the Figma Make design). |
| `js/core.js` | Shared state, helpers, icons, bottom nav, page header. Change with care: every screen uses it. |
| `js/screens/onboard.js` | Onboarding: language with its (sample) capabilities, level (plus optional CEFR, test score, linked app), frequency, contexts, how recording works and prompts a day (2 recommended), optional calendar |
| `js/screens/home.js` | Home: quick record, recording prompt (stops after 2 captures a day), live recording bar, Settings, feedback-ready notification, tappable coach, latest conversation's Top 3, more from your day; AI-only empty state |
| `js/screens/conversation.js` | Conversation detail: Top 3 to try next (context → you said → try; pronunciation cue and model audio), then all learning points; Save is separate from practice; deletion note |
| `js/screens/bank.js` | Learn: This week's picks, review card for saved items, Expressions / Pronunciation / Speaking Tips (each its own format) / Saved, suggested vs saved, delete an item |
| `js/screens/cards.js` | Flashcard review of saved items: expressions (meaning → phrase), pronunciation (word → stress, cue, model audio), speaking tips (you said → try); Got it / Not yet; familiarity 🌱 new → 🌿 getting there → 🌳 remembered |
| `js/screens/practice.js` | One AI partner: pick a topic (`TOPICS` in data.js: Work, School, Friends, Family, Surprise me; tone follows the topic) or replay a recorded conversation (only while its transcript is kept); AI practice session, recap, scripted fallback |
| `js/screens/phone.js` | Phone demo: lock screen (prompt notification, recording countdown with +1 min and Stop) and Control Center record button. Simulated |
| `api/practice.mjs` | Vercel serverless function that calls the AI model (Groq). Holds the only use of the API key. |
| `prompts/practice.mjs` | The live prompts: coach suggestion, a replay turn, a topic-chat turn, and the casual / polished tone (`REGISTER`) |
| `js/screens/progress.js` | Insights: Real conversations vs AI practice, This week / month / all time, skill bars with earlier vs recent examples, recurring mistakes (`MISTAKES`, sample data); AI-only empty state |

Each screen file adds one entry to `SCREENS` and its buttons to `ACTIONS`, so two people
working on different screens don't touch the same file.

## PRD requirement → screen

| PRD v2.4 requirement | Where it shows up |
|---|---|
| ONB-01..10 onboarding | `onboard.js`: language and capabilities, level page (connect an app / test score / five levels), how often and where, recording and prompts a day, calendar |
| REC-01..17 recording | Home (prompt, Record, live bar), Settings (prompts a day, length in minutes), Phone demo (lock-screen countdown with +1 min, Control Center) |
| DAT-01..05 data | Notes in onboarding, Settings and each conversation; *Delete transcript* on a conversation page |
| FDB-01..08 feedback | Conversation detail: Top 3 (context → you said → try), all learning points, Save |
| LRN, PCK, PRO | Learn tab: This week's picks, Expressions / Pronunciation / Speaking Tips, flashcards, model audio |
| PRA-01..09 practice | Practice: topics (Work, School, Friends, Family, Surprise me), replay a recorded conversation, recap |
| RPT-01..10 insights | Insights: real vs AI practice, time filters, skill bars with improvements and what to work on |
| AIO-01..05 AI-only | Settings → prompts off; empty states on Home and Insights |

## AI practice partner

Practice uses a real model through `api/practice.mjs`:

- **What to practice** is chosen by a rule, not the AI. Replay: that conversation's saved
  phrases (up to 3). Topic chat: the learner's saved phrases, those in the topic's tone first.
  For a replay the AI words the suggestion and writes the partner's first line; a topic chat
  opens with the fixed first line in `TOPICS`.
- **Two prompts:** `TURN_PROMPT` for a replay (the AI plays the other person) and
  `TOPIC_TURN_PROMPT` for a topic chat. Both share the same rules and take a tone from
  `REGISTER`: casual (Friends, Family, everyday slang) or professional (Work, School, polished).
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

- **Recording:** prompts, quick record, the timer and the prompts-a-day limit work, but nothing is
  recorded, transcribed or analyzed, and there is no speaker ID. A capture does not create a new
  conversation. The feedback-ready notification is shown in the app the way a push would arrive.
- **Phone demo:** the lock screen and Control Center are drawings in the page (`phone.js`); the
  clock is fixed and the other Control Center tiles do nothing.
- **Onboarding:** connecting a learning app shows a permission step and returns a sample level
  (`OB_APPS`); test scores map to levels with approximate bands (`OB_TESTS`); the calendar is a toggle.
- **Data:** "audio deleted" and "transcript kept" are labels; deleting a transcript hides that
  conversation's replay.
- **Content:** language coverage (`LANG_SUPPORT`), phrases, the Top 3, weekly picks and other
  suggestions, skill levels, improvements, recurring mistakes and earlier weeks in Insights
  (`SKILLS`, `MISTAKES`, `EARLIER`) are hand-written in `js/data.js`.
- **AI partner:** live when the Groq key is set; otherwise the fixed script. It is called
  "Coach" (`PARTNER`) until the team picks a name.

Progress is kept in the browser's localStorage; *Reset demo* clears it.
