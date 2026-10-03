import scienceNotes from '../data/scienceNotes.json';

const SUGGESTION_NOTE_MAP: Record<string, keyof typeof scienceNotes> = {
  'move-task': 'moving-task',
  'split-task': 'split-task',
  'break-now': 'breathing-break',
  'sleep-early': 'sleep-early',
  'balanced-week': 'balanced-week',
};

export function getScienceNote(key: string): string {
  const mapped = SUGGESTION_NOTE_MAP[key] ?? (key as keyof typeof scienceNotes);
  return scienceNotes[mapped] ?? 'Small, steady habits protect your energy over time.';
}

export function getBreakNote(breakId: string): string {
  const map: Record<string, keyof typeof scienceNotes> = {
    '1': 'eyes-off-screen',
    '2': 'breathing-break',
    '3': 'stretching',
    '4': 'quick-walk',
  };
  const mapped = map[breakId] ?? 'stretching';
  return scienceNotes[mapped];
}
