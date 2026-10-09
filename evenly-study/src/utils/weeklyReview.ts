import { AppState, Settings } from '../types';
import { getCrunchStatus } from './crunch';
import { currentWeekDebt, chronicSleepNote } from './sleepScore';

// Builds the weekly review (PRD 7.4): under a minute to read, leads with
// what went well, summarizes sleep/breaks/workload/best day plus any
// schedule-overload flags, and ends with one small one-tap suggestion.
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ReviewSuggestion {
  text: string;
  setting?: Partial<Settings>;
}

export interface WeekReview {
  weekStart: string; // YYYY-MM-DD, 6 days ago
  summary: string;
  wins: string[];
  highlights: string[];
  flags: string[];
  bestDay: string | null;
  suggestion: ReviewSuggestion;
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function shiftMinutes(hhmm: string, delta: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + delta;
  const norm = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(norm / 60)).padStart(2, '0')}:${String(norm % 60).padStart(2, '0')}`;
}

export function buildWeekReview(state: AppState): WeekReview {
  const weekStart = isoDaysAgo(6);
  const inWeek = (date: string) => date >= weekStart;

  const checkIns = state.dailyCheckIns.filter(c => inWeek(c.date));
  const sleep = state.sleep.filter(s => inWeek(s.date));
  const tasksDone = state.tasks.filter(t => t.completed);
  const tasksOpen = state.tasks.filter(t => !t.completed);
  const skips = state.skippedBreaks.filter(s => inWeek(s.date)).reduce((n, s) => n + s.count, 0);
  const flags = state.flagLog.filter(f => inWeek(f.date)).map(f => f.text);

  const avgMood = checkIns.length > 0
    ? checkIns.reduce((n, c) => n + c.mood_score, 0) / checkIns.length
    : null;
  const avgRest = sleep.length > 0
    ? sleep.reduce((n, s) => n + s.rest_score, 0) / sleep.length
    : null;

  let bestDay: string | null = null;
  if (checkIns.length > 0) {
    const best = checkIns.reduce((a, b) => (b.mood_score > a.mood_score ? b : a));
    bestDay = DAY_NAMES[new Date(best.date + 'T12:00:00').getDay()];
  }

  const wins: string[] = [];
  if (checkIns.length >= 5) wins.push(`You checked in ${checkIns.length} days this week.`);
  else if (checkIns.length > 0) wins.push('You showed up to check in — that counts.');
  if (avgRest !== null && avgRest >= 3.5) wins.push(`Solid rest — averaging ${avgRest.toFixed(1)} out of 5.`);
  if (tasksDone.length > 0) wins.push(`You finished ${tasksDone.length} task${tasksDone.length === 1 ? '' : 's'}.`);
  if (skips === 0 && checkIns.length > 0) wins.push('You took your breaks when they came.');
  if (wins.length === 0) wins.push('A quiet week is still a week you got through.');

  const highlights: string[] = [];
  highlights.push(
    avgMood !== null ? `Mood averaged ${avgMood.toFixed(1)} out of 5.` : 'No mood check-ins logged.'
  );  highlights.push(
    avgRest !== null ? `Rest averaged ${avgRest.toFixed(1)} out of 5.` : 'No sleep check-ins logged.'
  );
  highlights.push(
    `${tasksDone.length} done, ${tasksOpen.length} still open.`
  );
  if (bestDay) highlights.push(`${bestDay} was your best day.`);
  const target = state.settings.sleepTargetHours ?? 8;
  const debt = currentWeekDebt(state.sleep, target);
  if (debt.shortNights > 0) {
    highlights.push(`About ${debt.debtHours}h of sleep borrowed this week — it resets fresh next week.`);
  }
  const chronic = chronicSleepNote(state.sleep, target);
  if (chronic) highlights.push(chronic);
  const crunch = getCrunchStatus(state.settings);
  if (crunch.phase !== 'off') {
    highlights.push(
      crunch.phase === 'active'
        ? 'Crunch mode is on — essentials first, the rest can wait.'
        : 'You came out of crunch mode recently — how are you feeling?'
    );
  }

  // One small suggestion, highest priority first. Each applies in one tap.
  let suggestion: ReviewSuggestion;
  if (avgRest !== null && avgRest < 3) {
    suggestion = {
      text: 'Move bedtime 30 minutes earlier next week.',
      setting: { targetBedtime: shiftMinutes(state.settings.targetBedtime, -30) },
    };
  } else if (skips >= 3) {
    suggestion = {
      text: 'Shorten focus sessions to 20 minutes to protect breaks.',
      setting: { focusLength: 20 },
    };
  } else if (tasksOpen.length >= 4) {
    suggestion = {
      text: 'Add 5 minutes to breaks to protect your energy.',
      setting: { breakLength: state.settings.breakLength + 5 },
    };
  } else {
    suggestion = { text: 'Keep your rhythm — nothing needs changing.' };
  }

  const summary = wins[0];

  return { weekStart, summary, wins, highlights, flags, bestDay, suggestion };
}
