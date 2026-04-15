import type { LessonDefinition } from './lesson-types';

export const countUniqueLesson: LessonDefinition = {
  id: 'array-count-unique',
  title: 'count unique values in array',
  description: 'Build a seen array of distinct values and report its length.',
  algorithmType: 'scan',
  category: 'aggregate',
  starterCode: `arr = [3, 1, 3, 2, 2];
seen = [];
i = 0;

while (i < arr.length) {
    exists = 0;
    j = 0;
    while (j < seen.length) {
        if (seen[j] == arr[i]) {
            exists = 1;
            break;
        }
        j = j + 1;
    }
    if (exists == 0) {
        seen[seen.length] = arr[i];
    }
    i = i + 1;
}

uniqueCount = seen.length;`,
  initialBindings: {
    arr: [3, 1, 3, 2, 2],
    seen: [],
    i: 0,
    j: 0,
    exists: 0,
    uniqueCount: 0,
  },
  watchedVariables: ['uniqueCount', 'exists', 'i', 'j'],
  pointerVariables: ['i', 'j'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'The inner loop checks whether the current value has already appeared.',
    SET_VAR: 'Unseen values are appended; uniqueCount is set from seen.length at the end.',
  },
};
