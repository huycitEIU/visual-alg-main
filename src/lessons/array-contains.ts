import type { LessonDefinition } from './lesson-types';

export const containsLesson: LessonDefinition = {
  id: 'array-contains',
  title: 'contains(value)',
  description: 'Check whether a target value appears at least once in the array.',
  algorithmType: 'search',
  category: 'array',
  starterCode: `arr = [5, 2, 9, 2, 4, 2, 7];
target = 8;
found = 0;
i = 0;

while (i < arr.length) {
    if (arr[i] == target) {
        found = 1;
        break;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [5, 2, 9, 2, 4, 2, 7],
    target: 8,
    found: 0,
    i: 0,
  },
  watchedVariables: ['target', 'found', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    READ_ARRAY: 'Each step checks the next element against the requested target.',
    SET_VAR: 'found becomes 1 as soon as a matching value is discovered.',
    FINISH: 'Execution ends when a match is found or when the scan reaches the end.',
  },
};
