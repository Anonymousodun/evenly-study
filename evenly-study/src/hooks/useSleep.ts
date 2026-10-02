import { useAppContext } from '../context/AppContext';
import { SleepEntry } from '../types';
import { getSleepEntries, createSleepEntry } from '../db/repositories/sleep.repo';

export function useSleep() {
  const { state, dispatch } = useAppContext();

  const loadSleep = async () => {
    if (!state.user) return;
    const entries = await getSleepEntries(state.user.id);
    dispatch({ type: 'LOAD_DATA', payload: { sleep: entries } });
  };

  const addSleepEntry = async (date: string, bedtime: string, wakeTime: string, restScore: number) => {
    if (!state.user) return;
    const entry = await createSleepEntry({
      user_id: state.user.id,
      date,
      bedtime,
      wake_time: wakeTime,
      rest_score: restScore,
    });
    dispatch({ type: 'ADD_SLEEP_CHECKIN', payload: entry });
  };

  return { sleep: state.sleep, loadSleep, addSleepEntry };
}
