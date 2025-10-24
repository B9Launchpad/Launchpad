import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { autoComplete } from "./StringInput";

interface SmallInputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "password";
  children?: React.ReactNode;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  autoComplete?: autoComplete;
  name?: string;
  id?: string;
  autofocus?: boolean;
}

export type InputSmallRef = HTMLInputElement & {
  clear: () => void;
  get: () => string;
  error: (message: string) => void;
};

const InputSmall = forwardRef<InputSmallRef, SmallInputProps>(
  (
    { label, placeholder, id, autofocus, onChange, type = "text", children, error = "", value = "", maxLength, autoComplete = "off", name },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [charCount, setCharCount] = useState(value?.length ?? 0);
    const [currentValue, setCurrentValue] = useState<string>(value);
    const [currentError, setCurrentError] = useState<string>(error);

    useEffect(() => {
        setCharCount(value?.length ?? 0);
    }, [value]);

    const clearInput = () => {
        setCurrentValue("");
        setCharCount(0);
    };

    useImperativeHandle(ref, () => {
        const node = inputRef.current!;
        return Object.assign(node, {
            clear: () => {
                clearInput();
                node.value = "";
            },
            get: () => node.value,
            error: (message: string) => setCurrentError(message),
        });
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      setCharCount(e.target.value.length);
      setCurrentValue(e.currentTarget.value);
    };

    return (
      <div className="input__small--wrap">
        {label && <label className="input__label">{label}</label>}
        <input
            ref={inputRef}
            id={id}
            autoFocus={autofocus}
            autoComplete={autoComplete}
            name={name}
            onChange={handleChange}
            onClick={() => setCurrentError("")}
            value={currentValue}
            type={type}
            maxLength={maxLength}
            className={`input__main ${
              currentError ? "input__main--error" : ""
            }`}
            placeholder={placeholder}
        />
        {(maxLength || currentError || children) && (
            <div className="input__sub-content">
                {children}
                {maxLength && (
                    <small className="input__char--counter">
                        {charCount}/{maxLength}
                    </small>
                )}
                {currentError && (
                    <p className="input__error-message">{currentError}</p>
                )}
            </div>
        )}
      </div>
    );
  }
);

export default InputSmall;
