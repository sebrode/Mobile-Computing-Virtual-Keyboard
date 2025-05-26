// /src/Components/Keyboard/Keyboard.tsx
import React, { useState, useMemo, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "simple-keyboard/build/css/index.css";
import "./Keyboard_sofus.module.css";
import styles from "./Keyboard_sofus.module.css";

const keywords: string[] = [
  "False","None","True","and","as","assert","async","await","break",
  "class","continue","def","del","elif","else","except","finally",
  "for","from","global","if","import","in","is","lambda",
  "not","or","pass","raise","return","try","while","with","yield"
];

interface PythonKeyboardProps {
    value: string;
    onChange: (val: string) => void;
  }
  
  export default function PythonKeyboardSofus({ value, onChange }: PythonKeyboardProps) {
  const keyboardRef = useRef<KeyboardReactInterface>(null);
  // Add a state to track the current layout
  const [currentLayout, setCurrentLayout] = useState("default");
  // Add state to track if shift is temporary (one character only)
  const [isTemporaryShift, setIsTemporaryShift] = useState(false);
  
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
  
    const onKeyPress = (button: string) => {
      // Handle shift button
      if (button === "{shift}" || button === "{lock}") {
        const newLayout = currentLayout === "default" ? "shift" : "default";
        setCurrentLayout(newLayout);
        setIsTemporaryShift(newLayout === "shift"); // Mark shift as temporary
        keyboardRef.current?.setOptions({ layoutName: newLayout });
        return;
      }
      
      // Handle layout switch buttons
      if (button === "{123}") {
        setCurrentLayout("extra");
        setIsTemporaryShift(false); // Not in shift mode
        keyboardRef.current?.setOptions({ layoutName: "extra" });
        return;
      }
      
      if (button === "{abc}") {
        setCurrentLayout("default");
        setIsTemporaryShift(false); // Not in shift mode
        keyboardRef.current?.setOptions({ layoutName: "default" });
        return;
      }

      // Handle suggestions
      if (suggestions.includes(button)) {
        handleSuggestionClick(button);
        return;
      }

      // Handle enter key
      if (button === "{enter}" || button === "{ghost}") {
        const newVal = value + "\n";
        onChange(newVal);
        keyboardRef.current?.setInput(newVal);
        return;
      }

      // If we're in temporary shift mode and pressed a regular key,
      // return to default layout after this keypress
      if (isTemporaryShift && !button.startsWith("{")) {
        // Use setTimeout to ensure the current key is processed before changing layout
        setTimeout(() => {
          setCurrentLayout("default");
          setIsTemporaryShift(false);
          keyboardRef.current?.setOptions({ layoutName: "default" });
        }, 10);
      }
    };
  
    const handleChange = (next: string) => {
      onChange(next);
      
      // Only ensure layout is maintained if we're not in temporary shift mode
      // or if we're in a non-shift layout
      if (!isTemporaryShift || currentLayout !== "shift") {
        keyboardRef.current?.setOptions({ layoutName: currentLayout });
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
          layoutName={currentLayout} // Use the tracked current layout
          layout={{
            default: [
              "! \" # & / ( ) [ ] { } = + *",
              "q w e r t y u i o p",
              "{tab} a s d f g h j k l",
              "{shift} < > z x c v b n m , . {bksp}",
              "{123} {space} {enter}"
            ],
            shift: [
              "! \" # & / ( ) [ ] { } = +",
              "Q W E R T Y U I O P" ,
              "{tab} A S D F G H J K L",
              "{shift} < > Z X C V B N M ; : {bksp}",
              "{123} {space} {enter}"
            ],
            
            extra: [
              "1 2 3 4 5 6 7 8 9 0",
              "- / : ; ( ) & \" ' ` ~",
              "{tab} [ ] \{ \} # % ^ * + =",
              "{shift} _ \\ | ~ < > $ . , ? ! ' {bksp}",
              "{abc} {space} {enter}"  // Changed from {default} to {abc}
            ]
          }}
          display={{"{abc}": "abc", "{bksp}": "⌫", "{shift}": "⇧", "{space}": "⎵", "{extra}": "++", "{enter}": "⏎","{tab}":"⇥", "{123}": "123", "{ghost}":"ghost", "{ghost2}":"ghost"} }
          buttonTheme={[  
            {
              class: styles.shiftKey, // Apply a custom style for special keys
              buttons: "{shift}"
            },
            {
              class: styles.defaultKeys, // Apply a default style for regular keys
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
              class: styles.enterKey, // Apply a custom style for suggestion keys
              buttons: "{enter}"
            },
            {
              class: styles.ghostKey,
              buttons: "{ghost}"
            },
            {
              class: styles.ghost2Key,
              buttons: "{ghost2}"
            },
            {
              class: styles.spaceKey,
              buttons: "{space}"
            },
            {
              class: styles.defaultKey,
              buttons: "{default}"
            },
            {
              class: styles.defaultKey,
              buttons: "{abc}"  // Add the abc button to use the same styling as the default button
            },
            {
              class: styles.enterKey,
              buttons: "{enter}"  // Add the abc button to use the same styling as the default button
            }
            



          ]}
        />
      </div>
    );
  }