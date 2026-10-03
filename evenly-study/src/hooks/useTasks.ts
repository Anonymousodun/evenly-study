import { useAppContext } from '../context/AppContext';
import { Task, TaskType, TaskEffort } from '../types';
import { api } from '../api/client';
import { generateId } from '../utils/id';

export function useTasks() {
  const { state, dispatch } = useAppContext();

  const loadTasks = async () => {
    const tasks = await api.get<Task[]>('/api/tasks');
    dispatch({ type: 'LOAD_DATA', payload: { tasks } });
  };

  const addTask = async (title: string, type: TaskType, effort: TaskEffort, dueDate: string) => {
    try {
      const task = await api.post<Task>('/api/tasks', {
        title,
        type,
        effort,
        due_date: dueDate,
      });
      dispatch({ type: 'ADD_TASK', payload: task });
      return task;
    } catch {
      const local: Task = {
        id: generateId(),
        user_id: state.user?.id || '',
        title,
        type,
        effort,
        due_date: dueDate,
        completed: false,
        created_at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TASK', payload: local });
      return local;
    }
  };

  const toggleComplete = async (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      const updated = await api.patch<Task>(`/api/tasks/${taskId}`, {
        completed: !task.completed,
      });
      dispatch({ type: 'UPDATE_TASK', payload: updated });
    } catch {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, completed: !task.completed } });
    }
  };

  const moveTask = async (taskId: string, dueDate: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    try {
      const updated = await api.patch<Task>(`/api/tasks/${taskId}`, { due_date: dueDate });
      dispatch({ type: 'UPDATE_TASK', payload: updated });
    } catch {
      if (task) {
        dispatch({ type: 'UPDATE_TASK', payload: { ...task, due_date: dueDate } });
      }
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await api.del(`/api/tasks/${taskId}`);
    } catch {
      // Offline — still remove locally.
    }
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  return { tasks: state.tasks, loadTasks, addTask, toggleComplete, moveTask, removeTask };
}
