import type { RuntimeEvent } from '../engine/runtime-events';
import type { LessonDefinition } from '../lessons/lesson-types';
import type { AppState } from './app-state';
import type { RunnerState } from './runner-state';

const MAX_LOG_ENTRIES = 8;

export function createInitialState(lesson: LessonDefinition, speed: number): AppState {
  const arrayName = pickPrimaryArrayName(lesson.initialBindings);
  const arrayValues = Array.isArray(lesson.initialBindings[arrayName])
    ? [...(lesson.initialBindings[arrayName] as unknown[])]
    : [];

  // Extract all arrays from initial bindings
  const arrays: Record<string, unknown[]> = {};
  for (const [key, value] of Object.entries(lesson.initialBindings)) {
    if (Array.isArray(value)) {
      arrays[key] = [...value];
    }
  }

  const variables = { ...lesson.initialBindings };
  const pointers = Object.fromEntries(
    lesson.pointerVariables
      .filter((name) => typeof variables[name] === 'number')
      .map((name) => [name, Number(variables[name])]),
  );
  const arrayPointers = inferArrayPointers(Object.keys(arrays), Object.keys(pointers), lesson.starterCode, arrayName);

  return {
    algorithmType: lesson.algorithmType,
    runnerState: 'ready',
    currentLine: 1,
    arrayName,
    arrayValues,
    arrays,
    arrayPointers,
    activeIndices: [],
    activeArrayIndices: {},
    activeCellMode: null,
    activeArrayName: arrayName,
    variables,
    pointers,
    activePointerNames: [],
    activePointerMode: null,
    activeVariableNames: [],
    activeVariableMode: null,
    logEntries: ['Ready to step through the lesson.'],
    explanation: lesson.description,
    eventCursor: 0,
    speed,
  };
}

export function createStateFromLesson(
  state: AppState,
  lesson: LessonDefinition,
  event: RuntimeEvent,
): AppState {
  const nextState: AppState = {
    ...state,
    runnerState: state.runnerState === 'ready' ? 'paused' : state.runnerState,
    eventCursor: state.eventCursor + 1,
    activeIndices: [],
    activeArrayIndices: {},
    activeCellMode: null,
    activeVariableNames: [],
    activeVariableMode: null,
    activePointerNames: [],
    activePointerMode: null,
    activeArrayName: null,
    arrays: { ...state.arrays },
  };

  switch (event.type) {
    case 'LINE_ENTER':
      nextState.currentLine = event.line;
      break;
    case 'SET_VAR':
      nextState.variables = { ...nextState.variables, [event.name]: event.value };
      nextState.activeVariableNames = [event.name];
      nextState.activeVariableMode = 'write';
      if (lesson.pointerVariables.includes(event.name) && typeof event.value === 'number') {
        nextState.pointers = { ...nextState.pointers, [event.name]: event.value };
        nextState.activePointerNames = [event.name];
        nextState.activePointerMode = 'write';
      }
      break;
    case 'READ_ARRAY':
      nextState.activeIndices = [event.index];
      nextState.activeCellMode = 'read';
      nextState.activeArrayName = event.arrayName;
      break;
    case 'WRITE_ARRAY':
      {
        const writtenArray = nextState.variables[event.arrayName];
        if (Array.isArray(writtenArray)) {
          const nextArray = [...writtenArray];
          nextArray[event.index] = event.value;
          nextState.variables = {
            ...nextState.variables,
            [event.arrayName]: nextArray,
          };

          // Update both primary and all arrays tracking
          if (event.arrayName === nextState.arrayName) {
            nextState.arrayValues = nextArray;
          }
          nextState.arrays[event.arrayName] = nextArray;
        }
      }
      nextState.activeIndices = [event.index];
      nextState.activeCellMode = 'write';
      nextState.activeArrayName = event.arrayName;
      break;
    case 'COMPARE':
      {
        const compareTargets = collectTargetsFromCompare(nextState.variables, event.leftRef, event.rightRef);
        nextState.activeIndices = compareTargets.indices;
        nextState.activeArrayIndices = compareTargets.arrayIndices;
        nextState.activeVariableNames = compareTargets.variables;
        nextState.activeVariableMode = compareTargets.variables.length > 0 ? 'compare' : null;
        nextState.activePointerNames = compareTargets.variables.filter((name) => lesson.pointerVariables.includes(name));
        nextState.activePointerMode = nextState.activePointerNames.length > 0 ? 'compare' : null;
      }
      nextState.activeCellMode = 'compare';
      break;
    case 'MOVE_POINTER':
      nextState.pointers = { ...nextState.pointers, [event.name]: event.index };
      nextState.variables = { ...nextState.variables, [event.name]: event.index };
      nextState.activeIndices = [event.index];
      nextState.activePointerNames = [event.name];
      nextState.activePointerMode = 'move';
      nextState.activeVariableNames = [event.name];
      nextState.activeVariableMode = 'move';
      nextState.activeCellMode = 'move';
      break;
    case 'SWAP': {
      const arrayValues = [...nextState.arrayValues];
      [arrayValues[event.i], arrayValues[event.j]] = [arrayValues[event.j], arrayValues[event.i]];
      nextState.arrayValues = arrayValues;
      // Also update in arrays tracking if it's the primary array
      if (nextState.arrayName in nextState.arrays) {
        nextState.arrays[nextState.arrayName] = arrayValues;
      }
      nextState.activeIndices = [event.i, event.j];
      nextState.activeCellMode = 'swap';
      nextState.activeArrayName = nextState.arrayName;
      break;
    }
    case 'PRINT':
      break;
    case 'FINISH':
      nextState.runnerState = 'finished';
      break;
    case 'ERROR':
      nextState.runnerState = 'error';
      break;
  }

  const eventDescription = describeEvent(event);
  if (eventDescription) {
    nextState.logEntries = appendLog(nextState.logEntries, formatLogEntry(nextState.currentLine, eventDescription));
  }
  nextState.explanation = explainEvent(lesson, event);

  return nextState;
}

function collectTargetsFromCompare(
  variables: Record<string, unknown>,
  leftRef?: string,
  rightRef?: string,
): { indices: number[]; arrayIndices: Record<string, number[]>; variables: string[] } {
  const indices = new Set<number>();
  const arrayIndices: Record<string, number[]> = {};
  const variableNames = new Set<string>();

  addTargetFromRef(leftRef, variables, indices, arrayIndices, variableNames);
  addTargetFromRef(rightRef, variables, indices, arrayIndices, variableNames);

  return {
    indices: [...indices],
    arrayIndices,
    variables: [...variableNames],
  };
}

function addTargetFromRef(
  ref: string | undefined,
  variables: Record<string, unknown>,
  indices: Set<number>,
  arrayIndices: Record<string, number[]>,
  variableNames: Set<string>,
): void {
  if (!ref) {
    return;
  }

  const trimmed = ref.trim();
  if (trimmed.length === 0) {
    return;
  }

  const arrayAccessMatch = /^([A-Za-z_]\w*)\s*\[\s*(.+)\s*\]$/.exec(trimmed);
  if (arrayAccessMatch && arrayAccessMatch[1] && arrayAccessMatch[2]) {
    const arrayName = arrayAccessMatch[1];
    const indexExpression = arrayAccessMatch[2];
    const resolvedIndex = resolveIndexExpression(indexExpression, variables);
    if (resolvedIndex !== null) {
      indices.add(resolvedIndex);
      // Track by array name
      if (!arrayIndices[arrayName]) {
        arrayIndices[arrayName] = [];
      }
      arrayIndices[arrayName].push(resolvedIndex);
    }

    for (const name of extractIdentifiers(indexExpression)) {
      variableNames.add(name);
    }
    return;
  }

  if (/^[A-Za-z_]\w*$/.test(trimmed)) {
    variableNames.add(trimmed);
  }
}

function resolveIndexExpression(expression: string, variables: Record<string, unknown>): number | null {
  const compact = expression.replace(/\s+/g, '');
  const tokens = compact.match(/([A-Za-z_]\w*|-?\d+|[+\-])/g);
  if (!tokens || tokens.join('') !== compact) {
    return resolveSimpleToken(compact, variables);
  }

  let result: number | null = null;
  let operator: '+' | '-' = '+';

  for (const token of tokens) {
    if (token === '+' || token === '-') {
      operator = token;
      continue;
    }

    const value = resolveSimpleToken(token, variables);
    if (value === null) {
      return null;
    }

    if (result === null) {
      result = value;
      continue;
    }

    result = operator === '+' ? result + value : result - value;
  }

  return result;
}

function resolveSimpleToken(token: string, variables: Record<string, unknown>): number | null {
  if (/^-?\d+$/.test(token)) {
    return Number(token);
  }

  if (/^[A-Za-z_]\w*$/.test(token)) {
    const value = variables[token];
    return typeof value === 'number' ? value : null;
  }

  return null;
}

function extractIdentifiers(expression: string): string[] {
  const names = expression.match(/[A-Za-z_]\w*/g);
  return names ?? [];
}

export function setRunnerState(state: AppState, runnerState: RunnerState): AppState {
  return { ...state, runnerState };
}

export function getPlaybackDelay(speed: number): number {
  const delays = [0, 1100, 800, 500, 280, 160];
  return delays[speed] ?? 500;
}

function appendLog(logEntries: string[], entry: string): string[] {
  return [entry, ...logEntries].slice(0, MAX_LOG_ENTRIES);
}

function explainEvent(lesson: LessonDefinition, event: RuntimeEvent): string {
  const mappedExplanation = lesson.explanationMap?.[event.type];
  if (typeof mappedExplanation === 'function') {
    return mappedExplanation(event);
  }

  if (typeof mappedExplanation === 'string') {
    return mappedExplanation;
  }

  return describeEvent(event);
}

function describeEvent(event: RuntimeEvent): string {
  switch (event.type) {
    case 'LINE_ENTER':
      return '';
    case 'SET_VAR':
      return `Set ${event.name} = ${String(event.value)}.`;
    case 'READ_ARRAY':
      return `Read ${event.arrayName}[${event.index}] = ${String(event.value)}.`;
    case 'WRITE_ARRAY':
      return `Write ${event.arrayName}[${event.index}] = ${String(event.value)}.`;
    case 'COMPARE':
      return `Compare ${String(event.left)} ${event.operator} ${String(event.right)} => ${String(event.result)}.`;
    case 'MOVE_POINTER':
      return `Move ${event.name} to index ${event.index}.`;
    case 'SWAP':
      return `Swap ${event.arrayName}[${event.i}] with ${event.arrayName}[${event.j}].`;
    case 'PRINT':
      return `Print ${event.text}.`;
    case 'FINISH':
      return 'Execution finished.';
    case 'ERROR':
      return `Execution error: ${event.message}`;
  }
}

function formatLogEntry(line: number | null, action: string): string {
  if (line === null) {
    return action;
  }

  return `Line ${line} : ${action}`;
}

function pickPrimaryArrayName(bindings: Record<string, unknown>): string {
  const match = Object.entries(bindings).find(([, value]) => Array.isArray(value));
  return match?.[0] ?? 'arr';
}

function inferArrayPointers(
  arrayNames: string[],
  pointerNames: string[],
  source: string,
  fallbackArrayName: string,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const name of arrayNames) {
    result[name] = [];
  }

  for (const pointerName of pointerNames) {
    const pointerRegex = new RegExp(`\\b${escapeForRegex(pointerName)}\\b`);
    const matches = arrayNames.filter((arrayName) => {
      const arrayAccessRegex = new RegExp(`\\b${escapeForRegex(arrayName)}\\s*\\[\\s*[^\\]]*\\b${escapeForRegex(pointerName)}\\b[^\\]]*\\]`);
      const lengthRegex = new RegExp(`\\b${escapeForRegex(pointerName)}\\b\\s*(?:<|<=|>|>=)\\s*${escapeForRegex(arrayName)}\\.length\\b`);
      const reverseLengthRegex = new RegExp(`\\b${escapeForRegex(arrayName)}\\.length\\b\\s*(?:<|<=|>|>=)\\s*\\b${escapeForRegex(pointerName)}\\b`);
      return arrayAccessRegex.test(source) || lengthRegex.test(source) || reverseLengthRegex.test(source);
    });

    const targetArrays = matches.length > 0 ? matches : [fallbackArrayName];
    for (const arrayName of targetArrays) {
      if (!result[arrayName]) {
        result[arrayName] = [];
      }

      if (!result[arrayName].includes(pointerName) && pointerRegex.test(source)) {
        result[arrayName].push(pointerName);
      }
    }
  }

  return result;
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}