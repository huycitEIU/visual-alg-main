import type { LessonDefinition } from './lesson-types';

export const longestRunLesson: LessonDefinition = {
  id: 'array-longest-run',
  title: 'find longest consecutive identical run',
  description: 'Track current streak length and update the best streak while scanning.',
  algorithmType: 'scan',
  category: 'transform',
  starterCode: `arr = [1, 1, 2, 2, 2, 3, 3];
best = 1;
current = 1;
i = 1;

while (i < arr.length) {
    if (arr[i] == arr[i - 1]) {
        current = current + 1;
        if (current > best) {
            best = current;
        }
    }
    if (arr[i] != arr[i - 1]) {
        current = 1;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [1, 1, 2, 2, 2, 3, 3],
    best: 1,
    current: 1,
    i: 1,
  },
  watchedVariables: ['best', 'current', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Neighboring values are compared to detect continuation or reset of a run.',
    SET_VAR: 'current tracks the active streak, while best stores the longest streak seen.',
  },
};
