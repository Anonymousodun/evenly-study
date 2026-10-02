import { AppState, BurnoutLevel } from '../types';

export function calculateBurnoutLevel(state: AppState): BurnoutLevel {
  const score = calculateBurnoutScore(state);
  if (score < 3) return 'green';
  if (score < 6) return 'yellow';
  return 'red';
}

function calculateBurnoutScore(state: AppState): number {
  const now = new Date();
  const recentDays = 7;

  let score = 0;

  const upcomingTasks = state.tasks.filter(t => {
    if (t.completed) return false;
    const dueDate = new Date(t.due_date);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  });
  const heavyTasks = upcomingTasks.filter(t => t.effort === 'heavy').length;
  score += Math.min(heavyTasks, 3);

  const recentSleep = state.sleep
    .filter(s => {
      const entryDate = new Date(s.date);
      const diffDays = Math.ceil((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= recentDays;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const poorSleep = recentSleep.filter(s => {
    const hours = calculateSleepHours(s.bedtime, s.wake_time);
    return hours < 6;
  }).length;
  score += poorSleep;

  const recentMoods = state.dailyCheckIns
    .filter(c => {
      const entryDate = new Date(c.date);
      const diffDays = Math.ceil((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= recentDays;
    })
    .slice(-3);

  const lowMood = recentMoods.filter(c => c.mood_score <= 2).length;
  score += lowMood;

  const recentSkips = state.skippedBreaks.filter(s => {
    const entryDate = new Date(s.date);
    const diffDays = Math.ceil((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= recentDays;
  });

  if (recentSkips.length >= 3) score += 2;
  else if (recentSkips.length >= 2) score += 1;

  return score;
}

function calculateSleepHours(bedtime: string, wakeTime: string): number {
  const [bedHour, bedMin] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);

  let bedTotal = bedHour * 60 + bedMin;
  let wakeTotal = wakeHour * 60 + wakeMin;

  if (wakeTotal < bedTotal) {
    wakeTotal += 24 * 60;
  }

  return (wakeTotal - bedTotal) / 60;
}

export function getBurnoutSuggestion(level: BurnoutLevel): string {
  switch (level) {
    case 'green':
      return "You're in a healthy zone — keep it up!";
    case 'yellow':
      return 'Load is building — consider moving one task to tomorrow';
    case 'red':
      return 'High risk — time to ease off. Want to see how to lighten your load?';
  }
}
