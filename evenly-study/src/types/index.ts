export type BurnoutLevel = 'green' | 'yellow' | 'red';

export type TaskType = 'exam' | 'essay' | 'reading' | 'group-project' | 'custom';
export type TaskEffort = 'light' | 'medium' | 'heavy';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  type: TaskType;
  effort: TaskEffort;
  due_date: string;
  completed: boolean;
  created_at: string;
}

export interface SleepEntry {
  id: string;
  user_id: string;
  date: string;
  bedtime: string;
  wake_time: string;
  rest_score: number;
  created_at: string;
}

export interface DailyCheckIn {
  id: string;
  user_id: string;
  date: string;
  mood_score: number;
  created_at: string;
}

export interface SkippedBreak {
  id: string;
  user_id: string;
  date: string;
  count: number;
  created_at: string;
}

export type ScheduleKind = 'class' | 'study' | 'work' | 'other' | 'break';

// A fixed weekly timetable block. day: 0 (Sunday) - 6 (Saturday).
// Times are 'HH:MM' strings. V2-1: manual entry only.
export interface ScheduleBlock {
  id: string;
  user_id: string;
  day: number;
  title: string;
  kind: ScheduleKind;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  break_length: 'short' | 'long' | null;
  completed: boolean;
  skipped: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
  target_bedtime: string | null;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  targetBedtime: string;
  studyWindows: { start: string; end: string }[];
  breakLength: number;
  focusLength: number;
  windDownReminder: boolean;
  region: string;
  setupComplete: boolean;
}

export interface Suggestion {
  id: string;
  type: 'move-task' | 'split-task' | 'break-now' | 'sleep-early';
  taskId?: string;
  text: string;
  detail: string;
  approved: boolean | null;
  timestamp: string;
}

export interface AppState {
  tasks: Task[];
  sleep: SleepEntry[];
  dailyCheckIns: DailyCheckIn[];
  burnoutLevel: BurnoutLevel;
  suggestions: Suggestion[];
  settings: Settings;
  skippedBreaks: SkippedBreak[];
  schedule: ScheduleBlock[];
  scheduleBackup: ScheduleBlock[] | null;
  flagLog: FlagLogEntry[];
  user: User | null;
}

// One overload flag recorded for the weekly review (PRD 7.2 + 7.4).
export interface FlagLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
}
