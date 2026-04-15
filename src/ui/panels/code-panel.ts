export interface CodePanelRefs {
  root: HTMLElement;
  editorMount: HTMLDivElement;
  fullscreenButton: HTMLButtonElement;
  copyButton: HTMLButtonElement;
  themeButton: HTMLButtonElement;
  rebuildButton: HTMLButtonElement;
  errorList: HTMLDivElement;
}

export function createCodePanel(): CodePanelRefs {
  const root = document.createElement('section');
  root.className = 'panel panel-code';

  const header = document.createElement('div');
  header.className = 'panel-header';
  const title = document.createElement('h2');
  title.textContent = 'Code Editor';

  const headerActions = document.createElement('div');
  headerActions.className = 'code-panel-actions';

  const fullscreenButton = document.createElement('button');
  fullscreenButton.type = 'button';
  fullscreenButton.className = 'mode-toggle';
  fullscreenButton.setAttribute('data-fullscreen-toggle', 'code');
  fullscreenButton.setAttribute('aria-label', 'Fullscreen code editor');
  fullscreenButton.textContent = 'Fullscreen';

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'mode-toggle';
  copyButton.textContent = 'Copy';

  const themeButton = document.createElement('button');
  themeButton.type = 'button';
  themeButton.className = 'mode-toggle';
  themeButton.textContent = 'Light Theme';

  const rebuildButton = document.createElement('button');
  rebuildButton.type = 'button';
  rebuildButton.className = 'mode-toggle';
  rebuildButton.textContent = 'Rebuild visual';

  const tag = document.createElement('span');
  tag.className = 'panel-tag';
  tag.textContent = 'CodeMirror 6';

  headerActions.append(fullscreenButton, copyButton, themeButton, rebuildButton, tag);
  header.append(title, headerActions);

  const editorMount = document.createElement('div');
  editorMount.className = 'panel-body editor-host';

  const errorList = document.createElement('div');
  errorList.className = 'code-errors';

  root.append(header, editorMount, errorList);
  return { root, editorMount, fullscreenButton, copyButton, themeButton, rebuildButton, errorList };
}