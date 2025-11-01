
interface DateInputProps {
    format: "dd" | "dd-mm" | "dd-mm-yyyy" | "mm-yyyy" | "yyyy";
    title: string;
    children?: React.ReactNode;
    error?: string | null;
    value?: [string];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    id?: string;
    autofocus?: boolean;
    disabled?: boolean;
    required: boolean;
    description?: string;
}

const DateInput: React.FC<DateInputProps> = ({ format, title, children, error, value, onChange, name, id, required = true, description, disabled, autofocus }) => {
    
    return (
        <div className={`input__wrap`}>
            <div className={`input__content ${disabled == true ? 'disabled' : ''}`}>
                <span className="input__title-content">
                    <p className="input__title">{title}</p>
                    {required && (<p className="input__mandatory">*</p>)}
                </span>
                {description && (<p className="input__description">{description}</p>)}
            </div>
            <div className={`input__field`}>
                <input disabled={disabled} id={id} autoFocus={autofocus} name={name} /* onChange={handleChange} */ /* onClick={disableError} */ /*value={ value from "value" }*/ type={"text"} className={`input__main ${error ? 'input__main--error' : ''} ${disabled == true ? 'disabled' : ''}`} ></input>
                {children}
                {error && (
                    <p className="input__error-message">{error}</p>
                )}
            </div>
        </div>
    )
}