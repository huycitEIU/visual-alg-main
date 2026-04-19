import { appConfig } from './config';
import { loadPersistedAppState, savePersistedAppState } from './persistence';
import { createEditorController } from '../editor/editor';
import { InterpreterRunner } from '../engine/interpreter-runner';
import { validateSource } from '../engine/validator';
import { getLessonById, lessons } from '../lessons/registry';
import type { LessonDefinition } from '../lessons/lesson-types';
import { createInitialState, createStateFromLesson, getPlaybackDelay, setRunnerState } from '../state/reducers';
import { getShortcutAction, shouldIgnoreShortcutTarget } from '../ui/keyboard-shortcuts';
import { createLayout } from '../ui/layout';
import { renderLessonInfoPanel } from '../ui/panels/welcome-panel';
import { formatValidationIssues } from '../ui/validation-summary';
import { renderArrayPanel } from '../visual/array-renderer';
import { renderVariablesPanel } from '../visual/variable-renderer';

export function bootstrap(container: HTMLDivElement | null): void {
  if (!container) {
    throw new Error('Missing #app root container.');
  }

  const firstLesson = lessons[0];
  if (!firstLesson) {
    throw new Error('At least one lesson must be registered.');
  }

  const persistedState = loadPersistedAppState();
  const initialLesson = getLessonById(persistedState?.lessonId ?? '') ?? firstLesson;

  let selectedLesson: LessonDefinition = initialLesson;
  let state = createInitialState(selectedLesson, persistedState?.speed ?? appConfig.initialSpeed);
  let sourceCode = persistedState?.sourceCode ?? selectedLesson.starterCode;
  let validationMessages = formatValidationIssues(validateSource(sourceCode).errors);
  let runner: InterpreterRunner | null = null;
  let runTimer: number | null = null;
  let suppressEditorListener = false;
  let activeFullscreenPanel: HTMLElement | null = null;

  const stopRunLoop = (): void => {
    if (runTimer !== null) {
      window.clearInterval(runTimer);
      runTimer = null;
    }
  };

  const layout = createLayout({
    title: appConfig.appName,
    lessons,
    initialLesson: selectedLesson,
    onLessonChange: (lessonId) => {
      const nextLesson = getLessonById(lessonId);
      if (!nextLesson) {
        return;
      }

      stopRunLoop();
      selectedLesson = nextLesson;
      state = createInitialState(selectedLesson, state.speed);
      sourceCode = selectedLesson.starterCode;
      validationMessages = formatValidationIssues(validateSource(sourceCode).errors);
      runner = null;
      setEditorValueFromApp(sourceCode);
      persist();
      render();
    },
    onReset: () => {
      stopRunLoop();
      state = createInitialState(selectedLesson, state.speed);
      runner = null;
      persist();
      render();
    },
    onNext: () => {
      if (!ensureLatestSourceApplied()) {
        return;
      }
      stepPlayback();
    },
    onRun: () => {
      if (!ensureLatestSourceApplied()) {
        return;
      }

      if (state.runnerState === 'finished' || state.runnerState === 'error') {
        return;
      }

      stopRunLoop();
      state = setRunnerState(state, 'running');
      render();
      runTimer = window.setInterval(() => {
        const completed = stepPlayback();
        if (completed) {
          stopRunLoop();
        }
      }, getPlaybackDelay(state.speed));
    },
    onPause: () => {
      stopRunLoop();
      if (state.runnerState === 'running') {
        state = setRunnerState(state, 'paused');
        render();
      }
    },
    onSpeedChange: (speed) => {
      state = { ...state, speed };
      if (runTimer !== null) {
        stopRunLoop();
        state = setRunnerState(state, 'running');
        render();
        runTimer = window.setInterval(() => {
          const completed = stepPlayback();
          if (completed) {
            stopRunLoop();
          }
        }, getPlaybackDelay(state.speed));
      } else {
        persist();
        render();
      }
    },
  });

  const editor = createEditorController(layout.code.editorMount, (value) => {
    if (suppressEditorListener) {
      return;
    }

    stopRunLoop();
    validationMessages = formatValidationIssues(validateSource(value).errors);
    runner = null;
    state = {
      ...state,
      currentLine: null,
      explanation:
        validationMessages[0] ?? 'Code changed. Click Rebuild visual to apply changes to the visualization.',
    };
    persist();
    render();
  });
  setEditorValueFromApp(sourceCode);
  editor.setEditable(false);

  layout.code.copyButton.addEventListener('click', async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(sourceCode);
        setInfoMessage('Code copied to clipboard.');
      }
    } catch {
      setInfoMessage('Clipboard copy failed in this environment.');
    }
    render();
  });

  layout.code.rebuildButton.addEventListener('click', () => {
    refreshExecutionFromSource();
  });

  layout.code.fullscreenButton.addEventListener('click', () => {
    togglePanelFullscreen(layout.code.root, layout.code.fullscreenButton, 'Code Editor');
  });

  layout.visual.fullscreenButton.addEventListener('click', () => {
    togglePanelFullscreen(layout.visual.root, layout.visual.fullscreenButton, 'Visualization');
  });

  let isDarkTheme = true;
  layout.code.themeButton.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    editor.setTheme(isDarkTheme);
    layout.code.themeButton.textContent = isDarkTheme ? 'Light Theme' : 'Dark Theme';
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeFullscreenPanel) {
      event.preventDefault();
      exitFullscreenPanel();
      return;
    }

    if (shouldIgnoreShortcutTarget(event.target, false)) {
      return;
    }

    const action = getShortcutAction(event.key);
    if (!action) {
      return;
    }

    event.preventDefault();
    switch (action) {
      case 'next':
        layout.visual.nextButton.click();
        break;
      case 'run':
        layout.visual.runButton.click();
        break;
      case 'pause':
        layout.visual.pauseButton.click();
        break;
      case 'reset':
        layout.visual.resetButton.click();
        break;
    }
  });

  function stepPlayback(): boolean {
    if (validationMessages.length > 0) {
      state = {
        ...state,
        runnerState: 'error',
        explanation: validationMessages[0] ?? 'Validation error.',
        logEntries: [`Validation error: ${validationMessages[0] ?? 'Unsupported syntax.'}`, ...state.logEntries].slice(0, appConfig.maxLogEntries),
      };
      render();
      return true;
    }

    try {
      if (!runner) {
        runner = new InterpreterRunner({
          source: sourceCode,
          pointerVariables: selectedLesson.pointerVariables,
        });
        runner.initialize();
      }
    } catch (error) {
      stopRunLoop();
      const message = error instanceof Error ? error.message : String(error);
      state = {
        ...state,
        runnerState: 'error',
        explanation: message,
        logEntries: [`Execution error: ${message}`, ...state.logEntries].slice(0, appConfig.maxLogEntries),
      };
      render();
      return true;
    }

    const nextEvent = runner.nextEvent();
    if (!nextEvent) {
      stopRunLoop();
      return true;
    }

    state = createStateFromLesson(state, selectedLesson, nextEvent);
    render();
    return state.runnerState === 'finished' || state.runnerState === 'error';
  }

  function refreshExecutionFromSource(): void {
    stopRunLoop();
    sourceCode = editor.getValue();
    validationMessages = formatValidationIssues(validateSource(sourceCode).errors);
    runner = null;

    const derivedLesson: LessonDefinition = {
      ...selectedLesson,
      initialBindings: deriveInitialBindingsFromSource(sourceCode, selectedLesson.initialBindings),
    };
    state = createInitialState(derivedLesson, state.speed);
    persist();
    render();
  }

  function togglePanelFullscreen(panel: HTMLElement, button: HTMLButtonElement, label: string): void {
    const isTargetFullscreen = panel.classList.contains('is-fullscreen');
    if (isTargetFullscreen) {
      exitFullscreenPanel();
      return;
    }

    exitFullscreenPanel();
    panel.classList.add('is-fullscreen');
    document.body.classList.add('has-panel-fullscreen');
    button.textContent = 'Exit Fullscreen';
    button.setAttribute('aria-label', `Exit fullscreen ${label}`);
    activeFullscreenPanel = panel;
  }

  function exitFullscreenPanel(): void {
    if (!activeFullscreenPanel) {
      return;
    }

    const fullscreenButton = activeFullscreenPanel.querySelector<HTMLButtonElement>('[data-fullscreen-toggle]');
    if (fullscreenButton) {
      fullscreenButton.textContent = 'Fullscreen';
      if (fullscreenButton.dataset.fullscreenToggle === 'code') {
        fullscreenButton.setAttribute('aria-label', 'Fullscreen code editor');
      } else {
        fullscreenButton.setAttribute('aria-label', 'Fullscreen visualization');
      }
    }

    activeFullscreenPanel.classList.remove('is-fullscreen');
    activeFullscreenPanel = null;
    document.body.classList.remove('has-panel-fullscreen');
  }

  function deriveInitialBindingsFromSource(
    source: string,
    fallbackBindings: Record<string, unknown>,
  ): Record<string, unknown> {
    const derivedBindings: Record<string, unknown> = { ...fallbackBindings };
    const lines = source.split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.length === 0 || line.startsWith('//')) {
        continue;
      }

      if (/^(while|for|if|function)\b/.test(line)) {
        break;
      }

      const match = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+);$/.exec(line);
      if (!match || !match[1] || !match[2]) {
        continue;
      }

      const [, variableName, expression] = match;
      const parsedValue = parseSimpleLiteral(expression.trim());
      if (parsedValue !== undefined) {
        derivedBindings[variableName] = parsedValue;
      }
    }

    return derivedBindings;
  }

  function parseSimpleLiteral(expression: string): unknown {
    if (/^-?\d+(?:\.\d+)?$/.test(expression)) {
      return Number(expression);
    }

    if (/^\[(.*)\]$/.test(expression)) {
      const inner = expression.slice(1, -1).trim();
      if (inner.length === 0) {
        return [];
      }

      const tokens = inner.split(',').map((token) => token.trim());
      if (tokens.every((token) => /^-?\d+(?:\.\d+)?$/.test(token))) {
        return tokens.map((token) => Number(token));
      }
    }

    return undefined;
  }

  function ensureLatestSourceApplied(): boolean {
    if (editor.getValue() !== sourceCode) {
      refreshExecutionFromSource();
    }
    return validationMessages.length === 0;
  }

  function setEditorValueFromApp(value: string): void {
    sourceCode = value;
    suppressEditorListener = true;
    editor.setValue(value);
    suppressEditorListener = false;
  }

  function render(): void {
    const hasPendingCodeChanges = editor.getValue() !== sourceCode;
    const hasValidationErrors = validationMessages.length > 0;

    layout.visual.root.dataset.algorithmType = selectedLesson.algorithmType;
    layout.visual.root.dataset.structureType = selectedLesson.primaryStructure;
    renderLessonInfoPanel(layout.lessonInfo, selectedLesson);

    layout.toolbar.lessonSelect.value = selectedLesson.id;
    layout.visual.speedInput.value = String(state.speed);
    layout.visual.resetButton.disabled = false;
    layout.visual.nextButton.disabled = hasPendingCodeChanges || hasValidationErrors || state.runnerState === 'running' || state.runnerState === 'finished';
    layout.visual.runButton.disabled = hasPendingCodeChanges || hasValidationErrors || state.runnerState === 'running' || state.runnerState === 'finished';
    layout.visual.pauseButton.disabled = state.runnerState !== 'running';
    layout.code.rebuildButton.disabled = !hasPendingCodeChanges;

    editor.setEditable(false);
    editor.highlightLine(state.currentLine);

    renderArrayPanel(layout.visual.stage, state);
    renderVariablesPanel(layout.visual.variables, state, selectedLesson);
    const latestLogEntry = state.logEntries[0] ?? 'Ready for the next operation.';
    layout.visual.operationLogBody.replaceChildren(paragraph(latestLogEntry));
    layout.explanation.body.replaceChildren(paragraph(selectedLesson.description));
    layout.code.errorList.replaceChildren(...validationMessages.map((message) => paragraph(message)));
    layout.code.errorList.classList.toggle('has-errors', hasValidationErrors);
  }

  function persist(): void {
    const persistedSource = editor.getValue();
    savePersistedAppState({
      lessonId: selectedLesson.id,
      sourceCode: persistedSource,
      speed: state.speed,
      isEditable: false,
      welcomeDismissed: true,
    });
  }

  function setInfoMessage(message: string): void {
    state = {
      ...state,
      explanation: message,
      logEntries: [message, ...state.logEntries].slice(0, appConfig.maxLogEntries),
    };
  }

  function paragraph(text: string): HTMLParagraphElement {
    const element = document.createElement('p');
    element.textContent = text;
    return element;
  }

  container.innerHTML = '';
  container.append(layout.root);
  persist();
  render();
}