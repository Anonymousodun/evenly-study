import { query } from '../connection';
import { Task } from '../../types';

export async function getTasks(userId: string): Promise<Task[]> {
  const result = await query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC', [userId]);
  return result.rows;
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
  const result = await query(
    'INSERT INTO tasks (user_id, title, type, effort, due_date, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [task.user_id, task.title, task.type, task.effort, task.due_date, task.completed]
  );
  return result.rows[0];
}

export async function updateTask(task: Task): Promise<Task> {
  const result = await query(
    'UPDATE tasks SET title = $1, type = $2, effort = $3, due_date = $4, completed = $5 WHERE id = $6 RETURNING *',
    [task.title, task.type, task.effort, task.due_date, task.completed, task.id]
  );
  return result.rows[0];
}

export async function deleteTask(taskId: string): Promise<void> {
  await query('DELETE FROM tasks WHERE id = $1', [taskId]);
}
