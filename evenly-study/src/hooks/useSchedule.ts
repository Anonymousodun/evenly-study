import { useAppContext } from '../context/AppContext';
import { ScheduleBlock, ScheduleKind } from '../types';
import { api } from '../api/client';
import { generateId } from '../utils/id';

export function useSchedule() {
  const { state, dispatch } = useAppContext();

  const loadSchedule = async () => {
    const schedule = await api.get<ScheduleBlock[]>('/api/schedule');
    dispatch({ type: 'LOAD_DATA', payload: { schedule } });
  };

  const addBlock = async (day: number, title: string, kind: ScheduleKind, startTime: string, endTime: string) => {
    try {
      const block = await api.post<ScheduleBlock>('/api/schedule', {
        day,
        title,
        kind,
        start_time: startTime,
        end_time: endTime,
      });
      dispatch({ type: 'ADD_SCHEDULE_BLOCK', payload: block });
      return block;
    } catch {
      const local: ScheduleBlock = {
        id: generateId(),
        user_id: state.user?.id || '',
        day,
        title,
        kind,
        start_time: startTime,
        end_time: endTime,
        created_at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_SCHEDULE_BLOCK', payload: local });
      return local;
    }
  };

  const removeBlock = async (blockId: string) => {
    try {
      await api.del(`/api/schedule/${blockId}`);
    } catch {
      // Offline — still remove locally.
    }
    dispatch({ type: 'DELETE_SCHEDULE_BLOCK', payload: blockId });
  };

  return { schedule: state.schedule, loadSchedule, addBlock, removeBlock };
}
