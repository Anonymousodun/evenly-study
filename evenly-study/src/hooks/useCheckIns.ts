import { useAppContext } from '../context/AppContext';
import { DailyCheckIn } from '../types';
import { getDailyCheckIns, createDailyCheckIn } from '../db/repositories/checkins.repo';

export function useCheckIns() {
  const { state, dispatch } = useAppContext();

  const loadCheckIns = async () => {
    if (!state.user) return;
    const checkIns = await getDailyCheckIns(state.user.id);
    dispatch({ type: 'LOAD_DATA', payload: { dailyCheckIns: checkIns } });
  };

  const addCheckIn = async (date: string, moodScore: number) => {
    if (!state.user) return;
    const checkIn = await createDailyCheckIn({
      user_id: state.user.id,
      date,
      mood_score: moodScore,
    });
    dispatch({ type: 'ADD_DAILY_CHECKIN', payload: checkIn });
  };

  return { dailyCheckIns: state.dailyCheckIns, loadCheckIns, addCheckIn };
}
