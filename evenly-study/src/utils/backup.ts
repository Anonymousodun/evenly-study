import { AppState } from '../types';

// Backup contents: everything needed to rebuild the app's data on a new
// phone. Never included: passwords, session tokens, R2 credentials.
// Restoring does not log anyone in: sign in first, then restore.
export function serializeBackup(state: AppState): string {
  return JSON.stringify({
    app: 'evenly-study-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: state.tasks,
    sleep: state.sleep,
    dailyCheckIns: state.dailyCheckIns,
    skippedBreaks: state.skippedBreaks,
    schedule: state.schedule,
    settings: state.settings,
  });
}

export interface ParsedBackup {
  tasks: AppState['tasks'];
  sleep: AppState['sleep'];
  dailyCheckIns: AppState['dailyCheckIns'];
  skippedBreaks: AppState['skippedBreaks'];
  schedule: AppState['schedule'];
  settings: Partial<AppState['settings']>;
}

export function parseBackup(json: string): ParsedBackup {
  const data = JSON.parse(json);
  if (!data || data.app !== 'evenly-study-backup' || !Array.isArray(data.tasks)) {
    throw new Error('That file is not an Evenly Study backup.');
  }
  return {
    tasks: data.tasks,
    sleep: Array.isArray(data.sleep) ? data.sleep : [],
    dailyCheckIns: Array.isArray(data.dailyCheckIns) ? data.dailyCheckIns : [],
    skippedBreaks: Array.isArray(data.skippedBreaks) ? data.skippedBreaks : [],
    schedule: Array.isArray(data.schedule) ? data.schedule : [],
    settings: data.settings && typeof data.settings === 'object' ? data.settings : {},
  };
}
