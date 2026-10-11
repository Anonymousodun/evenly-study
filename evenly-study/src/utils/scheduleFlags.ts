import { ScheduleBlock, Settings } from '../types';

// Immediate, factual overload flags for the working schedule (PRD 7.2).
// Shown on the same screen as soon as the schedule changes , never as a
// separate notification. Suggested fixes only touch study time; fixed
// commitments (class/work/other) are reported factually with no fix prescribed.
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ScheduleFlag {
  id: string;
  kind: 'sleep' | 'heavy-day' | 'late-study';
  text: string;
  fix?: string;
}

const MIN_SLEEP_MIN = 7 * 60; // below this, a night gets flagged
const HEAVY_DAY_MIN = 10 * 60; // above this, a day gets flagged
const WAKE_HOUR = 7; // assumed wake time until a setting exists
const WIND_DOWN_MIN = 30;

function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fmtHours(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}` : `${h}.${Math.round((m / 60) * 10)}`;
}

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}

export function analyzeSchedule(blocks: ScheduleBlock[], settings: Settings): ScheduleFlag[] {
  const flags: ScheduleFlag[] = [];
  const bedtime = toMin(settings.targetBedtime || '23:00');
  const cutoff = bedtime - WIND_DOWN_MIN;
  const nightLen = (24 * 60 - bedtime) + WAKE_HOUR * 60;

  for (let day = 0; day < 7; day++) {
    const today = blocks.filter(b => b.day === day);
    if (today.length === 0) continue;
    const nextDay = (day + 1) % 7;

    // Sleep opportunity: night window minus scheduled blocks inside it.
    let nightBusy = 0;
    for (const b of today) nightBusy += overlap(toMin(b.start_time), toMin(b.end_time), bedtime, 24 * 60);
    for (const b of blocks.filter(x => x.day === nextDay)) {
      nightBusy += overlap(toMin(b.start_time), toMin(b.end_time), 0, WAKE_HOUR * 60);
    }
    const sleepOpp = nightLen - nightBusy - WIND_DOWN_MIN;
    if (sleepOpp < MIN_SLEEP_MIN) {
      const nightStudy = today.filter(b => b.kind === 'study' && toMin(b.end_time) > bedtime - 60);
      const fixedOnly = nightStudy.length === 0;
      flags.push({
        id: `sleep-${day}`,
        kind: 'sleep',
        text: `${DAY_NAMES[day]} night leaves only ${fmtHours(sleepOpp)} hours for sleep.`,
        fix: fixedOnly
          ? undefined
          : `Consider moving ${nightStudy.map(b => `"${b.title}"`).join(' or ')} earlier.`,
      });
      if (fixedOnly && nightBusy > 0) {
        flags[flags.length - 1].text += ' The squeeze comes from fixed commitments , no study changes suggested.';
      }
    }

    // Heavy day: total scheduled time.
    const dayTotal = today.reduce((sum, b) => sum + (toMin(b.end_time) - toMin(b.start_time)), 0);
    if (dayTotal > HEAVY_DAY_MIN) {
      const study = today.filter(b => b.kind === 'study');
      flags.push({
        id: `heavy-${day}`,
        kind: 'heavy-day',
        text: `${DAY_NAMES[day]} has ${fmtHours(dayTotal)} hours scheduled , a heavy day.`,
        fix: study.length > 0
          ? `Consider splitting or moving ${study.map(b => `"${b.title}"`).join(', ')}.`
          : undefined,
      });
      if (study.length === 0) {
        flags[flags.length - 1].text += ' This comes from fixed commitments.';
      }
    }

    // Late study: study running past the wind-down cutoff.
    for (const b of today) {
      if (b.kind === 'study' && toMin(b.end_time) > cutoff) {
        flags.push({
          id: `late-${b.id}`,
          kind: 'late-study',
          text: `"${b.title}" on ${DAY_NAMES[day]} runs past your wind-down cutoff.`,
          fix: 'Shorten it, or check the Our suggestion tab.',
        });
      }
    }
  }

  return flags;
}
