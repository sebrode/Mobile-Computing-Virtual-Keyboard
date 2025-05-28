import React, { useRef, useEffect } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './IDE.css';

interface CodeEditorProps {
  language?: string;
  theme?: string;
  value?: string;
  onChange?: OnChange;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language = 'python',
  theme = 'light',
  value = '',
  onChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    const ta = editor.getDomNode()?.querySelector('textarea');
    if (ta instanceof HTMLTextAreaElement) {
      ta.readOnly = true;
      ta.setAttribute('inputmode', 'none');
    }

    editor.focus();
    editor.setPosition({ lineNumber: 1, column: 1 });

    decorationsRef.current = editor.deltaDecorations([], [
      {
        range: new monaco.Range(1, 1, 1, 1),
        options: {
          className: 'custom-cursor',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      },
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.querySelector('.custom-cursor');
      if (el) el.classList.toggle('cursor-hidden');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="IDE">
      <Editor
        height="100%"
        language={language}
        value={value}
        theme={theme}
        onMount={handleMount}
        onChange={onChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          mouseWheelZoom: false,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
