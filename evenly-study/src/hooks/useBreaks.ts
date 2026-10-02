import { useAppContext } from '../context/AppContext';
import { SkippedBreak } from '../types';
import { generateId } from '../utils/id';

export function useBreaks() {
  const { state, dispatch } = useAppContext();

  const logSkippedBreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const existing = state.skippedBreaks.find(b => b.date === today);

    if (existing) {
      dispatch({
        type: 'LOG_SKIPPED_BREAK',
        payload: {
          ...existing,
          count: existing.count + 1,
        },
      });
    } else {
      const skipped: SkippedBreak = {
        id: generateId(),
        user_id: state.user?.id || '',
        date: today,
        count: 1,
        created_at: new Date().toISOString(),
      };
      dispatch({ type: 'LOG_SKIPPED_BREAK', payload: skipped });
    }
  };

  const getSkipCount = (days: number = 5): number => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return state.skippedBreaks
      .filter(b => new Date(b.date) >= cutoff)
      .reduce((sum, b) => sum + b.count, 0);
  };

  return { skippedBreaks: state.skippedBreaks, logSkippedBreak, getSkipCount };
}
