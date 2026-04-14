import type { LessonDefinition } from '../lessons/lesson-types';

interface ToolbarOptions {
  lessons: LessonDefinition[];
  onLessonChange: (lessonId: string) => void;
}

export interface ToolbarRefs {
  root: HTMLElement;
  algorithmSelect: HTMLSelectElement;
  lessonSelect: HTMLSelectElement;
}

export function createToolbar(options: ToolbarOptions): ToolbarRefs {
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar toolbar-minimal';

  const algorithmSelector = document.createElement('label');
  algorithmSelector.className = 'toolbar-group';

  const algorithmLabel = document.createElement('span');
  algorithmLabel.textContent = 'Algorithm';

  const algorithmSelect = document.createElement('select');
  algorithmSelect.setAttribute('aria-label', 'Algorithm selector');
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All algorithms';
  algorithmSelect.append(allOption);

  const algorithmTypes = [...new Set(options.lessons.map((lesson) => lesson.algorithmType))];
  for (const algorithmType of algorithmTypes) {
    const option = document.createElement('option');
    option.value = algorithmType;
    option.textContent = toTitleCase(algorithmType);
    algorithmSelect.append(option);
  }
  algorithmSelector.append(algorithmLabel, algorithmSelect);

  const selector = document.createElement('label');
  selector.className = 'toolbar-group';

  const label = document.createElement('span');
  label.textContent = 'Lesson';

  const lessonSelect = document.createElement('select');
  lessonSelect.setAttribute('aria-label', 'Lesson selector');
  const rebuildLessonOptions = (preferredLessonId?: string): string => {
    const activeAlgorithm = algorithmSelect.value;
    const filteredLessons =
      activeAlgorithm === 'all'
        ? options.lessons
        : options.lessons.filter((lesson) => lesson.algorithmType === activeAlgorithm);

    lessonSelect.replaceChildren();
    for (const lesson of filteredLessons) {
      const option = document.createElement('option');
      option.value = lesson.id;
      option.textContent = lesson.title;
      lessonSelect.append(option);
    }

    const defaultLessonId = filteredLessons[0]?.id ?? '';
    const nextLessonId =
      preferredLessonId && filteredLessons.some((lesson) => lesson.id === preferredLessonId)
        ? preferredLessonId
        : defaultLessonId;
    lessonSelect.value = nextLessonId;
    return nextLessonId;
  };

  rebuildLessonOptions(options.lessons[0]?.id);

  algorithmSelect.addEventListener('change', () => {
    const previousLessonId = lessonSelect.value;
    const nextLessonId = rebuildLessonOptions(previousLessonId);
    if (nextLessonId && nextLessonId !== previousLessonId) {
      options.onLessonChange(nextLessonId);
    }
  });

  lessonSelect.addEventListener('change', () => {
    options.onLessonChange(lessonSelect.value);
  });
  selector.append(label, lessonSelect);

  toolbar.append(algorithmSelector, selector);

  return {
    root: toolbar,
    algorithmSelect,
    lessonSelect,
  };
}

function toTitleCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}