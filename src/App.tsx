import React, { useState, useMemo, useRef } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "simple-keyboard/build/css/index.css";

const keywords: string[] = [
  "False","None","True","and","as","assert","async","await","break",
  "class","continue","def","del","elif","else","except","finally",
  "for","from","global","if","import","in","is","lambda","nonlocal",
  "not","or","pass","raise","return","try","while","with","yield"
];

const SUGGESTION_ROW_HEIGHT = 48; // px, adjust as needed

export default function App() {
  const [input, setInput] = useState<string>("");
  const [layoutName, setLayoutName] = useState<"default" | "shift" | "extra">("default");

  const keyboardRef = useRef<KeyboardReactInterface>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute suggestions based on last token
  const suggestions = useMemo(() => {
    const token = input.split(/\s+/).pop()?.toLowerCase() || "";
    if (!token) return [];
    return keywords
      .filter(k => k.toLowerCase().startsWith(token))
      .slice(0, 8);
  }, [input]);

  // Handler for suggestion clicks
  const handleSuggestionClick = (word: string) => {
    const newInput = input.replace(/\S*$/, word + " ");
    setInput(newInput);
    keyboardRef.current?.setInput(newInput);
    inputRef.current?.focus();
  };

  // Mirror keyboard changes to React state
  const handleChange = (next: string) => {
    setInput(next);
  };

  // Handle shift toggle and suggestion clicks
  const onKeyPress = (button: string) => {
    // shift / caps
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
      return;
    }

    // go to your extra symbols page
    if (button === "{extra}") {
      setLayoutName("extra");
      return;
    }

    // and a way back to letters
    if (button === "{default}") {
      setLayoutName("default");
      return;
    }
    if (suggestions.includes(button)) {
      const newInput = input.replace(/\S*$/, button + " ");
      setInput(newInput);
      keyboardRef.current?.setInput(newInput);
      inputRef.current?.focus();
      return;
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", textAlign: "center", bottom: "0" }}>
      {/* Real text input */}
      <input
        ref={inputRef}
        value={input}
        onChange={e => {
          setInput(e.target.value);
          keyboardRef.current?.setInput(e.target.value);
        }}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1.2rem",
          boxSizing: "border-box"
        }}
        placeholder="Type or tap below…"
      />

      {/* Suggestion row - fixed height */}
      <div
        style={{
          height: `${SUGGESTION_ROW_HEIGHT}px`,           
          margin: "0.5rem 0",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          overflowX: "auto",
          gap: "0.5rem",
          bottom: "0",
        }}
      >
        {suggestions.map(w => (
          <button
            key={w}
            type="button"
            onClick={() => handleSuggestionClick(w)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.25rem",
              border: "1px solid #ccc",
              background: "#f9f9f9",
              cursor: "pointer",
              fontSize: "1rem",
              flex: "0 0 auto"
            }}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Virtual keyboard */}
      <Keyboard
        keyboardRef={r => (keyboardRef.current = r)}
        onChange={handleChange}
        onKeyPress={onKeyPress}
        layoutName={layoutName}
        layout={{
          default: [
            "! @ # $ % ^ & * ( ) _ ",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m , . {bksp}",
            "{space}"
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
            "[ ] \{ \} # % ^ * + =",
            "{shift} _ \\ | ~ < > $ . , ? ! \' {bksp}",
            "{default} {space}"
          ]
        }}
        display={{ "{bksp}": "⌫", "{shift}": "⇧", "{space}": "⎵", "{extra}": "++" }}
      />
    </div>
  );
}
