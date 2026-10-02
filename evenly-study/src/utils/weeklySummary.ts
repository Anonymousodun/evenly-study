import { AppState, BurnoutLevel } from '../types';

export interface DayData {
  day: string;
  date: string;
  mood: number | null;
  sleepHours: number | null;
  level: BurnoutLevel;
}

export interface WeeklySummary {
  days: DayData[];
  greenDays: number;
  yellowDays: number;
  redDays: number;
  avgMood: number | null;
  avgSleep: number | null;
  insight: string;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function generateWeeklySummary(state: AppState): WeeklySummary {
  const days: DayData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const checkIn = state.dailyCheckIns.find(c => c.date === dateStr);
    const sleep = state.sleep.find(s => s.date === dateStr);

    days.push({
      day: DAY_NAMES[date.getDay()],
      date: dateStr,
      mood: checkIn?.mood_score ?? null,
      sleepHours: sleep ? calculateSleepHours(sleep.bedtime, sleep.wake_time) : null,
      level: state.burnoutLevel,
    });
  }

  const greenDays = days.filter(d => d.level === 'green').length;
  const yellowDays = days.filter(d => d.level === 'yellow').length;
  const redDays = days.filter(d => d.level === 'red').length;

  const moods = days.map(d => d.mood).filter((m): m is number => m !== null);
  const sleeps = days.map(d => d.sleepHours).filter((s): s is number => s !== null);

  const avgMood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : null;
  const avgSleep = sleeps.length > 0 ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length : null;

  let insight = '';
  if (greenDays >= 5) {
    insight = 'You had a balanced week. Your future self thanks you.';
  } else if (redDays >= 3) {
    insight = 'A tough week. Consider lightening next week — rest is part of the work.';
  } else if (avgSleep !== null && avgSleep < 6) {
    insight = 'Your sleep has been short. Protecting bedtime could help next week.';
  } else if (avgMood !== null && avgMood <= 2.5) {
    insight = 'Your mood has been low. Be gentle with yourself — small breaks help.';
  } else {
    insight = 'A mixed week. Keep checking in — awareness is the first step.';
  }

  return { days, greenDays, yellowDays, redDays, avgMood, avgSleep, insight };
}

function calculateSleepHours(bedtime: string, wakeTime: string): number {
  const [bedHour, bedMin] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
  let bedTotal = bedHour * 60 + bedMin;
  let wakeTotal = wakeHour * 60 + wakeMin;
  if (wakeTotal < bedTotal) wakeTotal += 24 * 60;
  return (wakeTotal - bedTotal) / 60;
}
