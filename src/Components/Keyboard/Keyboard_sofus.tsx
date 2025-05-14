// /src/Components/Keyboard/Keyboard.tsx
import React, { useState, useMemo, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "simple-keyboard/build/css/index.css";
import "./Keyboard_sofus.module.css";
import styles from "./Keyboard_sofus.module.css";

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
  
  export default function PythonKeyboardSofus({ value, onChange }: PythonKeyboardProps) {
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
      if (button === "{shift}" || button === "{lock}") {
        const currentLayout = keyboardRef.current?.options.layoutName;
        const newLayout = currentLayout === "default" ? "shift" : "default";
        keyboardRef.current?.setOptions({ layoutName: newLayout });
        return;
      }
      if (button === "{123}" || button === "{default}") {
        const currentLayout = keyboardRef.current?.options.layoutName;
        const newLayout = currentLayout === "default" ? "extra" : "default";
        keyboardRef.current?.setOptions({ layoutName: newLayout });
        return;
      }
    
      if (suggestions.includes(button)) handleSuggestionClick(button);
    
      if (button === "{enter}" || button === "{ghost}") {
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
              "! \" # & / ( ) [ ] { } = +",
              "q w e r t y u i o p {ghost}", // ← Move Enter up here
              "{tab} a s d f g h j k l {enter}",
              "{shift} < > z x c v b n m , . {bksp}",
              "{123} {space}"        // ← add enter here
            ],
            shift: [
              "1 2 3 4 5 6 7 8 9 0",
              "Q W E R T Y U I O P",
              "A S D F G H J K L {enter}",  // ← Add Enter here
              "{shift} Z X C V B N M < > {bksp}",
              "{extra} {space}"
            ],
            
            extra: [
              "! @ # $ % ^ & * ( ) _",
              "- / : ; ( ) kr & @ \"",
              "[ ] \\{ \\} # % ^ * + =",
              "{shift} _ \\ | ~ < > $ . , ? ! ' {enter} {bksp}",  // ← Add Enter here too
              "{default} {space}"
            ]
          }}
          display={{ "{bksp}": "⌫", "{shift}": "⇧", "{space}": "⎵", "{extra}": "++", "{enter}": "⏎","{tab}":"⇥", "{123}": "123", "{ghost}":"ghost", "{ghost2}":"ghost"} }
          buttonTheme={[  
            {
              class: styles.shiftKey, // Apply a custom style for special keys
              buttons: "{shift}"
            },
            {
              class: styles.defaultKey, // Apply a default style for regular keys
              buttons: "q w e r t y u i o p a s d f g h j k l z x c v b n m"
            },
            {
             class: styles.emptyKey, 
             buttons: "{empty}"
            },
            {
              class: styles.extraKey, // Apply a custom style for suggestion keys
              buttons: "{123}"
            },
            {
              class: styles.ghostKey,
              buttons: "{ghost}"
            },
            {
              class: styles.ghost2Key,
              buttons: "{ghost2}"
            }
          ]}
        />
      </div>
    );
  }