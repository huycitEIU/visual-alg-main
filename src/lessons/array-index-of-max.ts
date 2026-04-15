import type { LessonDefinition } from './lesson-types';

export const indexOfMaxLesson: LessonDefinition = {
  id: 'array-index-of-max',
  title: 'find index of maximum value',
  description: 'Scan the array and keep the index of the largest value seen so far.',
  algorithmType: 'scan',
  category: 'extrema',
  starterCode: `arr = [3, 8, 1, 6, 9, 2];
maxIndex = 0;
i = 1;

while (i < arr.length) {
    if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [3, 8, 1, 6, 9, 2],
    maxIndex: 0,
    i: 1,
  },
  watchedVariables: ['maxIndex', 'i'],
  pointerVariables: ['i', 'maxIndex'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Compare the current value with the value at maxIndex to decide whether to update the best index.',
    SET_VAR: 'When a larger value is found, maxIndex moves to that position.',
  },
};