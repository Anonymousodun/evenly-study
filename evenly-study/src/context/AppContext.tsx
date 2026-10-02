import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Task, SleepEntry, DailyCheckIn, SkippedBreak, Suggestion, Settings, BurnoutLevel, User } from '../types';
import { lightTheme, darkTheme, Theme } from './themes';
import { calculateBurnoutLevel } from '../utils/burnoutAlgorithm';

const defaultSettings: Settings = {
  targetBedtime: '23:00',
  studyWindows: [{ start: '09:00', end: '17:00' }],
  breakLength: 5,
  focusLength: 25,
  windDownReminder: true,
  region: 'US',
};

const initialState: AppState = {
  tasks: [],
  sleep: [],
  dailyCheckIns: [],
  burnoutLevel: 'green',
  suggestions: [],
  settings: defaultSettings,
  skippedBreaks: [],
  user: null,
};

type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'ADD_SLEEP_CHECKIN'; payload: SleepEntry }
  | { type: 'ADD_DAILY_CHECKIN'; payload: DailyCheckIn }
  | { type: 'SET_BURNOUT_LEVEL'; payload: BurnoutLevel }
  | { type: 'ADD_SUGGESTION'; payload: Suggestion }
  | { type: 'APPROVE_SUGGESTION'; payload: string }
  | { type: 'DISMISS_SUGGESTION'; payload: string }
  | { type: 'LOG_SKIPPED_BREAK'; payload: SkippedBreak }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'RESET_DATA' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'ADD_SLEEP_CHECKIN':
      return { ...state, sleep: [...state.sleep, action.payload] };
    case 'ADD_DAILY_CHECKIN':
      return { ...state, dailyCheckIns: [...state.dailyCheckIns, action.payload] };
    case 'SET_BURNOUT_LEVEL':
      return { ...state, burnoutLevel: action.payload };
    case 'ADD_SUGGESTION':
      return { ...state, suggestions: [...state.suggestions, action.payload] };
    case 'APPROVE_SUGGESTION':
      return {
        ...state,
        suggestions: state.suggestions.map(s =>
          s.id === action.payload ? { ...s, approved: true } : s
        ),
      };
    case 'DISMISS_SUGGESTION':
      return {
        ...state,
        suggestions: state.suggestions.map(s =>
          s.id === action.payload ? { ...s, approved: false } : s
        ),
      };
    case 'LOG_SKIPPED_BREAK':
      return { ...state, skippedBreaks: [...state.skippedBreaks, action.payload] };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    case 'RESET_DATA':
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isDark, setIsDark] = React.useState(false);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const level = calculateBurnoutLevel(state);
    if (level !== state.burnoutLevel) {
      dispatch({ type: 'SET_BURNOUT_LEVEL', payload: level });
    }
  }, [state.tasks, state.sleep, state.dailyCheckIns, state.skippedBreaks]);

  return (
    <AppContext.Provider value={{ state, dispatch, theme, isDark, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export function useTheme() {
  const { theme } = useAppContext();
  return theme;
}
