import React, { useState } from 'react';
import './App.css';
import CodeEditor from './Components/IDE/IDE';
import PythonKeyboard from './Components/Keyboard/Keyboard';

const App: React.FC = () => {
  const [code, setCode] = useState('// Write your Python here');

  return (
    <div className="App">
      <main className="App__main">
        <CodeEditor
          value={code}
          onChange={v => setCode(v || '')}
          language="python"
        />
        <PythonKeyboard value={code} onChange={setCode} />
      </main>
    </div>
  );
};

export default App;
