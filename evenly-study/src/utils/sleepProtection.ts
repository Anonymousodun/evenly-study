import { AppState } from '../types';

export interface SleepProtectionResult {
  exceeded: boolean;
  message: string;
  suggestedAction: string;
}

export function calculateCutoffTime(targetBedtime: string): Date {
  const [hour, minute] = targetBedtime.split(':').map(Number);
  const cutoff = new Date();
  cutoff.setHours(hour - 1, minute, 0, 0);
  return cutoff;
}

export function checkSleepProtection(state: AppState): SleepProtectionResult {
  const now = new Date();
  const cutoff = calculateCutoffTime(state.settings.targetBedtime);
  const hasActiveTasks = state.tasks.some(t => !t.completed);

  if (now > cutoff && hasActiveTasks) {
    return {
      exceeded: true,
      message: "It's getting late for work. Let's protect your sleep.",
      suggestedAction: 'Move a task to tomorrow?',
    };
  }

  return { exceeded: false, message: '', suggestedAction: '' };
}

export function getWindDownTime(targetBedtime: string): Date {
  const [hour, minute] = targetBedtime.split(':').map(Number);
  const windDown = new Date();
  windDown.setHours(hour, minute - 30, 0, 0);
  return windDown;
}
