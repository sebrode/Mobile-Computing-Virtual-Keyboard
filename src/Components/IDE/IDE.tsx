import React from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';

interface CodeEditorProps {
  language?: string;
  theme?: string;
  value?: string;
  onChange?: OnChange;
  onMount?: OnMount;
}


const CodeEditor: React.FC<CodeEditorProps> = ({
    language = 'python',
    theme = 'light',
    value = '',
    onChange,
  }) => {
    const handleMount: OnMount = (editor, monaco) => {
      // grab the hidden <textarea> that Monaco uses internally
      const ta = editor.getDomNode()?.querySelector('textarea');
      if (ta instanceof HTMLTextAreaElement) {
        ta.readOnly = true;            // iOS
        ta.setAttribute('inputmode', 'none'); // Android/Chrome
      }
    }
  
    return (
      <div className="IDE">
        <Editor
       height="100%"
       language={language}
       value={value}
       theme={theme}
      onMount={editor => {
        // also prevent wheel on the hidden textarea
        const ta = editor.getDomNode()?.querySelector('textarea');
        if (ta instanceof HTMLTextAreaElement) {
          ta.readOnly = true;
          ta.setAttribute('inputmode', 'none');
        }
      }}
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