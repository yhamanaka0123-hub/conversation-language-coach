# PRD v2: Conversation Language Coach

Version 2.0 · November 12, 2026 · INFO 213 · Team 12
Status: Confirmed product direction; implementation and measurement details pending validation.
Version 1 (Oct 20, 2026) is kept in [`PRD-v1.md`](PRD-v1.md). The prototype as tested is at `/v1/` (git tag `v1-prototype`).

## 1. Overview

The Conversation Language Coach helps language learners improve everyday speaking through feedback grounded in their real conversations. It identifies useful expressions and opportunities to improve communication, supports optional AI practice, and makes progress visible through reports backed by conversation examples.

This iteration builds on Prototype A (#1 "Learn, Practice, Track"). It incorporates the depth and specificity of Prototype B's feedback (#2 "Habit-Stack Nudges") and the simplicity of Prototype C's experience (#3 "Double Subtitles"). It preserves Prototype A's existing tabs: Home, Vocab, Practice, and Progress. It adds a short onboarding so feedback can start from the learner's level.

The product expands beyond vocabulary collection to support pronunciation, grammar, sentence structure, and communication appropriate to the situation. Users should understand what to try next and see whether they apply it in subsequent conversations.

**Decision status**

- **Confirmed:** approved product behavior for this iteration.
- **To validate:** a technical capability or measurement method that has not been demonstrated.
- **TBD:** an implementation or operational decision still requiring definition.

Confirmed requirements describe intended behavior; they do not imply that the current prototype already implements it.

## 2. Problem and Audience

Learners who use their target language in daily life encounter useful expressions and speaking difficulties, but often lack a way to revisit those moments. Generic feedback does not show them what to change. Lists of saved vocabulary also do not demonstrate whether their communication is improving.

**Primary audience:** language learners living in a country or environment where their target language is regularly spoken, with opportunities to use it in everyday interactions. An example is a non-native English speaker living in the United States.

The design prioritizes learners who want to improve existing participation in real conversations. Learners with little exposure to the target language are outside this iteration's primary audience.

> How might we help learners living in their target-language environment improve everyday communication and build speaking confidence through concrete feedback from real conversations?

## 3. Research Basis

The team's November 10 discussion synthesized feedback across three prototypes. The following findings inform this version:

| Finding | Product implication |
| --- | --- |
| Participants valued content from their own real conversations. | Retain real conversations as the core source of learning and assessment. |
| Generic feedback was insufficient and sometimes discouraging. Participants asked for their exact words, a suggested revision, and the reason. | Show the learner's original speech and a concrete suggested alternative, with an optional one-line reason. |
| Needs extended beyond vocabulary. | Cover pronunciation, grammar, structure, expressions, and cultural context. |
| Applying feedback in later conversations felt like meaningful growth. | Ground progress in evidence from subsequent real conversations. |
| Participants resisted forced learning during entertainment. | Deliver optional feedback after conversations rather than interrupting them with mandatory practice. |
| Recording raised confidentiality and privacy concerns. | Provide visible recording status and direct user control; validate whether controls are sufficient. |
| Some participants struggled with navigation and unclear actions, and asked who the people in the sample conversations were. | Simplify access to feedback, distinguish saving from practicing, and add a short onboarding that sets context. |
| A participant asked how the app would know which phrases she doesn't already know. | Calibrate to the learner's level through onboarding and early conversations. |

**Research limitations**

Participants reviewed predetermined conversation content rather than feedback generated from conversations they had just completed. Emotional relevance, sustained engagement, and actual improvement therefore remain unvalidated. Preferences also differed with participants' language environments.

**Subsequent change to the recording direction**

The meeting explored selective recording through short consent prompts. During subsequent product clarification, the product owner chose a different approach: one initial activation followed by ongoing recording, with one-tap pause and manual resume. This supersedes the short-session prompt proposal. Its convenience and privacy tradeoffs require further testing; it is not a validated outcome of the original study.

## 4. Goals and Scope

**Goals**

1. Turn authentic conversations into specific, manageable learning opportunities.
2. Help learners apply improvements in subsequent real interactions.
3. Show understandable progress supported by actual conversation evidence.
4. Reduce repeated interaction required to capture conversations.
5. Keep practice optional and feedback easy to access.
6. Start feedback at the learner's level from the first conversation.

**In scope**

- A short onboarding: target language, self-rated level, everyday contexts, and recording activation.
- Ongoing recording after initial activation, with pause and resume controls.
- Conversation transcripts, contextual expressions, and speaker attribution.
- A Top 3 summary of improvements per conversation, with all other learning points listed below it.
- Expressions in Vocab; Pronunciation and Skill Clusters in Progress.
- Optional AI partner practice based on real conversation feedback.
- Separate reports for real conversations and AI practice.
- Skill progress bars supported by conversation examples.
- Optional notifications when conversation feedback is ready.

**Outside the current scope**

- Mandatory daily AI practice or fixed daily learning quotas.
- Forced learning interruptions during social media or video consumption.
- Combining all three prototypes' content-capture mechanisms.
- Fixed weekly quotas for new expressions.
- Short 2–3 minute recording prompts or daily consent prompts.
- Treating other speakers' performance as the learner's performance.
- Combining AI practice scores with real-conversation progress.
- A full placement test during onboarding.

Calendar-based recording scheduling is not required for the selected flow. Additional recording schedules can be considered later, but are not approved scope.

## 5. Information Architecture

This iteration keeps Prototype A's four tabs and gives each a clear job.

| Existing tab | Responsibility in this iteration |
| --- | --- |
| Home | Recent conversations, available feedback (Top 3 per conversation), and recording controls. Final layout is TBD. |
| Vocab | Expressions: automatically extracted and manually saved, each with its original context. Keeps the existing flashcard review. |
| Practice | Optional AI partner practice grounded in identified improvement opportunities. |
| Progress | Reports and skill progress: Pronunciation and Skill Clusters with progress bars and supporting examples; real conversations and AI practice shown separately. |

**Confirmed:** complete progress summaries and skill progress bars belong in Progress. Do not introduce a duplicate progress-summary requirement on Home.

The exact layout inside Progress, and how Pronunciation and Skill Clusters sit next to the real-conversation and AI-practice reports, is a layout decision still to be resolved.

## 6. Functional Requirements

### 6.0 Onboarding (new in v2)

| ID | Requirement (proposed Nov 12, team to confirm) |
| --- | --- |
| ONB-01 | Ask for the target language and the languages the learner already speaks. |
| ONB-02 | Ask for a self-rated speaking level and the everyday contexts where they use the language (e.g. work, school, friends, services). |
| ONB-03 | Removed Nov 13: onboarding does not show a feedback sample (decided after the v2 prototype review). |
| ONB-04 | Explain ongoing recording and ask the learner to enable it (REC-01). |
| ONB-05 | Keep onboarding short; every step except recording activation can be skipped. |
| ONB-06 | Use onboarding answers as a starting estimate of level, refine it from the learner's first real conversations, and let the learner adjust it. |

To validate: whether self-rating plus early conversations is enough to tell which expressions a learner already knows. Number of steps and exact questions are TBD.

### 6.1 Recording and Control

| ID | Confirmed requirement |
| --- | --- |
| REC-01 | During first-time setup, explain ongoing recording and require the user to actively enable it. |
| REC-02 | After activation, recording continues without a repeated daily permission prompt, subject to the user's pause state and technical availability. |
| REC-03 | Clearly indicate whether recording is active or paused. |
| REC-04 | Provide an obvious one-tap Pause control. |
| REC-05 | A user-initiated pause persists until the user explicitly selects Resume. |
| REC-06 | Do not impose a fixed 2–3 minute recording limit. |

To validate: background operation, operating-system constraints, battery impact, recording reliability, and recovery after interruptions. The product must not imply it is recording when capture is unavailable. Handling app restarts, device restarts, and permission changes is TBD, while preserving an intentional pause is mandatory.

One-time product activation does not define consent handling for other participants. Participant notice/consent, recording exclusions, and related launch requirements remain TBD (see §11). No legal compliance claim is made by this PRD.

### 6.2 Conversation Processing and Speaker Attribution

| ID | Confirmed requirement |
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

| ID | Confirmed requirement |
| --- | --- |
| FDB-01 | Generate feedback after a conversation, without interrupting the conversation with required learning actions. |
| FDB-02 | Show a Top 3 summary of the most important improvements at the top of each conversation's feedback. |
| FDB-03 | Show fewer than three when fewer meaningful recommendations exist. |
| FDB-04 | Below the Top 3, list all other learning points from the conversation (further improvements and useful expressions), each attributed to who said it. |
| FDB-05 | Present each improvement as conversation context and the learner's original wording, followed by a suggested alternative. |
| FDB-06 | Each improvement may include an optional one-line reason, collapsed by default and shown on tap. |
| FDB-07 | Cover relevant pronunciation, grammar, structure, expression, and cultural-context opportunities. |

TBD: how the Top 3 are chosen. Candidate considerations include impact on understanding, recurrence, and usefulness in upcoming everyday interactions. These are proposed criteria, not a finalized algorithm.

Suggested wording must preserve the learner's intended meaning and suit the conversation context. The method for evaluating this requirement is to validate.

### 6.4 Expressions and Saving

| ID | Confirmed requirement |
| --- | --- |
| EXP-01 | Automatically identify potentially useful expressions from recorded conversations. |
| EXP-02 | Let users manually save the items they want to revisit or practice, preserving the existing behavior. Saved items appear in Vocab. |
| EXP-03 | Include everyday expressions and phrases, not only slang. |
| EXP-04 | Keep expressions connected to their original conversation context. |
| EXP-05 | Base recommendations on actual conversations rather than a fixed quota of two new suggestions per week. |
| EXP-06 | Clearly distinguish Save actions from Practice actions. |

Expressions spoken by others may be retained as text with context. Their usage must not be credited as evidence that the learner used the expression.

### 6.5 Pronunciation

| ID | Confirmed requirement |
| --- | --- |
| PRO-01 | Identify pronunciation opportunities in the learner's speech. |
| PRO-02 | Prioritize recurring issues and issues that affect understanding. |
| PRO-03 | Do not mark accent differences as errors when they do not affect understanding. |
| PRO-04 | Provide separate, clearly labeled controls for learner audio and model pronunciation. |
| PRO-05 | Play audio only when the user selects a playback control. |

The goal is clearer communication, not eliminating the learner's accent. Pronunciation assessment accuracy and suitable reference pronunciations are to validate.

### 6.6 Skill Clusters and Progress Bars

| ID | Confirmed requirement |
| --- | --- |
| SKL-01 | Include grammar, sentence structure, and cultural context within Skill Clusters. |
| SKL-02 | Show progress bars for assessed skills in Progress. |
| SKL-03 | Support progress displays with actual conversation examples, including earlier and more recent performance where available. |
| SKL-04 | Assess real-conversation progress using only the learner's own speech. |
| SKL-05 | Keep AI practice assessment separate from real-conversation assessment. |

**Scoring status:** detailed rubrics, thresholds, and aggregation methods are explicitly to validate. Progress bars are approved as a presentation format; this does not approve a fabricated numeric scoring system.

The intended meaning of a full bar is consistent demonstration of the assessed skill in observed conversations, not complete mastery of a language.

Before production scoring, define and test:

- What each skill measures and what observable performance counts as improvement.
- How a personal baseline is established (starting from onboarding, ONB-06).
- The minimum amount and variety of evidence required.
- How multiple conversations are aggregated and how recent evidence is weighted.
- How conversational difficulty and opportunities to demonstrate a skill affect comparison.
- How uncertainty and insufficient evidence appear to users.

Missing evidence must not automatically count as failure or regression. A learner may not have had an opportunity to use a particular expression or skill in the recorded sample.

### 6.7 AI Partner Practice

| ID | Confirmed requirement |
| --- | --- |
| PRA-01 | Retain the existing AI partner practice capability. |
| PRA-02 | Offer practice based on improvement opportunities from real conversations. |
| PRA-03 | Let users choose whether and when to practice. |
| PRA-04 | Do not require daily practice tasks. |
| PRA-05 | Assess practice separately and display its results in Progress. |

Example: if a learner struggled to express a request while ordering food, offer a similar scenario in which they can try the suggested wording.

### 6.8 Reports

| ID | Confirmed requirement |
| --- | --- |
| RPT-01 | Keep reports inside the existing Progress tab; do not add a separate Reports tab. |
| RPT-02 | Present real-conversation results and AI practice results separately within this area. |
| RPT-03 | Provide This Week, This Month, and All Time filters. |
| RPT-04 | Default to This Week. |
| RPT-05 | Make skill progress and its supporting evidence available in the reports. |

TBD: calendar-week boundaries, time-zone handling, and exact report layout. No new Home progress dashboard is required.

### 6.9 Notifications

| ID | Confirmed requirement |
| --- | --- |
| NTF-01 | Offer a notification when post-conversation feedback is ready. |
| NTF-02 | Let users disable these notifications. |
| NTF-03 | Let users ignore the notification and review feedback later. |
| NTF-04 | Do not expose conversation quotations on the lock screen. |

Example copy: "Your latest conversation has 2 points to review." Final copy is TBD. Delivery timing, batching, and frequency controls need validation to avoid excessive notifications.

## 7. Primary User Journey

1. In a short onboarding, the learner picks their language, rates their level, and names the contexts where they speak it.
2. The learner understands the ongoing-recording behavior and activates it.
3. Recording continues while enabled. The learner can pause before sensitive interactions and manually resume later.
4. The system identifies a completed conversation, produces a transcript, and separates learner speech from other speakers.
5. It generates a Top 3 summary of improvements, plus all other learning points and contextual expressions worth learning.
6. The learner receives a notification if enabled and opens the feedback when convenient.
7. The learner reviews original wording and suggested alternatives (opening a one-line reason if they want it), saves useful expressions to Vocab, or listens to pronunciation comparisons.
8. The learner optionally practices related situations with the AI partner.
9. In later real conversations, the system looks for evidence of improvement in the learner's own speech.
10. Progress reports show real-conversation progress and AI practice results separately, defaulting to This Week.

## 8. Prototype Requirements and Acceptance Criteria

The updated prototype should make the confirmed experience reviewable without claiming unbuilt recording or scoring capabilities.

| Area | Acceptance criteria |
| --- | --- |
| Existing navigation | Home, Vocab, Practice, and Progress remain available. |
| Onboarding | A short onboarding asks for language, level, and contexts, and activates recording; optional steps can be skipped. |
| Recording state | Active and paused states are distinguishable; Pause changes the state and Resume is required to reactivate it. |
| Feedback | A conversation shows a Top 3 summary at the top, each with context, original wording, and a suggested alternative; a one-line reason opens on tap. All other learning points are listed below. |
| Learning content | Automatically extracted items can be manually saved to Vocab; saving does not start practice. |
| Speaker distinction | Examples show whether the learner or another person spoke; other speakers do not contribute to the learner's score. |
| Pronunciation | Learner and model audio controls are separate and user initiated; no playable other-speaker audio appears. |
| Skill evidence | Progress bars link to inspectable examples rather than appearing as unexplained scores. |
| Practice | A feedback item can lead to optional related AI practice. |
| Reports | Real conversation and AI practice remain separate in Progress; This Week is the default, with This Month and All Time available. |
| Notifications | A feedback-ready notification is represented, can be disabled, and contains no conversation quotations. |

Use representative sample conversations where backend functions are unavailable. Label simulated scores and states clearly in prototype documentation. Exact scoring and continuous-recording feasibility remain validation tasks.

## 9. Validation Plan

**Usability and desirability**

- Does onboarding give enough context that the conversations and feedback make sense without a sample?
- Do learners feel the feedback matches their level?
- Can users understand the recording state and pause it without assistance?
- Do they understand that a pause will remain until they manually resume?
- Do they find the Top 3 relevant and easy to act on? Do they open the one-line reasons?
- Can they distinguish extracted expressions, saved items, and practice actions?
- Can they understand a progress bar by inspecting its supporting examples?
- Can they distinguish real-conversation performance from AI practice performance?
- Are feedback notifications useful without feeling disruptive?

Where possible, evaluate feedback from conversations the participant actually completed, addressing a limitation of the earlier study.

**Technical validation**

- Background capture reliability and battery impact.
- Accurate speaker attribution and preservation of learner-only audio examples.
- Conversation segmentation and feedback readiness.
- Transcription accuracy, including mixed-language conversations.
- Contextually appropriate recommendations and pronunciation assessment.
- Level estimation from onboarding and early conversations.
- Stable skill scoring supported by sufficient evidence.

## 10. Proposed Success Measures

These are evaluation proposals, not confirmed numerical targets. Set definitions and targets after baseline testing.

| Measure | What it helps evaluate |
| --- | --- |
| Feedback usefulness rating | Whether recommendations are relevant and actionable. |
| Save and optional practice usage | Whether users choose to engage with extracted learning opportunities. |
| Later application of recommendations | Whether learning transfers into real conversations. |
| Progress-report comprehension | Whether users correctly understand what the bars and evidence represent. |
| Notification usefulness and disable rate | Whether reminders support engagement without excessive interruption. |
| Recording-state comprehension and pause-task success | Whether users can control capture confidently. |
| Onboarding completion and perceived level fit | Whether the starting level estimate makes early feedback feel right. |
| Assessment agreement with human review | Whether feedback and skill judgments are credible. |

Do not use raw recording duration or vocabulary count alone as evidence of learning success.

## 11. Outstanding Implementation Decisions

These items remain unresolved and must not be presented as validated behavior:

| Item | Required next step |
| --- | --- |
| Participant recording controls | Define participant notice/consent and situations where recording should not proceed. Ongoing recording is the product's core assumption, and some places, including California where the team is based, generally require every party's consent to record a private conversation. Get advice before any real-world use. |
| Ongoing recording feasibility | Test platform support, battery use, interruptions, and recovery. |
| Speaker identification | Define enrollment or identification method and uncertainty handling. |
| Other-speaker audio handling | Define temporary processing and deletion so retained learning records contain only their text, expressions, and context. |
| User data controls | Define deletion, export, storage location, access controls, and retention periods. |
| Level calibration | Define how onboarding answers and early conversations estimate what the learner already knows, and test how accurate it is. |
| Conversation boundaries | Test how the system separates interactions and determines when feedback is ready. |
| Scoring | Define skill rubrics, baseline, evidence thresholds, aggregation, and uncertainty displays. |
| Feedback prioritization | Define how the system chooses the Top 3 recommendations. |
| Reports and navigation | Resolve the detailed layout within Progress and calendar/time-zone semantics. |
| Notifications | Test delivery delay, batching, and frequency. |

## 12. Changes from Prototype A

| Area | Updated requirement |
| --- | --- |
| Audience | Focus on learners living in a target-language environment. |
| Onboarding | New short onboarding: language, self-rated level, contexts, and recording activation. |
| Learning focus | Expand from vocabulary and expressions to actual speaking performance. |
| Recording | First-time activation followed by ongoing capture, with one-tap pause and manual resume; no daily prompt. |
| Feedback | A Top 3 summary of improvements at the top, showing context, original wording, and alternatives, with an optional one-line reason; all other learning points listed below. |
| Expressions | Context-based recommendations without weekly quotas; retain automatic extraction, manual saving to Vocab, and flashcard review. |
| Pronunciation | Learner/model audio comparison focused on intelligibility and recurring issues. |
| Progress | Skill bars supported by evidence; scoring rules remain to validate. Replaces the fixed weekly goals ("3 new phrases used", "5 practiced") in Prototype A. |
| Speaker scope | Assess only the learner; retain other speakers' text and contextual expressions for learning. |
| Practice | Keep optional AI partner practice tied to real-conversation feedback. |
| Reports | Keep both assessment types separate inside Progress; This Week, This Month, and All Time filters. |
| Notifications | Optional post-conversation feedback notifications without lock-screen quotations. |
| Navigation | Preserve the existing four tabs (Home, Vocab, Practice, Progress); simplify content and clarify actions. |

**Source basis:** team discussion transcript dated November 10, 2026; recommendation slides 10–13; subsequent product-owner decisions confirmed on November 12, 2026 (including tabs, Top 3 layout, optional reason, and onboarding). Later confirmed decisions supersede earlier proposals where explicitly documented above.
