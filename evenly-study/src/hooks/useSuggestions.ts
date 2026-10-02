import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateSuggestions } from '../utils/recommendations';

export function useSuggestions() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    if (state.burnoutLevel === 'green') return;

    const fresh = generateSuggestions(state.tasks);
    const pending = state.suggestions.filter(s => s.approved === null);
    const pendingKeys = new Set(pending.map(s => `${s.type}:${s.taskId}`));

    fresh.forEach(suggestion => {
      const key = `${suggestion.type}:${suggestion.taskId}`;
      if (!pendingKeys.has(key)) {
        dispatch({ type: 'ADD_SUGGESTION', payload: suggestion });
      }
    });
  }, [state.burnoutLevel, state.tasks.length]);

  const approve = (suggestionId: string) => {
    const suggestion = state.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    dispatch({ type: 'APPROVE_SUGGESTION', payload: suggestionId });

    if (suggestion.taskId && suggestion.type === 'move-task') {
      const task = state.tasks.find(t => t.id === suggestion.taskId);
      if (task) {
        const dueDate = new Date(task.due_date);
        dueDate.setDate(dueDate.getDate() + 1);
        dispatch({
          type: 'UPDATE_TASK',
          payload: { ...task, due_date: dueDate.toISOString().split('T')[0] },
        });
      }
    }
  };

  const dismiss = (suggestionId: string) => {
    dispatch({ type: 'DISMISS_SUGGESTION', payload: suggestionId });
  };

  const active = state.suggestions.filter(s => s.approved === null);

  return { suggestions: active, approve, dismiss };
}
