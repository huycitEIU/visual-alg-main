import type { LessonDefinition } from '../../lessons/lesson-types';

export interface LessonInfoPanelRefs {
  root: HTMLElement;
  name: HTMLHeadingElement;
  metadata: HTMLParagraphElement;
  description: HTMLParagraphElement;
}

export function createLessonInfoPanel(lesson: LessonDefinition): LessonInfoPanelRefs {
  const root = document.createElement('section');
  root.className = 'welcome-panel lesson-info-panel';

  const copy = document.createElement('div');
  copy.className = 'welcome-copy';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Lesson Info';

  const name = document.createElement('h2');
  const metadata = document.createElement('p');
  metadata.className = 'lesson-info-metadata';

  const description = document.createElement('p');
  description.className = 'lesson-info-description';

  copy.append(eyebrow, name, metadata, description);
  root.append(copy);

  const refs: LessonInfoPanelRefs = { root, name, metadata, description };
  renderLessonInfoPanel(refs, lesson);
  return refs;
}

export function renderLessonInfoPanel(refs: LessonInfoPanelRefs, lesson: LessonDefinition): void {
  refs.name.textContent = lesson.title;
  refs.metadata.textContent = [
    `Algorithm: ${toTitleLabel(lesson.algorithmType)}`,
    `Category: ${toTitleLabel(lesson.category)}`,
    `Structure: ${toTitleLabel(lesson.primaryStructure)}`,
  ].join(' • ');
  refs.description.textContent = lesson.description;
}

function toTitleLabel(value: string): string {
  return value
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}