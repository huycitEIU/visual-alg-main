import type { LessonDefinition } from './lesson-types';

export const removeDuplicatesLesson: LessonDefinition = {
  id: 'array-remove-duplicates',
  title: 'remove duplicates from array',
  description: 'Build a new array that keeps only the first occurrence of each value.',
  algorithmType: 'scan',
  category: 'transform',
  starterCode: `arr = [3, 1, 3, 2, 4];
unique = [];
i = 0;

while (i < arr.length) {
    seen = 0;
    j = 0;

    while (j < unique.length) {
        if (unique[j] == arr[i]) {
            seen = 1;
            break;
        }
        j = j + 1;
    }

    if (seen == 0) {
        unique[unique.length] = arr[i];
    }

    i = i + 1;
}`,
  initialBindings: {
    arr: [3, 1, 3, 2, 4],
    unique: [],
    i: 0,
    j: 0,
    seen: 0,
  },
  watchedVariables: ['unique', 'seen', 'i', 'j'],
  pointerVariables: ['i', 'j'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'The inner scan checks whether the current value already exists in unique.',
    SET_VAR: 'Only unseen values are appended, preserving first-appearance order.',
  },
};
