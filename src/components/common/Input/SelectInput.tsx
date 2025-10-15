import { useEffect, useState } from "react";

type InputSelectOptions = Array<
    {
        label: string,
        value: any,
    }>

interface InputProps {
    title: string;
    description?: string;
    options: InputSelectOptions;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    expand?: boolean;
    disabled?: boolean;
}

const InputSelect: React.FC<InputProps> = ({ expand = false, disabled = false, title, description, options, onChange, value, ...props}) => {

    return (
        <div className={`input__wrap ${expand ? "expand" : ""}`}>
                <div className="input__content">
                <span className="input__title-content">
                    <p className="input__title">{title}</p>
                </span>
                {description && (<p className="input__description">{description}</p>)}
            </div>
            <div className="input__field">
                <select disabled={disabled} {...props} defaultValue={value} onChange={onChange} className={`input__main ${expand ? 'expand' : ''}`}>
                    { options.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    )) }
                </select>
            </div>
        </div>
    )
}

export default InputSelect;