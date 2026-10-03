import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../api/client';
import { Task, SleepEntry, DailyCheckIn, SkippedBreak } from '../types';

// Loads the signed-in user's data from the API into local state.
// Runs once per sign-in; screens read from fast local state after that.
export function useSync() {
  const { state, dispatch } = useAppContext();
  const userId = state.user?.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        const [tasks, sleep, checkIns, skips, me] = await Promise.all([
          api.get<Task[]>('/api/tasks'),
          api.get<SleepEntry[]>('/api/sleep'),
          api.get<DailyCheckIn[]>('/api/checkins'),
          api.get<SkippedBreak[]>('/api/skips'),
          api.get<{ profile: { settings?: Record<string, unknown> } }>('/api/me'),
        ]);
        if (cancelled) return;
        dispatch({ type: 'LOAD_DATA', payload: { tasks, sleep, dailyCheckIns: checkIns, skippedBreaks: skips } });
        if (me.profile?.settings && typeof me.profile.settings === 'object') {
          dispatch({ type: 'UPDATE_SETTINGS', payload: me.profile.settings as any });
        }
      } catch (err) {
        console.log('Sync failed (server may be offline):', (err as Error).message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);
}
