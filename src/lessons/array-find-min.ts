import type { LessonDefinition } from './lesson-types';

export const findMinLesson: LessonDefinition = {
  id: 'array-find-min',
  title: 'find minimum value',
  description: 'Track the current smallest value while scanning the array once.',
  algorithmType: 'scan',
  category: 'extrema',
  starterCode: `arr = [3, 8, 1, 6];
min = arr[0];
i = 1;

while (i < arr.length) {
    if (arr[i] < min) {
        min = arr[i];
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [3, 8, 1, 6],
    min: 3,
    i: 1,
  },
  watchedVariables: ['min', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Each comparison checks whether the current cell is smaller than the best minimum seen so far.',
    SET_VAR: 'A smaller value replaces the current minimum.',
  },
};