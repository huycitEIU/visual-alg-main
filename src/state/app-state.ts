import type { RunnerState } from './runner-state';
import type { LessonDefinition } from '../lessons/lesson-types';

export type ActiveCellMode = 'read' | 'write' | 'compare' | 'swap' | 'move' | null;

export interface AppState {
  algorithmType: LessonDefinition['algorithmType'];
  runnerState: RunnerState;
  currentLine: number | null;
  arrayName: string;
  arrayValues: unknown[];
  activeIndices: number[];
  activeCellMode: ActiveCellMode;
  variables: Record<string, unknown>;
  pointers: Record<string, number>;
  activeVariableNames: string[];
  logEntries: string[];
  explanation: string;
  eventCursor: number;
  speed: number;
}