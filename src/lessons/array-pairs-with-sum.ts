import type { LessonDefinition } from './lesson-types';

export const pairsWithSumLesson: LessonDefinition = {
  id: 'array-pairs-with-sum',
  title: 'find pairs with target sum',
  description: 'Check all index pairs and store value pairs whose sum equals the target.',
  algorithmType: 'scan',
  category: 'transform',
  starterCode: `arr = [1, 5, 7, -1, 5];
target = 6;
pairLeft = [];
pairRight = [];
i = 0;

while (i < arr.length) {
    j = i + 1;
    while (j < arr.length) {
        if (arr[i] + arr[j] == target) {
            pairLeft[pairLeft.length] = arr[i];
            pairRight[pairRight.length] = arr[j];
        }
        j = j + 1;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [1, 5, 7, -1, 5],
    target: 6,
    pairLeft: [],
    pairRight: [],
    i: 0,
    j: 1,
  },
  watchedVariables: ['target', 'pairLeft', 'pairRight', 'i', 'j'],
  pointerVariables: ['i', 'j'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'Two values are added and compared with the target sum.',
    SET_VAR: 'Matching pairs are recorded into the output arrays.',
  },
};
