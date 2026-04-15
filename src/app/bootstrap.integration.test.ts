// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EditorView } from '@codemirror/view';

import { bootstrap } from './bootstrap';

describe('bootstrap integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    vi.useFakeTimers();
    installDomPolyfills();
    window.localStorage.clear();
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('loads the default lesson and renders the initial state', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    expect(lessonSelector()?.value).toBe('array-index-of');
    expect(arrayValues()).toEqual(['5', '2', '9', '2', '4', '2', '7']);
    expect(document.querySelector('.variable-card-inline strong')?.textContent).toBe('target');
    expect(document.querySelector('.cm-content')?.hasAttribute('aria-readonly')).toBe(true);
  });

  it('restores the saved state on re-bootstrap', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    changeLesson('array-reverse');

    document.body.innerHTML = '<div id="app"></div>';
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    expect(lessonSelector()?.value).toBe('array-reverse');
  });

  it('steps through indexOf and updates variables', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    stepUntil(() => variableValue('answer') === '1', 40);

    expect(buttonByTitle('Run')?.disabled).toBe(false);
    expect(buttonByTitle('Pause')?.disabled).toBe(true);
    expect(variableValue('answer')).toBe('1');
  });

  it('steps through reverse and updates the array state', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));
    changeLesson('array-reverse');

    stepUntil(() => arrayValues().join(',') === '5,4,3,2,1', 40);

    expect(arrayValues()).toEqual(['5', '4', '3', '2', '1']);
  });

  it('resets after partial execution', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    clickButton('Next', 2);
    clickButton('Reset');

    expect(buttonByTitle('Run')?.disabled).toBe(false);
    expect(variableValue('answer')).toBe('-1');
  });

  it('runs to completion', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    clickButton('Run');
    advanceRunUntil(() => variableValue('answer') === '1', 80);
    advanceRunUntil(() => buttonByTitle('Run')?.disabled ?? false, 20);

    expect(buttonByTitle('Run')?.disabled).toBe(true);
    expect(variableValue('answer')).toBe('1');
  });

  it('pauses while running', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    clickButton('Run');
    vi.advanceTimersByTime(1_100);
    clickButton('Pause');

    expect(buttonByTitle('Pause')?.disabled).toBe(true);
    expect(buttonByTitle('Run')?.disabled).toBe(false);
  });

  it('filters lesson options by selected algorithm family', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    const algorithmSelect = algorithmSelector();
    if (!algorithmSelect) {
      throw new Error('Missing algorithm selector');
    }

    algorithmSelect.value = 'sort';
    algorithmSelect.dispatchEvent(new Event('change', { bubbles: true }));

    expect(lessonSelector()?.value).toBe('array-bubble-sort');
    expect(lessonOptionValues()).toEqual(['array-bubble-sort']);
  });

  it('copies lesson code from the code panel actions', async () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    const copyButton = queryTextButton('Copy');
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
    expect(buttons.some((button) => button.textContent?.includes('Reset code'))).toBe(false);
    expect(buttons.some((button) => button.textContent?.includes('Editable'))).toBe(false);

    copyButton.click();
    await Promise.resolve();

    const clipboard = navigator.clipboard as unknown as { writeText: ReturnType<typeof vi.fn> };
    expect(clipboard.writeText).toHaveBeenCalled();
  });

  it('applies edited code only after clicking rebuild visual', () => {
    bootstrap(document.querySelector<HTMLDivElement>('#app'));

    const editorElement = document.querySelector<HTMLElement>('.cm-editor');
    if (!editorElement) {
      throw new Error('Missing editor element');
    }

    const view = EditorView.findFromDOM(editorElement);
    if (!view) {
      throw new Error('Missing editor view');
    }
    view.dispatch({
      changes: {
        from: view.state.doc.length,
        insert: '\nlet extra = 1;',
      },
    });

    const runButton = document.querySelector<HTMLButtonElement>('button[title="Run"]');
    const rebuildButton = queryTextButton('Rebuild visual');
    if (!runButton) {
      throw new Error('Missing run button');
    }

    expect(runButton.disabled).toBe(true);
    expect(rebuildButton.disabled).toBe(false);

    rebuildButton.click();

    expect(runButton.disabled).toBe(false);
    expect(rebuildButton.disabled).toBe(true);
  });
});

function installDomPolyfills(): void {
  if (!('ResizeObserver' in globalThis)) {
    class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserver);
  }

  if (!('requestAnimationFrame' in globalThis)) {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0));
    vi.stubGlobal('cancelAnimationFrame', (handle: number) => clearTimeout(handle));
  }
}

function clickButton(title: string, times = 1): void {
  const button = buttonByTitle(title);
  if (!button) {
    throw new Error(`Missing button ${title}`);
  }

  for (let index = 0; index < times; index += 1) {
    button.click();
  }
}

function buttonByTitle(title: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(`button[title="${title}"]`);
}

function queryTextButton(text: string): HTMLButtonElement {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button'));
  const match = buttons.find((button) => button.textContent?.includes(text));
  if (!match) {
    throw new Error(`Missing text button ${text}`);
  }

  return match;
}

function changeLesson(lessonId: string): void {
  const select = lessonSelector();
  if (!select) {
    throw new Error('Missing lesson selector');
  }

  select.value = lessonId;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

function lessonSelector(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('select[aria-label="Lesson selector"]');
}

function algorithmSelector(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>('select[aria-label="Algorithm selector"]');
}

function lessonOptionValues(): string[] {
  return Array.from(document.querySelectorAll<HTMLSelectElement>('select[aria-label="Lesson selector"] option')).map((option) => option.value);
}

function stepUntil(condition: () => boolean, maxSteps = 20): void {
  for (let index = 0; index < maxSteps; index += 1) {
    if (condition()) {
      return;
    }
    clickButton('Next');
  }
}

function advanceRunUntil(condition: () => boolean, maxTicks = 20): void {
  for (let index = 0; index < maxTicks; index += 1) {
    if (condition()) {
      return;
    }
    vi.advanceTimersByTime(1_100);
  }
}

function arrayValues(): string[] {
  return Array.from(document.querySelectorAll('.array-value')).map((node) => node.textContent ?? '');
}

function variableValue(name: string): string | undefined {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.variable-card-inline'));
  for (const card of cards) {
    const label = card.querySelector('strong')?.textContent;
    if (label === name) {
      return card.querySelector('span')?.textContent ?? undefined;
    }
  }

  return undefined;
}