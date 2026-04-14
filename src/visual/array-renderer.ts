import type { AppState } from '../state/app-state';

import { renderPointers } from './pointer-renderer';

const MAX_RENDERED_CELLS = 20;

export function renderArrayPanel(container: HTMLDivElement, state: AppState): void {
  container.innerHTML = '';
  const content = document.createElement('div');
  const isSortFamily = state.algorithmType === 'sort';
  content.className = isSortFamily ? 'visual-stage-content visual-bar-stage' : 'visual-stage-content array-stage-content';

  const visibleValues = state.arrayValues.slice(0, MAX_RENDERED_CELLS);
  const activeVisibleIndices = state.activeIndices.filter((index) => index >= 0 && index < visibleValues.length);
  const pointerVisibleIndices = new Set(
    Object.values(state.pointers).filter((index) => index >= 0 && index < visibleValues.length),
  );

  renderPointers(content, state.pointers, visibleValues.length);

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

  content.append(grid);

  if (state.arrayValues.length > MAX_RENDERED_CELLS) {
    const notice = document.createElement('p');
    notice.className = 'visual-limit-note';
    notice.textContent = `Showing first ${MAX_RENDERED_CELLS} cells of ${state.arrayValues.length}.`;
    content.append(notice);
  }

  container.append(content);
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