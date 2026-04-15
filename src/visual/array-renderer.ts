import type { AppState } from '../state/app-state';

import { renderPointers } from './pointer-renderer';

const MAX_RENDERED_CELLS = 20;

export function renderArrayPanel(container: HTMLDivElement, state: AppState): void {
  container.innerHTML = '';
  const content = document.createElement('div');
  const isSortFamily = state.algorithmType === 'sort';
  
  // Check if we have multiple arrays to display
  const arrayNames = Object.keys(state.arrays);
  const hasMultipleArrays = arrayNames.length > 1;

  if (hasMultipleArrays) {
    // Multi-array layout: display all arrays stacked vertically
    content.className = 'visual-stage-content multi-array-stage';
    
    for (const arrayName of arrayNames) {
      const arrayValues = state.arrays[arrayName] ?? [];
      renderArraySection(content, arrayName, arrayValues, state, isSortFamily);
    }
  } else {
    // Single array layout: original behavior
    content.className = isSortFamily ? 'visual-stage-content visual-bar-stage' : 'visual-stage-content array-stage-content';
    const arrayValues = state.arrayValues;
    const visibleValues = arrayValues.slice(0, MAX_RENDERED_CELLS);
    const pointerNamesForArray = state.arrayPointers[state.arrayName] ?? [];
    const pointerEntries = Object.entries(state.pointers).filter(([name]) => pointerNamesForArray.includes(name));
    const activeArrayIndicesForArray = state.activeArrayIndices[state.arrayName] ?? [];
    const activeVisibleIndices = state.activeIndices.filter((index) => index >= 0 && index < visibleValues.length)
      .concat(activeArrayIndicesForArray.filter((index) => index >= 0 && index < visibleValues.length));
    const pointerVisibleIndices = new Set(
      pointerEntries
        .map(([, index]) => index)
        .filter((index) => index >= 0 && index < visibleValues.length),
    );

    renderPointers(
      content,
      state.pointers,
      visibleValues.length,
      state.activePointerNames,
      state.activePointerMode,
      pointerNamesForArray,
    );
    renderGrid(content, visibleValues, activeVisibleIndices, pointerVisibleIndices, state, isSortFamily);

    if (arrayValues.length > MAX_RENDERED_CELLS) {
      const notice = document.createElement('p');
      notice.className = 'visual-limit-note';
      notice.textContent = `Showing first ${MAX_RENDERED_CELLS} cells of ${arrayValues.length}.`;
      content.append(notice);
    }
  }

  container.append(content);
}

function renderArraySection(
  container: HTMLElement,
  arrayName: string,
  arrayValues: unknown[],
  state: AppState,
  isSortFamily: boolean,
): void {
  const section = document.createElement('div');
  section.className = 'array-section';
  if (state.activeArrayName === arrayName && state.activeCellMode) {
    section.classList.add('is-active');
  }

  // Array label
  const label = document.createElement('div');
  label.className = 'array-section-label';
  label.textContent = arrayName;
  section.append(label);

  const visibleValues = arrayValues.slice(0, MAX_RENDERED_CELLS);
  
  // Get indices for this specific array that are being compared from multi-array comparisons
  const activeArrayIndicesForThisArray = state.activeArrayIndices[arrayName] ?? [];
  const activeVisibleIndices = (state.activeArrayName === arrayName 
    ? state.activeIndices.filter((index) => index >= 0 && index < visibleValues.length) 
    : [])
    .concat(activeArrayIndicesForThisArray.filter((index) => index >= 0 && index < visibleValues.length));
  const pointerNamesForArray = state.arrayPointers[arrayName] ?? [];
  const pointerEntries = Object.entries(state.pointers).filter(([name]) => pointerNamesForArray.includes(name));
  const pointerVisibleIndices = new Set(
    pointerEntries
      .map(([, index]) => index)
      .filter((index) => index >= 0 && index < visibleValues.length),
  );

  // Render pointers for this array
  renderPointers(
    section,
    state.pointers,
    visibleValues.length,
    state.activePointerNames,
    state.activePointerMode,
    pointerNamesForArray,
  );

  // Render grid
  renderGrid(section, visibleValues, activeVisibleIndices, pointerVisibleIndices, state, isSortFamily);

  // Size notice
  if (arrayValues.length > MAX_RENDERED_CELLS) {
    const notice = document.createElement('p');
    notice.className = 'visual-limit-note';
    notice.textContent = `Showing first ${MAX_RENDERED_CELLS} cells of ${arrayValues.length}.`;
    section.append(notice);
  }

  container.append(section);
}

function renderGrid(
  container: HTMLElement,
  visibleValues: unknown[],
  activeVisibleIndices: number[],
  pointerVisibleIndices: Set<number>,
  state: AppState,
  isSortFamily: boolean,
): void {
  const grid = document.createElement('div');
  grid.className = isSortFamily ? 'visual-grid visual-bar-grid' : 'visual-grid array-grid';
  grid.style.gridTemplateColumns = `repeat(${Math.max(visibleValues.length, 1)}, minmax(72px, 1fr))`;

  const numericValues = visibleValues.map((value) => Number(value));
  const minValue = numericValues.length > 0 ? Math.min(...numericValues) : 0;
  const maxValue = numericValues.length > 0 ? Math.max(...numericValues) : 1;

  for (const [index, value] of visibleValues.entries()) {
    const cell = document.createElement('div');
    cell.className = isSortFamily ? 'visual-cell visual-bar' : 'visual-cell array-cell';
    if (pointerVisibleIndices.has(index)) {
      cell.classList.add('is-pointer-active');
    }

    if (activeVisibleIndices.includes(index) && state.activeCellMode) {
      cell.classList.add('is-processing');
      cell.classList.add(`is-${state.activeCellMode}`);
      if (state.activeCellMode === 'swap') {
        const swapPosition = activeVisibleIndices.indexOf(index);
        cell.classList.add(swapPosition === 0 ? 'is-swap-left' : 'is-swap-right');
      }
    }

    const indexText = document.createElement('span');
    indexText.className = 'visual-index array-index';
    indexText.textContent = String(index);

    if (isSortFamily) {
      const barTrack = document.createElement('div');
      barTrack.className = 'visual-bar-track';

      const valueNumber = Number(value);
      const percent = getPercent(valueNumber, minValue, maxValue);

      const barFill = document.createElement('div');
      barFill.className = 'visual-bar-fill';
      barFill.style.height = `${percent}%`;

      barTrack.append(barFill);
      cell.append(barTrack, indexText);
    } else {
      const valueText = document.createElement('span');
      valueText.className = 'visual-value array-value';
      valueText.textContent = String(value);
      cell.append(indexText, valueText);
    }

    grid.append(cell);
  }

  container.append(grid);
}

function getPercent(value: number, minValue: number, maxValue: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (maxValue <= minValue) {
    return 100;
  }

  const normalized = ((value - minValue) / (maxValue - minValue)) * 100;
  return Math.min(100, Math.max(0, normalized));
}