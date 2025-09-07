import { forwardRef, useEffect, useRef, useState } from "react";

interface SmallInputProps {
    label?: string;
    placeholder?: string;
    type?: 'text' | 'password';
    children?: React.ReactNode;
    error?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    maxLength?: number;
    autoComplete?: 'on' | 'off' | 'username email' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'street-address' | 'country' | 'country-name' | 'postal-code' | 'name' | 'additional-name' | 'family-name' | 'given-name' | 'honoric-prefix' | 'honoric-suffix' | 'nickname' | 'organization-title' | 'username' | 'new-password' | 'current-password' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'one-time-code' | 'organization' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount'| 'language' | 'url' | 'email' | 'photo' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-extension' | 'impp';
    name?: string;
    id?: string;
    autofocus?: boolean;
}

const InputSmall = forwardRef<HTMLInputElement, SmallInputProps>(({ label, placeholder, id, autofocus, onChange, type = 'text', children, error, value, maxLength, autoComplete = 'off', name}, ref) => {
    const inputRef = (ref as React.RefObject<HTMLInputElement>);
    const [charCount, setCharCount] = useState(value?.length);

    useEffect(() => {
        setCharCount(value?.length);
    }, [value]);


    const disableError = () => {
        error = undefined;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e);
        }
        setCharCount(e.target.value.length);
    }


    return (
        <div className="input__small--wrap">
            { label && ( <label className={`input__label`}>{label}</label> )}
            <input maxLength={maxLength} id={id} autoFocus={autofocus} autoComplete={autoComplete} name={name} onChange={handleChange} onClick={disableError} value={value} type={type} className={`input__main ${error ? 'input__main--error' : ''}`} ref={inputRef} placeholder={placeholder}></input>
            {maxLength && (
                <small className="input__char--counter">
                    {charCount}/{maxLength}
                </small>
            )}
            {error && (
                <p className="input__error-message">{error}</p>
            )}
            {children}
        </div>
    )
});

export default InputSmall;