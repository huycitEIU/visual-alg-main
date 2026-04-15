import type { LessonDefinition } from './lesson-types';

export const allIndicesLesson: LessonDefinition = {
  id: 'array-all-indices',
  title: 'find all indices of a value',
  description: 'Collect every index where the target appears.',
  algorithmType: 'search',
  category: 'lookup',
  starterCode: `arr = [4, 2, 4, 1, 4];
target = 4;
indices = [];
i = 0;

while (i < arr.length) {
    if (arr[i] == target) {
        indices[indices.length] = i;
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [4, 2, 4, 1, 4],
    target: 4,
    indices: [],
    i: 0,
  },
  watchedVariables: ['target', 'indices', 'i'],
  pointerVariables: ['i'],
  primaryStructure: 'array',
  explanationMap: {
    COMPARE: 'The current value is compared with the target.',
    SET_VAR: 'Matching positions are appended to the indices result array.',
  },
};
