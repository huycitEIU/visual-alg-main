import type { LessonDefinition } from './lesson-types';

export const indexOfMinLesson: LessonDefinition = {
  id: 'array-index-of-min',
  title: 'find index of minimum value',
  description: 'Scan the array and keep the index of the smallest value seen so far.',
  algorithmType: 'scan',
  category: 'extrema',
  starterCode: `arr = [3, 8, 1, 6, 9, 2];
minIndex = 0;
i = 1;

while (i < arr.length) {
    if (arr[i] < arr[minIndex]) {
        minIndex = i;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [3, 8, 1, 6, 9, 2],
    minIndex: 0,
    i: 1,
  },
  watchedVariables: ['minIndex', 'i'],
  pointerVariables: ['i', 'minIndex'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Compare the current value with the value at minIndex to decide whether to update the best index.',
    SET_VAR: 'When a smaller value is found, minIndex moves to that position.',
  },
};
