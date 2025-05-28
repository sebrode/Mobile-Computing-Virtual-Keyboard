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

const accentButtons = Object.keys(accentMap).join(' ');

interface PythonKeyboardProps {
  value: string;
  onChange: (val: string) => void;
}

export default function PythonKeyboardGustav({ value, onChange }: PythonKeyboardProps) {
  const keyboardRef = useRef<KeyboardReactInterface>(null);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [showAccentMenu, setShowAccentMenu] = useState(false);
  const [accentOptions, setAccentOptions] = useState<string[]>([]);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  const pressedKeysRef = useRef<Set<string>>(new Set());
  const popupTriggeredRef = useRef<Set<string>>(new Set());
  const holdTimeoutRef = useRef<{ [key: string]: number | undefined }>({});
  const isHoldingRef = useRef<{ [key: string]: boolean }>({});
  const [activeTarget, setActiveTarget] = useState<HTMLElement | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState<"default" | "shift" | "extra">("default");
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const shiftTimeoutRef = useRef<number>(0);

  const canVibrate = typeof navigator !== "undefined" && "vibrate" in navigator;

  useEffect(() => {
    keyboardRef.current?.setOptions({ layoutName });
  }, [layoutName]);

  const resetPopupState = (button?: string) => {
    if (button) {
      isHoldingRef.current[button] = false;
      popupTriggeredRef.current.delete(button);
      if (holdTimeoutRef.current[button]) {
        clearTimeout(holdTimeoutRef.current[button]);
        holdTimeoutRef.current[button] = undefined;
      }
      pressedKeysRef.current.delete(button);
    } else {
      // Reset everything
      isHoldingRef.current = {};
      popupTriggeredRef.current.clear();
      Object.keys(holdTimeoutRef.current).forEach(key => {
        clearTimeout(holdTimeoutRef.current[key]);
        holdTimeoutRef.current[key] = undefined;
      });
      pressedKeysRef.current.clear();
    }

    setShowAccentMenu(false);
    setLastKeyPressed(null);
    setSelectedAccent(null);
  };

  function triggerHaptic(pattern: number = 10) {
    if (canVibrate) navigator.vibrate(pattern);
  }

  const suggestions = useMemo(() => {
    triggerHaptic(20)
    const token = value.split(/\s+/).pop()?.toLowerCase() || "";
    if (!token) return [];
    return keywords
      .filter(k => k.toLowerCase().startsWith(token))
      .slice(0, 8);
  }, [value]);

  const handleSuggestionClick = (word: string) => {
    triggerHaptic(20)
    const newVal = value.replace(/\S*$/, word + " ");
    onChange(newVal);
    keyboardRef.current?.setInput(newVal);
  };

  const insertCharacter = (char: string) => {
    triggerHaptic(20)
    console.log("Inserting character:", char);
    const newVal = value + char;
    onChange(newVal);
    keyboardRef.current?.setInput(newVal);
  };

  const handleControlKey = (button: string) => {
    triggerHaptic(20)
    if (button === "{shift}") {
      const now = Date.now();
      const timeSinceLastTap = now - shiftTimeoutRef.current;
      console.log("now:", now);
      console.log("shiftTimeoutRef.current:", timeSinceLastTap);
      if (timeSinceLastTap < 300) {
        // Double-tap detected
        setCapsLockActive(true);
        setLayoutName("shift");
        setIsShiftActive(true);
      }
      else if (capsLockActive) {
        // Turn off caps lock
        setLayoutName("default");
        setCapsLockActive(false);
      } 
      else if (isShiftActive) {
        // Activate caps lock on double press
        setLayoutName("default");
        setCapsLockActive(false);
        setIsShiftActive(false);
      } 
      else {
        // Activate shift temporarily
        setLayoutName("shift");
        setIsShiftActive(true);
      }
      shiftTimeoutRef.current = now;
    } else if (button === "{extra}") {
      if (layoutName === "default" || layoutName === "shift") {
        setLayoutName("extra");
        setIsShiftActive(false);
        setCapsLockActive(false);
      }
    } else if (button === "{default}") {
      if (layoutName === "extra") {
        setLayoutName("default");
        setIsShiftActive(false);
        setCapsLockActive(false);
      }
    } else if (button === "{enter}") {
      const newVal = value + "\n";
      onChange(newVal);
      keyboardRef.current?.setInput(newVal);
    } else if (button === "{space}") {
      const newVal = value + " ";
      onChange(newVal);
      keyboardRef.current?.setInput(newVal);
    } else if (button === "{bksp}") {
      const newVal = value.slice(0, -1);
      onChange(newVal);
      keyboardRef.current?.setInput(newVal);
    }
  };

  const onKeyPress = (button: string) => {
    console.log("Pressed button:", button);

    if (pressedKeysRef.current.has(button)) return;
    pressedKeysRef.current.add(button);
    isHoldingRef.current[button] = true;

    if (button.startsWith("{")) {
      handleControlKey(button);
      return;
    }

    setLastKeyPressed(button);

    // If shift is active but not caps lock, deactivate shift after one key press

    if (accentMap[button]) {
      popupTriggeredRef.current.delete(button);

      if (holdTimeoutRef.current[button]) {
        clearTimeout(holdTimeoutRef.current[button]);
      }

      const buttonElement = document.querySelector(`[data-skbtn="${CSS.escape(button)}"]`);
      const container = document.querySelector(".pythonKeyboard__container");
      if (buttonElement && container) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const relativeLeft = buttonRect.left - containerRect.left;
        const relativeTop = buttonRect.top - containerRect.top;
        const buttonWidth = buttonRect.width;

        // Calculate popup dimensions
        const accentCount = accentMap[button].length;
        const accentButtonWidth = 40;
        const totalPopupWidth = accentCount * accentButtonWidth;

        // Position popup so its right edge aligns with the original key's right edge
        const popupLeft = relativeLeft + buttonWidth - totalPopupWidth;

        // Position popup above the key
        const popupTop = relativeTop - 95;

        setPopupPosition({ left: popupLeft, top: popupTop });
      }

      holdTimeoutRef.current[button] = window.setTimeout(() => {
        if (isHoldingRef.current[button]) {
          setAccentOptions(accentMap[button]);
          setShowAccentMenu(true);
          popupTriggeredRef.current.add(button);
        }
      }, 500);
    }
  };

  const onKeyReleased = (button: string) => {
    if (isShiftActive && !capsLockActive && button !== "{shift}") {
      setLayoutName("default");
      setIsShiftActive(false);
    }

    const isInsidePopup = popupRef.current?.contains(activeTarget || null);

    if (showAccentMenu && (isInsidePopup || selectedAccent)) {
      // User selected a popup option or is dragging over popup → handled by touch events
      return;
    } else {
      // Handle keys with accents
      if (accentMap[button]) {
        if (!showAccentMenu) {
          // Popup was not shown, insert the original key
          insertCharacter(button);
        }
        // If popup was shown, character insertion is handled by touch events
      } else {
        // Handle keys WITHOUT accents - insert the character immediately
        if (!button.startsWith("{")) {
          insertCharacter(button);
        }
      }
    }
    if (layoutName === "shift" && !capsLockActive && !button.startsWith("{") && button !== "{extra}") {
      const now = Date.now();
      const timeSinceLastTap = now - shiftTimeoutRef.current;

      if (timeSinceLastTap > 300) {
        // Not a double-tap → reset shift
        setLayoutName("default");
      }
    }

    resetPopupState(button);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        resetPopupState();
      }
    };

    if (showAccentMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showAccentMenu]);

  useEffect(() => {
    if (showAccentMenu && popupRef.current && popupPosition) {
      const popup = popupRef.current;
      const popupRect = popup.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (popupRect.right > viewportWidth) {
        const overflow = popupRect.right - viewportWidth;
        const newLeft = popupPosition.left - overflow;
        popup.style.left = `${newLeft}px`;
      }
    }
  }, [showAccentMenu, popupPosition]);

  useEffect(() => {
    Object.entries(accentMap).forEach(([key, accents]) => {
      const buttonEl = document.querySelector(`[data-skbtn="${key}"]`);
      if (buttonEl && accents.length > 0) {
        (buttonEl as HTMLElement).setAttribute("data-accent", accents[0]);
      }
    });
  }, [layoutName]);

  useEffect(() => {
    const handleMove = (e: PointerEvent | TouchEvent) => {
      let target: HTMLElement | null = null;

      if (e instanceof TouchEvent && e.touches.length > 0) {
        const touch = e.touches[0];
        target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
      } else if (e instanceof PointerEvent) {
        target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      }

      // Store the target for later use
      setActiveTarget(target);

      if (popupRef.current && target && popupRef.current.contains(target)) {
        const char = target.textContent?.trim() || null;
        if (char) {
          setSelectedAccent(char);
        }
      } else {
        setSelectedAccent(null);
      }
    };

    const handleEnd = (e: PointerEvent | TouchEvent) => {
      let finalSelected: string | null = selectedAccent;

      // For touch events, use the stored activeTarget or get the final position
      if (!finalSelected && e instanceof TouchEvent && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;

        if (popupRef.current && target && popupRef.current.contains(target)) {
          finalSelected = target.textContent?.trim() || null;
        }
      }

      // Also check the stored activeTarget as fallback
      if (!finalSelected && activeTarget && popupRef.current?.contains(activeTarget)) {
        finalSelected = activeTarget.textContent?.trim() || null;
      }

      // Insert the selected character or fallback to original key
      if (finalSelected) {
        insertCharacter(finalSelected);
      } else if (lastKeyPressed) {
        insertCharacter(lastKeyPressed);
      }

      // Reset popup state after a short delay
      setTimeout(() => {
        resetPopupState();
        setActiveTarget(null);
      }, 50);
    };

    if (showAccentMenu) {
      // Use both pointer and touch events for better cross-device compatibility
      window.addEventListener("pointermove", handleMove, { passive: true });
      window.addEventListener("touchmove", handleMove, { passive: true });
      window.addEventListener("pointerup", handleEnd);
      window.addEventListener("touchend", handleEnd);

      // Also handle touch cancel events
      window.addEventListener("touchcancel", handleEnd);
    }

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [showAccentMenu, selectedAccent, lastKeyPressed, activeTarget]);

  return (
    <div className="pythonKeyboard__container" style={{height: "auto"}}>
      <div className="pythonKeyboard__suggestions">
        {suggestions.map(w => (
          <button key={w} type="button" onClick={() => handleSuggestionClick(w)}>
            {w}
          </button>
        ))}
      </div>

      <div style={{ position: "relative" }} className={`${styles.keyboardWrapper} ${capsLockActive ? styles.capsLockActive : ''}`}>
        <Keyboard
          keyboardRef={r => (keyboardRef.current = r)}
          onKeyPress={onKeyPress}
          onKeyReleased={onKeyReleased}
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
              "[ ] { } # % ^ * + =",
              "- _ | ~ ! ? $ {bksp}",
              "{default} {space} {enter}"
            ]
          }}
          buttonTheme={[
            {
              class: styles.specialKey,
              buttons: '{shift}'
            },
            {
              class: styles.specialKey,
              buttons: "{bksp}"
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
                className={`${styles.accentButton} ${
                  selectedAccent === accentChar ? styles.accentButtonActive : ""
                }`}
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
