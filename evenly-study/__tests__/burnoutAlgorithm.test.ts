import { calculateBurnoutLevel, getBurnoutSuggestion } from '../src/utils/burnoutAlgorithm';
import { AppState } from '../src/types';

function makeState(overrides: Partial<AppState> = {}): AppState {
  return {
    tasks: [],
    sleep: [],
    dailyCheckIns: [],
    burnoutLevel: 'green',
    suggestions: [],
    settings: {
      targetBedtime: '23:00',
      studyWindows: [{ start: '09:00', end: '17:00' }],
      breakLength: 5,
      focusLength: 25,
      windDownReminder: true,
      region: 'US',
    },
    skippedBreaks: [],
    user: null,
    ...overrides,
  };
}

function daysFromNow(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

describe('calculateBurnoutLevel', () => {
  it('returns green for an empty state', () => {
    expect(calculateBurnoutLevel(makeState())).toBe('green');
  });

  it('returns red for heavy load + poor sleep + low mood', () => {
    const state = makeState({
      tasks: [
        { id: '1', user_id: 'u', title: 'Exam', type: 'exam', effort: 'heavy', due_date: daysFromNow(1), completed: false, created_at: '' },
        { id: '2', user_id: 'u', title: 'Essay', type: 'essay', effort: 'heavy', due_date: daysFromNow(2), completed: false, created_at: '' },
        { id: '3', user_id: 'u', title: 'Project', type: 'group-project', effort: 'heavy', due_date: daysFromNow(2), completed: false, created_at: '' },
      ],
      sleep: [
        { id: '1', user_id: 'u', date: daysFromNow(-1), bedtime: '02:00', wake_time: '06:00', rest_score: 2, created_at: '' },
        { id: '2', user_id: 'u', date: daysFromNow(-2), bedtime: '02:00', wake_time: '06:00', rest_score: 2, created_at: '' },
        { id: '3', user_id: 'u', date: daysFromNow(-3), bedtime: '01:00', wake_time: '06:00', rest_score: 1, created_at: '' },
      ],
      dailyCheckIns: [
        { id: '1', user_id: 'u', date: daysFromNow(-1), mood_score: 1, created_at: '' },
        { id: '2', user_id: 'u', date: daysFromNow(-2), mood_score: 2, created_at: '' },
        { id: '3', user_id: 'u', date: daysFromNow(-3), mood_score: 2, created_at: '' },
      ],
    });
    expect(calculateBurnoutLevel(state)).toBe('red');
  });

  it('ignores completed tasks', () => {
    const state = makeState({
      tasks: [
        { id: '1', user_id: 'u', title: 'Done', type: 'exam', effort: 'heavy', due_date: daysFromNow(1), completed: true, created_at: '' },
      ],
    });
    expect(calculateBurnoutLevel(state)).toBe('green');
  });

  it('returns yellow for moderate load', () => {
    const state = makeState({
      tasks: [
        { id: '1', user_id: 'u', title: 'Exam', type: 'exam', effort: 'heavy', due_date: daysFromNow(1), completed: false, created_at: '' },
        { id: '2', user_id: 'u', title: 'Essay', type: 'essay', effort: 'heavy', due_date: daysFromNow(2), completed: false, created_at: '' },
      ],
      dailyCheckIns: [
        { id: '1', user_id: 'u', date: daysFromNow(-1), mood_score: 2, created_at: '' },
      ],
    });
    expect(calculateBurnoutLevel(state)).toBe('yellow');
  });
});

describe('getBurnoutSuggestion', () => {
  it('returns a message for each level', () => {
    expect(getBurnoutSuggestion('green')).toContain('healthy zone');
    expect(getBurnoutSuggestion('yellow')).toContain('moving one task');
    expect(getBurnoutSuggestion('red')).toContain('ease off');
  });
});
