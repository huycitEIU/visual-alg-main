import type { LessonDefinition } from './lesson-types';

export const missingNumberLesson: LessonDefinition = {
  id: 'array-missing-number',
  title: 'find missing number in sequence',
  description: 'Subtract the actual sum from the expected 1..n sum to get the missing value.',
  algorithmType: 'scan',
  category: 'transform',
  starterCode: `arr = [1, 2, 3, 4, 6, 7, 8, 9, 10];
n = arr.length + 1;
expected = n * (n + 1);
expected = expected / 2;
actual = 0;
i = 0;

while (i < arr.length) {
    actual = actual + arr[i];
    i = i + 1;
}

missing = expected - actual;`,
  initialBindings: {
    arr: [1, 2, 3, 4, 6, 7, 8, 9, 10],
    n: 10,
    expected: 55,
    actual: 0,
    i: 0,
    missing: -1,
  },
  watchedVariables: ['n', 'expected', 'actual', 'missing', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    SET_VAR: 'The running sum is accumulated, then compared with the expected arithmetic-series sum.',
    FINISH: 'The missing number is the exact gap between expected and actual totals.',
  },
};