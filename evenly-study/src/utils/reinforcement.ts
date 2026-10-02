import { AppState } from '../types';

export const reinforcementMessages = {
  allBreaksTaken: 'You took every break today. Well done!',
  hitBedtime: 'Nice job easing off tonight. Rest is part of the work.',
  balancedWeek: 'You had a balanced week. Your future self thanks you.',
  completedTask: 'Good work finishing that. Every step counts.',
  sleepStreak: 'Two nights of good sleep. Your body is grateful.',
};

export interface StreakInfo {
  currentStreak: number;
  paused: boolean;
  lastActiveDate: string | null;
}

export function getStreakInfo(state: AppState): StreakInfo {
  const checkIns = [...state.dailyCheckIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (checkIns.length === 0) {
    return { currentStreak: 0, paused: false, lastActiveDate: null };
  }

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const lastDate = checkIns[0].date;
  const paused = lastDate !== today && lastDate !== yesterdayStr;

  let streak = 0;
  const expected = new Date();
  if (lastDate !== today) {
    expected.setDate(expected.getDate() - 1);
  }

  for (const checkIn of checkIns) {
    const expectedStr = expected.toISOString().split('T')[0];
    if (checkIn.date === expectedStr) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else {
      break;
    }
  }

  return { currentStreak: streak, paused, lastActiveDate: lastDate };
}

export function getReinforcementMessage(state: AppState): string | null {
  const today = new Date().toISOString().split('T')[0];

  const todaySkips = state.skippedBreaks.filter(b => b.date === today);
  if (todaySkips.length === 0 && state.dailyCheckIns.some(c => c.date === today)) {
    return reinforcementMessages.allBreaksTaken;
  }

  const recentSleep = state.sleep.slice(-2);
  const goodNights = recentSleep.filter(s => {
    const hours = calculateSleepHours(s.bedtime, s.wake_time);
    return hours >= 7;
  });
  if (goodNights.length >= 2) {
    return reinforcementMessages.sleepStreak;
  }

  if (state.burnoutLevel === 'green') {
    return reinforcementMessages.balancedWeek;
  }

  return null;
}

function calculateSleepHours(bedtime: string, wakeTime: string): number {
  const [bedHour, bedMin] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
  let bedTotal = bedHour * 60 + bedMin;
  let wakeTotal = wakeHour * 60 + wakeMin;
  if (wakeTotal < bedTotal) wakeTotal += 24 * 60;
  return (wakeTotal - bedTotal) / 60;
}
