import type { LessonDefinition } from './lesson-types';

export const secondExtremeLesson: LessonDefinition = {
  id: 'array-second-extreme',
  title: 'find second largest or smallest value',
  description:
    'Track the best and second-best distinct values in one scan based on the selected mode.',
  algorithmType: 'scan',
  category: 'extrema',
  starterCode: `arr = [5, 1, 9, 9, 3, 1];
mode = 1;
best = arr[0];
second = -1;
i = 1;

while (i < arr.length) {
    if (mode == 1) {
        if (arr[i] > best) {
            second = best;
            best = arr[i];
        }
        if (arr[i] < best) {
            if (second == -1 || arr[i] > second) {
                second = arr[i];
            }
        }
    }
    if (mode == -1) {
        if (arr[i] < best) {
            second = best;
            best = arr[i];
        }
        if (arr[i] > best) {
            if (second == -1 || arr[i] < second) {
                second = arr[i];
            }
        }
    }
    i = i + 1;
}

answer = second;`,
  initialBindings: {
    arr: [5, 1, 9, 9, 3, 1],
    mode: 1,
    best: 5,
    second: -1,
    i: 1,
    answer: -1,
  },
  watchedVariables: ['mode', 'best', 'second', 'answer', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Each value is compared against the current best and second-best distinct values.',
    SET_VAR: 'When a stronger candidate is found, best/second are updated accordingly.',
    FINISH: 'After the scan, answer stores the requested second extreme value.',
  },
};