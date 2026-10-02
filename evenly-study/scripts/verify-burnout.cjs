// Offline verification for the burnout algorithm.
// Run: npx tsc src/utils/burnoutAlgorithm.ts src/types/index.ts --outDir .tmp-verify --module commonjs --target es2020 --skipLibCheck
// Then: node scripts/verify-burnout.cjs
const assert = require('assert');
const { calculateBurnoutLevel, getBurnoutSuggestion } = require('../.tmp-verify/utils/burnoutAlgorithm');

function makeState(overrides = {}) {
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

function daysFromNow(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log(`ok - ${name}`);
}

check('empty state is green', () => {
  assert.strictEqual(calculateBurnoutLevel(makeState()), 'green');
});

check('heavy load + poor sleep + low mood is red', () => {
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
  assert.strictEqual(calculateBurnoutLevel(state), 'red');
});

check('completed tasks are ignored', () => {
  const state = makeState({
    tasks: [
      { id: '1', user_id: 'u', title: 'Done', type: 'exam', effort: 'heavy', due_date: daysFromNow(1), completed: true, created_at: '' },
    ],
  });
  assert.strictEqual(calculateBurnoutLevel(state), 'green');
});

check('moderate load is yellow', () => {
  const state = makeState({
    tasks: [
      { id: '1', user_id: 'u', title: 'Exam', type: 'exam', effort: 'heavy', due_date: daysFromNow(1), completed: false, created_at: '' },
      { id: '2', user_id: 'u', title: 'Essay', type: 'essay', effort: 'heavy', due_date: daysFromNow(2), completed: false, created_at: '' },
    ],
    dailyCheckIns: [
      { id: '1', user_id: 'u', date: daysFromNow(-1), mood_score: 2, created_at: '' },
    ],
  });
  assert.strictEqual(calculateBurnoutLevel(state), 'yellow');
});

check('suggestions exist for each level', () => {
  assert.ok(getBurnoutSuggestion('green').includes('healthy zone'));
  assert.ok(getBurnoutSuggestion('yellow').includes('moving one task'));
  assert.ok(getBurnoutSuggestion('red').includes('ease off'));
});

console.log(`\n${passed} checks passed`);
