import { useAppContext } from '../context/AppContext';
import { SleepEntry } from '../types';
import { api } from '../api/client';
import { generateId } from '../utils/id';

export function useSleep() {
  const { state, dispatch } = useAppContext();

  const loadSleep = async () => {
    const entries = await api.get<SleepEntry[]>('/api/sleep');
    dispatch({ type: 'LOAD_DATA', payload: { sleep: entries } });
  };

  const addSleepEntry = async (date: string, bedtime: string, wakeTime: string, restScore: number) => {
    try {
      const entry = await api.post<SleepEntry>('/api/sleep', {
        date,
        bedtime,
        wake_time: wakeTime,
        rest_score: restScore,
      });
      dispatch({ type: 'ADD_SLEEP_CHECKIN', payload: entry });
      return entry;
    } catch {
      const local: SleepEntry = {
        id: generateId(),
        user_id: state.user?.id || '',
        date,
        bedtime,
        wake_time: wakeTime,
        rest_score: restScore,
        created_at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_SLEEP_CHECKIN', payload: local });
      return local;
    }
  };

  return { sleep: state.sleep, loadSleep, addSleepEntry };
}
