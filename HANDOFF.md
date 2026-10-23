# Handoff — where this prototype stands (Oct 20, 2026)

Context for whoever (person or coding agent) picks this up next. Delete or update as it goes stale.

## What exists
- `index.html` + `style.css` + `js/` — the clickable prototype, plain HTML/CSS/JS, no build
  step. Split one file per screen so teammates can work in parallel (see README table).
- Visual design taken from the team's Figma Make prototype (sage/cream, Newsreader +
  DM Sans); behaviour and data from the first build. Figma Make is no longer the
  source of truth: design changes are made here in `style.css`.
- `README.md` — golden path, PRD-requirement mapping, list of simulated parts.
- `docs/PRD.md` — the team PRD draft this was built from.
- Shared preview on Vercel: https://conversation-language-coach.vercel.app/
- A hosted copy is also published as a private Claude artifact owned by Yuka
  (shared from that page's Share menu). It does **not** update from this repo.

## Screens (4 tabs)
Home (list + detail with context switch) · Vocab bank · Practice (scripted AI replay
with coach notes, simulated mic) · Progress (weekly stats, terms/week chart, casual vs
professional split). Celebration fires when the week reaches 5 learned terms (2 seeded).

## Decisions made so far
- Detection and suggestions are still simulated (hand-written sample data).
- Practice uses a real model (Groq free tier) via `api/practice.mjs`, with the old script as
  fallback. Chosen over Gemini because Gemini's free tier was cut to very low daily limits;
  Claude's own artifact AI was ruled out because the team needs it to work on Vercel.
- Rule picks what to practice; AI only words it (keeps suggestions predictable and testable).
- Added a Progress tab on request, although the PRD lists "reviewing progress over time"
  as out of scope. Decide whether it stays in the first-phase scope or is cut for testing.
- Context switch (Casual/Professional) in conversation detail changes the suggested
  wording, to show FR-4 as a prerequisite for FR-5.

## Suggested next steps
1. ~~Split for collaboration~~ (done Oct 20).
2. ~~Shared preview URL~~ (done Oct 23): https://conversation-language-coach.vercel.app/
   on Vercel, with the AI partner live.
3. **Riskiest capability**: whether real conversations yield useful new phrases and
   context-fit rephrasings. Still simulated. Next capability test: feed a redacted or
   invented transcript to a real model call through the same serverless setup.
4. **Evaluate the AI partner**: 5 to 10 cases (stays in character, never says "wrong",
   marks only phrases really used, no invented facts, wraps up on the last turn).
5. Run the PRD §11 success criteria with real test users and write down what you saw.

## Team workflow
Branch per change (`<first-name>/<topic>`), open a pull request, merge into `main`.
Everyone commits under their own GitHub account.
