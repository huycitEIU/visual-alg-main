import type { LessonDefinition } from './lesson-types';

export const rotateArrayLesson: LessonDefinition = {
  id: 'array-rotate',
  title: 'rotate array left or right by k',
  description: 'Build a rotated copy by remapping each destination index to its source index.',
  algorithmType: 'two-pointer',
  category: 'transform',
  starterCode: `arr = [1, 2, 3, 4, 5];
k = 2;
direction = 0;
rotated = [];
n = arr.length;
shift = k % n;

if (shift < 0) {
    shift = shift + n;
}

i = 0;
while (i < n) {
    if (direction == 0) {
        source = i + shift;
        if (source >= n) {
            source = source - n;
        }
        rotated[i] = arr[source];
    }
    if (direction == 1) {
        source = i - shift;
        if (source < 0) {
            source = source + n;
        }
        rotated[i] = arr[source];
    }
    i = i + 1;
}`,
  initialBindings: {
    arr: [1, 2, 3, 4, 5],
    k: 2,
    direction: 0,
    rotated: [],
    n: 5,
    shift: 2,
    i: 0,
    source: 0,
  },
  watchedVariables: ['k', 'direction', 'shift', 'i', 'source', 'rotated'],
  pointerVariables: ['i', 'source'],
  primaryStructure: 'array',
  explanationMap: {
    READ_ARRAY: 'The algorithm reads from the wrapped source index for each destination cell.',
    WRITE_ARRAY: 'Each computed source value is written to the rotated result.',
  },
};
