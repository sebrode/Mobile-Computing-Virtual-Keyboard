// /src/Components/Keyboard/Keyboard.tsx
import React, { useState, useMemo, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "simple-keyboard/build/css/index.css";

const keywords: string[] = [
  "False","None","True","and","as","assert","async","await","break",
  "class","continue","def","del","elif","else","except","finally",
  "for","from","global","if","import","in","is","lambda","nonlocal",
  "not","or","pass","raise","return","try","while","with","yield"
];

interface PythonKeyboardProps {
    value: string;
    onChange: (val: string) => void;
  }
  
  export default function PythonKeyboard({ value, onChange }: PythonKeyboardProps) {
    const keyboardRef = useRef<KeyboardReactInterface>(null);
  
    const suggestions = useMemo(() => {
      const token = value.split(/\s+/).pop()?.toLowerCase() || "";
      if (!token) return [];
      return keywords
        .filter(k => k.toLowerCase().startsWith(token))
        .slice(0, 8);
    }, [value]);
  
    const handleSuggestionClick = (word: string) => {
      const newVal = value.replace(/\S*$/, word + " ");
      onChange(newVal);
      keyboardRef.current?.setInput(newVal);
    };
  
    const handleChange = (next: string) => {
      onChange(next);
    };
  
    const onKeyPress = (button: string) => {
      if (button === "{shift}" || button === "{lock}") return;
      if (suggestions.includes(button)) handleSuggestionClick(button);
      if (button === "{enter}") {
        const newVal = value + "\n";
        onChange(newVal);
        keyboardRef.current?.setInput(newVal);
        return;
      }
    };
  
    return (
      <div className="pythonKeyboard__container">
        <div className="pythonKeyboard__suggestions">
          {suggestions.map(w => (
            <button
              key={w}
              type="button"
              onClick={() => handleSuggestionClick(w)}
            >
              {w}
            </button>
          ))}
        </div>
  
        <Keyboard
          keyboardRef={r => (keyboardRef.current = r)}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          layoutName="default"
          layout={{
            default: [
                "! @ # $ % ^ & * ( ) _",
                "q w e r t y u i o p å",
                "a s d f g h j k l æ ø",
                "{shift} z x c v b n m , . {bksp}",
                "{space} {enter}"          // ← add enter here
            ],
            shift: [
              "1 2 3 4 5 6 7 8 9 0",
              "Q W E R T Y U I O P",
              "A S D F G H J K L",
              "{shift} Z X C V B N M < > {bksp}",
              "{extra} {space}"
            ],
            extra: [
              "! @ # $ % ^ & * ( ) _",
              "- / : ; ( ) kr & @ \"",
              "[ ] \\{ \\} # % ^ * + =",
              "{shift} _ \\ | ~ < > $ . , ? ! ' {bksp}",
              "{default} {space}"
            ]
          }}
          display={{ "{bksp}": "⌫", "{shift}": "⇧", "{space}": "⎵", "{extra}": "++", "{enter}": "⏎", }}
        />
      </div>
    );
  }