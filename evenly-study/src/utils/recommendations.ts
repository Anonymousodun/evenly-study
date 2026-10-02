import { Task, Suggestion } from '../types';
import { generateId } from './id';

export function generateSuggestions(tasks: Task[]): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const now = new Date();

  const heavyTasks = tasks.filter(t => {
    if (t.completed) return false;
    const dueDate = new Date(t.due_date);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3 && t.effort === 'heavy';
  });

  heavyTasks.forEach(task => {
    suggestions.push({
      id: generateId(),
      type: 'move-task',
      taskId: task.id,
      text: `Move "${task.title}" to tomorrow?`,
      detail: `Due ${formatDate(task.due_date)}`,
      approved: null,
      timestamp: new Date().toISOString(),
    });

    if (task.type === 'essay' || task.type === 'group-project') {
      suggestions.push({
        id: generateId(),
        type: 'split-task',
        taskId: task.id,
        text: `Break "${task.title}" into smaller sessions?`,
        detail: 'Work 15 min at a time instead of one long session',
        approved: null,
        timestamp: new Date().toISOString(),
      });
    }
  });

  return suggestions;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
