import { useAppContext } from '../context/AppContext';
import { DailyCheckIn } from '../types';
import { api } from '../api/client';
import { generateId } from '../utils/id';

export function useCheckIns() {
  const { state, dispatch } = useAppContext();

  const loadCheckIns = async () => {
    const checkIns = await api.get<DailyCheckIn[]>('/api/checkins');
    dispatch({ type: 'LOAD_DATA', payload: { dailyCheckIns: checkIns } });
  };

  const addCheckIn = async (date: string, moodScore: number) => {
    try {
      const checkIn = await api.post<DailyCheckIn>('/api/checkins', {
        date,
        mood_score: moodScore,
      });
      dispatch({ type: 'ADD_DAILY_CHECKIN', payload: checkIn });
      return checkIn;
    } catch {
      const local: DailyCheckIn = {
        id: generateId(),
        user_id: state.user?.id || '',
        date,
        mood_score: moodScore,
        created_at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_DAILY_CHECKIN', payload: local });
      return local;
    }
  };

  return { dailyCheckIns: state.dailyCheckIns, loadCheckIns, addCheckIn };
}
