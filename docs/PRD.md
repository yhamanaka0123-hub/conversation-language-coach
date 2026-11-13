# PRD v2.2: Conversation Language Coach

Version 2.2 · November 12, 2026 · INFO 213 · Team 12
Status: Confirmed product direction. Technical and operational details marked TBD or To validate are listed in §12.
Version 1 (Oct 20, 2026) is kept in [`PRD-v1.md`](PRD-v1.md). The prototype as tested is at `/v1/` (git tag `v1-prototype`); the current prototype is at the site root and does not yet reflect every requirement here (see §11).

## 1. Overview

The Conversation Language Coach helps language learners improve everyday speaking through feedback grounded in their real conversations. Learners record selected conversations by accepting a short prompt or by starting a recording themselves. The product turns each capture into concrete feedback and learning content, supports optional AI practice, and shows progress through reports backed by examples. Captured audio and complete transcripts are deleted after analysis; only learning outputs are kept.

This iteration builds on Prototype A (#1 "Learn, Practice, Track"). It incorporates the depth and specificity of Prototype B's feedback (#2 "Habit-Stack Nudges") and the simplicity of Prototype C's experience (#3 "Double Subtitles").

The main navigation is **Home / Learn / Practice / Insights**:

- **Home:** recent conversations, their feedback, and recording access.
- **Learn:** actionable learning content to review, save, and practice.
- **Practice:** optional AI conversation practice.
- **Insights:** performance and progress reports.

The product covers expressions, pronunciation, grammar, sentence structure, tone, and cultural context, not only vocabulary. Learners should understand what to try next and see whether they apply it in later conversations.

**Decision status**

- **Confirmed:** approved product behavior for this iteration.
- **To validate:** a technical capability or measurement method that has not been demonstrated.
- **TBD:** an implementation or operational decision still requiring definition.

Requirements describe intended product behavior; they do not imply that the current prototype already implements them.

## 2. Problem and Audience

Learners who use their target language in daily life encounter useful expressions and speaking difficulties, but often lack a way to revisit those moments. Generic feedback does not show them what to change. Lists of saved vocabulary also do not show whether their communication is improving.

**Primary audience:** language learners living in a country or environment where their target language is regularly spoken, with opportunities to use it in everyday interactions. An example is a non-native English speaker living in the United States.

**Secondary audience:** learners outside that environment who use AI conversation practice. They can turn recording prompts off and use the product in AI-only mode (§6.10).

> How might we help learners living in their target-language environment improve everyday communication and build speaking confidence through concrete feedback from real conversations?

## 3. Research Basis

The team's November 10 discussion synthesized feedback across three prototypes. The following findings inform this version:

| Finding | Product implication |
| --- | --- |
| Participants valued content from their own real conversations. | Retain real conversations as the core source of learning and assessment. |
| Generic feedback was insufficient and sometimes discouraging. Participants asked for their exact words and a suggested revision. | Show brief context, the learner's original wording, and a concrete suggested alternative. |
| Needs extended beyond vocabulary. | Cover expressions, pronunciation, grammar, structure, tone, and cultural context. |
| Applying feedback in later conversations felt like meaningful growth. | Ground progress in evidence from later real conversations. |
| Participants resisted forced learning during entertainment. | Keep practice optional and deliver feedback after conversations, not during them. |
| Recording raised confidentiality and privacy concerns. | Record only after the learner accepts a prompt or starts a recording, show clearly when recording is active, and delete audio and complete transcripts after analysis. |
| Some participants struggled with navigation and unclear actions, and asked who the people in the sample conversations were. | Give each tab one clear purpose, distinguish saving from practicing, and add a short onboarding. |
| A participant asked how the app would know which phrases she doesn't already know. | Calibrate to the learner's level through onboarding and early conversations. |

**Research limitations**

Participants reviewed predetermined conversation content rather than feedback generated from conversations they had just completed. Emotional relevance, sustained engagement, and actual improvement therefore remain unvalidated. Preferences also differed with participants' language environments.

## 4. Goals and Scope

**Goals**

1. Turn authentic conversations into specific, manageable learning opportunities.
2. Help learners apply improvements in later real interactions.
3. Show understandable progress supported by concrete examples.
4. Make capturing a useful conversation quick, without recording anything the learner did not choose to record.
5. Keep practice optional and feedback easy to access.
6. Start feedback at the learner's level from the first conversation.
7. Support learners without regular real-world conversations through AI practice, without presenting AI performance as real-world improvement.

**In scope**

- A short onboarding: target language, self-rated level, everyday contexts, recording preferences, and an optional calendar connection.
- Two opt-in recording modes: prompted recording and manual quick-record.
- Optional calendar connection to improve prompt timing; calendar events never start recording.
- AI-only mode: recording prompts can be turned off while manual recording stays available.
- Deleting captured audio and complete transcripts after analysis, keeping only learning outputs.
- Up to three prioritized improvement points per conversation, each as brief context → original wording → suggested alternative, with additional points when relevant.
- A Learn tab organized into Expressions, Pronunciation, and Speaking Tips, with automatic extraction, manual saving, and a format suited to each type.
- "This week's picks": two highlighted expressions per week.
- Tap-to-play model pronunciation with textual pronunciation feedback.
- Optional AI partner practice based on real conversation feedback.
- Insights: separate reports for real conversations and AI practice, with This Week, This Month, and All Time filters.
- Skill progress bars supported by concrete examples.
- Optional notifications for recording prompts and for feedback that is ready.

**Outside the current scope**

- Always-on, ongoing, or automatic daily recording.
- Recording or buffering audio before the learner accepts a prompt or starts a recording.
- Recording started automatically by calendar events.
- Keeping captured audio or complete transcripts after analysis.
- Playback of the learner's own recorded audio.
- Mandatory daily AI practice or fixed daily learning quotas.
- Forced learning interruptions during social media or video consumption.
- Fixed weekly quotas for new expressions. (The two weekly picks are highlights, not a limit.)
- Treating other speakers' performance as the learner's performance.
- Combining AI practice results with real-conversation progress.
- A full placement test during onboarding.
- A numeric speaking or confidence score.
- A progress dashboard on Home.

## 5. Information Architecture

| Tab | Purpose |
| --- | --- |
| Home | Recent conversations and their feedback (each conversation's Top 3), recording access (manual quick-record and the state of any active recording), and feedback-ready notifications. |
| Learn | Actionable learning content to review, save, and practice: This week's picks, Expressions, Pronunciation, and Speaking Tips. Suggested and saved items are clearly distinguished. |
| Practice | Optional AI conversation practice, grounded in identified improvement points or, for AI-only users, in stated learning needs. |
| Insights | Performance and progress reports: real conversations and AI practice evaluated separately, with time filters, skill progress bars, and supporting examples. |

**Keeping the purposes distinct**

- Home shows what is new from recent conversations and how to record. It does not hold a progress dashboard.
- Learn holds the content itself. It stays a separate tab and is not merged into Insights.
- Insights shows whether the learner applies what they learn. It keeps the Natural Expressions skill measure, which shows whether the learner uses natural expressions in real conversations, but does not repeat the full Learn content list.
- Practice is optional, and its results stay separate from real-conversation progress.

## 6. Functional Requirements

### 6.0 Onboarding

| ID | Requirement |
| --- | --- |
| ONB-01 | Ask for the target language and the languages the learner already speaks. |
| ONB-02 | Ask for a self-rated speaking level and the everyday contexts where they use the language (e.g. work, school, friends, services). |
| ONB-03 | Removed Nov 12: onboarding does not show a feedback sample. |
| ONB-04 | Explain the two recording modes and that nothing is recorded until the learner accepts a prompt or starts a recording. Let the learner choose whether to receive recording prompts or use AI-only mode. |
| ONB-05 | Keep onboarding short; let learners skip optional steps. |
| ONB-06 | Use onboarding answers as a starting estimate of level, refine it from the learner's first conversations, and let the learner adjust it. |
| ONB-07 | Offer an optional calendar connection to improve prompt timing (§6.2). The learner can skip it. |

To validate: whether self-rating plus early conversations is enough to tell which expressions a learner already knows.

### 6.1 Recording Modes

Recording is always opt-in. There are two modes; both can be used by the same learner.

**A. Prompted recording**

| ID | Requirement |
| --- | --- |
| REC-01 | The app may prompt the learner to record when a conversation may be worth capturing. Nothing is recorded or buffered before the learner accepts the prompt. |
| REC-02 | A prompted recording lasts a default duration of 2–3 minutes, adjustable in settings. |
| REC-03 | The learner can stop a prompted recording early. |
| REC-04 | Once the learner has two usable captures in a day, stop proactive prompts for the rest of that day. Manual recordings count toward this threshold. |
| REC-05 | After the threshold is reached, the learner can still record manually. |

**B. Manual quick-record**

| ID | Requirement |
| --- | --- |
| REC-06 | Provide a one-tap entry point to start recording. |
| REC-07 | The learner explicitly starts a manual recording and stops it manually. It is not limited to the prompted-recording duration. |

**Both modes**

| ID | Requirement |
| --- | --- |
| REC-08 | Clearly show when recording is active, with a way to stop it. |
| REC-09 | The product must not imply it is recording when it is not, or that it is not recording when it is. |
| REC-10 | Turning recording prompts off does not disable manual recording. |

A shortcut similar to a Control Center toggle or Shazam's quick-capture is a reference interaction for manual quick-record, not a confirmed platform capability; its implementation feasibility is TBD.

TBD: the exact default duration, the allowed duration settings, what counts as a usable capture, and prompt frequency when prompts are ignored.

**Privacy concerns that remain.** Opt-in recording reduces but does not remove privacy risk. Other participants in a conversation have not necessarily agreed to be recorded. Participant notice/consent and situations where recording should not proceed are TBD; some places, including California where the team is based, generally require every party's consent to record a private conversation. No legal compliance claim is made by this PRD.

### 6.2 Optional Calendar Connection

| ID | Requirement |
| --- | --- |
| CAL-01 | Offer an optional calendar connection, during onboarding and later in settings, to improve the timing of recording prompts. |
| CAL-02 | Calendar events never start recording automatically. The learner must still accept a prompt or start a manual recording. |
| CAL-03 | The product works fully without a calendar connection. |

TBD: calendar-based timing rules, calendar permissions requested, and how suitable or excluded events are identified and handled.

### 6.3 Conversation Processing and Speaker Attribution

| ID | Requirement |
| --- | --- |
| CON-01 | Organize each capture into a conversation and analyze it. |
| CON-02 | Distinguish the learner's speech from other speakers' speech. |
| CON-03 | Use only the learner's own speech for progress assessment. |
| CON-04 | Allow useful expressions spoken by any speaker to become learning content. |
| CON-05 | Clearly attribute learning examples to the learner or another speaker. |

To validate: speaker identification, mixed-language handling, and transcription quality on short captures.

Proposed error behavior, to validate: when speaker attribution is uncertain, withhold affected speech from scoring rather than assigning another person's speech to the learner.

### 6.4 Data Retention and Privacy

After a capture is analyzed:

| ID | Requirement |
| --- | --- |
| DAT-01 | Delete the captured audio. |
| DAT-02 | Delete the complete transcript. |
| DAT-03 | Retain only learning outputs and the minimum information needed to support them. |

Retained learning outputs may include:

- Relevant excerpts of original sentences (for example, the sentence an improvement point quotes).
- Brief conversation context (for example, "Coffee chat with Maya, casual").
- Extracted or saved expressions, including ones other people said, kept as text with their context.
- Suggested alternatives and feedback.
- Skill assessment results and the supporting learning evidence.

Deleting the complete transcript is different from keeping selected excerpts: the product keeps the specific sentences that learning outputs rely on, not the conversation as a whole. This document does not claim that no conversation content is retained.

TBD: exact deletion timing, how long data is kept during processing, what happens when processing fails, storage location and processor behavior, participant notice/consent, and learner deletion controls. Whether AI practice chat transcripts follow the same deletion policy is also TBD. No privacy or compliance claim beyond these requirements is made.

### 6.5 Conversation Feedback

Each improvement point follows **brief context → original wording → suggested alternative**. For example:

- Context: Grammar · coffee chat with Maya
- You said: "I have went to Tilden last month."
- Try: "I went to Tilden last month."

| ID | Requirement |
| --- | --- |
| FDB-01 | Generate feedback after a capture, without interrupting the conversation. |
| FDB-02 | Show at most three prioritized improvement points at the top of each conversation's feedback. |
| FDB-03 | Show fewer than three when fewer are useful; do not force three suggestions. |
| FDB-04 | Make additional learning points available below the top points when relevant, each attributed to who said it. |
| FDB-05 | Present each improvement point as brief context, the learner's original wording, then a suggested alternative. |
| FDB-06 | A separate "Why?" explanation field is not required. |
| FDB-07 | Cover relevant expression, pronunciation, grammar, structure, tone, and cultural-context opportunities. |
| FDB-08 | Let the learner save any point or expression to Learn, and optionally start a related AI practice. Saving does not start practice. |

TBD: how the top points are chosen. Candidate considerations include impact on understanding, recurrence, and usefulness in upcoming everyday interactions. These are proposed criteria, not a finalized algorithm.

Suggested wording must preserve the learner's intended meaning and suit the conversation context. The method for evaluating this is to validate.

### 6.6 Learn

Learn is a separate tab for actionable learning content. It is organized by learning type, and each type uses its own format rather than one vocabulary-flashcard format.

| Category | What it holds | Format |
| --- | --- | --- |
| Expressions | Vocabulary, phrases, slang, and everyday expressions | The expression, its meaning, and the context it is used in |
| Pronunciation | Pronunciation improvement opportunities found in the learner's speech | The word or phrase, tap-to-play model pronunciation, and a short pronunciation cue where useful |
| Speaking Tips | Grammar, sentence structure, tone, and cultural context | Original wording → suggested alternative, with brief context |

| ID | Requirement |
| --- | --- |
| LRN-01 | Automatically extract learning content from analyzed conversations into the three categories. |
| LRN-02 | Let learners manually save the items they want to revisit or practice. |
| LRN-03 | Clearly distinguish suggested items (extracted, not yet saved) from saved items. |
| LRN-04 | Keep each item connected to its brief conversation context and attributed to who said it. |
| LRN-05 | Include everyday expressions and phrases, not only slang. |
| LRN-06 | Do not cap how many items are extracted or saved. |
| LRN-07 | Clearly distinguish Save actions from Practice actions. |
| LRN-08 | Use the format for each category shown above; do not present all content as vocabulary flashcards. |

Expressions spoken by others may be retained as text with context. Their use by others is not evidence that the learner used them.

**This week's picks**

| ID | Requirement |
| --- | --- |
| PCK-01 | Show two highlighted expressions per week at the top of Learn. |
| PCK-02 | Prioritize relevance to the learner's recent conversations and needs. |
| PCK-03 | For AI-only learners, picks may draw on AI practice and stated learning needs. |
| PCK-04 | Each pick shows the expression, its meaning, and the context it relates to, and can be saved. |
| PCK-05 | Picks are recommendations, not a limit on other extracted or saved content. |

TBD: how picks are selected and what happens when there are fewer than two good candidates.

### 6.7 Pronunciation

| ID | Requirement |
| --- | --- |
| PRO-01 | Identify pronunciation opportunities in the learner's speech. |
| PRO-02 | Prioritize recurring issues and issues that affect understanding. |
| PRO-03 | Do not treat harmless accent differences as errors. |
| PRO-04 | Provide tap-to-play model pronunciation for each pronunciation item. |
| PRO-05 | Give textual pronunciation feedback (for example, which syllable to stress). |
| PRO-06 | Play audio only when the learner taps a playback control. |

Because captured audio is deleted after analysis, the product does not offer playback of the learner's own recording or an original-audio comparison. The goal is clearer communication, not eliminating the learner's accent. Assessment accuracy and suitable reference pronunciations are to validate.

### 6.8 AI Partner Practice

| ID | Requirement |
| --- | --- |
| PRA-01 | Retain the existing AI partner practice capability. |
| PRA-02 | Offer practice based on improvement points from real conversations, or on stated learning needs for AI-only learners. |
| PRA-03 | Let learners choose whether and when to practice. |
| PRA-04 | Do not require daily practice tasks. |
| PRA-05 | Assess practice separately and show its results in Insights. |

Example: if a learner struggled to make a request while ordering food, offer a similar scenario to try the suggested wording.

### 6.9 Insights Reports

| ID | Requirement |
| --- | --- |
| RPT-01 | Keep reports inside Insights; do not add a duplicate progress dashboard to Home. |
| RPT-02 | Evaluate and present real-conversation results and AI practice results separately. |
| RPT-03 | Provide This Week, This Month, and All Time filters. |
| RPT-04 | Default to This Week. |
| RPT-05 | Show skill progress bars supported by concrete examples from the learner's own speech. |
| RPT-06 | Show counts that can be checked against captures (for example, new expressions used in real conversations), not a score. |
| RPT-07 | Do not repeat the full Learn content list. |
| RPT-08 | For AI-only learners, show an appropriate empty state for real-conversation reports. |
| RPT-09 | Never present AI practice performance as evidence of real-world improvement. |

**Skill progress bars.** Skill measures cover natural expressions, grammar, sentence structure, pronunciation, and cultural context, assessed only from the learner's own speech. Each bar opens to concrete examples, such as an earlier and a more recent instance of the same kind of moment. A full bar means the skill is shown consistently in observed conversations, not mastery of the language. Detailed scoring rubrics, evidence thresholds, and aggregation methods are to validate; progress bars are approved as a presentation format, not a scoring formula. Missing evidence must not count as failure or regression.

TBD: calendar-week boundaries, time-zone handling, and exact report layout.

### 6.10 AI-Only Mode

| ID | Requirement |
| --- | --- |
| AIO-01 | Let learners turn recording prompts off completely and keep using AI conversation practice. |
| AIO-02 | Turning prompts off does not disable manual recording. |
| AIO-03 | Learn and Practice work for AI-only learners; Insights shows AI practice results and an empty state for real-conversation reports. |

### 6.11 Notifications

| ID | Requirement |
| --- | --- |
| NTF-01 | Deliver recording prompts as notifications the learner can accept or ignore; no recording starts unless they accept. |
| NTF-02 | Offer a notification when post-conversation feedback is ready. |
| NTF-03 | Let learners turn each kind of notification off. |
| NTF-04 | Let learners ignore a notification and review feedback later. |
| NTF-05 | Do not show conversation quotations on the lock screen. |

Example copy: "Your latest conversation has 2 points to review." Final copy, delivery timing, batching, and frequency are TBD.

## 7. Primary User Journeys

**Learner in a target-language environment**

1. In a short onboarding, the learner picks their language, rates their level, names the contexts where they speak it, chooses to receive recording prompts, and optionally connects a calendar.
2. Before a conversation, the learner either accepts a recording prompt or taps manual quick-record. Nothing is recorded before that.
3. A prompted recording runs for its set duration unless stopped early; a manual recording runs until the learner stops it. The app clearly shows that recording is active.
4. After two usable captures in a day, proactive prompts stop for that day; manual recording stays available.
5. The capture is analyzed. Audio and the complete transcript are deleted; learning outputs are kept.
6. The learner gets a feedback-ready notification if enabled and opens the feedback when convenient.
7. For each of up to three top points, the learner sees brief context, what they said, and what to try. Additional points appear below when relevant.
8. The learner saves useful items to Learn, or starts an optional related practice.
9. In Learn, the learner reviews This week's picks, Expressions, Pronunciation (with model playback), and Speaking Tips.
10. In later captures, the system looks for evidence of improvement in the learner's own speech.
11. Insights shows real-conversation progress and AI practice results separately, defaulting to This Week.

**AI-only learner**

1. In onboarding, the learner turns recording prompts off (AI-only mode). Manual recording stays available if they later want it.
2. Learn shows This week's picks based on AI practice and stated learning needs.
3. The learner practices with the AI partner.
4. Insights shows AI practice results and an empty state for real-conversation reports. AI performance is not presented as real-world improvement.

## 8. Prototype Requirements and Acceptance Criteria

The prototype should make these requirements reviewable without claiming unbuilt recording, analysis, or scoring capabilities. Status reflects the current prototype at the site root.

| Area | Acceptance criteria | Current prototype |
| --- | --- | --- |
| Navigation | Tabs read Home / Learn / Practice / Insights, each with its stated purpose. | Tabs read Home / Vocab / Practice / Progress |
| Onboarding | Asks for language, level, and contexts; explains the two recording modes; offers prompts or AI-only mode; offers an optional calendar connection. | Partly: language, level, contexts; recording step shows the earlier always-on design |
| Prompted recording | A prompt can be accepted or ignored; nothing records before acceptance; recording shows as active, can be stopped early, and ends after its duration; prompts stop after two usable captures that day. | Not built |
| Manual quick-record | A one-tap entry starts recording; the learner stops it manually; active recording is clearly shown; available even with prompts off. | Not built (prototype shows an always-on pause/resume pill) |
| Calendar | Calendar connection is optional and never starts recording. | Not built |
| Data retention | Prototype documentation states that audio and complete transcripts are deleted after analysis and which learning outputs are kept. | Not built |
| Feedback | Up to three points, each as brief context → original wording → suggested alternative, with more points when relevant; no "Why?" field required. | Built (also shows an optional "Why?") |
| Learn | Expressions, Pronunciation, and Speaking Tips, each in its own format; suggested vs saved is clear; saving does not start practice. | Partly: one Vocab list with New / Saved / Practiced filters and flashcards |
| This week's picks | Two highlighted expressions at the top of Learn, each savable. | Not built |
| Pronunciation | Tap-to-play model pronunciation and a text cue; no playback of the learner's own audio. | Partly: model playback built; also shows "Your audio (simulated)", which should be removed |
| Speaker distinction | Examples show who spoke; other speakers do not count toward the learner's progress. | Built |
| Practice | A feedback item can lead to optional related AI practice. | Built |
| Insights | Real conversations and AI practice separate; This Week default plus This Month and All Time; skill bars open to examples; empty real-conversation state for AI-only learners. | Partly: built as Progress; AI-only empty state not built |
| Notifications | Recording prompts and feedback-ready notifications are represented, can be turned off, and contain no quotations. | Partly: feedback-ready banner and toggle built; recording prompts not built |

Use representative sample conversations where backend functions are unavailable, and label simulated states and sample data clearly.

## 9. Validation Plan

**Usability and desirability**

- Do learners understand that nothing is recorded until they accept a prompt or start a recording?
- Do they accept prompts, and do 2–3 minutes capture enough of a conversation?
- Is manual quick-record easy to reach at the start of a conversation?
- Can they tell when recording is active and stop it without help?
- Are recording prompts well timed, with and without a calendar connection?
- Do learners understand what is deleted after analysis and what is kept?
- Does onboarding give enough context that the feedback makes sense, and does feedback match their level?
- Do they find the top points relevant and easy to act on?
- Do they understand the difference between Learn (content) and Insights (whether they apply it)?
- Do the three Learn categories and their formats match how learners think about the content?
- Are This week's picks useful?
- Is model pronunciation with a text cue enough without hearing their own audio?
- Do AI-only learners find the product useful, and do they understand the real-conversation empty state?
- Can learners distinguish real-conversation performance from AI practice performance?
- Are notifications useful without feeling disruptive?

Where possible, evaluate feedback from conversations the participant actually completed.

**Technical validation**

- Prompt timing and acceptance; quick-record entry points on each platform.
- Speaker attribution and transcription quality on short captures, including mixed-language conversations.
- Deleting audio and complete transcripts reliably after analysis.
- Contextually appropriate recommendations, weekly pick selection, and pronunciation assessment.
- Level estimation from onboarding and early conversations.
- Stable skill measures supported by sufficient evidence.

## 10. Proposed Success Measures

These are evaluation proposals, not confirmed numerical targets. Set definitions and targets after baseline testing.

| Measure | What it helps evaluate |
| --- | --- |
| Prompt acceptance rate and usable captures per day | Whether prompted recording fits into the learner's day. |
| Manual quick-record use | Whether learners capture conversations on their own initiative. |
| Feedback usefulness rating | Whether recommendations are relevant and actionable. |
| Save and optional practice usage | Whether learners engage with learning content. |
| Later application of recommendations | Whether learning transfers into real conversations. |
| Insights comprehension | Whether learners correctly understand the bars and examples. |
| Recording-state comprehension | Whether learners know when they are being recorded and can stop it. |
| Notification usefulness and disable rate | Whether notifications help without excessive interruption. |
| Onboarding completion and perceived level fit | Whether the starting level estimate makes early feedback feel right. |
| Assessment agreement with human review | Whether feedback and skill judgments are credible. |

Do not use raw recording duration or vocabulary count alone as evidence of learning success.

## 11. Current Prototype Summary

For reviewers comparing the prototype at the site root with this document. The prototype predates some confirmed decisions:

- **Onboarding:** three steps; the last turns on always-on recording. No prompt choice, AI-only mode, or calendar step.
- **Home:** an always-on Recording / Paused pill with Pause and Resume, a feedback-ready banner, a notifications toggle, and the latest conversation's Top 3. No prompted recording or manual quick-record.
- **Conversation feedback:** Top 3 as context → "You said" → "Try" (built), an optional "Why?", Save, I know this, and "Try it in a chat"; then all learning points. Pronunciation points show "Your audio (simulated)" and "Model".
- **Vocab:** one list with New / Saved / Practiced filters and flashcards; no categories or weekly picks.
- **Practice:** pick a person from your conversations; recap compares then and now.
- **Progress:** real conversations and AI practice, time filters, counts, skill bars with Before / Now examples.

Recording, notifications, learner audio, skill levels, and earlier periods are simulated or sample data.

## 12. Remaining Technical and Operational TBDs

| Area | TBD |
| --- | --- |
| Prompted recording | Exact default duration; allowed duration settings; definition of a usable capture; prompt frequency when prompts are ignored. |
| Manual quick-record | Feasibility of a Control Center or Shazam-like shortcut on each platform. |
| Calendar | Timing rules; permissions requested; how suitable and excluded events are identified and handled. |
| Data retention | Exact deletion timing; temporary retention during processing; failure handling; storage location and processor behavior; learner deletion controls. |
| AI practice data | Whether AI chat transcripts follow the same deletion policy. |
| Participant consent | Participant notice/consent and situations where recording should not proceed; legal advice before real-world use. |
| Speaker identification | Identification method and handling of uncertain attribution. |
| Level calibration | How onboarding answers and early conversations estimate what the learner already knows. |
| Feedback prioritization | How the top points are chosen. |
| Weekly picks | Selection method; behavior when there are fewer than two good candidates. |
| Scoring | Skill rubrics, baseline, evidence thresholds, aggregation, and uncertainty display. |
| Reports | Calendar-week boundaries, time-zone handling, and detailed Learn and Insights layouts. |
| Notifications | Final copy, delivery timing, batching, and frequency. |

## 13. Changes from Prototype A

| Area | Updated requirement |
| --- | --- |
| Audience | Primary: learners in a target-language environment. Secondary: learners elsewhere who use AI practice (AI-only mode). |
| Onboarding | New short onboarding: language, level, contexts, recording prompt choice, optional calendar connection. |
| Recording | Two opt-in modes, prompted (default 2–3 minutes, stop early, prompts end after two usable captures a day) and manual quick-record. No always-on or automatic recording. |
| Calendar | Optional connection to time prompts; never starts recording. |
| Data | Audio and complete transcripts deleted after analysis; only learning outputs kept. |
| Feedback | Up to three points as brief context → original wording → suggested alternative; more when relevant; no required "Why?". |
| Learn | Separate tab with Expressions, Pronunciation, and Speaking Tips, each in its own format; suggested vs saved clear; two weekly picks. |
| Pronunciation | Tap-to-play model pronunciation and text cues; no playback of the learner's own audio. |
| Insights | Formerly Progress. Real conversations and AI practice separate; time filters; skill bars with examples; AI-only empty state; no fixed weekly goals. |
| Practice | Optional AI practice tied to real-conversation feedback or stated needs. |
| Notifications | Recording prompts and feedback-ready notifications, each optional, no lock-screen quotations. |
| Navigation | Home / Learn / Practice / Insights. |

**Source basis:** team discussion transcript dated November 10, 2026; recommendation slides 10–13; confirmed team decisions of November 12, 2026, which replace earlier conflicting requirements (including always-on recording, persistent playback of user audio, and keeping full transcripts).
