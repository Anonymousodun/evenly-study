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
  user: User | null;
}
