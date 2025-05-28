// App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import CodeEditor from './Components/IDE/IDE';
import PythonKeyboard from './Components/Keyboard/Keyboard';
import PythonKeyboardSofus from './Components/Keyboard/Keyboard_sofus';
import PythonKeyboardNaomi from './Components/Keyboard/Keyboard_naomi';
import PythonKeyboardGustav from './Components/Keyboard/Keyboard_gustav';
import PythonKeyboardUltimate from './Components/Keyboard/Keyboard_ultimate';

const App: React.FC = () => {
  const [code, setCode] = useState('');
  const placeholder = '// Write your Python here';

  const location = useLocation();
  // Set page title based on route
  useEffect(() => {
    const routeTitles = {
      '/': 'Default Python Keyboard',
      '/sofus': 'Sofus Keyboard',
      '/naomi': 'Naomi Keyboard',
      '/gustav': 'Gustav Keyboard',
      '/ultimate': 'Ultimate Keyboard'
    };

    document.title = routeTitles[location.pathname as keyof typeof routeTitles] || 'Python Editor';
  }, [location.pathname]);

  // A small helper to render editor + one keyboard
  const EditorWith = (Keyboard: React.FC<{ value: string; onChange: (v: string) => void }>) => (
    <>
      <CodeEditor
        value={code || placeholder}
        onChange={(v) => setCode(v || '')}
        language="python"
        className={code ? '' : 'placeholder'}
      />
      <Keyboard value={code} onChange={setCode} />
    </>
  );

  return (
    <div className="App">
      <main className="App__main">
        <Routes>
          {/* default route: "/" → editor + default keyboard */}
          <Route path="/" element={EditorWith(PythonKeyboard)} />

          {/* "/sofus" → editor + Sofus keyboard */}
          <Route path="/sofus" element={EditorWith(PythonKeyboardSofus)} />

          {/* "/naomi" → editor + Naomi keyboard */}
          <Route path="/naomi" element={EditorWith(PythonKeyboardNaomi)} />

          {/* "/gustav" → editor + Gustav keyboard */}
          <Route path="/gustav" element={EditorWith(PythonKeyboardGustav)} />

          {/* "/ultimate" → editor + Ultimate keyboard */}
          <Route path="/ultimate" element={EditorWith(PythonKeyboardUltimate)} />

          {/* catch-all: redirect unknown paths back to "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
