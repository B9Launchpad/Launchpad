import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";
import useLastInteractionKeyboard from "../../../functions/useLastInteractionKeyboard";
import Button from "../Button";
import Tag from "../Tag";
import IconBin from "../../icons/Bin";

interface SmallInputProps {
    title: string;
    placeholder?: string;
    type: "string" | "number" | "float" | "password";
    children?: React.ReactNode;
    error?: string;
    value?: string;
    chips?: string[]
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maxLength?: number;
    autoComplete?: 'on' | 'off' | 'username email' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'street-address' | 'country' | 'country-name' | 'postal-code' | 'name' | 'additional-name' | 'family-name' | 'given-name' | 'honoric-prefix' | 'honoric-suffix' | 'nickname' | 'organization-title' | 'username' | 'new-password' | 'current-password' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'one-time-code' | 'organization' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount'| 'language' | 'url' | 'email' | 'photo' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-extension' | 'impp';
    name?: string;
    id?: string;
    autofocus?: boolean;
    disabled?: boolean;
    isMandatory: boolean;
    description?: string;
    validation?: [(value: string) => boolean, string]; 
    maxArrayLength?: number;
    allowSameEntry?: boolean;
}

export type InputChipsRef = HTMLInputElement & {
  clear: () => void;
  get: () => string[] | undefined;
};

const InputChips = forwardRef<InputChipsRef, SmallInputProps>(({ title, allowSameEntry = false, maxArrayLength, validation, placeholder, id, autofocus, onChange, type = 'text', children, error, value = "", chips, maxLength, autoComplete = 'off', name, disabled = false, isMandatory, description}, ref) => {
    const [inputValue, setInputValue] = useState<string>(value)
    const [currentChips, setCurrentChips] = useState<string[] | undefined>(chips);
    const inputRef = useRef<HTMLInputElement>(null);
    const [charCount, setCharCount] = useState(value?.length);
    const lastInteractionWasKeyboard = useLastInteractionKeyboard();
    const [inputError, setInputError] = useState<string | undefined>(error);

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
                return currentChips;
            }
        });
    });

    const clearInput = () => {
        setInputValue("");
        setCharCount(0);
    }

    const disableError = () => {
        setInputError(undefined)
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

    const validateEntry = (entry: string) => {
        if(validation) {
            const validate = validation[0];
            if(!validate(entry)) {
                setInputError(validation[1]);
                return false;
            }
        }
        return true;
    }

    const handleClick = () => {
        if(inputValue.length < 1) return;
        if(currentChips && maxArrayLength && currentChips.length >= maxArrayLength) {
            clearInput();
            return;
        }
        const sameValueExists = currentChips?.includes(inputValue);
        if(sameValueExists && !allowSameEntry) {
            return
        } else if (sameValueExists && allowSameEntry) {
            
        } else {
            if(!validateEntry(inputValue)) return;
        }
        disableError();
        setCurrentChips([...(currentChips ?? []), inputValue])
        clearInput();
    }
    const handleRemove = (index: number) => {
        setCurrentChips(prev => prev?.filter((_, i) => i !== index));
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            e.preventDefault();
            handleClick();
        } 
    }

    return (
        <div className={`input__wrap`}>
            <div className={`input__content ${disabled === true ? 'disabled' : ''}`}>
                <span className="input__title-content">
                    <p className="input__title">{title}</p>
                    {isMandatory && (<p className="input__mandatory">*</p>)}
                </span>
                {description && (<p className="input__description">{description}</p>)}
            </div>
            <div className={`input__field`}>
                <div className="input__field--button">
                    <input onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleKeyDown} disabled={disabled} maxLength={maxLength} id={id} autoFocus={autofocus} autoComplete={autoComplete} name={name} onChange={handleChange} onClick={disableError} value={inputValue} type={type} className={`input__main ${inputError ? 'input__main--error' : ''} ${disabled == true ? 'disabled' : ''}`} ref={inputRef} placeholder={placeholder}></input>
                    <Button tabIndex={-1} onClick={handleClick}>+</Button>
                </div>
                {maxLength && (
                    <small className="input__char--counter">
                        {charCount}/{maxLength}
                    </small>
                )}
                {children}
                <div className="input-chips__items">
                    {currentChips?.map((chip, index) => {
                        return (
                            <Tag icon={<IconBin/>} iconAfterText={true} key={index} onClick={() => handleRemove(index)}>{chip}</Tag>
                        )
                    })}
                </div>
                {inputError && (
                    <p className="input__error-message">{inputError}</p>
                )}
            </div>
        </div>
    )
})

export default InputChips;