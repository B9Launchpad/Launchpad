import { useEffect, useState } from "react";

interface InputProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
}

const InputSelect: React.FC<InputProps> = ({ title, description, children, onChange, value}) => {

    return (
        <div className="input__wrap">
                <div className="input__content">
                <span className="input__title-content">
                    <p className="input__title">{title}</p>
                </span>
                {description && (<p className="input__description">{description}</p>)}
            </div>
            <div className="input__field">
                <select value={value} onChange={onChange} className={`input__main`}>
                    { children }
                </select>
            </div>
        </div>
    )
}

export default InputSelect;