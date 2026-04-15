import type { LessonDefinition } from './lesson-types';

export const countMaxOccurrencesLesson: LessonDefinition = {
  id: 'array-count-max-occurrences',
  title: 'count occurrences of the maximum value',
  description: 'Find the maximum first, then scan again to count how many times it appears.',
  algorithmType: 'scan',
  category: 'extrema',
  starterCode: `arr = [4, 7, 2, 7, 1, 7];
max = arr[0];
i = 1;

while (i < arr.length) {
    if (arr[i] > max) {
        max = arr[i];
    }
    i = i + 1;
}

count = 0;
i = 0;
while (i < arr.length) {
    if (arr[i] == max) {
        count = count + 1;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [4, 7, 2, 7, 1, 7],
    max: 4,
    count: 0,
    i: 1,
  },
  watchedVariables: ['max', 'count', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'The scan either finds a new maximum or checks for equality with the max.',
    SET_VAR: 'First pass updates max, second pass updates count.',
    FINISH: 'count holds how many times the maximum value appears.',
  },
};
