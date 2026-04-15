import type { LessonDefinition } from '../lessons/lesson-types';
import { createToolbar, type ToolbarRefs } from './toolbar';
import { createVisualPanel, type VisualPanelRefs } from './panels/visual-panel';
import { createCodePanel, type CodePanelRefs } from './panels/code-panel';
import { createExplanationPanel, type PanelRefs } from './panels/explanation-panel';
import { createLogPanel } from './panels/log-panel';
import { createLessonInfoPanel, type LessonInfoPanelRefs } from './panels/welcome-panel';

interface LayoutOptions {
  title: string;
  lessons: LessonDefinition[];
  initialLesson: LessonDefinition;
  onLessonChange: (lessonId: string) => void;
  onReset: () => void;
  onNext: () => void;
  onRun: () => void;
  onPause: () => void;
  onSpeedChange: (speed: number) => void;
}

export interface LayoutRefs {
  root: HTMLElement;
  toolbar: ToolbarRefs;
  code: CodePanelRefs;
  visual: VisualPanelRefs;
  lessonInfo: LessonInfoPanelRefs;
  log: PanelRefs;
  explanation: PanelRefs;
}

export function createLayout(options: LayoutOptions): LayoutRefs {
  const shell = document.createElement('main');
  shell.className = 'app-shell';

  const header = document.createElement('header');
  header.className = 'app-header';

  const heading = document.createElement('div');
  heading.className = 'app-heading';
  heading.innerHTML = `
    <p class="eyebrow">Browser-only classroom tool</p>
    <h1>${options.title}</h1>
    <p class="subtitle">Step through algorithms using a semantic event stream that updates each panel in sync.</p>
  `;

  const toolbar = createToolbar({
    lessons: options.lessons,
    onLessonChange: options.onLessonChange,
  });

  const headerTop = document.createElement('div');
  headerTop.className = 'app-header-top';
  headerTop.append(heading, toolbar.root);

  const lessonInfo = createLessonInfoPanel(options.initialLesson);

  header.append(headerTop, lessonInfo.root);

  const code = createCodePanel();
  const visual = createVisualPanel({
    onReset: options.onReset,
    onNext: options.onNext,
    onRun: options.onRun,
    onPause: options.onPause,
    onSpeedChange: options.onSpeedChange,
  });
  const log = createLogPanel();
  const explanation = createExplanationPanel();

  const topGrid = document.createElement('section');
  topGrid.className = 'top-grid';
  topGrid.append(visual.root, code.root);

  const bottomGrid = document.createElement('section');
  bottomGrid.className = 'bottom-grid';
  bottomGrid.append(explanation.root, log.root);

  shell.append(header, topGrid, bottomGrid);
  return { root: shell, toolbar, code, visual, lessonInfo, log, explanation };
}