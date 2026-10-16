import React, { createContext, useContext, useCallback, useMemo, useRef, useState, ReactNode } from 'react';
import { useAppContext } from '../../context/AppContext';
import { tourKeyFor, saveTourFlag } from '../../utils/tourStore';

export interface Spot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TourStep {
  key: string;
  title: string;
  body: string;
  kind: 'tab' | 'support';
}

export const TOUR_STEPS: TourStep[] = [
  { key: 'Home', title: 'Your calm home', body: 'See your burnout level and today\u2019s suggestion here.', kind: 'tab' },
  { key: 'Tasks', title: 'Your task list', body: 'Add assignments with effort so heavy weeks show early.', kind: 'tab' },
  { key: 'Schedule', title: 'Your weekly rhythm', body: 'Add your classes and see where your week is too full.', kind: 'tab' },
  { key: 'CheckIn', title: 'Daily check-in', body: 'Tap a face in five seconds to track mood and rest.', kind: 'tab' },
  { key: 'Settings', title: 'Your controls', body: 'Country, reminders, contacts, and account live here.', kind: 'tab' },
  { key: 'Support', title: 'Need help now', body: 'Support and helplines live behind this button, anytime.', kind: 'support' },
];

interface TourContextType {
  active: boolean;
  stepIndex: number;
  steps: TourStep[];
  tabSpots: Record<string, Spot>;
  supportSpot: Spot | null;
  containerSpot: Spot | null;
  setTabSpot: (name: string, spot: Spot) => void;
  setSupportSpot: (spot: Spot) => void;
  setContainerSpot: (spot: Spot) => void;
  startTour: () => void;
  next: () => void;
  back: () => void;
  skipTour: () => void;
  endQuietly: () => void;
  noteNavigation: (path: string) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const { state } = useAppContext();
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tabSpots, setTabSpots] = useState<Record<string, Spot>>({});
  const [supportSpot, setSupportSpot] = useState<Spot | null>(null);
  const [containerSpot, setContainerSpot] = useState<Spot | null>(null);
  const baselineRef = useRef<string | null>(null);

  const persist = useCallback(
    (flag: 'completed' | 'skipped') => {
      saveTourFlag(tourKeyFor(state.user?.id), flag);
    },
    [state.user?.id]
  );

  const startTour = useCallback(() => {
    setStepIndex(0);
    setActive(true);
  }, []);

  const finish = useCallback(
    (flag: 'completed' | 'skipped') => {
      persist(flag);
      setActive(false);
    },
    [persist]
  );

  const next = useCallback(() => {
    if (stepIndex >= TOUR_STEPS.length - 1) {
      finish('completed');
    } else {
      setStepIndex(stepIndex + 1);
    }
  }, [stepIndex, finish]);

  const back = useCallback(() => {
    setStepIndex(Math.max(0, stepIndex - 1));
  }, [stepIndex]);

  const skipTour = useCallback(() => finish('skipped'), [finish]);

  // Called with the current leaf route path on every navigation change.
  // While inactive it just tracks where the user is; once the tour starts,
  // any navigation away ends it quietly (saved as completed).
  const noteNavigation = useCallback(
    (path: string) => {
      if (!active) {
        baselineRef.current = path;
        return;
      }
      if (baselineRef.current !== null && path !== baselineRef.current) {
        finish('completed');
      }
    },
    [active, finish]
  );

  // If the account changes mid-tour, stop: flags are per account.
  const lastUserRef = useRef(state.user?.id);
  if (lastUserRef.current !== state.user?.id) {
    lastUserRef.current = state.user?.id;
    if (active) {
      persist('skipped');
      setActive(false);
    }
  }

  const value = useMemo(
    () => ({
      active,
      stepIndex,
      steps: TOUR_STEPS,
      tabSpots,
      supportSpot,
      containerSpot,
      setTabSpot: (name: string, spot: Spot) =>
        setTabSpots(prev => (prev[name]?.x === spot.x && prev[name]?.y === spot.y ? prev : { ...prev, [name]: spot })),
      setSupportSpot,
      setContainerSpot,
      startTour,
      next,
      back,
      skipTour,
      endQuietly: () => finish('completed'),
      noteNavigation,
    }),
    [active, stepIndex, tabSpots, supportSpot, containerSpot, startTour, next, back, skipTour, finish, noteNavigation]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within TourProvider');
  }
  return context;
}
