import { describe, expect, it } from 'vitest';

import { indexOfLesson } from '../lessons/array-index-of';
import { createInitialState, createStateFromLesson } from './reducers';

describe('state reducer', () => {
  it('hydrates lesson bindings into the initial state', () => {
    const state = createInitialState(indexOfLesson, 2);

    expect(state.arrayValues).toEqual([5, 2, 9, 2, 4, 2, 7]);
    expect(state.pointers).toEqual({ i: 0 });
    expect(state.variables.answer).toBe(-1);
    expect(state.runnerState).toBe('ready');
  });

  it('applies semantic events to the UI state', () => {
    const initialState = createInitialState(indexOfLesson, 1);
    const afterRead = createStateFromLesson(initialState, indexOfLesson, {
      type: 'READ_ARRAY',
      arrayName: 'arr',
      index: 1,
      value: 2,
    });
    const afterSet = createStateFromLesson(afterRead, indexOfLesson, {
      type: 'SET_VAR',
      name: 'answer',
      value: 1,
    });

    expect(afterRead.activeIndices).toEqual([1]);
    expect(afterRead.activeCellMode).toBe('read');
    expect(afterSet.variables.answer).toBe(1);
    expect(afterSet.activeVariableNames).toEqual(['answer']);
    expect(afterSet.activeVariableMode).toBe('write');
    expect(afterSet.logEntries[0]).toContain('Set answer = 1');
  });

  it('highlights exact compare operands for variables and array indices', () => {
    const initialState = createInitialState(indexOfLesson, 1);
    const compared = createStateFromLesson(initialState, indexOfLesson, {
      type: 'COMPARE',
      left: 9,
      operator: '==',
      right: 2,
      result: false,
      leftRef: 'arr[i]',
      rightRef: 'target',
    });

    expect(compared.activeCellMode).toBe('compare');
    expect(compared.activeIndices).toEqual([0]);
    expect(compared.activeVariableNames).toContain('i');
    expect(compared.activeVariableNames).toContain('target');
    expect(compared.activeVariableMode).toBe('compare');
  });

  it('highlights both sides when compare refs use adjacent index expressions', () => {
    const initialState = createInitialState(indexOfLesson, 1);
    const compared = createStateFromLesson(initialState, indexOfLesson, {
      type: 'COMPARE',
      left: 2,
      operator: '<=',
      right: 9,
      result: true,
      leftRef: 'arr[i]',
      rightRef: 'arr[i + 1]',
    });

    expect(compared.activeCellMode).toBe('compare');
    expect(compared.activeIndices).toEqual([0, 1]);
  });
});