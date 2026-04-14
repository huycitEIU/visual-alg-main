import { describe, expect, it } from 'vitest';

import { bubbleSortLesson } from '../lessons/array-bubble-sort';
import { binarySearchLesson } from '../lessons/array-binary-search';
import { averageElementsLesson } from '../lessons/array-average';
import { countOccurrencesLesson } from '../lessons/array-count-occurrences';
import { containsLesson } from '../lessons/array-contains';
import { findMaxLesson } from '../lessons/array-find-max';
import { findMinLesson } from '../lessons/array-find-min';
import { indexOfMaxLesson } from '../lessons/array-index-of-max';
import { indexOfMinLesson } from '../lessons/array-index-of-min';
import { indexOfLesson } from '../lessons/array-index-of';
import { lastIndexOfLesson } from '../lessons/array-last-index-of';
import { reverseArrayLesson } from '../lessons/array-reverse';
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

  it('solves the reverse array lesson', () => {
    const state = executeLesson(reverseArrayLesson);
    expect(state.arrayValues).toEqual([5, 4, 3, 2, 1]);
  });

  it('solves the bubble sort lesson', () => {
    const state = executeLesson(bubbleSortLesson);
    expect(state.arrayValues).toEqual([1, 2, 4, 5]);
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