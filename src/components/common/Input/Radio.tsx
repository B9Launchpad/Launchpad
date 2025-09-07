import React, { useEffect, useState, useRef } from "react";
import IconCheck from "../../icons/Input/Check";
import IconMinus from "../../icons/Input/Minus";
import useLastInteractionKeyboard from "../../../functions/useLastInteractionKeyboard";

interface RadioOption {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  description?: string;
}

interface RadioProps {
  options: RadioOption[];
  label?: string;
  description?: string;
  onToggle: (selected: string | number) => void;
}

const InputRadio: React.FC<RadioProps> = ({
  options,
  label,
  description,
  onToggle,
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(() => {
    const selected = options.find(opt => opt.selected);
    return selected?.id ?? null;
  });
  const [focusedIndex, setFocusedIndex] = useState(0);
  const groupRef = useRef<HTMLDivElement>(null);
  const lastInteractionWasKeyboard = useLastInteractionKeyboard();


  useEffect(() => {
    const filteredOptions = options.filter((opt) => opt.selected == true).length
    if(filteredOptions > 1) {
      throw new Error(`InputRadio: ${filteredOptions} options passed with 'selected: true' but expected 1 or fewer.`);
    }
  }, [])

  useEffect(() => {
    if (selectedId !== null) onToggle(selectedId);
  }, [selectedId]);
  
  useEffect(() => {
    if(hasFocus) {
      setSelectedId(options[focusedIndex].id)
    }
  }, [focusedIndex, hasFocus])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const focusedOption = options[focusedIndex];
      setSelectedId(focusedOption.id);
    }
  };

  useEffect(() => {
    setFocusedIndex(0);
  }, [hasFocus])
  
  const handleFocus = () => {
    if(lastInteractionWasKeyboard) {
      setHasFocus(true);
    }
  }

  return (
    <div className="input__wrap">
      {label && <label className="input__label">{label}</label>}
      {description && <p className="input__description">{description}</p>}
      <div
        role="radiogroup"
        tabIndex={0}
        className="input__wrap"
        onFocus={handleFocus}
        onBlur={() => setHasFocus(false)}
        ref={groupRef}
        onKeyDown={handleKeyDown}
        aria-activedescendant={`radio-${options[focusedIndex].id}`}
      >
        {options.map((opt, index) => (
          <div
            key={opt.id}
            id={`radio-${opt.id}`}
            role="radio"
            aria-checked={selectedId === opt.id}
            className={`input-radio__item`}
            onClick={() => setSelectedId(opt.id)}
          >
            <div className={`input__radio ${hasFocus && focusedIndex === index ? "focused" : ""}`}>
              {selectedId === opt.id && <div className="input-radio__selected" />}
            </div>
            <div className="input-radio__content">
              <em className="input-checkbox__label">{opt.label}</em>
              {opt.description && (
                <small className="input-checkbox__description">{opt.description}</small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputRadio;