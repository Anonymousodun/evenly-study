import { useAppContext } from '../context/AppContext';
import { Task, TaskType, TaskEffort } from '../types';
import { getTasks, createTask, updateTask, deleteTask } from '../db/repositories/tasks.repo';

export function useTasks() {
  const { state, dispatch } = useAppContext();

  const loadTasks = async () => {
    if (!state.user) return;
    const tasks = await getTasks(state.user.id);
    dispatch({ type: 'LOAD_DATA', payload: { tasks } });
  };

  const addTask = async (title: string, type: TaskType, effort: TaskEffort, dueDate: string) => {
    if (!state.user) return;
    const task = await createTask({
      user_id: state.user.id,
      title,
      type,
      effort,
      due_date: dueDate,
      completed: false,
    });
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const completeTask = async (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    const updated = await updateTask({ ...task, completed: true });
    dispatch({ type: 'UPDATE_TASK', payload: updated });
  };

  const removeTask = async (taskId: string) => {
    await deleteTask(taskId);
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  return { tasks: state.tasks, loadTasks, addTask, completeTask, removeTask };
}
