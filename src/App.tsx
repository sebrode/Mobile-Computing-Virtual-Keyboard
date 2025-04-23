import { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'simple-keyboard/build/css/index.css';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [layoutName, setLayoutName] = useState<'default' | 'shift'>('default');

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
      <input
        value={input}
        placeholder="Tap on the virtual keyboard"
        onChange={onChangeInput}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1.2rem' }}
      />

      {/* Inline-block wrapper lets the keyboard shrink and center */}
      <div style={{ display: 'inline-block', marginTop: '1rem' }}>
        <Keyboard
          theme="hg-theme-default my-theme"
          layoutName={layoutName}
          onChange={setInput}
          onKeyPress={onKeyPress}
          layout={{
            default: [
              '1 2 3 4 5 6 7 8 9 0 {bksp}',
              'q w e r t y u i o p',
              'a s d f g h j k l',
              '{shift} z x c v b n m , . {shift}',
              '{space}'
            ],
            shift: [
              '! @ # $ % ^ & * ( ) _ {bksp}',
              'Q W E R T Y U I O P',
              'A S D F G H J K L',
              '{shift} Z X C V B N M < > {shift}',
              '{space}'
            ]
          }}
          display={{
            '{bksp}': '⌫',
            '{shift}': '⇧',
            '{space}': '⎵'
          }}
        />
      </div>
    </div>
  );
};

export default App;
