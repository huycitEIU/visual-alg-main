import { describe, expect, it } from 'vitest';

import { bubbleSortLesson } from '../lessons/array-bubble-sort';
import { binarySearchLesson } from '../lessons/array-binary-search';
import { allIndicesLesson } from '../lessons/array-all-indices';
import { averageElementsLesson } from '../lessons/array-average';
import { countMaxOccurrencesLesson } from '../lessons/array-count-max-occurrences';
import { countOccurrencesLesson } from '../lessons/array-count-occurrences';
import { countUniqueLesson } from '../lessons/array-count-unique';
import { containsLesson } from '../lessons/array-contains';
import { findMaxLesson } from '../lessons/array-find-max';
import { findMinLesson } from '../lessons/array-find-min';
import { indexOfMaxLesson } from '../lessons/array-index-of-max';
import { indexOfMinLesson } from '../lessons/array-index-of-min';
import { indexOfLesson } from '../lessons/array-index-of';
import { isSortedLesson } from '../lessons/array-is-sorted';
import { lastIndexOfLesson } from '../lessons/array-last-index-of';
import { longestRunLesson } from '../lessons/array-longest-run';
import { mergeSortedLesson } from '../lessons/array-merge-sorted';
import { missingNumberLesson } from '../lessons/array-missing-number';
import { mostFrequentLesson } from '../lessons/array-most-frequent';
import { pairsWithSumLesson } from '../lessons/array-pairs-with-sum';
import { reverseArrayLesson } from '../lessons/array-reverse';
import { removeDuplicatesLesson } from '../lessons/array-remove-duplicates';
import { rotateArrayLesson } from '../lessons/array-rotate';
import { sortAscendingLesson } from '../lessons/array-sort-ascending';
import { sortDescendingLesson } from '../lessons/array-sort-descending';
import { secondExtremeLesson } from '../lessons/array-second-extreme';
import { sumElementsLesson } from '../lessons/array-sum';
import type { LessonDefinition } from '../lessons/lesson-types';
import { createInitialState, createStateFromLesson } from '../state/reducers';

import { InterpreterRunner } from './interpreter-runner';

describe('lesson execution', () => {
  it('solves the indexOf lesson', () => {
    const state = executeLesson(indexOfLesson);
    expect(state.variables.answer).toBe(1);
  });

  it('solves the lastIndexOf lesson', () => {
    const state = executeLesson(lastIndexOfLesson);
    expect(state.variables.answer).toBe(5);
  });

  it('solves the contains lesson', () => {
    const state = executeLesson(containsLesson);
    expect(state.variables.found).toBe(0);
  });

  it('handles the indexOf lesson when the value is not found', () => {
    const state = executeLesson({
      ...indexOfLesson,
      starterCode: `arr = [5, 2, 9, 2];
target = 7;
answer = -1;
i = 0;

while (i < arr.length) {
    if (arr[i] == target) {
        answer = i;
        break;
    }
    i = i + 1;
}`,
      initialBindings: {
        arr: [5, 2, 9, 2],
        target: 7,
        answer: -1,
        i: 0,
      },
    });

    expect(state.variables.answer).toBe(-1);
  });

  it('solves the find maximum lesson', () => {
    const state = executeLesson(findMaxLesson);
    expect(state.variables.max).toBe(8);
  });

  it('solves the find minimum lesson', () => {
    const state = executeLesson(findMinLesson);
    expect(state.variables.min).toBe(1);
  });

  it('solves the binary search lesson', () => {
    const state = executeLesson(binarySearchLesson);
    expect(state.variables.answer).toBe(4);
  });

  it('solves the index of maximum value lesson', () => {
    const state = executeLesson(indexOfMaxLesson);
    expect(state.variables.maxIndex).toBe(4);
  });

  it('solves the index of minimum value lesson', () => {
    const state = executeLesson(indexOfMinLesson);
    expect(state.variables.minIndex).toBe(2);
  });

  it('solves the sum of all elements lesson', () => {
    const state = executeLesson(sumElementsLesson);
    expect(state.variables.sum).toBe(29);
  });

  it('solves the average of all elements lesson', () => {
    const state = executeLesson(averageElementsLesson);
    expect(state.variables.average).toBeCloseTo(29 / 6, 6);
  });

  it('solves the count occurrences lesson', () => {
    const state = executeLesson(countOccurrencesLesson);
    expect(state.variables.count).toBe(3);
  });

  it('solves the count max occurrences lesson', () => {
    const state = executeLesson(countMaxOccurrencesLesson);
    expect(state.variables.max).toBe(7);
    expect(state.variables.count).toBe(3);
  });

  it('solves the count unique values lesson', () => {
    const state = executeLesson(countUniqueLesson);
    expect(state.variables.uniqueCount).toBe(3);
    expect(state.variables.seen).toEqual([3, 1, 2]);
  });

  it('solves the most frequent value lesson', () => {
    const state = executeLesson(mostFrequentLesson);
    expect(state.variables.bestValue).toBe(4);
    expect(state.variables.bestCount).toBe(3);
  });

  it('solves the second extreme lesson', () => {
    const state = executeLesson(secondExtremeLesson);
    expect(state.variables.answer).toBe(5);
  });

  it('solves the all indices lesson', () => {
    const state = executeLesson(allIndicesLesson);
    expect(state.variables.indices).toEqual([0, 2, 4]);
  });

  it('solves the is sorted lesson', () => {
    const state = executeLesson(isSortedLesson);
    expect(state.variables.sorted).toBe(1);
  });

  it('solves the remove duplicates lesson', () => {
    const state = executeLesson(removeDuplicatesLesson);
    expect(state.variables.unique).toEqual([3, 1, 2, 4]);
  });

  it('solves the pairs with sum lesson', () => {
    const state = executeLesson(pairsWithSumLesson);
    expect(state.variables.pairLeft).toEqual([1, 1, 7]);
    expect(state.variables.pairRight).toEqual([5, 5, -1]);
  });

  it('solves the rotate array lesson', () => {
    const state = executeLesson(rotateArrayLesson);
    expect(state.variables.rotated).toEqual([3, 4, 5, 1, 2]);
  });

  it('solves the longest run lesson', () => {
    const state = executeLesson(longestRunLesson);
    expect(state.variables.best).toBe(3);
  });

  it('solves the merge sorted lesson', () => {
    const state = executeLesson(mergeSortedLesson);
    expect(state.variables.merged).toEqual([1, 2, 3, 4, 7, 8, 9, 10]);
  });

  it('solves the missing number lesson', () => {
    const state = executeLesson(missingNumberLesson);
    expect(state.variables.missing).toBe(5);
  });

  it('solves the reverse array lesson', () => {
    const state = executeLesson(reverseArrayLesson);
    expect(state.arrayValues).toEqual([5, 4, 3, 2, 1]);
  });

  it('solves the bubble sort lesson', () => {
    const state = executeLesson(bubbleSortLesson);
    expect(state.arrayValues).toEqual([1, 2, 4, 5]);
  });

  it('solves the sort ascending lesson', () => {
    const state = executeLesson(sortAscendingLesson);
    expect(state.arrayValues).toEqual([1, 2, 3, 4, 5]);
  });

  it('solves the sort descending lesson', () => {
    const state = executeLesson(sortDescendingLesson);
    expect(state.arrayValues).toEqual([5, 4, 3, 2, 1]);
  });
});

function executeLesson(lesson: LessonDefinition) {
  const runner = new InterpreterRunner({
    source: lesson.starterCode,
    pointerVariables: lesson.pointerVariables,
  });
  let state = createInitialState(lesson, 1);

  for (let index = 0; index < 200; index += 1) {
    const event = runner.nextEvent();
    if (!event) {
      break;
    }

    state = createStateFromLesson(state, lesson, event);
    if (event.type === 'FINISH' || event.type === 'ERROR') {
      break;
    }
  }

  return state;
}