// Sample data for the prototype. Edit freely: conversations, phrases and the AI scripts
// all live here, so content changes never touch the screen code.

const GOAL = 5;           // weekly practice goal: saved phrases used in practice
const USE_GOAL = 3;       // weekly goal: new phrases used in real conversations
const USER = "Yuka";
const TODAY = "Tuesday, Oct 20";

// mine: minutes the learner spoke in that conversation (simulated speaker ID).
const CONVOS = [
  {
    id: "maya", title: "Coffee chat with Maya", context: "casual",
    when: "Today · 3:40 PM", length: "18 min", mine: 7, short: "coffee chat", art: "coffee", people: "Maya (classmate)", place: "Free Speech Café",
    summary: "You caught up with Maya after class. She's buried in internship recruiting, invited you on a Sunday hike, and pushed your Friday dinner.",
    partner: "Maya", partnerNote: "Plays your classmate, same tone as today",
    scene: ["Free Speech Café, after class.", "Maya is catching up on your week and weekend plans."],
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
    id: "sync", title: "Weekly product sync", context: "professional",
    when: "Mon · 10:00 AM", length: "32 min", mine: 5, short: "meeting", art: "meeting", people: "Daniel (PM), Lena (design)", place: "Zoom",
    summary: "Daniel ran the weekly sync. The team triaged a checkout bug, debated whether a fix could ship by Friday, and pushed the pricing discussion to next week.",
    partner: "Daniel", partnerNote: "Plays your PM in the same meeting",
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

// kind "phrase": something the other person said that is likely new to the user.
// kind "rephrase": something the user said, with a context-fit alternative per context.
const ITEMS = [
  { id: "maya-p1", convo: "maya", kind: "phrase", text: "I'm swamped", meaning: "I'm extremely busy; too much to do.",
    sentence: "Honestly, I'm swamped this week with recruiting stuff.", hl: "I'm swamped", speaker: "Maya", at: "02:14", match: ["swamped"] },
  { id: "maya-p2", convo: "maya", kind: "phrase", text: "take a rain check", meaning: "Politely postpone an invitation to another time.",
    sentence: "Can I take a rain check on Friday dinner?", hl: "take a rain check", speaker: "Maya", at: "09:51", match: ["rain check"] },
  { id: "maya-p3", convo: "maya", kind: "phrase", text: "a long shot", meaning: "Something unlikely to succeed, but worth trying.",
    sentence: "Applying there is a long shot, but why not.", hl: "a long shot", speaker: "Maya", at: "12:30", match: ["long shot"] },
  { id: "maya-p4", convo: "maya", kind: "phrase", text: "count me in", meaning: "Yes, include me; I want to join.",
    sentence: "If you're doing the hike Sunday, count me in.", hl: "count me in", speaker: "Maya", at: "15:02", match: ["count me in"] },
  { id: "maya-r1", convo: "maya", kind: "rephrase", said: "I am very tired because of many assignments.", at: "01:40",
    alt: { casual: "I'm wiped out from all these assignments.", professional: "I've been stretched a bit thin with deadlines this week." },
    why: { casual: "With a friend, a vivid everyday phrase sounds more relaxed.",
           professional: "At work, this signals a heavy load without sounding like a complaint." },
    match: { casual: ["wiped out"], professional: ["stretched", "thin"] } },
  { id: "maya-r2", convo: "maya", kind: "rephrase", said: "Shall we go together?", at: "16:20",
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
  { id: "sync-r1", convo: "sync", kind: "rephrase", said: "I want to say my opinion.", at: "04:05",
    alt: { professional: "If I could add one thing...", casual: "Can I jump in for a sec?" },
    why: { professional: "A softer opener lets you take the floor without sounding abrupt.",
           casual: "Among friends, a quick, light way to cut in." },
    match: { professional: ["add one thing", "quick thought"], casual: ["jump in"] } },
  { id: "sync-r2", convo: "sync", kind: "rephrase", said: "This is not possible by Friday.", at: "22:18",
    alt: { professional: "Friday might be tight. Could we aim for Monday?", casual: "Friday's pushing it. How about Monday?" },
    why: { professional: "Naming the constraint and offering an option keeps it collaborative.",
           casual: "Relaxed, but still clear about the timing." },
    match: { professional: ["tight", "aim for"], casual: ["pushing it", "how about"] } },

  // Learned earlier this week, from a conversation outside the demo.
  { id: "old-1", convo: null, source: "Lab meeting · Oct 15", sourceContext: "professional", kind: "phrase", text: "touch base", meaning: "Check in briefly.", seed: "learned", match: [] },
  { id: "old-2", convo: null, source: "Lab meeting · Oct 15", sourceContext: "professional", kind: "phrase", text: "on the same page", meaning: "In agreement; sharing the same understanding.", seed: "learned", match: [] }
];

// Times the learner used a phrase they picked up earlier, in a later real conversation.
// Simulated detection: the prototype does not analyse the learner's own speech yet.
const USES = [
  { item: "old-1", convo: "sync", at: "24:10", said: "Can we touch base before Friday?" }
];
