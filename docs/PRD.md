# PRD: Conversation Language Coach (Prototype)

Working title. Draft based on team discussion, Oct 20, 2026. Status: Draft for team review.
(Converted from the team's .docx; wording kept. Later changes are listed in §12.)

## 1. Summary
We are building an app that listens to a non-native speaker's real, everyday conversations in the language they are learning (not limited to English) and turns them into personal learning material. For the class prototype, we will show one golden path: the user has a real conversation, the app picks up new phrases and suggests more natural ways to say things based on the conversation context, the user saves what they want to practice, practices it in a mock conversation with AI, and gets a cheer when they have learned new terms.

Our differentiator is that learning content comes from the user's own daily conversations, not a generic curriculum. Everything in the prototype should make that feel natural and low effort.

## 2. Problem
- Non-native speakers living and working in a second language hear phrases they do not know, but rarely capture them in the moment.
- They often say things that are correct but not natural, and nobody tells them a better way.
- Existing language apps teach generic content (quizzes that feel too easy or irrelevant) instead of what the user actually needs in their own conversations.
- The right wording depends on context: what works with friends sounds odd in a professional meeting, and vice versa.

## 3. Target user
Non-native speakers of any language (for example, international graduate students and professionals living abroad) who have regular casual and professional conversations in that language and want to build confidence speaking naturally.

## 4. Goals for the prototype
- Show the golden path end to end in clickable screens (Figma Make, Lovable, Claude, or similar). It does not need to be fully functional.
- Make the core value clear: "my own conversations become my learning material."
- Keep the experience natural and low friction, not like studying.

## 5. Scope
### In scope (P0 for prototype)
| Feature area | What's included |
|---|---|
| Vocab bank | Pick up new phrases and terms; save them to the vocab bank; user reviews new phrases and chooses which ones to practice |
| Recommendation | App knows the conversation context (e.g., casual conversation, professional meeting); suggests a different, more native way to say what the user said |
| Practice | Speaking with AI: user replays a version of the actual conversation with AI and practices speaking in a better way |
| Progression | Agent cheers the user on when they have learned X new terms |

### Out of scope for prototype (later)
- Brief explanation of cultural references (e.g., sports, TV dramas). Discussed as interesting; candidate for P2.
- Remember cards (Anki-style retention cards).
- Pop quiz (vocab-based, or "which wording fits this situation better").
- Suggesting new terms to use based on the user's calendar or schedule.
- Scoring current speaking level (needs a scoring framework).
- Reviewing progress over time. *(Prototype now includes a basic Progress tab; see §12.)*
- Onboarding: voice setup and initial level assessment.
- Input device and always-on recording hardware.

## 6. Golden path (user flow)
1. User has a real conversation (e.g., a coffee chat or a team meeting). The app is already listening in the background; no button press needed.
2. After the conversation, the user opens the app and sees a conversation summary, tagged with its context (casual or professional).
3. The app shows new phrases the other person used that the user may not know.
4. The app shows "You said X. You could also say Y," based on the context.
5. The user marks which items to practice ("Practice this") or dismisses ones they already know ("I know this").
6. Saved items go to the vocab bank.
7. The user starts a practice session: AI plays the other person in a version of the same conversation, and the user tries using the new phrases.
8. The agent gives light feedback and cheers: "You've learned 5 new terms this week!"

## 7. Functional requirements
We agreed to focus on functional requirements (what the product does) for the prototype. Technical requirements (how we build it) are captured as notes only.

### 7.1 Vocab bank
- **FR-1 Pick up new phrases and terms.** The app identifies phrases and terms from the conversation that are likely new to the user. Focus on what the other person said, since words the user said themselves are likely already known.
- **FR-2 Save to the vocab bank.** Detected items are saved to the user's vocab bank, with the original sentence and conversation context.
- **FR-3 Review and prioritize.** The user can review new phrases and choose which ones to practice. The user can mark an item as "already known" so it is not shown again.

Technical note: one idea is a baseline of high-school-level vocabulary and grammar for each target language, so common words are filtered out first.

### 7.2 Recommendation
- **FR-4 Know the conversation context.** The app recognizes the type of conversation (e.g., casual conversation with friends, professional meeting, interview) and uses it for recommendations. This is a prerequisite for FR-5: a suggestion that does not fit the context is not useful.
- **FR-5 Suggest a different way to say it.** Based on what the user said, the app suggests a more natural, native-sounding alternative that fits the context. The original is not framed as "wrong," just as one option.
- **FR-6 Save suggestions.** The user can save a suggestion to the vocab bank to practice later.

### 7.3 Practice: speaking with AI
- **FR-7 Mimic the actual conversation.** The user can start a practice session where AI recreates the situation from a real conversation and plays the other person.
- **FR-8 Practice speaking in a better way.** The session prompts the user to use saved phrases and suggested wording, and gives light feedback on how they did.

### 7.4 Progression
- **FR-9 Cheer on progress.** The agent celebrates when the user has learned X new terms (e.g., "You learned 5 new terms this week!").

## 8. Prototype screens
- Home / conversation list (each conversation tagged with its context)
- Conversation detail: new phrases picked up and "You could also say" suggestions
- Vocab bank with "Practice this" and "I know this" actions
- Practice session with AI (chat or voice-style UI)
- Celebration moment ("You learned X new terms")
- Progress report *(added Oct 20; see §12)*

## 9. Assumptions for the prototype
- Onboarding is done: the app already recognizes the user's voice and has a rough sense of their level.
- Recording works in the background (always on), so we show results after the conversation rather than the recording step itself.
- Screens can use sample data for one or two example conversations.

## 10. Open questions
- Should we focus on one context (casual vs. professional) or support both? Professional may have higher willingness to pay and lower recording friction (people already use AI note takers); casual is harder but core to building confidence. This also affects go-to-market. Note our possible bias as MBA students.
- Speaker identification: how does the app reliably tell the user's voice apart from others?
- Level assessment (post-prototype): we lean toward assessing from actual conversations as soon as there is enough data, not a fixed number of days or an upfront test, and showing an early estimate quickly.
- Input device (post-prototype): flexible input (phone, watch, wearable) vs. one dedicated device; always-on with voice activation to save battery.
- Scoring framework for speaking level (post-prototype): what metrics to use.

## 11. Success criteria for the prototype
- Test users understand the core value within the first screen or two.
- Test users can complete the golden path without help.
- Test users say the suggestions feel personal and relevant, not like generic study content.

## 12. Change log (since the Oct 20 draft)
| Date | Change | Status |
|---|---|---|
| Oct 20, 2026 | Added a **Progress** tab to the prototype: this week's stats (terms learned, conversations captured, phrases reviewed, practice sessions), terms learned per week against the goal (earlier weeks are sample history), casual vs. professional split, and the list of terms learned this week. A "See progress report" link sits on the home progress card. This pulls part of "Reviewing progress over time" (§5, out of scope) into the prototype. | Proposed, team to confirm whether it stays in first-phase scope |
