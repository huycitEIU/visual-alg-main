import type { LessonDefinition } from './lesson-types';

export const sortAscendingLesson: LessonDefinition = {
  id: 'array-sort-ascending',
  title: 'sort array in ascending order',
  description: 'Use bubble sort passes to move larger values to the right.',
  algorithmType: 'sort',
  category: 'transform',
  starterCode: `arr = [5, 1, 4, 2, 3];
i = 0;

while (i < arr.length - 1) {
    j = 0;
    while (j < arr.length - 1 - i) {
        if (arr[j] > arr[j + 1]) {
            swap(arr, j, j + 1);
        }
        j = j + 1;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [5, 1, 4, 2, 3],
    i: 0,
    j: 0,
  },
  watchedVariables: ['i', 'j'],
  pointerVariables: ['i', 'j'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Adjacent values are compared to check if they are out of order.',
    SWAP: 'Out-of-order neighbors are swapped so the larger value moves right.',
    FINISH: 'After all passes, the array is sorted in ascending order.',
  },
};
