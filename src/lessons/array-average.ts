import type { LessonDefinition } from './lesson-types';

export const averageElementsLesson: LessonDefinition = {
  id: 'array-average-elements',
  title: 'calculate average of all elements',
  description: 'Accumulate the sum, then divide by the array length to compute the average.',
  algorithmType: 'scan',
  category: 'aggregate',
  starterCode: `arr = [3, 8, 1, 6, 9, 2];
sum = 0;
average = 0;
i = 0;

while (i < arr.length) {
    sum = sum + arr[i];
    i = i + 1;
}

average = sum / arr.length;`,
  initialBindings: {
    arr: [3, 8, 1, 6, 9, 2],
    sum: 0,
    average: 0,
    i: 0,
  },
  watchedVariables: ['sum', 'average', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    READ_ARRAY: 'Read each value to build the total sum before averaging.',
    SET_VAR: 'Update either the running sum or the final average value.',
  },
};
