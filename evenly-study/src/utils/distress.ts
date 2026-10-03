import { AppState } from '../types';

export interface DistressCheck {
  triggered: boolean;
  message: string;
}

export function checkDistress(state: AppState): DistressCheck {
  const sorted = [...state.dailyCheckIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const recent = sorted.slice(0, 3);
  const sustainedLowMood =
    recent.length >= 3 && recent.every(c => c.mood_score <= 2);

  if (sustainedLowMood) {
    return {
      triggered: true,
      message:
        "We've noticed you've been feeling drained lately. Would you like to see people who can help?",
    };
  }

  return { triggered: false, message: '' };
}
