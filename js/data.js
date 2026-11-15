// Sample data for the prototype. Edit freely: conversations, phrases and the AI scripts
// all live here, so content changes never touch the screen code.

// Product name: tentative until the team confirms it (PRD §12).
const APP_NAME = "Afterchat";
const USER = "Yuka";
const TODAY = "Tuesday, Oct 20";

// Language support shown in onboarding (PRD §6.12). SAMPLE values for the prototype only:
// the real supported languages and coverage are TBD.
const CAPS = ["AI chat", "Transcription", "Pronunciation", "Skill check"];
// note: shown only when something is limited (one sentence, says what won't be scored).
const LANG_SUPPORT = {
  English: { caps: ["yes", "yes", "yes", "yes"], note: null },
  Spanish: { caps: ["yes", "yes", "limited", "no"], note: "Pronunciation feedback is limited and skills aren't scored yet; some regional varieties may not be recognized." },
  Japanese: { caps: ["yes", "yes", "limited", "no"], note: "Pronunciation feedback is limited and skills aren't scored yet; dialects other than standard Japanese aren't assessed." },
  Mandarin: { caps: ["yes", "limited", "no", "no"], note: "Tone feedback isn't available yet, so pronunciation and skills won't be scored." }
};
// "This week's picks" on Learn (PCK-01..05): two expressions, each with why it was picked.
const PICKS = [
  { item: "maya-p2", why: "You turned down plans twice this week. This is the friendly way to do it." },
  { item: "sync-p4", why: "Useful for your Monday syncs, where you want to bring others in." }
];

// mine: minutes the learner spoke in that conversation (simulated speaker ID).
// role, invite, look: how the partner appears on the Practice character cards.
// look.hair is "bob", "short" or "bun"; look.glasses adds glasses.
const CONVOS = [
  {
    id: "maya", title: "Coffee chat with Sam", context: "casual",
    when: "Today · 3:40 PM", length: "18 min", mine: 7, short: "coffee chat", art: "coffee", people: "Sam (classmate)", place: "Free Speech Café",
    summary: "You caught up with Sam after class. Sam's buried in internship recruiting, invited you on a Sunday hike, and pushed your Friday dinner.",
    partner: "Sam", partnerNote: "Plays your classmate, same tone as today",
    role: "classmate", invite: "Coffee chat after class",
    look: { hair: "bob", hairColor: "#4a2f25", skin: "#f1c7a3", shirt: "#f08a5d" },
    scene: ["Free Speech Café, after class.", "Sam is catching up on your week and weekend plans."],
    script: [
      { ai: "Hey! Sorry I'm late, it's been a week. How are you holding up?", hint: "maya-r1",
        sample: "Honestly, I'm wiped out from all these assignments." },
      { ai: "Ugh, same. A few of us are doing the Tilden hike Sunday morning. You in?", hint: "maya-p4",
        sample: "Count me in! What time are you leaving?" },
      { ai: "Oh wait, I also said Friday dinner with you... I might be swamped. Is that okay?", hint: "maya-p2",
        sample: "No worries, let's take a rain check on Friday." },
      { ai: "Thanks. Oh, I applied to that design studio in SF. Total long shot, but fingers crossed. What are you up to Saturday?", hint: "maya-r2",
        sample: "Not much. I'm going to the farmers market. Want to come with?" }
    ],
    closing: "Okay, I gotta run. See you Sunday!"
  },
  {
    id: "priya", title: "Lunch with Priya", context: "casual",
    when: "Today · 12:10 PM", length: "15 min", mine: 6, short: "lunch", art: "bowl", people: "Priya (roommate)", place: "Your apartment kitchen",
    summary: "Priya made too much curry and shared it. She vented about the landlord and the broken heater, and you two planned a grocery run.",
    partner: "Priya", partnerNote: "Plays your roommate, same easy tone",
    role: "roommate", invite: "Lunch at home, catching up",
    look: { hair: "bun", hairColor: "#1f1a24", skin: "#b9805a", shirt: "#b39cf0" },
    scene: ["Your kitchen, lunchtime.", "Priya just made a big pot of curry."],
    script: [
      { ai: "I made way too much curry again. Want some?", hint: "priya-p1",
        sample: "Yes please! And help yourself to the bread I bought." },
      { ai: "Thanks! Ugh, the landlord still hasn't fixed the heater.", hint: "priya-p3",
        sample: "That's so annoying. Let's call it a day on chores and relax." },
      { ai: "Ha, deal. Oh, we're almost out of rice and eggs.", hint: "priya-r1",
        sample: "Want to do a grocery run tomorrow?" },
      { ai: "Yes! I'll drive if you grab coffee on the way.", hint: "priya-p2",
        sample: "Deal, and the coffee's on me." }
    ],
    closing: "Perfect. Okay, back to my problem set!"
  },
  {
    id: "chen", title: "Office hours with Prof. Chen", context: "professional",
    when: "Mon · 4:00 PM", length: "15 min", mine: 6, short: "office hours", art: "book", people: "Prof. Chen (Marketing)", place: "Faculty office",
    summary: "You went over your market research draft. Prof. Chen liked the start, asked you to build out the customer section, and suggested about ten interviews.",
    partner: "Prof. Chen", partnerNote: "Plays your professor, same office hours",
    role: "professor", invite: "Office hours on your draft",
    look: { hair: "short", hairColor: "#9a96a3", skin: "#f0cfae", shirt: "#5b6bd6", glasses: true },
    scene: ["Prof. Chen's office, Monday afternoon.", "You brought your market research draft."],
    script: [
      { ai: "Come on in! What would you like to go over today?", hint: "chen-r1",
        sample: "Could you walk me through the segmentation part?" },
      { ai: "Sure. Your draft is a good start, but the customer section is thin.", hint: "chen-p2",
        sample: "Got it. I'll flesh out the customer section this week." },
      { ai: "Good. How many interviews are you planning?", hint: "chen-p3",
        sample: "Is ten a good rule of thumb?" },
      { ai: "Ten is fine. Anything else on your mind?", hint: "chen-p1",
        sample: "Could you touch on how to size the market?" }
    ],
    closing: "Great questions. See you in class Thursday."
  },
  {
    id: "sync", title: "Weekly product sync", context: "professional",
    when: "Mon · 10:00 AM", length: "32 min", mine: 5, short: "meeting", art: "meeting", people: "Daniel (PM), Lena (design)", place: "Zoom",
    summary: "Daniel ran the weekly sync. The team triaged a checkout bug, debated whether a fix could ship by Friday, and pushed the pricing discussion to next week.",
    partner: "Daniel", partnerNote: "Plays your PM in the same meeting",
    role: "PM", invite: "Monday team sync",
    look: { hair: "short", hairColor: "#2d2440", skin: "#d9a57c", shirt: "#4fae8b", glasses: true },
    scene: ["Monday sync on Zoom.", "Daniel is going around the team for updates."],
    script: [
      { ai: "Morning! Before we dive in, any quick updates from your side?", hint: "sync-r1",
        sample: "If I could add one thing: three interviewees mentioned the checkout bug." },
      { ai: "Good to know. Can you give me a rough number on how many users hit it?", hint: "sync-p2",
        sample: "A ballpark figure would be around two hundred a week." },
      { ai: "Okay. Can we ship the fix by Friday?", hint: "sync-r2",
        sample: "Friday might be tight. Could we aim for Monday instead?" },
      { ai: "Fair. Should design be involved before we commit?", hint: "sync-p4",
        sample: "Yes, let's loop in Lena before we commit to a date." }
    ],
    closing: "Great, thanks everyone. Let's circle back on pricing next week."
  }
];

// kind "phrase": something another person said that is likely new to the learner.
// kind "rephrase": something the learner said, with a better way per context (alt) and an
//   optional one-line reason (why). area = the skill it belongs to: expression, grammar,
//   structure or pronunciation (cultural context / slang counts as expression). top = its place (1-3) in the conversation's Top 3.
//   Pronunciation items add heard (how it came out), sayLearner / sayModel (what the
//   prototype's synthetic voice reads for "your audio" and "model"; nothing is recorded).
const ITEMS = [
  { id: "maya-p1", convo: "maya", kind: "phrase", text: "I'm swamped", meaning: "I'm extremely busy; too much to do.",
    sentence: "Honestly, I'm swamped this week with recruiting stuff.", hl: "I'm swamped", speaker: "Sam", at: "02:14", match: ["swamped"] },
  { id: "maya-p2", convo: "maya", kind: "phrase", text: "take a rain check", meaning: "Politely postpone an invitation to another time.",
    sentence: "Can I take a rain check on Friday dinner?", hl: "take a rain check", speaker: "Sam", at: "09:51", match: ["rain check"] },
  { id: "maya-p3", convo: "maya", kind: "phrase", text: "a long shot", meaning: "Something unlikely to succeed, but worth trying.",
    sentence: "Applying there is a long shot, but why not.", hl: "a long shot", speaker: "Sam", at: "12:30", match: ["long shot"] },
  { id: "maya-p4", convo: "maya", kind: "phrase", text: "count me in", meaning: "Yes, include me; I want to join.",
    sentence: "If you're doing the hike Sunday, count me in.", hl: "count me in", speaker: "Sam", at: "15:02", match: ["count me in"] },
  { id: "maya-r1", convo: "maya", kind: "rephrase", area: "expression", top: 1, said: "I am very tired because of many assignments.", at: "01:40",
    alt: { casual: "I'm wiped out from all these assignments.", professional: "I've been stretched a bit thin with deadlines this week." },
    why: { casual: "With a friend, a vivid everyday phrase sounds more relaxed.",
           professional: "At work, this signals a heavy load without sounding like a complaint." },
    match: { casual: ["wiped out"], professional: ["stretched", "thin"] } },
  { id: "maya-r2", convo: "maya", kind: "rephrase", area: "expression", said: "Shall we go together?", at: "16:20",
    alt: { casual: "Want to come with?", professional: "Would you like to join us?" },
    why: { casual: "“Shall we” is correct, but sounds formal between friends.",
           professional: "A polite question that works for colleagues or a manager." },
    match: { casual: ["come with", "wanna join", "want to join"], professional: ["would you like to join"] } },

  { id: "sync-p1", convo: "sync", kind: "phrase", text: "circle back", meaning: "Return to a topic later.",
    sentence: "Let's circle back on pricing next week.", hl: "circle back", speaker: "Daniel", at: "28:45", match: ["circle back"] },
  { id: "sync-p2", convo: "sync", kind: "phrase", text: "a ballpark figure", meaning: "A rough estimate, not an exact number.",
    sentence: "Can someone give me a ballpark figure on affected users?", hl: "a ballpark figure", speaker: "Daniel", at: "06:12", match: ["ballpark"] },
  { id: "sync-p3", convo: "sync", kind: "phrase", text: "move the needle", meaning: "Make a noticeable difference to a result.",
    sentence: "Fixing checkout will actually move the needle on conversion.", hl: "move the needle", speaker: "Lena", at: "11:37", match: ["move the needle"] },
  { id: "sync-p4", convo: "sync", kind: "phrase", text: "loop in", meaning: "Include someone in a discussion or email thread.",
    sentence: "Let's loop in the design team before we commit.", hl: "loop in", speaker: "Daniel", at: "19:03", match: ["loop in"] },
  { id: "sync-r1", convo: "sync", kind: "rephrase", area: "expression", top: 2, said: "I want to say my opinion.", at: "04:05",
    alt: { professional: "If I could add one thing...", casual: "Can I jump in for a sec?" },
    why: { professional: "A softer opener lets you take the floor without sounding abrupt.",
           casual: "Among friends, a quick, light way to cut in." },
    match: { professional: ["add one thing", "quick thought"], casual: ["jump in"] } },
  { id: "sync-r2", convo: "sync", kind: "rephrase", area: "structure", top: 1, said: "This is not possible by Friday.", at: "22:18",
    alt: { professional: "Friday might be tight. Could we aim for Monday?", casual: "Friday's pushing it. How about Monday?" },
    why: { professional: "Naming the constraint and offering an option keeps it collaborative.",
           casual: "Relaxed, but still clear about the timing." },
    match: { professional: ["tight", "aim for"], casual: ["pushing it", "how about"] } },

  { id: "priya-p1", convo: "priya", kind: "phrase", text: "help yourself", meaning: "Take as much as you like; no need to ask.",
    sentence: "There's tons of curry, help yourself.", hl: "help yourself", speaker: "Priya", at: "01:12", match: ["help yourself"] },
  { id: "priya-p2", convo: "priya", kind: "phrase", text: "it's on me", meaning: "I'll pay for it.",
    sentence: "Next coffee's on me, I owe you.", hl: "on me", speaker: "Priya", at: "11:40", match: ["on me"] },
  { id: "priya-p3", convo: "priya", kind: "phrase", text: "call it a day", meaning: "Stop working on something for now.",
    sentence: "I'm going to call it a day on laundry.", hl: "call it a day", speaker: "Priya", at: "06:05", match: ["call it a day"] },
  { id: "priya-r1", convo: "priya", kind: "rephrase", area: "expression", top: 1, said: "I want to buy food together tomorrow.", at: "09:30",
    alt: { casual: "Want to do a grocery run tomorrow?", professional: "Would you like to go grocery shopping together tomorrow?" },
    why: { casual: "“Grocery run” is the everyday way roommates say it.",
           professional: "A full, polite question that works with anyone." },
    match: { casual: ["grocery run"], professional: ["would you like to go"] } },

  { id: "chen-p1", convo: "chen", kind: "phrase", text: "touch on", meaning: "Talk about something briefly.",
    sentence: "Let me touch on your second question first.", hl: "touch on", speaker: "Prof. Chen", at: "03:20", match: ["touch on"] },
  { id: "chen-p2", convo: "chen", kind: "phrase", text: "flesh out", meaning: "Add more detail to an idea or draft.",
    sentence: "You'll want to flesh out the customer section.", hl: "flesh out", speaker: "Prof. Chen", at: "07:48", match: ["flesh out"] },
  { id: "chen-p3", convo: "chen", kind: "phrase", text: "a good rule of thumb", meaning: "A practical guideline, not an exact rule.",
    sentence: "A good rule of thumb is about ten interviews.", hl: "a good rule of thumb", speaker: "Prof. Chen", at: "10:15", match: ["rule of thumb"] },
  { id: "chen-r1", convo: "chen", kind: "rephrase", area: "expression", top: 1, said: "I don't understand this part.", at: "01:05",
    alt: { professional: "Could you walk me through this part?", casual: "Wait, can you explain this bit again?" },
    why: { professional: "Asks for help in a way that sounds engaged, not lost.",
           casual: "Light and friendly when you're among peers." },
    match: { professional: ["walk me through"], casual: ["explain this bit", "explain that again"] } },


  // More improvement points (v2): grammar, structure, pronunciation.
  { id: "maya-g1", convo: "maya", kind: "rephrase", area: "grammar", top: 2, said: "I have went to Tilden last month.", at: "05:20",
    alt: { casual: "I went to Tilden last month.", professional: "I went to Tilden last month." },
    why: { casual: "A finished time like \u201clast month\u201d takes the simple past: went.", professional: "A finished time like \u201clast month\u201d takes the simple past: went." },
    match: { casual: ["i went"], professional: ["i went"] } },
  { id: "maya-pr1", convo: "maya", kind: "rephrase", area: "pronunciation", top: 3, said: "I'm not comfortable hiking that far.", at: "07:02",
    heard: "com-FOR-ta-ble", alt: { casual: "COMF-ter-bul", professional: "COMF-ter-bul" },
    why: { casual: "Stress the first syllable; the middle \u201cfor\u201d almost disappears.", professional: "Stress the first syllable; the middle \u201cfor\u201d almost disappears." },
    sayLearner: "come for table", sayModel: "comfortable", match: { casual: ["comfortable"], professional: ["comfortable"] } },
  { id: "priya-g1", convo: "priya", kind: "rephrase", area: "grammar", top: 2, said: "The landlord don't answer my messages.", at: "05:44",
    alt: { casual: "The landlord doesn't answer my messages.", professional: "The landlord doesn't answer my messages." },
    why: { casual: "One person (he/she/the landlord) takes \u201cdoesn't\u201d.", professional: "One person (he/she/the landlord) takes \u201cdoesn't\u201d." },
    match: { casual: ["doesn't answer", "doesn't reply"], professional: ["doesn't answer", "doesn't reply"] } },
  { id: "priya-pr1", convo: "priya", kind: "rephrase", area: "pronunciation", top: 3, said: "Let's get more vegetables.", at: "10:02",
    heard: "ve-ge-TA-bles", alt: { casual: "VEJ-tuh-bulz", professional: "VEJ-tuh-bulz" },
    why: { casual: "Three beats, stress on the first: VEJ-tuh-bulz.", professional: "Three beats, stress on the first: VEJ-tuh-bulz." },
    sayLearner: "veh jeh tah bles", sayModel: "vegetables", match: { casual: ["vegetables"], professional: ["vegetables"] } },
  { id: "chen-s1", convo: "chen", kind: "rephrase", area: "structure", top: 2, said: "About the interviews, how many is enough, ten?", at: "09:40",
    alt: { professional: "How many interviews would be enough? Would ten work?", casual: "How many interviews is enough? Like ten?" },
    why: { professional: "Leading with the question makes it easier to follow.", casual: "Leading with the question makes it easier to follow." },
    match: { professional: ["would ten work", "how many interviews"], casual: ["how many interviews", "like ten"] } },
  { id: "chen-pr1", convo: "chen", kind: "rephrase", area: "pronunciation", top: 3, said: "I want to determine the market size.", at: "12:10",
    heard: "de-ter-MINE", alt: { professional: "de-TER-min", casual: "de-TER-min" },
    why: { professional: "Stress the middle syllable, and the end sounds like \u201cmin\u201d.", casual: "Stress the middle syllable, and the end sounds like \u201cmin\u201d." },
    sayLearner: "dee ter mine", sayModel: "determine", match: { professional: ["determine"], casual: ["determine"] } },
  { id: "sync-pr1", convo: "sync", kind: "rephrase", area: "pronunciation", top: 3, said: "We need to develop the fix first.", at: "14:30",
    heard: "DE-ve-lop", alt: { professional: "dih-VEL-up", casual: "dih-VEL-up" },
    why: { professional: "Stress the second syllable: dih-VEL-up.", casual: "Stress the second syllable: dih-VEL-up." },
    sayLearner: "deh vuh lop", sayModel: "develop", match: { professional: ["develop"], casual: ["develop"] } },

  // Learned earlier this week, from a conversation outside the demo.
  { id: "old-1", convo: null, source: "Lab meeting · Oct 15", sourceContext: "professional", kind: "phrase", text: "touch base", meaning: "Check in briefly.", seed: "learned", match: [] },
  { id: "old-2", convo: null, source: "Lab meeting · Oct 15", sourceContext: "professional", kind: "phrase", text: "on the same page", meaning: "In agreement; sharing the same understanding.", seed: "learned", match: [] }
];

// Times the learner used a phrase they picked up earlier, in a later real conversation.
// Simulated detection: the prototype does not analyse the learner's own speech yet.
const USES = [
  { item: "old-1", convo: "sync", at: "24:10", said: "Can we touch base before Friday?" }
];

// Progress reports (v2.4). Order: pronunciation, grammar, sentence structure, natural
// expressions (cultural context and slang are part of natural expressions). Sample data: the prototype doesn't score speech yet.
// level: 0-100 per period; evidence: how many of the learner's own sentences it rests on.
// wins: up to 3 pairs of the same kind of moment, earlier (before) and recently (now), in the
// learner's own words; mark = the words that changed; change = one line on what got better.
// What hasn't improved yet is in MISTAKES, shown under its skill as "to grow further".
const SKILLS = [
  { id: "pronunciation", name: "Pronunciation", level: { week: 40, month: 38, all: 34 }, evidence: { week: 3, month: 8, all: 19 },
    wins: [
      { before: { when: "Oct 13 · Lab meeting", text: "“develop” said as DE-ve-lop", mark: "DE-ve-lop" },
        now: { when: "Oct 19 · Weekly product sync", text: "“develop” said as dih-VEL-up", mark: "dih-VEL-up" },
        change: "The stress moved to the second syllable, where it belongs." },
      { before: { when: "Oct 9 · Office hours", text: "“record” (a noun) said as re-CORD", mark: "re-CORD" },
        now: { when: "Oct 19 · Office hours", text: "“record” (a noun) said as REK-erd", mark: "REK-erd" },
        change: "As a noun, “record” stresses the first syllable." }
    ] },
  { id: "grammar", name: "Grammar", level: { week: 48, month: 44, all: 36 }, evidence: { week: 4, month: 11, all: 26 },
    wins: [
      { before: { when: "Oct 6 · Coffee with Sam", text: "Yesterday I go to the library.", mark: "go" },
        now: { when: "Oct 20 · Lunch with Priya", text: "I went to the store yesterday.", mark: "went" },
        change: "Past tense for things that already happened: go → went." },
      { before: { when: "Oct 8 · Lab meeting", text: "I am agree with Lena.", mark: "am agree" },
        now: { when: "Oct 19 · Weekly product sync", text: "I agree with Lena on that.", mark: "agree" },
        change: "“Agree” is already a verb, so it doesn't need “am”." },
      { before: { when: "Oct 12 · Office hours", text: "Thank you for the many informations.", mark: "many informations" },
        now: { when: "Oct 19 · Office hours", text: "Thanks for all the information.", mark: "all the information" },
        change: "“Information” has no plural: all the information." }
    ] },
  { id: "structure", name: "Sentence structure", level: { week: 44, month: 45, all: 39 }, evidence: { week: 2, month: 7, all: 15 },
    wins: [
      { before: { when: "Oct 12 · Office hours", text: "The draft, I think, maybe is not finished.", mark: "The draft, I think, maybe is not" },
        now: { when: "Oct 19 · Office hours", text: "I don't think the draft is finished yet.", mark: "I don't think the draft is" },
        change: "Starting with “I don't think” makes the point clear right away." }
    ] },
  { id: "expression", name: "Natural expressions (slang)", level: { week: 62, month: 54, all: 41 }, evidence: { week: 3, month: 9, all: 21 },
    wins: [
      { before: { when: "Oct 8 · Lab meeting", text: "Can I meet you shortly before Friday?", mark: "meet you shortly" },
        now: { when: "Oct 19 · Weekly product sync", text: "Can we touch base before Friday?", mark: "touch base" },
        change: "“Touch base” is how colleagues say a quick check-in." },
      { before: { when: "Oct 15 · Lab meeting", text: "I want to say my opinion.", mark: "I want to say my opinion" },
        now: { when: "Oct 19 · Weekly product sync", text: "If I could add one thing...", mark: "If I could add one thing" },
        change: "A softer way to take the floor in a meeting." },
      { before: { when: "Oct 11 · Lunch with Priya", text: "Shall we go together?", mark: "Shall we go together" },
        now: { when: "Oct 18 · Coffee chat with Sam", text: "Want to come with?", mark: "Want to come with" },
        change: "Between friends, the shorter question sounds relaxed." }
    ] }
];
// The summary at the top of Progress and the takeaway card, per period (sample).
const INSIGHTS = {
  week: { title: "More natural, fewer verb slips.", sub: "You used a new phrase at work and got past tense right in two chats.",
    takeaway: "You try new phrases more in casual chats than in meetings.", note: "Your coffee chat with Sam had the most new phrases." },
  month: { title: "Steady progress this month.", sub: "Grammar and natural expressions moved the most.",
    takeaway: "Your longest conversations were with friends over food.", note: "Lunch and coffee chats ran 15 minutes or more." },
  all: { title: "You've come a long way.", sub: "Since you started, every skill has moved up.",
    takeaway: "Meetings are where you've grown the most.", note: "Natural expressions in meetings rose the fastest." }
};
// Top 3 tips from this week's feedback that the learner later used in a real conversation.
// Simulated: the prototype doesn't analyse the learner's speech yet.
const APPLIED = ["sync-r1", "chen-r1"];
// Totals before this week, added for This Month and All Time (sample history).
// used: new phrases used in real conversations; tips / applied: Top 3 tips given / later used.
const EARLIER = {
  month: { conversations: 10, minutes: 72, sessions: 3, practiced: 6, used: 3, tips: 30, applied: 7 },
  all: { conversations: 27, minutes: 186, sessions: 7, practiced: 15, used: 9, tips: 81, applied: 22 }
};

// Recurring mistakes in Insights (v2.4), shown under their skill as "to grow further": the same
// kind of slip seen again in later real conversations, with the latest instance and what to
// try. skill = a SKILLS id. Sample data, like SKILLS.
// times: per period, how often it showed up; status: "still" (keeps happening) or "fewer".
const MISTAKES = [
  { id: "m-past", skill: "grammar", label: "“have” + past tense for finished times",
    times: { week: 3, month: 7, all: 12 }, status: "still",
    latest: { when: "Today · Coffee chat with Sam", text: "I have went to Tilden last month.", mark: "have went" },
    try: "I went to Tilden last month.", tip: "With a finished time (last month, yesterday), use the simple past." },
  { id: "m-does", skill: "grammar", label: "“don't” with one person",
    times: { week: 2, month: 5, all: 9 }, status: "still",
    latest: { when: "Today · Lunch with Priya", text: "The landlord don't answer my messages.", mark: "don't" },
    try: "The landlord doesn't answer my messages.", tip: "He, she or one person takes “doesn't”." },
  { id: "m-stress", skill: "pronunciation", label: "Stress on the last syllable",
    times: { week: 2, month: 6, all: 14 }, status: "fewer",
    latest: { when: "Mon · Office hours with Prof. Chen", text: "“determine” said as de-ter-MINE", mark: "de-ter-MINE" },
    try: "de-TER-min", tip: "Fewer than last month. Long words usually stress an early syllable." },
  { id: "m-lead", skill: "structure", label: "The question comes last",
    times: { week: 2, month: 6, all: 11 }, status: "still",
    latest: { when: "Mon · Office hours with Prof. Chen", text: "About the interviews, how many is enough, ten?", mark: "About the interviews," },
    try: "How many interviews would be enough? Would ten work?", tip: "Lead with the question, then add the detail. It's easier to follow." },
  { id: "m-very", skill: "expression", label: "“very” + a plain word",
    times: { week: 2, month: 4, all: 8 }, status: "still",
    latest: { when: "Today · Coffee chat with Sam", text: "I am very tired because of many assignments.", mark: "very tired" },
    try: "I'm wiped out from all these assignments.", tip: "With friends, one vivid phrase sounds more natural than “very” + a word." }
];

// Practice topics (v2.4): one AI partner, and the learner picks what to talk about: Work,
// School, Friends or Family ("Surprise me" picks one of them). The register follows the topic:
// Friends and Family use everyday slang, Work and School stay polished. script / closing: fallback when the AI is
// offline. sample: what the mic types in browsers without speech recognition.
const PARTNER = "Coach";   // placeholder until the team votes on a name
const TOPICS = [
  { id: "t-work", label: "Work", context: "professional", emoji: "💼",
    summary: "A quick catch-up with a coworker before a team meeting: what each of you is working on this week.",
    scene: ["Before a team meeting.", "A coworker asks how your week is going."],
    script: [
      { ai: "Hey, got a minute before the meeting? How's your week shaping up?", sample: "Pretty busy, but it's going well. I'm wrapping up a report." },
      { ai: "Nice. Anything you're stuck on that I could help with?", sample: "Could you take a quick look at my slides later?" },
      { ai: "Sure. Are you presenting today or next week?", sample: "Next week, so I have a little time." },
      { ai: "Good. Want to grab lunch after the meeting?", sample: "Sounds good. Let's do it." }
    ], closing: "Great, see you in there." },
  { id: "t-school", label: "School", context: "professional", emoji: "📚",
    summary: "Chatting with a classmate after a lecture about the group project and the next assignment.",
    scene: ["Right after class.", "A classmate wants to plan the group project."],
    script: [
      { ai: "That lecture went fast. Did you catch what's due Friday?", sample: "I think it's the first draft of the project proposal." },
      { ai: "Right. Should we split the sections?", sample: "Good idea. I can take the research part." },
      { ai: "Perfect. When could we meet to put it together?", sample: "How about Thursday afternoon at the library?" },
      { ai: "Works for me. Should we invite the others?", sample: "Yes, let's send a message to the group." }
    ], closing: "Okay, see you Thursday!" },
  { id: "t-friends", label: "Friends", context: "casual", emoji: "🧋",
    summary: "Catching up with a friend about the weekend and making plans.",
    scene: ["Texting turned into a call.", "A friend wants to hear about your weekend."],
    script: [
      { ai: "Hey! What did you get up to this weekend?", sample: "Not much, honestly. I just chilled and caught up on sleep." },
      { ai: "Love that. Some of us are getting tacos Friday. You in?", sample: "Count me in! What time?" },
      { ai: "Around seven. Oh, and are you still coming to the hike on Sunday?", sample: "I might skip it, I'm kind of wiped out." },
      { ai: "Totally fair. Wanna do something low-key instead?", sample: "Sure, maybe a movie?" }
    ], closing: "Deal. Talk soon!" },
  { id: "t-family", label: "Family", context: "casual", emoji: "🏠",
    summary: "A video call with a family member: how things are going, and plans for the next visit.",
    scene: ["A Sunday video call.", "A family member wants to hear how you're doing."],
    script: [
      { ai: "Hi sweetie! You look tired. Are you eating okay?", sample: "I'm fine, just a busy week. I've been cooking more, actually." },
      { ai: "Good! What have you been making?", sample: "Mostly curry and pasta. Nothing fancy." },
      { ai: "Ha. So when are you coming home next?", sample: "Maybe in December, if I can get time off." },
      { ai: "That would be wonderful. Want me to make your favorite?", sample: "Yes please, I miss your cooking." }
    ], closing: "Okay, get some rest. Love you!" }
];
