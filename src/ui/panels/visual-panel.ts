interface VisualPanelOptions {
  onReset: () => void;
  onNext: () => void;
  onRun: () => void;
  onPause: () => void;
  onSpeedChange: (speed: number) => void;
}

export interface VisualPanelRefs {
  root: HTMLElement;
  fullscreenButton: HTMLButtonElement;
  stage: HTMLDivElement;
  operationLogBody: HTMLDivElement;
  variables: HTMLDivElement;
  legend: HTMLDivElement;
  resetButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  runButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  speedInput: HTMLInputElement;
}

export function createVisualPanel(options: VisualPanelOptions): VisualPanelRefs {
  const root = document.createElement('section');
  root.className = 'panel panel-visual panel-visual-wide';

  const header = document.createElement('div');
  header.className = 'panel-header';
  const title = document.createElement('h2');
  title.textContent = 'Data Visualization';

  const headerActions = document.createElement('div');
  headerActions.className = 'code-panel-actions';

  const fullscreenButton = document.createElement('button');
  fullscreenButton.type = 'button';
  fullscreenButton.className = 'mode-toggle';
  fullscreenButton.setAttribute('data-fullscreen-toggle', 'visual');
  fullscreenButton.setAttribute('aria-label', 'Fullscreen visualization');
  fullscreenButton.textContent = 'Fullscreen';

  const tag = document.createElement('span');
  tag.className = 'panel-tag';
  tag.textContent = 'Access, updates, pointers';

  headerActions.append(fullscreenButton, tag);
  header.append(title, headerActions);

  const body = document.createElement('div');
  body.className = 'panel-body panel-body-visual';

  const stage = document.createElement('div');
  stage.className = 'visual-stage';

  const operationLog = document.createElement('section');
  operationLog.className = 'visual-operation-log';

  const operationLogTitle = document.createElement('h3');
  operationLogTitle.className = 'visual-operation-log-title';
  operationLogTitle.textContent = 'Operation Log';

  const operationLogBody = document.createElement('div');
  operationLogBody.className = 'log-list';

  operationLog.append(operationLogTitle, operationLogBody);

  const variables = document.createElement('div');
  variables.className = 'visual-variables';

  const legend = document.createElement('div');
  legend.className = 'visual-legend';
  legend.innerHTML = `
    <span class="legend-item"><i class="legend-swatch is-pointer-active"></i>Pointer location</span>
    <span class="legend-item"><i class="legend-swatch is-read"></i>Access / Processing</span>
    <span class="legend-item"><i class="legend-swatch is-move"></i>Pointer move</span>
    <span class="legend-item"><i class="legend-swatch is-write"></i>Update</span>
    <span class="legend-item"><i class="legend-swatch is-compare"></i>Compare</span>
    <span class="legend-item"><i class="legend-swatch is-swap"></i>Swap / Move</span>
    <span class="legend-item"><i class="legend-pointer"></i>Pointer chip (set/compare/move uses colors above)</span>
  `;

  const footer = document.createElement('div');
  footer.className = 'visual-footer';

  const speedGroup = document.createElement('label');
  speedGroup.className = 'speed-group';
  speedGroup.innerHTML = '<span>Speed</span>';

  const speedInput = document.createElement('input');
  speedInput.type = 'range';
  speedInput.min = '1';
  speedInput.max = '5';
  speedInput.value = '1';
  speedInput.setAttribute('aria-label', 'Playback speed');
  speedInput.addEventListener('input', () => {
    options.onSpeedChange(Number(speedInput.value));
  });
  speedGroup.append(speedInput);

  const controls = document.createElement('div');
  controls.className = 'visual-controls';

  const resetButton = createIconButton('Reset', '↺', options.onReset);
  const nextButton = createIconButton('Next', '⟶', options.onNext);
  const runButton = createIconButton('Run', '▶', options.onRun);
  const pauseButton = createIconButton('Pause', '⏸', options.onPause);
  controls.append(resetButton, nextButton, runButton, pauseButton);

  footer.append(speedGroup, controls);
  body.append(footer, legend, variables, stage, operationLog);

  root.append(header, body);
  return {
    root,
    fullscreenButton,
    stage,
    operationLogBody,
    variables,
    legend,
    resetButton,
    nextButton,
    runButton,
    pauseButton,
    speedInput,
  };
}

function createIconButton(label: string, icon: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-button';
  button.setAttribute('aria-label', label);
  button.title = label;
  button.innerHTML = `
    <span class="icon-button-glyph" aria-hidden="true">${icon}</span>
    <span class="sr-only">${label}</span>
  `;
  button.style.setProperty('--mx', '50%');
  button.style.setProperty('--my', '50%');
  button.addEventListener('mousemove', (event) => {
    const bounds = button.getBoundingClientRect();
    button.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
    button.style.setProperty('--my', `${event.clientY - bounds.top}px`);
  });
  button.addEventListener('mouseleave', () => {
    button.style.setProperty('--mx', '50%');
    button.style.setProperty('--my', '50%');
  });
  button.addEventListener('click', onClick);
  return button;
}