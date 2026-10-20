# Conversation Language Coach — clickable prototype

Built from the team PRD draft in [`docs/PRD.md`](docs/PRD.md) (Oct 20, 2026).
Visual design comes from the team's Figma Make prototype; behaviour and sample data
come from the first clickable build. Plain HTML/CSS/JS, no build step:
open `index.html` in a browser.

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
| `js/screens/home.js` | Home: weekly progress card, conversation list |
| `js/screens/conversation.js` | Conversation detail: new phrases, "You could also say", context switch |
| `js/screens/bank.js` | Vocab bank |
| `js/screens/practice.js` | Practice picker, AI replay session, recap |
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

## Simulated (not real)

Background recording, transcription and speaker ID; phrase detection and suggestions
(hand-written in `js/data.js`); the AI partner (scripted turns); feedback (keyword match
on saved phrases); the mic (types a sample answer). Weeks before Oct 19 in the Progress
chart are sample history. Progress is kept in the browser's localStorage; *Reset demo*
clears it.
