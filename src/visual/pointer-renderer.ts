import type { ActivePointerMode } from '../state/app-state';

export function renderPointers(
  container: HTMLElement,
  pointers: Record<string, number>,
  cellCount: number,
  activePointerNames: string[] = [],
  activePointerMode: ActivePointerMode = null,
  pointerNamesForArray?: string[],
): void {
  const lane = document.createElement('div');
  lane.className = 'pointer-lane visual-pointer-lane';
  lane.style.gridTemplateColumns = `repeat(${Math.max(cellCount, 1)}, minmax(72px, 1fr))`;

  for (const [name, index] of Object.entries(pointers)) {
    if (pointerNamesForArray && pointerNamesForArray.length > 0 && !pointerNamesForArray.includes(name)) {
      continue;
    }

    if (index < 0 || index >= cellCount) {
      continue;
    }

    const marker = document.createElement('div');
    marker.className = 'pointer visual-pointer';
    if (activePointerNames.includes(name)) {
      marker.classList.add('is-active');
      if (activePointerMode) {
        marker.classList.add(`is-${activePointerMode}`);
      }
    }
    marker.textContent = `${name} = ${index}`;
    marker.style.gridColumn = String(index + 1);
    lane.append(marker);
  }

  container.append(lane);
}