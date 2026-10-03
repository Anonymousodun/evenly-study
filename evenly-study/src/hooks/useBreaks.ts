import { useAppContext } from '../context/AppContext';
import { SkippedBreak } from '../types';
import { api } from '../api/client';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function useBreaks() {
  const { state, dispatch } = useAppContext();

  const loadSkips = async () => {
    const skips = await api.get<SkippedBreak[]>('/api/skips');
    dispatch({ type: 'LOAD_DATA', payload: { skippedBreaks: skips } });
  };

  const logSkippedBreak = async () => {
    const today = todayStr();
    try {
      await api.post<SkippedBreak>('/api/skips', { date: today });
      await loadSkips();
    } catch {
      const skipped: SkippedBreak = {
        id: `local-${Date.now()}`,
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

  return { skippedBreaks: state.skippedBreaks, loadSkips, logSkippedBreak, getSkipCount };
}
