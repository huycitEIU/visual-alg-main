export function renderPointers(
  container: HTMLElement,
  pointers: Record<string, number>,
  cellCount: number,
): void {
  const lane = document.createElement('div');
  lane.className = 'pointer-lane visual-pointer-lane';
  lane.style.gridTemplateColumns = `repeat(${Math.max(cellCount, 1)}, minmax(72px, 1fr))`;

  for (const [name, index] of Object.entries(pointers)) {
    if (index < 0 || index >= cellCount) {
      continue;
    }

    const marker = document.createElement('div');
    marker.className = 'pointer visual-pointer';
    marker.textContent = `${name} = ${index}`;
    marker.style.gridColumn = String(index + 1);
    lane.append(marker);
  }

  container.append(lane);
}