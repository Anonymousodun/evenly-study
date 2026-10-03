// Local advice engine for Evenly AI.
// Study advice only — never diagnosis, never therapy.
// Crisis language is always met with human support options.

const CRISIS_WORDS = [
  'suicide', 'kill myself', 'end it', 'self-harm', 'self harm',
  'hurt myself', 'want to die', 'no reason to live',
];

export interface AIReply {
  text: string;
  crisis: boolean;
}

export function getAIAdvice(message: string): AIReply {
  const lower = message.toLowerCase();

  if (CRISIS_WORDS.some(w => lower.includes(w))) {
    return {
      crisis: true,
      text: "I'm really glad you told me, and I want to be honest: I'm only a study advice bot, not someone who can help with this. Please reach out to a person you trust right now — a counselor, a friend, or a helpline on the Support screen. You matter, and you don't have to sit with this alone.",
    };
  }

  if (/(sleep|insomnia|can't sleep|cant sleep|tired|bedtime|awake)/.test(lower)) {
    return {
      crisis: false,
      text: 'Sleep is the highest-leverage study tool you have — memories consolidate overnight. Tonight: set a firm cutoff one hour before bed, dim screens, and do something boring and screen-free for 20 minutes. If thoughts race, write tomorrow\'s top 3 tasks on paper so your brain can let go of them.',
    };
  }

  if (/(exam|test|deadline|grades|fail|failing)/.test(lower)) {
    return {
      crisis: false,
      text: 'Exam pressure makes everything feel urgent, but panic studying backfires. Try this: list everything due, circle the one thing that moves the needle most, and work in 25-minute sessions with real breaks. One focused hour beats three anxious ones. Want help splitting a big task? Check the suggestion on your Home screen.',
    };
  }

  if (/(focus|concentrat|distract|procrastinat|motivat|lazy)/.test(lower)) {
    return {
      crisis: false,
      text: 'Struggling to focus is normal, not a character flaw. Shrink the start: commit to just 5 minutes on the task — starting is the hardest part. Put your phone in another room, use a timer (the Breaks tab has one), and pair the session with a small reward like a walk or a snack.',
    };
  }

  if (/(break|rest|burnout|exhaust|overwhelm|tired of|too much)/.test(lower)) {
    return {
      crisis: false,
      text: 'Feeling overwhelmed is a signal, not a failure. Right now: stand up, look at something far away for a minute, and drink some water. Then pick exactly one small thing to do next — or deliberately rest without guilt. Rest is part of the work, and your Home indicator will ease back as your load lightens.',
    };
  }

  if (/(anxious|anxiety|stress|stressed|worried|panic|nervous)/.test(lower)) {
    return {
      crisis: false,
      text: 'That tight, buzzy feeling is your body trying to protect you — thank it, then slow it down. Try box breathing: in 4 counts, hold 4, out 4, hold 4, four rounds. Then externalize the worry: write down what\'s actually due and when. Vague dread shrinks once it\'s on paper with dates.',
    };
  }

  if (/(sad|down|lonely|hopeless|depress|empty)/.test(lower)) {
    return {
      crisis: false,
      text: 'I\'m sorry you\'re feeling this way. I can share study tips, but I can\'t be the support a person can be — if this feeling sticks around, please talk to someone you trust or check the Support screen. For today: one tiny kind act counts — a short walk, sunlight, texting a friend. Small steps still move you forward.',
    };
  }

  if (/(hi|hello|hey|morning|evening|thanks|thank you)/.test(lower)) {
    return {
      crisis: false,
      text: "Hi! I'm Evenly AI — I give practical study and rest advice: sleep, focus, exam prep, breaks, and handling workload. What's on your mind?",
    };
  }

  return {
    crisis: false,
    text: 'Good question. In general: protect sleep first, work in short focused sessions with real breaks, and split big tasks into 15-minute chunks. If you tell me a bit more — sleep, exams, focus, or stress — I can be more specific.',
  };
}

export const QUICK_PROMPTS = ['I can\'t sleep', 'Exam stress', 'I can\'t focus', 'Feeling overwhelmed'];
