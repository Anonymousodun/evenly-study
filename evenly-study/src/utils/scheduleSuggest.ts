import { ScheduleBlock, Settings } from '../types';

// Suggests a balanced version of the student's schedule.
// Rules (study blocks only , classes, work and other commitments are never touched):
//  1. Study blocks longer than 90 minutes are split with 10-minute breaks.
//  2. Study blocks running past the sleep cutoff (bedtime minus 30 min wind-down)
//     are shortened to end at the cutoff.
const MAX_STUDY_MIN = 90;
const BREAK_MIN = 10;
const WIND_DOWN_MIN = 30;
const MIN_KEPT_MIN = 15;

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ScheduleSuggestion {
  blocks: ScheduleBlock[];
  changes: string[];
  summary: string;
}

function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function cutoffMin(bedtime: string): number {
  return toMin(bedtime) - WIND_DOWN_MIN;
}

export function suggestSchedule(blocks: ScheduleBlock[], settings: Settings): ScheduleSuggestion {
  const out: ScheduleBlock[] = [];
  const changes: string[] = [];
  let breaksAdded = 0;
  let shortened = 0;
  const cutoff = cutoffMin(settings.targetBedtime || '23:00');

  const byDay = [...blocks].sort((a, b) => a.day - b.day || a.start_time.localeCompare(b.start_time));

  for (const b of byDay) {
    if (b.kind !== 'study') {
      out.push(b);
      continue;
    }
    let start = toMin(b.start_time);
    let end = toMin(b.end_time);

    // Rule 2 first: cap at the sleep cutoff.
    if (end > cutoff && start < cutoff) {
      end = cutoff;
      shortened += 1;
      changes.push(`Shortened "${b.title}" on ${DAY_NAMES[b.day]} to end at ${toHHMM(cutoff)} for bedtime.`);
    }
    if (start >= cutoff || end - start < MIN_KEPT_MIN) {
      if (end - start < MIN_KEPT_MIN && start < cutoff) {
        // Too short to keep , drop with a note instead of scheduling a useless stub.
        changes.push(`Removed "${b.title}" on ${DAY_NAMES[b.day]} , too little time left before bedtime. Consider another day.`);
        continue;
      }
      if (start >= cutoff) {
        changes.push(`Moved "${b.title}" on ${DAY_NAMES[b.day]} out , it ran past bedtime. Consider another day.`);
        continue;
      }
    }

    // Rule 1: split long study stretches with breaks.
    let cursor = start;
    let first = true;
    while (end - cursor > MAX_STUDY_MIN) {
      const chunkEnd = cursor + MAX_STUDY_MIN;
      out.push({
        ...b,
        id: first ? b.id : `${b.id}-p${cursor}`,
        start_time: toHHMM(cursor),
        end_time: toHHMM(chunkEnd),
      });
      first = false;
      const breakEnd = Math.min(chunkEnd + BREAK_MIN, end);
      if (breakEnd - chunkEnd >= 5) {
        out.push({
          id: `sug-${b.day}-${toHHMM(chunkEnd)}`,
          user_id: b.user_id,
          day: b.day,
          title: 'Break',
          kind: 'break',
          start_time: toHHMM(chunkEnd),
          end_time: toHHMM(breakEnd),
          created_at: new Date().toISOString(),
        });
        breaksAdded += 1;
        changes.push(`Added a ${breakEnd - chunkEnd}-min break during "${b.title}" on ${DAY_NAMES[b.day]}.`);
      }
      cursor = breakEnd;
    }
    out.push({
      ...b,
      id: first ? b.id : `${b.id}-p${cursor}`,
      start_time: toHHMM(cursor),
      end_time: toHHMM(end),
    });
  }

  const parts: string[] = [];
  if (breaksAdded > 0) parts.push(`added ${breaksAdded} break${breaksAdded === 1 ? '' : 's'}`);
  if (shortened > 0) parts.push(`shortened ${shortened} late block${shortened === 1 ? '' : 's'} for bedtime`);
  const summary = parts.length > 0
    ? `We ${parts.join(' and ')}.`
    : 'Your schedule already looks balanced , no changes suggested.';

  return { blocks: out, changes, summary };
}
