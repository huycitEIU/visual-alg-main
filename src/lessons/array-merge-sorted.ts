import type { LessonDefinition } from './lesson-types';

export const mergeSortedLesson: LessonDefinition = {
  id: 'array-merge-sorted',
  title: 'merge two sorted arrays',
  description: 'Use two pointers to merge sorted inputs into one sorted output.',
  algorithmType: 'two-pointer',
  category: 'transform',
  starterCode: `left = [1, 4, 7, 10];
right = [2, 3, 8, 9];
merged = [];
i = 0;
j = 0;

while (i < left.length) {
  if (j >= right.length) {
    break;
  }
    if (left[i] <= right[j]) {
        merged[merged.length] = left[i];
        i = i + 1;
  } else {
    merged[merged.length] = right[j];
    j = j + 1;
    }
}

while (i < left.length) {
    merged[merged.length] = left[i];
    i = i + 1;
}

while (j < right.length) {
    merged[merged.length] = right[j];
    j = j + 1;
}`,
  initialBindings: {
    left: [1, 4, 7, 10],
    right: [2, 3, 8, 9],
    merged: [],
    i: 0,
    j: 0,
  },
  watchedVariables: ['i', 'j', 'merged'],
  pointerVariables: ['i', 'j'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'The smaller front element between left and right is selected next.',
    WRITE_ARRAY: 'Selected values are appended to the merged output in sorted order.',
  },
};
