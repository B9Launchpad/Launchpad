import { useState, KeyboardEvent } from 'react';
import useLastInteractionKeyboard from '@functions/useLastInteractionKeyboard';

interface UseKeyboardListNavigationProps<T> {
  items: T[];
  onSelect?: (item: T, index: number) => void;
  initialFocusedIndex?: number;
}

export function useKeyboardListNavigation<T>({
  items,
  onSelect,
  initialFocusedIndex = 0
}: UseKeyboardListNavigationProps<T>) {
  const [focusedIndex, setFocusedIndex] = useState(initialFocusedIndex);
  const [hasFocus, setHasFocus] = useState(false);
  const lastInteractionWasKeyboard = useLastInteractionKeyboard();

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onSelect && items[focusedIndex]) {
        onSelect(items[focusedIndex], focusedIndex);
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setFocusedIndex(items.length - 1);
    }
  };

  const handleFocus = () => {
    if (lastInteractionWasKeyboard) {
      setHasFocus(true);
    }
  };

  const handleBlur = () => {
    setHasFocus(false);
  };

  const resetFocus = () => {
    setFocusedIndex(initialFocusedIndex);
  };

  return {
    focusedIndex,
    setFocusedIndex,
    hasFocus,
    handleKeyDown,
    handleFocus,
    handleBlur,
    resetFocus
  };
}