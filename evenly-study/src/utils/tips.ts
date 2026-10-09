import tipsData from '../data/tips.json';

export type TipCategory = 'Sleep' | 'Breaks' | 'Stress' | 'Focus';

export interface Tip {
  id: string;
  category: TipCategory;
  title: string;
  readSeconds: number;
  body: string;
}

export const TIP_CATEGORIES: TipCategory[] = ['Sleep', 'Breaks', 'Stress', 'Focus'];

export function getAllTips(): Tip[] {
  return tipsData as Tip[];
}

export function getTipsByCategory(category: TipCategory | 'All'): Tip[] {
  if (category === 'All') return getAllTips();
  return getAllTips().filter(t => t.category === category);
}

export function getTip(id: string): Tip | undefined {
  return getAllTips().find(t => t.id === id);
}

// Maps a suggestion type to the most relevant tip for contextual "Why?" links.
const SUGGESTION_TIP_MAP: Record<string, string> = {
  'move-task': 'chunking',
  'split-task': 'chunking',
  'break-now': 'box-breathing',
  'sleep-early': 'sleep-schedule',
  'balanced-week': 'breaks-are-focus',
};

export function getTipForSuggestion(suggestionType: string): string | undefined {
  return SUGGESTION_TIP_MAP[suggestionType];
}
