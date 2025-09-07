import React, { useEffect, useRef, useState } from 'react';
import IconCheck from '../../icons/Input/Check';
import IconMinus from '../../icons/Input/Minus';
import useLastInteractionKeyboard from '../../../functions/useLastInteractionKeyboard';


export type CheckboxState = true | false | 'i';
export type id = string | number
export type CheckboxSelected = { [key in id]: CheckboxState }

export interface CheckboxOption {
  id: id;
  label?: string;
  description?: string;
  checked?: CheckboxState;
}

interface CheckboxFieldProps {
  options: CheckboxOption[];
  label?: string;
  description?: string;
  onToggle: (checkboxState: CheckboxSelected) => void;
}

const InputCheckbox: React.FC<CheckboxFieldProps> = ({
  options,
  label,
  description,
  onToggle,
}) => {
    const [selected, setSelected] = useState<CheckboxSelected>(
      options
      .reduce((acc, opt) => {
        acc[opt.id] = opt.checked ?? false;
        return acc;
      }, {} as CheckboxSelected)
    );
    const [focusedIndex, setFocusedIndex] = useState(0);
    const [hasFocus, setHasFocus] = useState(false);
    const groupRef = useRef<HTMLDivElement>(null);
    const lastInteractionWasKeyboard = useLastInteractionKeyboard();

  const suppressOnToggleRef = useRef(false);

  useEffect(() => {
    const updated = options.reduce((acc, opt) => {
      acc[opt.id] = opt.checked ?? false;
      return acc;
    }, {} as CheckboxSelected);

    const isDifferent = Object.keys(updated).some(
      (key) => selected[key] !== updated[key]
    );

    if (isDifferent) { /* Re-initialisation of options after change of variable */
      suppressOnToggleRef.current = true; // suppress firing of onToggle() when state is updated
      setSelected(updated);
    }
  }, [options]); 

    const handleClick = (id: id) => {
      setSelected(prev => ({
        ...prev,
        [id]: prev[id] === 'i' ? true : !prev[id]
      }))
    }

  useEffect(() => {
    if (suppressOnToggleRef.current) {
      suppressOnToggleRef.current = false;
      return;
    }
    onToggle(selected);
  }, [selected]);
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % options.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const focusedOption: id = options[focusedIndex].id;
        handleClick(focusedOption)
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
    <div className="input__wrap" onClick={() => handleClick }>
      <div className='input__content'>
        {label && <label className="input__title">{label}</label>}
        {description && <p className="input__description">{description}</p>}
      </div>
      <div
        role="checkboxgroup"
        tabIndex={0}
        className="input__wrap"
        onFocus={handleFocus}
        onBlur={() => setHasFocus(false)}
        ref={groupRef}
        onKeyDown={handleKeyDown}
        aria-activedescendant={`checkbox-${options[focusedIndex].id}`}
      >
        {options.map((opt, index) => {
        const isChecked: CheckboxState = selected[opt.id];  
        return (
          <div 
            key={opt.id}
            id={`checkbox-${opt.id}`}
            role={"checkbox"}
            aria-checked={isChecked == true || isChecked == false ? isChecked : "mixed"}
            onClick={() => handleClick(opt.id)}
            className='input-checkbox__wrap'
          >
            <div
              className={`input__checkbox ${isChecked === "i" ? 'intermediate' : isChecked === true ? 'active' : 'inactive'} ${hasFocus && focusedIndex === index ? "focused" : ""}`}>
              {isChecked === true && <IconCheck/>}
              {isChecked === 'i' && <IconMinus/>}
              {/* no icon for 'unchecked' */}
            </div>
            <div className="input-checkbox__content">
              <em className="input-checkbox__label">{opt.label}</em>
              {opt.description && (
                <small className="input-checkbox__description">{opt.description}</small>
              )}
            </div>
          </div>
        )})}

      </div>
    </div>
  );
};

export default InputCheckbox;