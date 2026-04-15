import type { LessonDefinition } from './lesson-types';

export const sumElementsLesson: LessonDefinition = {
  id: 'array-sum-elements',
  title: 'calculate sum of all elements',
  description: 'Accumulate each array value into a running total.',
  algorithmType: 'scan',
  category: 'aggregate',
  starterCode: `arr = [3, 8, 1, 6, 9, 2];
sum = 0;
i = 0;

while (i < arr.length) {
    sum = sum + arr[i];
    i = i + 1;
}`,
  initialBindings: {
    arr: [3, 8, 1, 6, 9, 2],
    sum: 0,
    i: 0,
  },
  watchedVariables: ['sum', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    READ_ARRAY: 'Read the next value from the array to include it in the running total.',
    SET_VAR: 'Update the running sum after each element.',
  },
};
