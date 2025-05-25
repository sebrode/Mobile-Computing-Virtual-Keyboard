import React, { useState, useMemo, useRef, useEffect } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "simple-keyboard/build/css/index.css";
import styles from "./Keyboard_gustav.module.css";

const keywords: string[] = [
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"
];

const accentMap: { [key: string]: string[] } = {
  q: ['<'],
  w: ['>'],
  e: ['"'],
  r: ['#'],
  t: ['{'],
  y: ['}'],
  u: ['['],
  i: [']'],
  o: ['('],
  p: [')'],
  z: ['!'],
  x: ['+'],
  c: ['-'],
  v: ['*'],
  b: ['/'],
  n: ['%'],
  m: ['='],
  ',': [';'],
  '.': [':'],
  Q: ['<'],
  W: ['>'],
  E: ['"'],
  R: ['#'],
  T: ['{'],
  Y: ['}'],
  U: ['['],
  I: [']'],
  O: ['('],
  P: [')'],
  Z: ['!'],
  X: ['+'],
  C: ['-'],
  V: ['*'],
  B: ['/'],
  N: ['%'],
  M: ['='],
};
// const accentButtons = Object.keys(accentMap).flatMap(key => [key, key.toUpperCase()]).join(' ');
const accentButtons = Object.keys(accentMap).filter(key => !['.', ','].includes(key)).join(' ');

interface PythonKeyboardProps {
  value: string;
  onChange: (val: string) => void;
}

export default function PythonKeyboardGustav({ value, onChange }: PythonKeyboardProps) {
  const keyboardRef = useRef<KeyboardReactInterface>(null);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [showAccentMenu, setShowAccentMenu] = useState(false);
  const [accentOptions, setAccentOptions] = useState<string[]>([]);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [buttonPressed, setButtonPressed] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState<"default" | "shift" | "extra">("default");



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

  const insertCharacter = (char: string) => {
    const newVal = value + char;
    onChange(newVal);
    keyboardRef.current?.setInput(newVal);
  };

  const onKeyRelease = (button: string) => {
    setLastKeyPressed(button);
    if (button.startsWith("{")) {
      return
    }

    if (accentMap[button]) {
      // Get the location of the popup relative to the button
      const buttonElement = document.querySelector(`[data-skbtn="${button}"]`);
      if (buttonElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const parentDiv = buttonElement.closest('div[style*="position: relative"]');
        if (parentDiv) {
          const parentRect = parentDiv.getBoundingClientRect();
          const relativeLeft = buttonRect.left - parentRect.left;
          const relativeTop = buttonRect.top - parentRect.top;
          const buttonWidth = buttonRect.width;

          // Calculate initial position to center first accent button
          const firstAccentWidth = 40;
          const popupLeft = relativeLeft + buttonWidth / 2 - firstAccentWidth / 2;
          const popupTop = relativeTop - 58; // Position above the key

          setPopupPosition({ left: popupLeft, top: popupTop });
        }
      }

      // setTimeout(() => {
      if (pressStartTime !== null) {
        const heldTime = Date.now() - (pressStartTime || 0);

        if (heldTime >= 300) {
          setAccentOptions(accentMap[button]);
          setShowAccentMenu(true);
        } else {
          // If the button was not held long enough, insert the character
          insertCharacter(button);
        }
      }
      // }, 300);
      setPressStartTime(null);
      setButtonPressed(null);
    } else {
      insertCharacter(button);
    }

  };

  const onKeyPress = (button: string) => {
    if (button.startsWith("{")) {
      return handleControlKey(button);
    }
    setButtonPressed(button);
    if (buttonPressed != button || buttonPressed === null) {
      setPressStartTime(Date.now());
    }
  };

  const handleControlKey = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      const currentLayout = keyboardRef.current?.options.layoutName;
      const newLayout = currentLayout === "default" ? "shift" : "default";
      setLayoutName(newLayout);
      keyboardRef.current?.setOptions({ layoutName: newLayout });
    } else if (button === "{extra}" || button === "{default}") {
      const currentLayout = keyboardRef.current?.options.layoutName;
      const newLayout = currentLayout === "default" ? "extra" : "default";
      setLayoutName(newLayout);
      keyboardRef.current?.setOptions({ layoutName: newLayout });
    } else if (button === "{enter}") {
      const newVal = value + "\n";
      onChange(newVal);
      keyboardRef.current?.setInput(newVal);
    } else if (button === "{bksp}") {
      const newVal = value.slice(0, -1);
      onChange(newVal);
      keyboardRef.current?.setInput(newVal);
    }
  };

  useEffect(() => {
    Object.entries(accentMap).forEach(([key, accents]) => {
      const buttonEl = document.querySelector(`[data-skbtn="${key}"]`);
      if (buttonEl && accents.length > 0) {
        (buttonEl as HTMLElement).setAttribute("data-accent", accents[0]);
      }
    });
  }, [layoutName]);
  

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  //     if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
  //       setShowAccentMenu(false);
  //       setLastKeyPressed(null);
  //     }
  //   };

  //   if (showAccentMenu) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //     document.addEventListener("touchstart", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //     document.removeEventListener("touchstart", handleClickOutside);
  //   };
  // }, [showAccentMenu]);

  // useEffect(() => {
  //   if (showAccentMenu && popupRef.current && popupPosition) {
  //     const popup = popupRef.current;
  //     const popupRect = popup.getBoundingClientRect();
  //     const viewportWidth = window.innerWidth;

  //     if (popupRect.right > viewportWidth) {
  //       const overflow = popupRect.right - viewportWidth;
  //       const newLeft = popupPosition.left - overflow;
  //       popup.style.left = `${newLeft}px`;
  //     }
  //   }
  // }, [showAccentMenu, popupPosition]);

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

      <div style={{ position: "relative" }}>
        
        <Keyboard
          keyboardRef={r => (keyboardRef.current = r)}
          onKeyPress={onKeyPress}
          onKeyReleased={onKeyRelease}
          // preventMouseDownDefault={true}
          layoutName={layoutName}
        
          layout={{
            default: [
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "{shift} z x c v b n m {bksp}",
              "{extra} {space} , . {enter}"
            ],
            shift: [
              "Q W E R T Y U I O P",
              "A S D F G H J K L",
              "{shift} Z X C V B N M {bksp}",
              "{extra} {space} , . {enter}"
            ],
            extra: [
              "1 2 3 4 5 6 7 8 9 0",
              "[ ] \\{ \\} # % ^ * + =",
              "_ \\ | ~ < > $ {bksp}",
              "{default} {space} {enter}"
            ]
          }}
          buttonTheme={[
            {
              class: styles.specialKey,
              buttons: "{bksp} {shift}"
            },
            {
              class: styles.enterKey,
              buttons: "{enter}"
            },
            {
              class: styles.extraKey,
              buttons: "{extra} {default}"
            },
            {
              class: styles.punctuationKey,
              buttons: ", ."
            },
            {
              class: styles.accentedKey,
              buttons: accentButtons
            }
          ]}
          display={{
            "{bksp}": "⌫",
            "{shift}": "⇧",
            "{space}": "⎵",
            "{extra}": "123",
            "{enter}": "⏎",
            "{default}": "ABC"
          }}
        />

        {showAccentMenu && lastKeyPressed && (
          <div
            ref={popupRef}
            className={styles.accentPopup}
            style={{ top: popupPosition?.top, left: popupPosition?.left }}
          >
            {accentOptions.map((accentChar) => (
              <button
                key={accentChar}
                onClick={() => {
                  insertCharacter(accentChar);
                  setShowAccentMenu(false);
                  setLastKeyPressed(null);
                }}
                className={styles.accentButton}
              >
                {accentChar}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}