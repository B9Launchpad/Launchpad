import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export type InputSelectOptions = Array<
    {
        label: string,
        value: any,
    }>

interface InputProps {
    label: string;
    description?: string;
    options: InputSelectOptions;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    expand?: boolean;
    disabled?: boolean;
}

export type InputSelectRef = HTMLSelectElement & {
    get: () => string;
}

const InputSelect = forwardRef<InputSelectRef, InputProps>(({ expand = false, disabled = false, label, description, options, onChange, value, ...props}, ref) => {
    const selectRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => {
        const node = selectRef.current!;
        return Object.assign(node, {
            get: () => {
                return node.value;
            }
        })
    })

    return (
        <div className={`input__wrap ${expand ? "expand" : ""}`}>
                <div className="input__content">
                <span className="input__title-content">
                    <p className="input__title">{label}</p>
                </span>
                {description && (<p className="input__description">{description}</p>)}
            </div>
            <div className="input__field">
                <select ref={selectRef} disabled={disabled} {...props} defaultValue={value} onChange={onChange} className={`input__main ${expand ? 'expand' : ''}`}>
                    { options.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    )) }
                </select>
            </div>
        </div>
    )
})

export default InputSelect;