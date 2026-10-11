import { AppState, Settings } from '../types';

// Crunch mode (PRD 7.3): a bounded exam-season mode. Derived purely from
// dates , no stored transitions needed.
//  - active: today is within [start, end]
//  - recovery: within 3 days after end (longer breaks, earlier cutoff, no new load)
export type CrunchPhase = 'off' | 'active' | 'recovery';

export interface CrunchStatus {
  phase: CrunchPhase;
  daysLeft: number; // days remaining in the current phase
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function addDaysStr(dateStr: string, n: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function diffDays(a: string, b: string): number {
  return Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 86400000);
}

export function getCrunchStatus(settings: Settings): CrunchStatus {
  if (!settings.crunch) return { phase: 'off', daysLeft: 0 };
  const today = todayStr();
  const { end } = settings.crunch;
  if (today <= end) return { phase: 'active', daysLeft: diffDays(today, end) };
  if (today <= addDaysStr(end, 3)) return { phase: 'recovery', daysLeft: diffDays(today, addDaysStr(end, 3)) };
  return { phase: 'off', daysLeft: 0 };
}

// During recovery the sleep cutoff shifts 30 minutes earlier automatically.
export function getEffectiveBedtime(settings: Settings): string {
  if (getCrunchStatus(settings).phase !== 'recovery') return settings.targetBedtime;
  const [h, m] = settings.targetBedtime.split(':').map(Number);
  const total = h * 60 + m - 30;
  const norm = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(norm / 60)).padStart(2, '0')}:${String(norm % 60).padStart(2, '0')}`;
}

// One-time, never-repeated suggestion after several heavy days.
export function shouldSuggestCrunch(state: AppState): boolean {
  if (state.settings.crunch || state.settings.crunchDeclined) return false;
  if (getCrunchStatus(state.settings).phase !== 'off') return false;
  let low = 0;
  for (let n = 0; n < 7; n++) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    const key = d.toISOString().split('T')[0];
    const day = state.dailyCheckIns.filter(c => c.date === key);
    if (day.length > 0 && day.every(c => c.mood_score <= 2)) low += 1;
  }
  return low >= 3;
}

export { addDaysStr };
