# PRD v2.1: Conversation Language Coach

Version 2.1 · November 12, 2026 · INFO 213 · Team 12
Status: Confirmed product direction, with open proposals and one decision pending team alignment (see §13). Implementation and measurement details pending validation.
Version 1 (Oct 20, 2026) is kept in [`PRD-v1.md`](PRD-v1.md). The prototype as tested is at `/v1/` (git tag `v1-prototype`); the current prototype is at the site root.

## 1. Overview

The Conversation Language Coach helps language learners improve everyday speaking through feedback grounded in their real conversations. It identifies useful expressions and opportunities to improve communication, lets learners save what they want to work on, supports optional AI practice, and makes progress visible through reports backed by conversation examples.

This iteration builds on Prototype A (#1 "Learn, Practice, Track"). It incorporates the depth and specificity of Prototype B's feedback (#2 "Habit-Stack Nudges") and the simplicity of Prototype C's experience (#3 "Double Subtitles"). It adds a short onboarding so feedback can start from the learner's level.

Navigation has four tabs. "Insights" replaces "Progress" (confirmed). "Learn" replacing "Vocab" is a proposal for team review:

**Home / Learn (proposed name) / Practice / Insights**

The product expands beyond vocabulary collection to pronunciation, grammar, sentence structure, and communication appropriate to the situation. Users should understand what to try next and see whether they apply it in later conversations.

**Decision status**

- **Confirmed:** approved product behavior for this iteration.
- **Proposed:** a suggestion for team review; not an agreed team decision.
- **Pending team alignment:** the team holds different positions; options are documented and no option is final.
- **To validate:** a technical capability or measurement method that has not been demonstrated.
- **TBD:** an implementation or operational decision still requiring definition.

Requirements describe intended behavior; they do not imply that the current prototype already implements them. Where the prototype already does something, this document says so.

## 2. Problem and Audience

Learners who use their target language in daily life encounter useful expressions and speaking difficulties, but often lack a way to revisit those moments. Generic feedback does not show them what to change. Lists of saved vocabulary also do not show whether their communication is improving.

**Primary audience:** language learners living in a country or environment where their target language is regularly spoken, with opportunities to use it in everyday interactions. An example is a non-native English speaker living in the United States.

The design prioritizes learners who want to improve their participation in real conversations. Learners with little exposure to the target language are outside this iteration's primary audience.

> How might we help learners living in their target-language environment improve everyday communication and build speaking confidence through concrete feedback from real conversations?

## 3. Research Basis

The team's November 10 discussion synthesized feedback across three prototypes. The following findings inform this version:

| Finding | Product implication |
| --- | --- |
| Participants valued content from their own real conversations. | Retain real conversations as the core source of learning and assessment. |
| Generic feedback was insufficient and sometimes discouraging. Participants asked for their exact words and a suggested revision. | Show the learner's original wording and a concrete suggested alternative in context. |
| Needs extended beyond vocabulary. | Cover pronunciation, grammar, structure, expressions, and cultural context. |
| Applying feedback in later conversations felt like meaningful growth. | Ground progress in evidence from later real conversations. |
| Participants resisted forced learning during entertainment. | Deliver optional feedback after conversations rather than interrupting them with mandatory practice. |
| Recording raised confidentiality and privacy concerns. | Provide visible recording status and direct user control; validate whether controls are sufficient. The recording approach itself is pending team alignment (§6.1). |
| Some participants struggled with navigation and unclear actions, and asked who the people in the sample conversations were. | Simplify access to feedback, distinguish saving from practicing, give each tab one clear purpose, and add a short onboarding. |
| A participant asked how the app would know which phrases she doesn't already know. | Calibrate to the learner's level through onboarding and early conversations. |

**Research limitations**

Participants reviewed predetermined conversation content rather than feedback generated from conversations they had just completed. Emotional relevance, sustained engagement, and actual improvement therefore remain unvalidated. Preferences also differed with participants' language environments.

**Recording discussion**

The meeting explored selective recording through short prompts. The current prototype instead uses one initial opt-in followed by ongoing recording with pause and resume. Team members hold different preferences; both options are documented in §6.1 and neither is a final team decision.

## 4. Goals and Scope

**Goals**

1. Turn authentic conversations into specific, manageable learning opportunities.
2. Help learners apply improvements in later real interactions.
3. Show understandable progress supported by actual conversation evidence.
4. Reduce the effort required to capture conversations, without losing user control.
5. Keep practice optional and feedback easy to access.
6. Start feedback at the learner's level from the first conversation.

**In scope**

- A short onboarding: target language, self-rated level, everyday contexts, and recording setup.
- Conversation capture with a visible recording state and user control. The recording approach is pending team alignment (§6.1).
- Conversation transcripts, contextual expressions, and speaker attribution.
- Up to three prioritized improvement points per conversation, each shown as context → "You said" → "Try", with all other learning points listed below.
- A learning-content tab (proposed name: Learn) for saving and revisiting actionable content, organized into Words & Expressions, Pronunciation, and Speaking Tips (proposed categories), with automatic extraction and manual saving.
- A proposed "This week's picks" section with two recommended expressions.
- Pronunciation items with tap-to-play model pronunciation, keeping learner-audio comparison where available.
- Optional AI partner practice based on real conversation feedback.
- Insights: separate reports for real conversations and AI practice, with This Week, This Month, and All Time filters.
- Skill measures supported by conversation examples.
- Optional notifications when conversation feedback is ready.

**Outside the current scope**

- Mandatory daily AI practice or fixed daily learning quotas.
- Forced learning interruptions during social media or video consumption.
- Combining all three prototypes' content-capture mechanisms.
- Fixed weekly quotas for new expressions. (The proposed two weekly picks are highlights, not a quota.)
- Treating other speakers' performance as the learner's performance.
- Combining AI practice scores with real-conversation progress.
- A full placement test during onboarding.
- A numeric speaking or confidence score.

Calendar-based recording scheduling is not required for either recording option. Additional schedules can be considered later, but are not approved scope.

## 5. Information Architecture

| Tab | Purpose | Status |
| --- | --- | --- |
| Home | Recent conversations and their feedback: each conversation's Top 3, a feedback-ready notification, and recording controls. | Confirmed purpose; final layout TBD |
| Learn (currently "Vocab") | Actionable content to review, save, and practice: This week's picks, Words & Expressions, Pronunciation, Speaking Tips. Suggested and saved content are clearly distinguished. The existing flashcard review stays here. | **Proposed** name and categories, for team review |
| Practice | Optional AI conversations, grounded in identified improvement points. | Confirmed |
| Insights (formerly "Progress") | Performance and progress reports: real conversations and AI practice shown separately, with time filters, skill measures, and supporting examples. | **Confirmed** rename |

**Keeping the purposes distinct**

- Home shows what is new from recent conversations. It does not hold a progress dashboard.
- Learn holds the content itself: what to learn, hear, save, and practice.
- Insights shows whether the learner is applying it. It does not duplicate the full learning-content list from Learn.
- Practice is optional and its results stay separate from real-conversation progress.

**Where slang and everyday expressions belong (proposed).** Specific slang and everyday expressions to learn belong in Learn (Words & Expressions, and This week's picks). Insights keeps the Natural Expressions skill measure, which shows whether the learner uses natural expressions in their own real conversations, plus a short list of expressions the learner has used for real. That measure is different from the content to learn and links to Learn rather than repeating it.

## 6. Functional Requirements

### 6.0 Onboarding

| ID | Requirement |
| --- | --- |
| ONB-01 | Ask for the target language and the languages the learner already speaks. |
| ONB-02 | Ask for a self-rated speaking level and the everyday contexts where they use the language (e.g. work, school, friends, services). |
| ONB-03 | Removed Nov 12: onboarding does not show a feedback sample (decided after the v2 prototype review). |
| ONB-04 | Explain how recording works and ask the learner to set it up (§6.1). |
| ONB-05 | Keep onboarding short; every step except recording setup can be skipped. |
| ONB-06 | Use onboarding answers as a starting estimate of level, refine it from the learner's first real conversations, and let the learner adjust it. |

Current prototype: three steps (language, level and contexts, turn on recording). ONB-01 to ONB-06 were proposed Nov 12 and remain for team confirmation. To validate: whether self-rating plus early conversations is enough to tell which expressions a learner already knows.

### 6.1 Recording and Control (Pending team alignment)

The recording approach is **pending team alignment**. Neither option below is a final team decision, and this document does not replace the current prototype behavior with either one.

**Current prototype behavior.** During onboarding the learner turns recording on once. Recording then continues in the background with no repeated prompt. Home shows whether recording is active or paused, with a one-tap Pause; a pause lasts until the learner taps Resume. Recording is simulated in the prototype.

**Option A: initial opt-in, ongoing recording with pause/resume (Irene's preferred approach).** Rationale:

- Responding to prompts during a conversation creates friction.
- Users may miss the beginning of a useful interaction.
- A 2–3 minute recording window may lose important context.
- Repeatedly restarting recording adds effort.

**Option B: prompted recordings of 2–3 minutes each (a teammate's preferred approach).** The app prompts the learner to start a short recording when a conversation may be worth capturing; each recording lasts 2–3 minutes. This keeps each capture deliberate and bounded.

**Requirements for either option**

| ID | Requirement |
| --- | --- |
| REC-01 | During first-time setup, explain how recording works and require the learner to actively turn it on. |
| REC-02 | Clearly indicate at all times whether recording is active, paused, or off. |
| REC-03 | Provide an obvious one-tap way to stop or pause recording. |
| REC-04 | A user-initiated pause or stop persists until the learner explicitly resumes or starts recording again. |
| REC-05 | The product must not imply it is recording when capture is unavailable. |

**Option-specific behavior (applies only if that option is chosen)**

| Option | Behavior |
| --- | --- |
| A | After activation, recording continues without a repeated daily prompt, subject to pause state and technical availability. No fixed recording length. |
| B | Each recording starts from a prompt or a tap and ends after 2–3 minutes unless extended. Prompt timing and frequency are TBD. |

**Privacy concerns that remain under either option.** Pause/resume does not fully resolve them:

- Users may forget to pause before a sensitive conversation (Option A) or start a recording without thinking about who is present (Option B).
- Other participants have not consented to being recorded. Participant notice/consent and situations where recording should not proceed are TBD; some places, including California where the team is based, generally require every party's consent to record a private conversation (see §12).
- Storage and deletion of shared audio still need a policy (§6.2).

**To validate for both options:** background operation and operating-system limits, battery impact, reliability, recovery after interruptions, how often users forget to pause or miss a prompt, how much context a 2–3 minute window loses, and user comfort with each option. No legal compliance claim is made by this PRD.

### 6.2 Conversation Processing and Speaker Attribution

| ID | Requirement |
| --- | --- |
| CON-01 | Organize captured speech into conversations and produce transcripts with relevant context. |
| CON-02 | Distinguish the learner's speech from other speakers' speech. |
| CON-03 | Use only the learner's own speech for progress assessment. |
| CON-04 | Allow useful expressions from any speaker to become learning content. |
| CON-05 | Clearly attribute learning examples to the learner or another speaker. |
| CON-06 | Retain only transcripts, expressions, and context from other speakers as learning records; do not retain their playable original audio. |
| CON-07 | Make the learner's original pronunciation audio available alongside a model pronunciation in relevant feedback. |

To validate: conversation-boundary detection, speaker identification, mixed-language handling, transcription quality, and separating learner audio from other speakers' audio. Temporary processing of shared audio and deletion of non-learner audio require an explicit implementation policy before launch.

Proposed error behavior, to validate: when speaker attribution is uncertain, withhold affected speech from scoring rather than assigning another person's speech to the learner.

### 6.3 Conversation Feedback

The current prototype already shows each improvement point as **conversation context → "You said" → "Try"**. Example from the coffee chat with Maya:

- Context: Grammar · You · 05:20
- You said: "I have went to Tilden last month."
- Try: "I went to Tilden last month."

| ID | Requirement |
| --- | --- |
| FDB-01 | Generate feedback after a conversation, without interrupting the conversation with required learning actions. |
| FDB-02 | Show up to three prioritized improvement points at the top of each conversation's feedback (the Top 3). |
| FDB-03 | Show fewer than three when fewer meaningful recommendations exist. |
| FDB-04 | Below the Top 3, list all other learning points from the conversation (further improvements and useful expressions), each attributed to who said it. |
| FDB-05 | Present each improvement point as conversation context, then the learner's original wording ("You said"), then a suggested alternative ("Try"). |
| FDB-06 | A separate explanation or "Why?" field is not required. (The prototype currently offers an optional, collapsed one-line "Why?"; keeping it is a design choice, not a requirement.) |
| FDB-07 | Cover relevant pronunciation, grammar, structure, expression, and cultural-context opportunities. |
| FDB-08 | Let the learner save any improvement point or expression to Learn, and optionally start a related AI practice from it. Saving does not start practice. |

TBD: how the Top 3 are chosen. Candidate considerations include impact on understanding, recurrence, and usefulness in upcoming everyday interactions. These are proposed criteria, not a finalized algorithm.

Suggested wording must preserve the learner's intended meaning and suit the conversation context. The method for evaluating this is to validate.

### 6.4 Learn: Saved and Suggested Content (Proposed name and categories)

The tab currently named Vocab keeps its role as the dedicated place to save and revisit actionable content. The rename to **Learn** and the three categories below are **proposals for team review**.

| Category (proposed) | What it holds | Comes from |
| --- | --- | --- |
| Words & Expressions | Vocabulary, phrases, slang, and everyday expressions | Expressions other people used, plus expression-type improvement points |
| Pronunciation | Words the learner could pronounce more clearly | Pronunciation improvement points (§6.5) |
| Speaking Tips | Grammar, sentence structure, and context-appropriate wording | Grammar, structure, and cultural-context improvement points |

| ID | Requirement |
| --- | --- |
| LRN-01 | Automatically extract potentially useful content from recorded conversations into the categories above. |
| LRN-02 | Let users manually save the items they want to revisit or practice, preserving the existing behavior. |
| LRN-03 | Clearly distinguish suggested content (extracted, not yet saved) from saved content, for example with separate filters or labels. |
| LRN-04 | Keep each item connected to its original conversation context and attributed to who said it. |
| LRN-05 | Include everyday expressions and phrases, not only slang. |
| LRN-06 | Base recommendations on actual conversations; do not cap how many items are extracted or saved. |
| LRN-07 | Clearly distinguish Save actions from Practice actions. |
| LRN-08 | Keep the existing flashcard review for saved and suggested items. |

Expressions spoken by others may be retained as text with context. Their usage must not be credited as evidence that the learner used the expression.

Current prototype: Vocab shows all items with New / Saved / Practiced filters and a flashcard review; the three categories and the Learn name are not built yet.

**This week's picks (Proposed, pending team agreement)**

| ID | Requirement |
| --- | --- |
| PCK-01 | At the top of Learn, show two recommended slang or everyday expressions for the week. |
| PCK-02 | Where possible, choose them from the learner's recent conversations and the situations they come up in (for example, an expression a classmate used that fits the learner's upcoming plans). |
| PCK-03 | Each pick shows the expression, its meaning, and the situation or conversation it relates to, and can be saved. |
| PCK-04 | The picks are highlighted recommendations, not a limit on how many expressions the system extracts or the learner saves. |

TBD: how picks are selected and what happens when recent conversations offer fewer than two good candidates.

### 6.5 Pronunciation

| ID | Requirement |
| --- | --- |
| PRO-01 | Identify pronunciation opportunities in the learner's speech. |
| PRO-02 | Prioritize recurring issues and issues that affect understanding. |
| PRO-03 | Do not mark accent differences as errors when they do not affect understanding. |
| PRO-04 | Where the learner's audio is available, provide separate, clearly labeled controls for the learner's audio and the model pronunciation, so they can compare. |
| PRO-05 | Play audio only when the user selects a playback control. |
| PRO-06 | In Learn's Pronunciation list, show each identified word with a tap-to-play model pronunciation. Adding model playback does not remove the learner-audio comparison. |

The goal is clearer communication, not eliminating the learner's accent. Pronunciation assessment accuracy and suitable reference pronunciations are to validate.

Current prototype: pronunciation points in conversation feedback have separate "Your audio (simulated)" and "Model" buttons. The Learn Pronunciation list is not built yet.

### 6.6 Skill Measures in Insights

| ID | Requirement |
| --- | --- |
| SKL-01 | Show skill measures for natural expressions, grammar, sentence structure, pronunciation, and cultural context. |
| SKL-02 | Show a progress bar for each assessed skill in Insights. |
| SKL-03 | Support each measure with actual conversation examples: an earlier and a more recent example of the same kind of moment, with what changed. |
| SKL-04 | Assess real-conversation progress using only the learner's own speech. |
| SKL-05 | Keep AI practice assessment separate from real-conversation assessment. |
| SKL-06 | The Natural Expressions measure shows whether the learner uses natural expressions in real conversations; the expressions to learn stay in Learn. |

**Scoring status:** detailed rubrics, thresholds, and aggregation methods are to validate. Progress bars are approved as a presentation format; this does not approve a numeric scoring system or formula.

The intended meaning of a full bar is consistent demonstration of the assessed skill in observed conversations, not complete mastery of a language.

Before production scoring, define and test:

- What each skill measures and what observable performance counts as improvement.
- How a personal baseline is established (starting from onboarding, ONB-06).
- The minimum amount and variety of evidence required.
- How multiple conversations are aggregated and how recent evidence is weighted.
- How conversational difficulty and opportunities to demonstrate a skill affect comparison.
- How uncertainty and insufficient evidence appear to users.

Missing evidence must not automatically count as failure or regression. A learner may not have had an opportunity to use a particular expression or skill in the recorded sample.

Current prototype: Insights (still labeled Progress) shows the five measures with Before / Now examples, using sample data.

### 6.7 AI Partner Practice

| ID | Requirement |
| --- | --- |
| PRA-01 | Retain the existing AI partner practice capability. |
| PRA-02 | Offer practice based on improvement points from real conversations. |
| PRA-03 | Let users choose whether and when to practice. |
| PRA-04 | Do not require daily practice tasks. |
| PRA-05 | Assess practice separately and display its results in Insights. |

Example: if a learner struggled to express a request while ordering food, offer a similar scenario in which they can try the suggested wording.

### 6.8 Insights Reports

| ID | Requirement |
| --- | --- |
| RPT-01 | Name the reports tab Insights (formerly Progress); do not add a separate Reports tab. |
| RPT-02 | Present real-conversation results and AI practice results separately. |
| RPT-03 | Provide This Week, This Month, and All Time filters. |
| RPT-04 | Default to This Week. |
| RPT-05 | Make skill measures and their supporting examples available in the reports. |
| RPT-06 | Show counts that can be checked against conversations, not a score: for example minutes the learner spoke, new phrases used in real conversations, and Top 3 tips later applied. |
| RPT-07 | Do not duplicate the full learning-content list from Learn; link to it instead. |

TBD: calendar-week boundaries, time-zone handling, and exact report layout. No Home progress dashboard is required.

### 6.9 Notifications

| ID | Requirement |
| --- | --- |
| NTF-01 | Offer a notification when post-conversation feedback is ready. |
| NTF-02 | Let users disable these notifications. |
| NTF-03 | Let users ignore the notification and review feedback later. |
| NTF-04 | Do not expose conversation quotations on the lock screen. |

Current prototype: a push-style banner ("Your latest conversation has 3 points to review.") appears once per new conversation, and a bell on Home turns notifications on or off. Final copy, timing, batching, and frequency need validation.

## 7. Primary User Journey

1. In a short onboarding, the learner picks their language, rates their level, and names the contexts where they speak it.
2. The learner learns how recording works and sets it up. (Whether recording then runs continuously or by prompt is pending team alignment, §6.1.)
3. While recording is on, the learner can pause or stop it before sensitive interactions.
4. The system identifies a completed conversation, produces a transcript, and separates learner speech from other speakers.
5. It generates up to three prioritized improvement points, plus all other learning points and contextual expressions.
6. The learner receives a notification if enabled and opens the feedback when convenient.
7. For each point the learner sees the context, what they said, and what to try. They save useful items to Learn, or start an optional related practice.
8. In Learn, the learner reviews This week's picks (proposed), saved and suggested Words & Expressions, Pronunciation words with tap-to-play model audio, and Speaking Tips.
9. The learner optionally practices related situations with the AI partner.
10. In later real conversations, the system looks for evidence of improvement in the learner's own speech.
11. Insights shows real-conversation progress and AI practice results separately, defaulting to This Week.

## 8. Prototype Requirements and Acceptance Criteria

The prototype should make the experience reviewable without claiming unbuilt recording or scoring capabilities. "Built" means the current prototype already meets the criterion.

| Area | Acceptance criteria | Prototype status |
| --- | --- | --- |
| Navigation | Tabs read Home / Learn / Practice / Insights. "Insights" replaces "Progress"; "Learn" replacing "Vocab" follows team review. | Not yet renamed |
| Onboarding | A short onboarding asks for language, level, and contexts, and sets up recording; optional steps can be skipped. | Built |
| Recording state | The current state (active, paused, or off) is always visible, the learner can pause or stop in one tap, and a pause lasts until they resume. | Built for Option A; Option B not built |
| Feedback | Each conversation shows up to three improvement points, each as context → "You said" → "Try", then all other learning points. No "Why?" field is required. | Built |
| Learn content | Items are grouped into Words & Expressions, Pronunciation, and Speaking Tips; suggested and saved content are clearly distinguished; saving does not start practice. | Partly built (Vocab with New / Saved / Practiced filters) |
| This week's picks | Two recommended expressions at the top of Learn, tied to recent conversations where possible, each savable. | Not built (proposal) |
| Speaker distinction | Examples show whether the learner or another person spoke; other speakers do not contribute to the learner's score. | Built |
| Pronunciation | Learn lists pronunciation words with tap-to-play model audio; where learner audio exists, separate learner and model controls allow comparison; no playable other-speaker audio. | Comparison built in feedback; Learn list not built |
| Skill evidence | Skill bars open to an earlier and a recent example with what changed. | Built (sample data) |
| Practice | A feedback item can lead to optional related AI practice. | Built |
| Insights reports | Real conversation and AI practice are separate; This Week is the default, with This Month and All Time; no full Learn list is repeated. | Built (labeled Progress) |
| Notifications | A feedback-ready notification is represented, can be turned off, and contains no conversation quotations. | Built |

Use representative sample conversations where backend functions are unavailable. Label simulated states and sample data clearly. Exact scoring and recording feasibility remain validation tasks.

## 9. Validation Plan

**Usability and desirability**

- Does onboarding give enough context that the conversations and feedback make sense?
- Do learners feel the feedback matches their level?
- Can users tell whether recording is on, and pause it without help?
- Recording options: which option do participants prefer, how often would they forget to pause (A) or miss a prompt (B), and how much context does a 2–3 minute window lose?
- Do they find the Top 3 relevant and easy to act on?
- Do they understand the difference between Learn (content to learn) and Insights (whether they apply it)?
- Is "Learn" a clear name, and do the three categories match how they think about the content?
- Can they tell suggested items from saved items, and saving from practicing?
- Are This week's picks useful, and does the number two feel right?
- Do they use tap-to-play model pronunciation, and do they also want their own audio for comparison?
- Can they understand a skill bar by inspecting its examples?
- Can they distinguish real-conversation performance from AI practice performance?
- Are feedback notifications useful without feeling disruptive?

Where possible, evaluate feedback from conversations the participant actually completed, addressing a limitation of the earlier study.

**Technical validation**

- Recording feasibility for both options: background capture, battery, reliability, recovery.
- Accurate speaker attribution and preservation of learner-only audio examples.
- Conversation segmentation and feedback readiness.
- Transcription accuracy, including mixed-language conversations.
- Contextually appropriate recommendations, weekly pick selection, and pronunciation assessment.
- Level estimation from onboarding and early conversations.
- Stable skill measures supported by sufficient evidence.

## 10. Proposed Success Measures

These are evaluation proposals, not confirmed numerical targets. Set definitions and targets after baseline testing.

| Measure | What it helps evaluate |
| --- | --- |
| Feedback usefulness rating | Whether recommendations are relevant and actionable. |
| Save and optional practice usage | Whether users choose to engage with extracted learning content. |
| Later application of recommendations | Whether learning transfers into real conversations. |
| Insights comprehension | Whether users correctly understand what the bars and examples represent. |
| Notification usefulness and disable rate | Whether reminders support engagement without excessive interruption. |
| Recording-state comprehension and pause-task success | Whether users can control capture confidently. |
| Onboarding completion and perceived level fit | Whether the starting level estimate makes early feedback feel right. |
| Assessment agreement with human review | Whether feedback and skill judgments are credible. |

Do not use raw recording duration or vocabulary count alone as evidence of learning success.

## 11. Current Prototype Summary

What the prototype at the site root shows today, for reviewers comparing it with this document:

- **Onboarding:** three steps; recording is turned on at the end (Option A).
- **Home:** Recording / Paused pill with Pause and Resume, a push-style feedback-ready banner, a bell to turn notifications off, and the latest conversation's Top 3 with a "New" label.
- **Conversation feedback:** Top 3 as context → "You said" → "Try", an optional collapsed "Why?", Save, I know this, and "Try it in a chat"; then all learning points. Pronunciation points have "Your audio (simulated)" and "Model" buttons.
- **Vocab:** all items with New / Saved / Practiced filters and a flashcard review.
- **Practice:** pick a person from your conversations; recap compares then and now.
- **Progress:** real conversations and AI practice, time filters, three counts, five skill measures with Before / Now examples, a weekly takeaway, and phrases used in real conversations.

Recording, notifications, learner audio, skill levels and earlier periods are simulated or sample data.

## 12. Outstanding Implementation Decisions

These items remain unresolved and must not be presented as validated behavior:

| Item | Required next step |
| --- | --- |
| Recording approach | Pending team alignment between Option A and Option B (§6.1); test both with users before deciding. |
| Participant recording controls | Define participant notice/consent and situations where recording should not proceed. Some places, including California where the team is based, generally require every party's consent to record a private conversation. Get advice before any real-world use. |
| Recording feasibility | Test platform support, battery use, interruptions, and recovery for the chosen option. |
| Speaker identification | Define enrollment or identification method and uncertainty handling. |
| Other-speaker audio handling | Define temporary processing and deletion so retained learning records contain only their text, expressions, and context. |
| User data controls | Define deletion, export, storage location, access controls, and retention periods. |
| Level calibration | Define how onboarding answers and early conversations estimate what the learner already knows, and test how accurate it is. |
| Conversation boundaries | Test how the system separates interactions and determines when feedback is ready. |
| Scoring | Define skill rubrics, baseline, evidence thresholds, aggregation, and uncertainty displays. |
| Feedback prioritization | Define how the system chooses the Top 3. |
| Weekly picks selection | Define how two picks are chosen, if the team adopts them. |
| Learn and Insights layout | Resolve detailed layouts and calendar/time-zone semantics. |
| Notifications | Test delivery delay, batching, and frequency. |

## 13. Proposals and Decisions Requiring Team Agreement

| Item | Status | Section |
| --- | --- | --- |
| Rename "Vocab" to "Learn" | Proposed | §5, §6.4 |
| Learn categories: Words & Expressions, Pronunciation, Speaking Tips | Proposed | §6.4 |
| Slang and everyday expressions to learn live in Learn; Insights shows only whether they are applied | Proposed | §5, §6.6 |
| "This week's picks": two recommended expressions at the top of Learn | Proposed | §6.4 |
| Recording: Option A (ongoing with pause/resume) or Option B (prompted 2–3 minute recordings) | Pending team alignment | §6.1 |
| Onboarding requirements ONB-01 to ONB-06 | Proposed Nov 12, team to confirm | §6.0 |
| Keep or drop the prototype's optional "Why?" line | Open design choice | §6.3 |

Confirmed in this version: rename "Progress" to "Insights"; context → "You said" → "Try" feedback with up to three points; no required "Why?" field; tap-to-play model pronunciation in addition to the learner-audio comparison.

## 14. Changes from Prototype A

| Area | Updated requirement |
| --- | --- |
| Audience | Focus on learners living in a target-language environment. |
| Onboarding | New short onboarding: language, self-rated level, contexts, and recording setup. |
| Learning focus | Expand from vocabulary and expressions to actual speaking performance. |
| Recording | Visible state and user control; the approach (ongoing with pause/resume, or prompted 2–3 minute recordings) is pending team alignment. |
| Feedback | Up to three improvement points, each as context → "You said" → "Try"; all other learning points listed below; no required "Why?" field. |
| Learning content | The Vocab tab becomes a broader learning-content tab (proposed name Learn) with Words & Expressions, Pronunciation, and Speaking Tips; suggested vs saved is clear; flashcards kept; two weekly picks proposed. |
| Pronunciation | Tap-to-play model pronunciation for identified words, plus learner/model comparison where learner audio exists; focus on intelligibility and recurring issues. |
| Progress → Insights | Renamed Insights. Skill bars with Before / Now examples; countable metrics instead of fixed weekly goals ("3 new phrases used", "5 practiced"). |
| Speaker scope | Assess only the learner; retain other speakers' text and contextual expressions for learning. |
| Practice | Optional AI partner practice tied to real-conversation feedback. |
| Reports | Real conversations and AI practice separate inside Insights; This Week, This Month, and All Time filters. |
| Notifications | Optional feedback-ready notifications without lock-screen quotations. |
| Navigation | Home / Learn (proposed) / Practice / Insights, each with one purpose. |

**Source basis:** team discussion transcript dated November 10, 2026; recommendation slides 10–13; product-owner decisions on November 12, 2026; the current prototype at the site root. Where a team member's position differs from the product owner's, both are documented (§6.1). Later confirmed decisions supersede earlier proposals where explicitly documented above.
