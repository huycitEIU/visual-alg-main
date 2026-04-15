import type { LessonDefinition } from './lesson-types';

export const mostFrequentLesson: LessonDefinition = {
  id: 'array-most-frequent',
  title: 'find value with most occurrences',
  description: 'Count each value frequency and keep the value with the highest count.',
  algorithmType: 'scan',
  category: 'extrema',
  starterCode: `arr = [4, 1, 4, 2, 4, 2];
bestValue = arr[0];
bestCount = 0;
i = 0;

while (i < arr.length) {
    currentCount = 0;
    j = 0;
    while (j < arr.length) {
        if (arr[j] == arr[i]) {
            currentCount = currentCount + 1;
        }
        j = j + 1;
    }

    if (currentCount > bestCount) {
        bestCount = currentCount;
        bestValue = arr[i];
    }

    i = i + 1;
}`,
  initialBindings: {
    arr: [4, 1, 4, 2, 4, 2],
    bestValue: 4,
    bestCount: 0,
    currentCount: 0,
    i: 0,
    j: 0,
  },
  watchedVariables: ['bestValue', 'bestCount', 'currentCount', 'i', 'j'],
  pointerVariables: ['i', 'j'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Each value is compared against every cell to compute its frequency.',
    SET_VAR: 'When a larger frequency is found, bestCount and bestValue are updated.',
    FINISH: 'bestValue stores the most frequent element in the array.',
  },
};