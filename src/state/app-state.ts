import type { RunnerState } from './runner-state';
import type { LessonDefinition } from '../lessons/lesson-types';

export type ActiveCellMode = 'read' | 'write' | 'compare' | 'swap' | 'move' | null;
export type ActiveVariableMode = 'write' | 'compare' | 'move' | null;
export type ActivePointerMode = 'write' | 'compare' | 'move' | null;

export interface AppState {
  algorithmType: LessonDefinition['algorithmType'];
  runnerState: RunnerState;
  currentLine: number | null;
  arrayName: string;
  arrayValues: unknown[];
  arrays: Record<string, unknown[]>;
  arrayPointers: Record<string, string[]>;
  activeIndices: number[];
  activeArrayIndices: Record<string, number[]>;
  activeCellMode: ActiveCellMode;
  activeArrayName: string | null;
  variables: Record<string, unknown>;
  pointers: Record<string, number>;
  activePointerNames: string[];
  activePointerMode: ActivePointerMode;
  activeVariableNames: string[];
  activeVariableMode: ActiveVariableMode;
  logEntries: string[];
  explanation: string;
  eventCursor: number;
  speed: number;
}