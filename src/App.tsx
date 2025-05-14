// App.tsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import CodeEditor from './Components/IDE/IDE';
import PythonKeyboard from './Components/Keyboard/Keyboard';
import PythonKeyboardSofus from './Components/Keyboard/Keyboard_sofus';
import PythonKeyboardNaomi from './Components/Keyboard/Keyboard_naomi';
import PythonKeyboardGustav from './Components/Keyboard/Keyboard_gustav';

const App: React.FC = () => {
  const [code, setCode] = useState('// Write your Python here');

  // A small helper to render editor + one keyboard
  const EditorWith = (Keyboard: React.FC<{value: string; onChange: (v: string) => void;}>) => (
    <>
      <CodeEditor value={code} onChange={v => setCode(v || '')} language="python" />
      <Keyboard value={code} onChange={setCode} />
    </>
  );

  return (
    <div className="App">
      <main className="App__main">
        <Routes>
          {/* default route: "/" → editor + default keyboard */}
          <Route
            path="/"
            element={EditorWith(PythonKeyboard)}
          />

          {/* "/sofus" → editor + Sofus keyboard */}
          <Route
            path="/sofus"
            element={EditorWith(PythonKeyboardSofus)}
          />

          {/* "/naomi" → editor + Naomi keyboard */}
          <Route
            path="/naomi"
            element={EditorWith(PythonKeyboardNaomi)}
          />

          {/* "/gustav" → editor + Naomi keyboard */}
          <Route
            path="/gustav"
            element={EditorWith(PythonKeyboardGustav)}
          />

          {/* catch-all: redirect unknown paths back to "/" */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
