# Conversation Language Coach — clickable prototype

Built from the team PRD draft in [`docs/PRD.md`](docs/PRD.md) (Oct 20, 2026).
Single static file, no build step: open `index.html` in a browser.

**Golden path:** Conversations → open "Coffee chat with Maya" → tap *Practice this* on a
few items (or *I know this*) → *Practice this conversation* → reply to Maya (type, tap a
phrase chip, or tap the mic for a simulated spoken reply) → *See how you did* → the
celebration fires when the week reaches 5 learned terms (2 are seeded as already learned).

| PRD requirement | Where it shows up |
|---|---|
| FR-1/2/3 pick up, save, review phrases | Conversation detail + Vocab bank (*Practice this* / *I know this*) |
| FR-4 conversation context | Context tag on each conversation; switch Casual/Professional in the detail view |
| FR-5/6 "You could also say" + save | *Ways to say it more naturally* cards; wording changes with context |
| FR-7/8 practice with AI + light feedback | Practice replay with Maya / Daniel, coach notes after each reply |
| FR-9 cheer on progress | Weekly progress bar + celebration screen |
| Progress report (PRD lists "reviewing progress over time" as later; added for the demo) | *Progress* tab: weekly stats, terms per week vs goal, casual/professional split, learned list |

**Simulated (not real):** background recording, transcription and speaker ID; phrase
detection and suggestions (hand-written sample data in the file); the AI partner (scripted
turns); feedback (keyword match on saved phrases); the mic (types a sample answer).
Weeks before Oct 19 in the Progress chart are sample history. Progress is kept in the browser's localStorage; *Reset demo* clears it.
