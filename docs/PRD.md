# PRD v2.4: Afterchat (tentative name)

Version 2.4 · November 15, 2026 · INFO 213 · Team 12
Status: Confirmed product direction. Proposed safeguards and capabilities still to validate are marked as such; technical and operational details marked TBD are listed in §12.
Version 1 (Oct 20, 2026) is kept in [`PRD-v1.md`](PRD-v1.md). The prototype as tested is at `/v1/` (git tag `v1-prototype`); the current prototype is at the site root and does not yet reflect every requirement here (see §11). What changed in v2.4, after the November 13 prototype review, is listed in §14.

## 1. Overview

Afterchat (tentative name; formerly "Conversation Language Coach") helps language learners improve everyday speaking through feedback grounded in their real conversations. Learners record selected conversations by accepting a short prompt or by starting a recording themselves. The product turns each capture into concrete feedback and learning content, supports optional AI practice, and shows progress through reports backed by examples. Captured audio is deleted after analysis. Transcripts of the conversations a learner chose to record are kept, so they can replay a conversation in practice, and the learner can delete any of them.

This iteration builds on Prototype A (#1 "Learn, Practice, Track"). It incorporates the depth and specificity of Prototype B's feedback (#2 "Habit-Stack Nudges") and the simplicity of Prototype C's experience (#3 "Double Subtitles").

The main navigation is **Home / Learn / Practice / Insights**:

- **Home:** recent conversations, their feedback, and recording access.
- **Learn:** actionable learning content to review, save, and practice.
- **Practice:** optional AI conversation practice.
- **Insights:** performance and progress reports.

The product covers pronunciation, grammar, sentence structure, and natural expressions (including slang and cultural context), not only vocabulary. Learners should understand what to try next and see whether they apply it in later conversations.

**Decision status**

- **Confirmed:** approved product behavior for this iteration.
- **Proposed safeguard:** a protective requirement the team proposes, pending validation. Not yet confirmed. Requirement IDs start with SAF.
- **To validate:** a technical capability or measurement method that has not been demonstrated. Future capabilities marked this way are not committed for this iteration.
- **TBD:** an implementation or operational decision still requiring definition.

Requirements describe intended product behavior; they do not imply that the current prototype already implements them.

## 2. Problem and Audience

Learners who use their target language in daily life encounter useful expressions and speaking difficulties, but often lack a way to revisit those moments. Generic feedback does not show them what to change. Lists of saved vocabulary also do not show whether their communication is improving.

**Primary audience:** language learners living in a country or environment where their target language is regularly spoken, with opportunities to use it in everyday interactions. An example is a non-native English speaker living in the United States.

**Learners elsewhere:** country of residence is not an eligibility requirement for real-conversation features. Learners outside a target-language country may still use the language through online conversations, classes, work, community activities, or travel, and can record those conversations like anyone else.

**Secondary audience:** learners with few real-world opportunities to speak the language, who rely mainly on AI conversation practice. They can turn recording prompts off in Settings and use AI-only mode (§6.10). AI-only mode is an option the learner chooses later, not something onboarding offers, and never the default for everyone living outside a target-language country.

Personalization uses the learner's level (from a test score or learning app when the learner has one, otherwise self-rated on five CEFR-aligned levels), how often they use the language, and where they speak it (§6.0), not location alone.

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
| Recording raised confidentiality and privacy concerns. | Record only after the learner accepts a prompt or starts a recording, show clearly when recording is active, delete audio after analysis, and let the learner delete any kept transcript. |
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
8. Be clear about which languages and capabilities are supported, and where coverage is limited.

**In scope**

- A short onboarding: target language, level (from a test score or learning app, or picked from five CEFR-aligned levels), how often the learner uses the language, speaking contexts, consent to how recording works, prompts per day (2 recommended), and an optional calendar connection.
- Clear information on supported languages and the capabilities available for each (§6.12).
- Two opt-in recording modes: prompted recording and manual quick-record. Manual recording covers everyday conversations, classroom discussions, and the learner's own presentations and speaking practice.
- Optional calendar connection to improve prompt timing; calendar events never start recording.
- AI-only mode: recording prompts can be turned off in Settings while manual recording stays available.
- Deleting captured audio after analysis; keeping transcripts of recorded conversations for replay, with learner deletion.
- Recording from outside the app: the prompt as a notification, a lock-screen countdown for an active recording (add a minute or stop), and a Control Center button (platform feasibility to validate).
- Proposed safeguards for retained learning outputs: minimizing unnecessary sensitive details and deleting individual outputs (§6.4).
- Up to three prioritized improvement points per conversation, each as brief context → original wording → suggested alternative, with additional points when relevant.
- A Learn tab organized into Expressions, Pronunciation, and Speaking Tips, with automatic extraction, manual saving, and a format suited to each type.
- "This week's picks": two highlighted expressions per week.
- Tap-to-play model pronunciation with textual pronunciation feedback.
- Optional AI partner practice with one AI partner: pick a topic (Work, School, Friends, Family, or Surprise me), or replay a real conversation the learner recorded.
- Insights: separate reports for real conversations and AI practice, with This Week, This Month, and All Time filters.
- Skill progress bars supported by concrete examples, and recurring mistakes that have not improved yet.
- Optional notifications for recording prompts and for feedback that is ready.

**Outside the current scope**

- Always-on, ongoing, or automatic daily recording.
- Recording or buffering audio before the learner accepts a prompt or starts a recording.
- Recording started automatically by calendar events.
- Keeping captured audio after analysis.
- Playback of the learner's own recorded audio.
- Mandatory daily AI practice or fixed daily learning quotas.
- A required daily recording count or speaking duration, or penalties for declining or ignoring prompts.
- Using country of residence to decide who can use real-conversation features.
- Confident assessments for language varieties the product does not support.
- Intonation, pausing, and speech-chunking assessment (future capabilities to validate, §6.7).
- Forced learning interruptions during social media or video consumption.
- Fixed weekly quotas for new expressions. (The two weekly picks are highlights, not a limit.)
- Treating other speakers' performance as the learner's performance.
- Combining AI practice results with real-conversation progress.
- A full placement test during onboarding.
- A numeric speaking or confidence score.
- A progress dashboard on Home.
- Learner-created AI personas, or a cast of named AI characters.
- Offering AI-only mode in onboarding.

## 5. Information Architecture

| Tab | Purpose |
| --- | --- |
| Home | Recent conversations and their feedback (each conversation's Top 3), recording access (manual quick-record and the state of any active recording), and feedback-ready notifications. |
| Learn | Actionable learning content to review, save, and practice: This week's picks, Expressions, Pronunciation, and Speaking Tips. Suggested and saved items are clearly distinguished. |
| Practice | Optional AI conversation practice with one AI partner: a topic chat (Work, School, Friends, Family, Surprise me) or a replay of a recorded conversation, using the learner's saved improvement points. |
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
| ONB-01 | Ask for the target language and the languages the learner already speaks. When the learner picks a language, show which capabilities are available for it (§6.12). |
| ONB-02 | Ask for the learner's level (ONB-09), how often the learner uses the language, and the contexts where they speak it: Work, School, Friends, Family, or Other (the same four as the Practice topics, §6.8). |
| ONB-09 | Ask for the level on its own page. If the learner has a test score (e.g. TOEFL iBT, IELTS, Duolingo English Test) or connects a learning app (e.g. Duolingo, Speak, Memrise), it sets a starting level. Connecting an app shows a permission step that says what the product will read (course level and progress) and that it changes nothing in the app; once connected, the learner sees what was shared and can disconnect. Otherwise the learner picks one of five levels: Beginner (A1), Elementary (A2), Intermediate (B1), Upper-intermediate (B2), Advanced (C1–C2), each with a one-line description. The CEFR range is shown next to each level, so no separate CEFR question is needed. A level set from a score or app can be changed by hand. |
| ONB-03 | Removed Nov 12: onboarding does not show a feedback sample. |
| ONB-04 | Explain the two recording modes, that nothing is recorded until the learner accepts a prompt or starts a recording, and what is kept (transcripts, deletable) and deleted (audio). Onboarding does not offer AI-only mode; the product is built around prompted recording, and prompts can be turned off later in Settings (§6.10). |
| ONB-10 | Ask how many recording prompts a day the learner wants: 2 a day (shown first, labeled Recommended, and preselected), 1 a day, or up to 5 a day. Changeable in Settings. |
| ONB-05 | Keep onboarding short; let learners skip optional steps. |
| ONB-06 | Use onboarding answers (including any test score or linked app) as a starting estimate of level, refine it from the learner's first conversations, and let the learner adjust it. |
| ONB-07 | Offer an optional calendar connection to improve prompt timing (§6.2). The learner can skip it. |
| ONB-08 | Personalize from level, frequency of use, and speaking contexts, not from location alone. Country of residence does not restrict real-conversation features. |

To validate: whether self-rating plus early conversations is enough to tell which expressions a learner already knows, and whether a test score or app link improves the first feedback. Linking a learning app is simulated; which apps can share level data, and how scores map to levels, is TBD (the prototype uses approximate bands).

### 6.1 Recording Modes

Recording is always opt-in. There are two modes; both can be used by the same learner.

**A. Prompted recording**

| ID | Requirement |
| --- | --- |
| REC-01 | The app may prompt the learner to record when a conversation may be worth capturing. Nothing is recorded or buffered before the learner accepts the prompt. |
| REC-02 | A prompted recording lasts a default duration of 2–3 minutes. The learner sets the length as a number of minutes in Settings. |
| REC-03 | A prompted recording ends at its set length. The learner can stop it early from the app. Adding time happens on the lock-screen countdown (REC-16), not with a button inside the app, so the learner is not pulled into the phone mid-conversation. Learners who want longer captures set a longer default or use manual recording. |
| REC-04 | Once the learner has as many usable captures in a day as the prompts a day they chose (1, 2, or 5; ONB-10), stop proactive prompts for the rest of that day. Manual recordings count toward this threshold. |
| REC-05 | After the threshold is reached, the learner can still record manually. |

**The prompts-a-day setting is not a daily goal.** It only controls how often the app asks and when proactive prompts stop. It is not a task the learner has to complete, and "2 a day (Recommended)" is a suggested starting point, not a target.

| ID | Requirement |
| --- | --- |
| REC-11 | Do not set a required daily recording count or speaking duration. |
| REC-12 | Do not penalize the learner for declining or ignoring prompts (no lost streaks, lowered progress, or warnings). |
| REC-13 | Do not show messages that frame captures as a quota, such as "one recording left to complete today". |
| REC-14 | Keep AI practice optional; never present it as a substitute task when the learner does not record. |

TBD: how prompt frequency changes when prompts are ignored or declined.

**B. Manual quick-record**

Manual recording is for moments the learner chooses to capture:

- Everyday conversations.
- Classroom discussions.
- The learner's own presentations and speaking practice.

Classes and presentations can run much longer than a prompted capture, so a manual recording continues until the learner stops it rather than using the prompted-recording time limit.

| ID | Requirement |
| --- | --- |
| REC-06 | Provide a one-tap entry point to start recording. |
| REC-07 | The learner explicitly starts a manual recording and stops it manually. It is not limited to the prompted-recording duration. |
| REC-15 | In every manual use case, distinguish the learner's own speech from other speakers (classmates, instructors, audience) and assess only the learner (§6.3). |
| REC-17 | Offer a Control Center (or equivalent quick-settings) button that starts and stops a manual recording in one tap. The in-app Record button stays available. |

**Both modes**

| ID | Requirement |
| --- | --- |
| REC-08 | Clearly show when recording is active, with a way to stop it. |
| REC-09 | The product must not imply it is recording when it is not, or that it is not recording when it is. |
| REC-10 | Turning recording prompts off does not disable manual recording. |
| REC-16 | While a recording runs, show it on the lock screen as a live countdown (a prompted recording) or elapsed time (a manual one), with the app's icon, a +1 minute control for prompted recordings, and Stop. No conversation text is shown there. |

The two main ways in are outside the app: the recording prompt as a notification (similar to how Granola reminds users about a meeting) and the Control Center button (similar to Shazam's quick-capture). Both, and the lock-screen countdown, are confirmed as the intended interaction; whether each platform allows them is to validate.

TBD: the exact default duration, the allowed range of minutes, what counts as a usable capture, and prompt frequency when prompts are ignored or declined.

**User controls and remaining privacy risks**

The learner controls recording: nothing is captured until they accept a prompt or start a recording, they can stop at any time, recording is clearly shown while active, and prompts can be turned off. These controls reduce but do not remove privacy risk:

- Other people in a conversation, class, or presentation have not necessarily agreed to be recorded.
- Retained learning outputs can still contain sensitive details (§6.4).
- Classroom and presentation recordings may capture many other speakers.

Starting a recording manually does not move all responsibility to the learner or remove the product's own privacy responsibilities, such as clear recording states, data minimization, and deletion. Participant notice/consent and situations where recording should not proceed are TBD. Legal requirements for recording differ by place; this PRD makes no legal conclusions or compliance claims, and legal review is needed before real-world use.

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

To validate: speaker identification, mixed-language handling, and transcription quality on short captures and on longer manual recordings with many speakers, such as classes.

Proposed error behavior, to validate: when speaker attribution is uncertain, withhold affected speech from scoring rather than assigning another person's speech to the learner.

### 6.4 Data Retention and Privacy

After a capture is analyzed:

| ID | Requirement |
| --- | --- |
| DAT-01 | Delete the captured audio. |
| DAT-02 | Keep the transcript of a conversation the learner chose to record, so it can be replayed in practice (§6.8). Changed in v2.4: earlier versions deleted it. |
| DAT-03 | Beyond kept transcripts, retain only learning outputs and the minimum information needed to support them. |
| DAT-04 | Let the learner delete the transcript of any conversation. Its learning outputs stay unless deleted separately (SAF-03); replay of that conversation is no longer offered. |
| DAT-05 | Tell the learner, in onboarding, Settings, and each conversation, that audio is deleted and transcripts are kept until they delete them. |

Retained data may include:

- The transcript of each conversation the learner recorded, until they delete it.

- Relevant excerpts of original sentences (for example, the sentence an improvement point quotes).
- Brief conversation context (for example, "Coffee chat with Sam, casual").
- Extracted or saved expressions, including ones other people said, kept as text with their context.
- Suggested alternatives and feedback.
- Skill assessment results and the supporting learning evidence.

Confirmed November 13: audio is deleted after analysis, and transcripts are kept. This replaces the November 12 decision to delete full transcripts. The reason is that keeping them lets the learner replay a real conversation in practice. Every kept transcript comes from a conversation the learner chose to record (by accepting a prompt or starting a recording), never from always-on capture. A transcript still includes what other people said; this raises the participant-consent questions below. This document does not claim that no conversation content is retained.

**Proposed safeguards for retained learning outputs (pending validation)**

Kept transcripts, excerpts, and feedback can all contain sensitive information.

| ID | Proposed safeguard |
| --- | --- |
| SAF-01 | Minimize unnecessary personal names, company details, medical details, and other sensitive context in retained learning outputs and in what replay practice shows. |
| SAF-02 | Keep enough context for feedback to stay useful, without retaining conversation details the feedback does not need. |
| SAF-03 | Let the learner delete individual learning outputs. |

The product cannot guarantee that sensitive information is always detected or removed. Detection methods, whether learners review outputs before they are kept, and how individual deletion behaves are TBD.

TBD: exact audio deletion timing, how long transcripts are kept by default (until deleted, or for a set period), what happens when processing fails, storage location and processor behavior, participant notice/consent now that transcripts are kept, and bulk deletion. Whether AI practice chat transcripts are kept is also TBD. No privacy or compliance claim beyond these requirements is made.

### 6.5 Conversation Feedback

Each improvement point follows **brief context → original wording → suggested alternative**. For example:

- Context: Grammar · coffee chat with Sam
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
| FDB-07 | Cover relevant pronunciation, grammar, structure, tone, and natural-expression opportunities. Cultural context and slang count as natural expressions. |
| FDB-08 | Let the learner save any point or expression to Learn, and optionally start a related AI practice. Saving does not start practice. |

TBD: how the top points are chosen. Candidate considerations include impact on understanding, recurrence, and usefulness in upcoming everyday interactions. These are proposed criteria, not a finalized algorithm.

Suggested wording must preserve the learner's intended meaning and suit the conversation context. The method for evaluating this is to validate.

### 6.6 Learn

Learn is a separate tab for actionable learning content. It is organized by learning type, and each type uses its own format rather than one vocabulary-flashcard format.

| Category | What it holds | Format |
| --- | --- | --- |
| Expressions | Vocabulary, phrases, slang, everyday expressions, and what fits the cultural context | The expression, its meaning, and the context it is used in |
| Pronunciation | Pronunciation improvement opportunities found in the learner's speech | The word or phrase, tap-to-play model pronunciation, and a short pronunciation cue where useful |
| Speaking Tips | Grammar, sentence structure, and tone | Original wording → suggested alternative, with brief context |

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
| PRO-03 | Do not automatically treat accent differences that do not affect understanding as errors. |
| PRO-04 | Provide tap-to-play model pronunciation for each pronunciation item. |
| PRO-05 | Give textual pronunciation feedback (for example, which syllable to stress). |
| PRO-06 | Play audio only when the learner taps a playback control. |

Because captured audio is deleted after analysis, the product does not offer playback of the learner's own recording or an original-audio comparison. The goal is clearer communication, not eliminating the learner's accent. Assessment accuracy, suitable reference pronunciations, and coverage of dialects and accents (§6.12) are to validate.

**Future assessment capabilities (to validate, not committed for this iteration):** intonation, pausing, and speech chunking were raised as potentially useful feedback, especially for presentations. They are not part of this iteration's requirements.

### 6.8 AI Partner Practice

| ID | Requirement |
| --- | --- |
| PRA-01 | Retain the existing AI partner practice capability, with one AI partner. Do not offer a cast of named AI characters or let learners create their own personas (too much work for the learner, and a cluttered screen). |
| PRA-02 | Offer practice based on improvement points from real conversations, or on stated learning needs for AI-only learners. The learner's saved items are worked into the chat when there are any. |
| PRA-06 | Let the learner pick what to talk about: Work, School, Friends, or Family, or Surprise me (one of them at random). Topics that match the learner's onboarding contexts are marked. |
| PRA-07 | Match the AI partner's tone to the topic: Friends and Family are casual and use everyday slang the learner can follow; Work and School stay polished, with little slang. |
| PRA-08 | Let the learner replay a real conversation they recorded: the AI plays the other person in the same situation so the learner can try a better way to say it. Offered only while that conversation's transcript is kept (DAT-04). |
| PRA-09 | When a conversation's transcript has been deleted, its saved items can still be practiced in a topic chat of the same register. |
| PRA-03 | Let learners choose whether and when to practice. |
| PRA-04 | Do not require daily practice tasks. |
| PRA-05 | Assess practice separately and show its results in Insights. |

Example: if a learner struggled to turn down plans in a coffee chat, they can replay that coffee chat, or pick Friends and try the suggested wording there.

TBD: the AI partner's name (the product name is tentatively Afterchat), and how the tone instructions are tuned per topic.

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
| RPT-10 | Under each skill, after what got better, show what would help it grow further: recurring mistakes in that skill (the same kind of slip seen again in later real conversations), each with the latest instance, what to try, and whether it is still showing up or showing up less. The collapsed skill shows how many things there are to work on. Frame it as the next step, never as a penalty or a score. |

**Skill progress bars.** Skill measures, in this order, are pronunciation, grammar, sentence structure, and natural expressions/slang, assessed only from the learner's own speech. Cultural context is part of natural expressions rather than a separate measure, since the team could not draw a clear line between the two. Pronunciation, grammar, and structure can be compared with a standard; natural expressions depend more on context, which the examples should make clear. Each skill opens to up to three examples of what got better (an earlier and a more recent instance of the same kind of moment), followed by what to work on next (RPT-10). Each bar opens to concrete examples, such as an earlier and a more recent instance of the same kind of moment. A full bar means the skill is shown consistently in observed conversations, not mastery of the language. Detailed scoring rubrics, evidence thresholds, and aggregation methods are to validate; progress bars are approved as a presentation format, not a scoring formula. Missing evidence must not count as failure or regression.

**How natural expressions are measured.** Unlike pronunciation, grammar, and structure, natural expressions are not right or wrong; they depend on the situation. The measure looks at the learner's own speech for:

1. **Natural phrasing instead of textbook phrasing.** Moments where the learner used an everyday or idiomatic expression, including slang, where a literal, classroom-style phrasing was possible (for example, "touch base" rather than "meet you shortly", or "If I could add one thing" rather than "I want to say my opinion"). This includes using, in a later conversation, an expression the product suggested.
2. **Fit with the situation.** Casual expressions and slang with friends and family; more polished phrasing at work and school. Using more slang does not by itself count as progress, and slang in a formal setting does not count toward the skill.
3. **Examples, not a verdict.** The bar opens to earlier and recent examples of the same kind of moment, and the learner is never told an expression was "wrong".

The progress bar reflects how consistently these moments appear across the learner's real conversations. Detection of natural versus textbook phrasing, the scoring rubric, and evidence thresholds are to validate (§12).

TBD: calendar-week boundaries, time-zone handling, and exact report layout.

### 6.10 AI-Only Mode

| ID | Requirement |
| --- | --- |
| AIO-01 | Let learners turn recording prompts off completely in Settings and keep using AI conversation practice. |
| AIO-02 | Turning prompts off does not disable manual recording. |
| AIO-03 | Learn and Practice work for AI-only learners; Insights shows AI practice results and an empty state for real-conversation reports. |
| AIO-04 | AI-only mode is the learner's choice. Do not assign it based on country of residence; learners can switch it on or off at any time. |
| AIO-05 | Do not offer AI-only mode in onboarding. Without recording, most of the product does not work, so learners start with prompts and can turn them off later. |

### 6.11 Notifications

| ID | Requirement |
| --- | --- |
| NTF-01 | Deliver recording prompts as notifications the learner can accept or ignore; no recording starts unless they accept. |
| NTF-02 | Offer a notification when post-conversation feedback is ready. |
| NTF-03 | Let learners turn each kind of notification off. |
| NTF-04 | Let learners ignore a notification and review feedback later. |
| NTF-05 | Do not show conversation quotations on the lock screen, including in the recording countdown (REC-16). |
| NTF-06 | Do not frame captures or practice as quotas, streaks, or missed tasks in any notification (see REC-11 to REC-14). |

Example copy: "Your latest conversation has 2 points to review." Final copy, delivery timing, batching, and frequency are TBD.

### 6.12 Language and Dialect Support

The product must be transparent about what it supports. This PRD does not define a supported-language list; specific coverage is TBD.

| ID | Requirement |
| --- | --- |
| LNG-01 | Clearly show which languages are supported. |
| LNG-02 | For each language, show which capabilities are available: AI conversation, transcription, pronunciation feedback, and skill assessment. |
| LNG-03 | Clearly state known limitations in dialect or accent coverage. |
| LNG-04 | Do not give confident assessments for language varieties the product does not support. Where coverage is limited, say so instead of scoring. |
| LNG-05 | Do not automatically treat accent differences that do not affect understanding as errors (see PRO-03). |

TBD: the supported languages, the capabilities available for each, known dialect and accent limitations, and how limited coverage is communicated in the interface.

## 7. Primary User Journeys

**Learner in a target-language environment**

1. In a short onboarding, the learner picks their language and sees which capabilities it supports, sets their level (from a test score or app, or by picking one of five levels), says how often they use the language and where they speak it, learns how recording works, picks how many prompts a day (2, recommended), and optionally connects a calendar.
2. Before a conversation, the learner accepts a recording prompt from a notification, or starts a recording from Control Center or the in-app Record button. Nothing is recorded before that. For a class discussion or their own presentation, they use manual quick-record.
3. A prompted recording runs for its set length unless stopped early; the lock screen shows the countdown, where the learner can add a minute or stop. A manual recording runs until the learner stops it. Recording is always clearly shown.
4. Once they reach their prompts-a-day number of usable captures, proactive prompts stop for that day; manual recording stays available. Days with fewer captures, or none, carry no penalty.
5. The capture is analyzed, assessing only the learner's own speech. Audio is deleted; the transcript and learning outputs are kept, and the learner can delete the transcript or individual outputs.
6. The learner gets a feedback-ready notification if enabled and opens the feedback when convenient.
7. For each of up to three top points, the learner sees brief context, what they said, and what to try. Additional points appear below when relevant.
8. The learner saves useful items to Learn, or starts an optional related practice.
9. In Learn, the learner reviews This week's picks, Expressions, Pronunciation (with model playback), and Speaking Tips.
10. In later captures, the system looks for evidence of improvement in the learner's own speech.
11. Insights shows real-conversation progress and AI practice results separately, defaulting to This Week.

**Learner outside a target-language country**

1. In onboarding, the learner says they use the language in online conversations and a weekly class. They are offered the same options as everyone else.
2. They record selected online conversations with prompts or quick-record, and record class discussions manually.
3. From there, the journey follows steps 5–11 above.

**AI-only learner**

1. After onboarding, the learner turns recording prompts off in Settings (AI-only mode). Manual recording stays available if they later want it.
2. Learn shows This week's picks based on AI practice and stated learning needs.
3. The learner practices with the AI partner by topic (Work, School, Friends, Family, or Surprise me).
4. Insights shows AI practice results and an empty state for real-conversation reports. AI performance is not presented as real-world improvement.

## 8. Prototype Requirements and Acceptance Criteria

The prototype should make these requirements reviewable without claiming unbuilt recording, analysis, or scoring capabilities. Status reflects the current prototype at the site root.

| Area | Acceptance criteria | Current prototype |
| --- | --- | --- |
| Navigation | Tabs read Home / Learn / Practice / Insights, each with its stated purpose. | Built |
| Onboarding | Asks for language, level (a test score or app link sets it; otherwise five levels with their CEFR range), frequency of use, and speaking contexts (Work, School, Friends, Family, Other); explains the two recording modes and what is kept; asks for prompts a day with 2 first and recommended; no AI-only option; offers an optional calendar connection. | Built (app link and calendar simulated) |
| Language support | Supported languages and per-language capabilities are shown; known dialect or accent limits are stated; unsupported varieties get no confident assessment. | Built in onboarding (sample coverage values) |
| Prompted recording | A prompt can be accepted or ignored; nothing records before acceptance; recording shows as active, can be stopped early, and ends after its length; no in-app extend button; prompts stop after the chosen number of usable captures that day; length is set in minutes in Settings. | Built (simulated; nothing is recorded) |
| Lock screen and Control Center | The prompt arrives as a notification; an active recording shows a countdown with +1 minute and Stop and no quotations; a Control Center button starts and stops a manual recording. | Built as a simulated phone demo |
| No daily quota | No required daily count or duration, no penalty for declined or ignored prompts, and no "recordings left today" messaging anywhere. | Built |
| Manual quick-record | A one-tap entry starts recording; the learner stops it manually; active recording is clearly shown; available even with prompts off; fits conversations, classes, and the learner's own presentations. | Built (simulated) |
| Calendar | Calendar connection is optional and never starts recording. | Built (simulated) |
| Data retention | The prototype says audio is deleted and transcripts are kept; the learner can delete a conversation's transcript, which removes its replay. | Built (notes in onboarding, Settings, and each conversation; delete per conversation) |
| Learning-output safeguards (proposed) | A learner can delete an individual learning output; sample outputs avoid unnecessary names, company, or medical details. | Partly: delete built in Learn; sensitive-detail minimizing not built |
| Feedback | Up to three points, each as brief context → original wording → suggested alternative, with more points when relevant; no "Why?" field required. | Built |
| Learn | Expressions, Pronunciation, and Speaking Tips, each in its own format; suggested vs saved is clear; saving does not start practice. | Built (flashcards kept as an optional review) |
| This week's picks | Two highlighted expressions at the top of Learn, each savable. | Built |
| Pronunciation | Tap-to-play model pronunciation and a text cue; no playback of the learner's own audio. | Built |
| Speaker distinction | Examples show who spoke; other speakers do not count toward the learner's progress. | Built |
| Practice | One AI partner; topics Work, School, Friends, Family, Surprise me, with tone following the topic; replay of recorded conversations; a feedback item can lead to optional related practice. | Built (topic chats fall back to a script when the AI is offline) |
| Insights | Real conversations and AI practice separate; This Week default plus This Month and All Time; skill bars in the order pronunciation, grammar, structure, natural expressions/slang, opening to examples; up to three improvements and what to work on next under each skill; empty real-conversation state for AI-only learners. | Built (sample data) |
| Notifications | Recording prompts and feedback-ready notifications are represented, can be turned off, and contain no quotations. | Built (recording prompt shown in-app) |

Use representative sample conversations where backend functions are unavailable, and label simulated states and sample data clearly.

## 9. Validation Plan

**Usability and desirability**

- Do learners understand that nothing is recorded until they accept a prompt or start a recording?
- Do they accept prompts, and do 2–3 minutes capture enough of a conversation?
- Do users remember to use quick-record during relevant moments?
- Can they find and operate the quick-record shortcut with minimal effort?
- Do prompts arrive at inappropriate or disruptive times, with and without a calendar connection?
- Do users understand exactly when recording starts and stops, and can they stop it without help?
- Do users understand exactly what is deleted after analysis and what remains?
- How do privacy expectations differ across speaking contexts (everyday conversations, classes, work, presentations)?
- Do users read the prompts-a-day setting as a goal they must meet? Do most keep the recommended 2?
- Do learners find the recording entry points outside the app (notification, lock screen, Control Center)?
- Do learners understand that transcripts are kept, and are they comfortable with it? Do they delete them?
- Do the four topics (Work, School, Friends, Family) cover what learners want to practice? Do they use replay of a real conversation?
- Does the tone change between casual and polished topics feel right?
- Do recurring mistakes feel helpful rather than discouraging?
- How do needs vary by language level and by how often the learner is exposed to the target language?
- Do learners understand which capabilities are available for their language and variety?
- Does onboarding give enough context that the feedback makes sense, and does feedback match their level?
- Do they find the top points relevant and easy to act on?
- Do they understand the difference between Learn (content) and Insights (whether they apply it)?
- Do the three Learn categories and their formats match how learners think about the content?
- Are This week's picks useful?
- Is model pronunciation with a text cue enough without hearing their own audio?
- Do AI-only learners find the product useful, and do they understand the real-conversation empty state?
- Can learners distinguish real-conversation performance from AI practice performance?
- Are notifications useful without feeling disruptive?

- Is feedback more useful when based on a conversation the participant actually completed?

Where possible, test with realistic interactions, including conversations the participant actually completed, rather than only predetermined sample conversations.

**Technical validation**

- Prompt timing and acceptance; quick-record entry points on each platform.
- Speaker attribution and transcription quality on short captures and long multi-speaker recordings (classes, presentations), including mixed-language conversations.
- Coverage and accuracy for each supported language, dialect, and accent.
- Deleting audio reliably after analysis, and deleting a transcript reliably when the learner asks.
- Whether each platform allows a lock-screen countdown and a Control Center button.
- Whether unnecessary sensitive details can be reduced in retained outputs while keeping feedback useful (proposed safeguards SAF-01 and SAF-02).
- Future capabilities: whether intonation, pausing, and speech chunking can be assessed reliably.
- Contextually appropriate recommendations, weekly pick selection, and pronunciation assessment.
- Level estimation from onboarding and early conversations.
- Stable skill measures supported by sufficient evidence.

## 10. Proposed Success Measures

These are evaluation proposals, not confirmed numerical targets. Set definitions and targets after baseline testing.

| Measure | What it helps evaluate |
| --- | --- |
| Prompt acceptance rate and usable captures per day | Whether prompted recording fits into the learner's day. |
| Prompts-a-day choices and changes | Whether the recommended 2 a day fits, or learners lower or raise it. |
| Topic and replay use in practice | Which practice entry points learners actually use. |
| Manual quick-record use | Whether learners capture conversations on their own initiative. |
| Feedback usefulness rating | Whether recommendations are relevant and actionable. |
| Save and optional practice usage | Whether learners engage with learning content. |
| Later application of recommendations | Whether learning transfers into real conversations. |
| Insights comprehension | Whether learners correctly understand the bars and examples. |
| Recording-state comprehension | Whether learners know when they are being recorded and can stop it. |
| Notification usefulness and disable rate | Whether notifications help without excessive interruption. |
| Onboarding completion and perceived level fit | Whether the starting level estimate makes early feedback feel right. |
| Assessment agreement with human review | Whether feedback and skill judgments are credible. |

Do not use raw recording duration or vocabulary count alone as evidence of learning success. Captures per day is a team evaluation measure, never a target shown to learners.

## 11. Current Prototype Summary

The prototype at the site root follows this PRD (updated Nov 13, 2026). What it simulates:

- **Recording:** recording prompts, quick record, the timer and the prompts-a-day limit work, but nothing is recorded. The lock screen and Control Center are a simulated phone demo (Phone demo link, or Settings). A capture does not create a new conversation; sample conversations stand in for analyzed ones.
- **Calendar:** the connection is a toggle only.
- **Language support:** the capabilities shown in onboarding are sample values; real coverage is TBD (§6.12).
- **AI-only mode:** turned on from Settings; shown as empty states on Home and Insights; Learn and Practice still use the sample content.
- **Level:** a test score sets a level from approximate bands; connecting a learning app shows a simulated permission step and returns a sample level.
- **Transcripts:** "kept" is a label; deleting one hides its replay.
- **Practice:** topic chats and replays use the live AI when available, otherwise a fixed script. The AI partner is called "Coach" until the team picks a name.
- **Proposed safeguards:** deleting an item in Learn works; minimizing sensitive details is not built.
- **Sample data:** conversations, suggestions, weekly picks, skill levels, recurring mistakes and earlier periods.

## 12. Remaining Technical and Operational TBDs

| Area | TBD |
| --- | --- |
| Prompted recording | Exact default duration; allowed duration settings; definition of a usable capture; prompt frequency when prompts are ignored or declined. |
| Manual quick-record | Feasibility of a Control Center button and a lock-screen countdown on each platform; handling of long recordings such as classes. |
| Language support | Supported languages; capabilities available for each; known dialect and accent limitations; how limited coverage is shown. |
| Retained-output safeguards | Sensitive-detail detection methods; whether learners review outputs before they are kept; behavior of individual deletion. |
| Calendar | Timing rules; permissions requested; how suitable and excluded events are identified and handled. |
| Data retention | Exact audio deletion timing; how long transcripts are kept by default; failure handling; storage location and processor behavior; bulk deletion. |
| AI practice data | Whether AI chat transcripts are kept. |
| Level inputs | Which learning apps can share level data; how test scores map to a starting level. |
| Naming | Confirming the product name (tentatively Afterchat, Nov 15) and choosing the AI partner's name. |
| Participant consent | Participant notice/consent and situations where recording should not proceed; legal advice before real-world use. |
| Speaker identification | Identification method and handling of uncertain attribution. |
| Level calibration | How onboarding answers, test scores or app data, and early conversations estimate what the learner already knows. |
| Feedback prioritization | How the top points are chosen. |
| Weekly picks | Selection method; behavior when there are fewer than two good candidates. |
| Scoring | Skill rubrics, baseline, evidence thresholds, aggregation, and uncertainty display; for natural expressions, how natural versus textbook phrasing and fit with the situation are detected (§6.9). |
| Reports | Calendar-week boundaries, time-zone handling, and detailed Learn and Insights layouts. |
| Notifications | Final copy, delivery timing, batching, and frequency. |
| Future assessment | Whether and how to assess intonation, pausing, and speech chunking. |

## 13. Changes from Prototype A

| Area | Updated requirement |
| --- | --- |
| Audience | Primary: learners in a target-language environment. Learners elsewhere can use real-conversation features too; country is not a requirement. Secondary: learners who rely mainly on AI practice (AI-only mode, chosen by the learner). |
| Onboarding | New short onboarding: language (with its supported capabilities), level, frequency of use, speaking contexts, recording prompt choice, optional calendar connection. |
| Recording | Two opt-in modes, prompted (default 2–3 minutes, stop early, prompts a day chosen by the learner, 2 recommended, which is not a daily goal; extend from the lock screen) and manual quick-record for conversations, classes, and presentations. No always-on or automatic recording. |
| Language support | Supported languages, per-language capabilities, and dialect or accent limits are shown; no confident assessment of unsupported varieties. |
| Calendar | Optional connection to time prompts; never starts recording. |
| Data | Audio deleted after analysis; transcripts kept for replay and deletable (changed in v2.4, see §14). Proposed: minimize sensitive details in outputs and let learners delete individual outputs. |
| Feedback | Up to three points as brief context → original wording → suggested alternative; more when relevant; no required "Why?". |
| Learn | Separate tab with Expressions, Pronunciation, and Speaking Tips, each in its own format; suggested vs saved clear; two weekly picks. |
| Pronunciation | Tap-to-play model pronunciation and text cues; no playback of the learner's own audio. |
| Insights | Formerly Progress. Real conversations and AI practice separate; time filters; skill bars with examples; AI-only empty state; no fixed weekly goals. |
| Practice | Optional AI practice tied to real-conversation feedback or stated needs. |
| Notifications | Recording prompts and feedback-ready notifications, each optional, no lock-screen quotations. |
| Navigation | Home / Learn / Practice / Insights. |

## 14. Changes in v2.4 (prototype review, November 13, 2026)

| Area | Change | Why |
| --- | --- | --- |
| Onboarding | AI-only option removed; it now lives only in Settings (ONB-04, AIO-05). | Choosing it in onboarding left the product with almost nothing to do. |
| Onboarding | Prompts a day: 2 (Recommended, first and preselected), 1, or up to 5 (ONB-10, REC-04). | Start learners on a useful default while letting them make it lighter or heavier. |
| Onboarding | Speaking contexts are Work, School, Friends, Family, Other, matching the Practice topics (ONB-02). | One set of categories across the app is easier to understand, and Family came up as important in the review. |
| Onboarding | Level on its own page: a test score or learning app sets it; otherwise pick from Beginner to Advanced, each with its CEFR range (ONB-09). | Something more objective than "I'm comfortable" helps match feedback to the learner, while most learners have no recent score. |
| Recording | No +1 minute button in the app; prompted recordings end at their set length; length set as minutes in Settings (REC-02, REC-03). | Learners will not reach for the phone mid-conversation, and a pop-up asking to extend would interrupt. |
| Recording | Lock-screen countdown with +1 minute and Stop; Control Center button; prompt as a notification (REC-16, REC-17). | The main ways in are outside the app; the in-app Record button stays. |
| Data | Transcripts are kept; audio is still deleted; learners can delete a transcript (DAT-02, DAT-04, DAT-05). | Learners record by choice, and replaying a real conversation needs its transcript. |
| Practice | One AI partner; topics Work, School, Friends, Family, Surprise me; tone follows the topic; replay of recorded conversations; no persona cast or learner-made personas (PRA-01, PRA-06 to PRA-09). | Named characters implied the app knew who the learner talked to, and custom personas would be too much work and clutter. |
| Insights | Cultural context merged into natural expressions/slang; order is pronunciation, grammar, sentence structure, natural expressions; each skill shows up to three improvements, then what to work on to grow further (RPT-10). | The team could not tell cultural context and natural expressions apart; learners want to see what keeps going wrong, framed as what would help them improve. |
| Insights | Natural expressions defined as natural phrasing (including slang) instead of textbook phrasing, judged by fit with the situation and shown with examples rather than as right or wrong (§6.9). | The team asked how this skill could be measured; it was described in the review as the use of everyday expressions and slang you would not learn in a classroom. |
| Learn | Kept as its own tab. | Insights shows up to three examples per skill; Learn holds everything. |
| Naming | Product name tentatively **Afterchat** (feedback arrives after a chat; no app with that exact name was found in a quick search, while "Speak Easy" is taken by several AI English apps). The AI partner's name is still TBD. The sample friend "Maya" is renamed "Sam". | Many class projects' AI defaulted to "Maya", so the name read as the AI rather than a friend. |

**Source basis:** team discussion transcript dated November 10, 2026; recommendation slides 10–13; confirmed team decisions of November 12, 2026, which replace earlier conflicting requirements (including always-on recording, persistent playback of user audio, and keeping full transcripts); additions from the follow-up team discussion of November 12, 2026 (language support, manual-recording use cases, audience, no daily quota, retained-output safeguards, validation); and the prototype review of November 13, 2026 (§14), which replaces the November 12 decision to delete full transcripts.
