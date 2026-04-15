import type { LessonDefinition } from './lesson-types';

export const lastIndexOfLesson: LessonDefinition = {
  id: 'array-last-index-of',
  title: 'lastIndexOf(value)',
  description: 'Find the last index where the target appears in the array.',
  algorithmType: 'search',
  category: 'lookup',
  starterCode: `arr = [5, 2, 9, 2, 4, 2, 7];
target = 2;
answer = -1;
i = arr.length - 1;

while (i >= 0) {
    if (arr[i] == target) {
        answer = i;
        break;
    }
    i = i - 1;
}`,
  initialBindings: {
    arr: [5, 2, 9, 2, 4, 2, 7],
    target: 2,
    answer: -1,
    i: 6,
  },
  watchedVariables: ['target', 'answer', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    READ_ARRAY: 'The algorithm inspects elements from right to left to find the final occurrence first.',
    SET_VAR: 'When the target is found, answer stores that index and stops the search.',
    FINISH: 'The scan finishes at the first match from the right, which is the last occurrence overall.',
  },
};
