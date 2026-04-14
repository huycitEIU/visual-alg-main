import { defaultKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';

import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { oneDark } from '@codemirror/theme-one-dark';

import { createRuntimeHighlightExtension } from './highlighting';

// VS Code Light Theme colors
const vsCodeLightTheme = EditorView.theme({
  '&': { color: '#333333', backgroundColor: '#ffffff' },
  '&.cm-editor': { backgroundColor: '#ffffff' },
  '.cm-content': { color: '#333333', caretColor: '#44ff00' },
  '.cm-gutters': { backgroundColor: '#f5f5f5', color: '#999' },
  '.cm-activeLineGutter': { backgroundColor: '#e8e8e8' },
  '.cm-cursor': { borderLeftColor: '#44ff00' },
  '.cm-line': { color: '#333333' },
  '.cm-completions': {
    backgroundColor: '#ffffff',
    color: '#333333',
    border: '1px solid #ddd',
  },
  '.cm-completions .cm-option.cm-selected': { backgroundColor: '#e8e8e8' },
  '.cm-tooltip': { backgroundColor: '#ffffff', border: '1px solid #ddd', color: '#333333' },
});

// VS Code Light syntax highlighting
const vsCodeLightHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#0000ff', fontWeight: 'bold' },
  { tag: tags.atom, color: '#098658' },
  { tag: tags.number, color: '#098658' },
  { tag: tags.string, color: '#a31515' },
  { tag: tags.variableName, color: '#001080' },
  { tag: tags.comment, color: '#008000', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#795e26' },
  { tag: tags.propertyName, color: '#001080' },
  { tag: tags.operator, color: '#000000' },
  { tag: tags.bracket, color: '#000000' },
]);

// VS Code Dark syntax highlighting (improved from default)
const vsCodeDarkHighlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#569cd6', fontWeight: 'bold' },
  { tag: tags.atom, color: '#4ec9b0' },
  { tag: tags.number, color: '#b5cea8' },
  { tag: tags.string, color: '#ce9178' },
  { tag: tags.variableName, color: '#9cdcfe' },
  { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#dcdcaa' },
  { tag: tags.propertyName, color: '#9cdcfe' },
  { tag: tags.operator, color: '#d4d4d4' },
  { tag: tags.bracket, color: '#d4d4d4' },
]);

export interface EditorController {
  setValue: (value: string) => void;
  getValue: () => string;
  setEditable: (isEditable: boolean) => void;
  highlightLine: (lineNumber: number | null) => void;
  setTheme: (isDark: boolean) => void;
}

export function createEditorController(
  parent: HTMLElement,
  onChange?: (value: string) => void,
): EditorController {
  let activeLine: number | null = null;
  const highlightExtension = createRuntimeHighlightExtension(() => activeLine);
  const editableCompartment = new Compartment();
  const themeCompartment = new Compartment();
  const highlightCompartment = new Compartment();
  let currentValue = '';

  const view = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        lineNumbers(),
        keymap.of([...defaultKeymap, ...completionKeymap]),
        javascript(),
        autocompletion(),
        highlightCompartment.of(syntaxHighlighting(vsCodeDarkHighlight)),
        editableCompartment.of(EditorView.editable.of(true)),
        EditorView.lineWrapping,
        highlightExtension,
        themeCompartment.of(oneDark),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            currentValue = update.state.doc.toString();
            onChange?.(currentValue);
          }
        }),
      ],
    }),
    parent,
  });

  return {
    setValue(value: string) {
      if (value === currentValue) {
        return;
      }

      currentValue = value;
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
    },
    getValue() {
      return currentValue;
    },
    setEditable(isEditable) {
      view.dispatch({
        effects: editableCompartment.reconfigure(EditorView.editable.of(isEditable)),
      });
      view.contentDOM.toggleAttribute('aria-readonly', !isEditable);
    },
    highlightLine(lineNumber: number | null) {
      activeLine = lineNumber;
      view.dispatch({ effects: [] });
    },
    setTheme(isDark: boolean) {
      const theme = isDark ? oneDark : vsCodeLightTheme;
      const highlight = isDark ? syntaxHighlighting(vsCodeDarkHighlight) : syntaxHighlighting(vsCodeLightHighlight);
      view.dispatch({
        effects: [
          themeCompartment.reconfigure(theme),
          highlightCompartment.reconfigure(highlight),
        ],
      });
    },
  };
}