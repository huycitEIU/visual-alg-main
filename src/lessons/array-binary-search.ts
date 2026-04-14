import type { LessonDefinition } from './lesson-types';

export const binarySearchLesson: LessonDefinition = {
  id: 'array-binary-search',
  title: 'binary search',
  description: 'Find a target in a sorted array by repeatedly halving the search range.',
  algorithmType: 'search',
  category: 'array',
  starterCode: `arr = [1, 3, 5, 7, 9, 11, 13];
target = 9;
left = 0;
right = arr.length - 1;
mid = -1;
answer = -1;

while (left <= right) {
    mid = left + right;
    mid = mid - (mid % 2);
    mid = mid / 2;

    if (arr[mid] == target) {
        answer = mid;
        break;
    }

    if (arr[mid] < target) {
        left = mid + 1;
    }

    if (arr[mid] > target) {
        right = mid - 1;
    }
}`,
  initialBindings: {
    arr: [1, 3, 5, 7, 9, 11, 13],
    target: 9,
    left: 0,
    right: 6,
    mid: -1,
    answer: -1,
  },
  watchedVariables: ['target', 'left', 'right', 'mid', 'answer'],
  pointerVariables: ['left', 'right', 'mid'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Binary search compares the middle value to decide which half still may contain the target.',
    MOVE_POINTER: 'Pointers move to shrink the search range to one half.',
    SET_VAR: 'The algorithm updates either the midpoint or the final answer.',
  },
};
