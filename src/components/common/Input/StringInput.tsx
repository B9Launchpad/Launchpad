import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";
import useLastInteractionKeyboard from "../../../functions/useLastInteractionKeyboard";

export type autoComplete = 'on' | 'off' | 'username email' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'street-address' | 'country' | 'country-name' | 'postal-code' | 'name' | 'additional-name' | 'family-name' | 'given-name' | 'honoric-prefix' | 'honoric-suffix' | 'nickname' | 'organization-title' | 'username' | 'new-password' | 'current-password' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'one-time-code' | 'organization' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount'| 'language' | 'url' | 'email' | 'photo' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-extension' | 'impp';

interface SmallInputProps {
    label: string;
    placeholder?: string;
    type: "string" | "number" | "float" | "password";
    children?: React.ReactNode;
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maxLength?: number;
    name?: string;
    id?: string;
    autoComplete?: autoComplete;
    autofocus?: boolean;
    disabled?: boolean;
    isMandatory: boolean;
    description?: string;
    expand?: boolean;
}

export type InputStringRef = HTMLInputElement & {
  clear: () => void;
  get: () => string;
  error: (message: string) => void;
};

const InputString = forwardRef<InputStringRef, SmallInputProps>(({ label, placeholder, id, autofocus, onChange, type = 'text', children, error = "", value = "", maxLength, autoComplete = 'off', name, disabled = false, isMandatory, description, expand = false}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>(value);
    const [charCount, setCharCount] = useState(value?.length);
    const lastInteractionWasKeyboard = useLastInteractionKeyboard();
    const [currentError, setCurrentError] = useState<string>(error);

    useEffect(() => {
        setCharCount(value?.length);
    }, [value]);

    useImperativeHandle(ref, () => {
        const node = inputRef.current!;
        return Object.assign(node, {
            clear: () => {
                clearInput();
                node.value = "";
            },
            get: () => {
                return node.value;
            },
            error: (message: string) => {
                setCurrentError(message);
            }
        });
    });

    const clearInput = () => {
        setInputValue("");
        setCharCount(0);
    }

    const disableError = () => {
        setCurrentError("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
        setInputValue(e.currentTarget.value)
        setCharCount(e.target.value.length);
    }

    const handleFocus = () => {
        if(lastInteractionWasKeyboard) {
            inputRef.current?.classList.add("focused");
        }
    }

    const handleBlur = () => {
        inputRef.current?.classList.remove("focused");
    }

    return (
        <div className={`input__wrap ${expand ? 'expand' : ''}`}>
            <div className={`input__content ${disabled === true ? 'disabled' : ''}`}>
                <span className="input__title-content">
                    <p className="input__title">{label}</p>
                    {isMandatory && (<p className="input__mandatory">*</p>)}
                </span>
                {description && (<p className="input__description">{description}</p>)}
            </div>
            <div className={`input__field`}>
                <input onFocus={handleFocus} onBlur={handleBlur} disabled={disabled} maxLength={maxLength} id={id} autoFocus={autofocus} autoComplete={autoComplete} name={name} onChange={handleChange} onClick={disableError} value={inputValue} type={type} className={`input__main ${expand ? 'expand' : ''} ${currentError ? 'input__main--error' : ''} ${disabled == true ? 'disabled' : ''}`} ref={inputRef} placeholder={placeholder}></input>
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
        </div>
    )
})

export default InputString;