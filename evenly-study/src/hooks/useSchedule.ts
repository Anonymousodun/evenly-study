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

  // Replace the working schedule with a suggestion. Unchanged blocks are kept;
  // changed ones are deleted and re-added. The pre-adopt schedule is kept as backup.
  const adoptSuggestion = async (suggested: ScheduleBlock[]) => {
    dispatch({ type: 'SET_SCHEDULE_BACKUP', payload: [...state.schedule] });
    const same = (a: ScheduleBlock, b: ScheduleBlock) =>
      a.id === b.id && a.start_time === b.start_time && a.end_time === b.end_time &&
      a.day === b.day && a.title === b.title && a.kind === b.kind;
    for (const current of state.schedule) {
      if (!suggested.some(s => same(s, current))) {
        try {
          await api.del(`/api/schedule/${current.id}`);
        } catch {
          // Offline — still remove locally.
        }
        dispatch({ type: 'DELETE_SCHEDULE_BLOCK', payload: current.id });
      }
    }
    for (const s of suggested) {
      if (!state.schedule.some(c => same(c, s))) {
        await addBlock(s.day, s.title, s.kind, s.start_time, s.end_time);
      }
    }
  };

  const revertSchedule = async () => {
    const backup = state.scheduleBackup;
    if (!backup) return;
    for (const current of [...state.schedule]) {
      try {
        await api.del(`/api/schedule/${current.id}`);
      } catch {
        // Offline — still remove locally.
      }
      dispatch({ type: 'DELETE_SCHEDULE_BLOCK', payload: current.id });
    }
    for (const b of backup) {
      await addBlock(b.day, b.title, b.kind, b.start_time, b.end_time);
    }
    dispatch({ type: 'SET_SCHEDULE_BACKUP', payload: null });
  };

  return { schedule: state.schedule, scheduleBackup: state.scheduleBackup, loadSchedule, addBlock, removeBlock, adoptSuggestion, revertSchedule };
}
