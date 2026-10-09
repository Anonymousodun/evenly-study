import { SleepEntry } from '../types';

// Detailed sleep scoring (PRD 7.7): plain-language labels, never raw numbers.
// Debt is counted for the current week only and resets weekly. A chronic
// multi-week pattern surfaces as a gentle trend note, not a growing counter.
export type SleepLabel = 'Well rested' | 'Running low' | 'Sleep debt building';

export function sleepHours(entry: { bedtime: string; wake_time: string }): number {
  const [bedH, bedM] = entry.bedtime.split(':').map(Number);
  const [wakeH, wakeM] = entry.wake_time.split(':').map(Number);
  let bed = bedH * 60 + bedM;
  let wake = wakeH * 60 + wakeM;
  if (wake <= bed) wake += 24 * 60;
  return (wake - bed) / 60;
}

export function scoreNight(entry: SleepEntry, targetHours: number): SleepLabel {
  // How rested the student feels nudges the score up or down by up to an hour.
  const effective = sleepHours(entry) + (entry.rest_score - 3) * 0.5;
  if (effective >= targetHours - 0.5) return 'Well rested';
  if (effective >= targetHours - 1.5) return 'Running low';
  return 'Sleep debt building';
}

// Hours "borrowed" relative to target over the last 7 days only.
export function currentWeekDebt(entries: SleepEntry[], targetHours: number): { debtHours: number; shortNights: number } {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const key = cutoff.toISOString().split('T')[0];
  const week = entries.filter(e => e.date >= key);
  let debt = 0;
  let short = 0;
  for (const e of week) {
    const gap = targetHours - sleepHours(e);
    if (gap > 0) {
      debt += gap;
      short += 1;
    }
  }
  return { debtHours: Math.round(debt * 10) / 10, shortNights: short };
}

// Gentle trend note when low sleep persists across weeks (not a counter).
export function chronicSleepNote(entries: SleepEntry[], targetHours: number): string | null {
  const byWeek = new Map<string, number[]>();
  for (const e of entries) {
    const d = new Date(e.date + 'T12:00:00');
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = monday.toISOString().split('T')[0];
    const list = byWeek.get(key) ?? [];
    list.push(sleepHours(e));
    byWeek.set(key, list);
  }
  let lowWeeks = 0;
  for (const hours of byWeek.values()) {
    const avg = hours.reduce((n, h) => n + h, 0) / hours.length;
    if (avg < targetHours - 1) lowWeeks += 1;
  }
  if (lowWeeks >= 3) {
    return `You've had low sleep for ${lowWeeks} weeks running — worth a kind look at your evenings.`;
  }
  return null;
}
