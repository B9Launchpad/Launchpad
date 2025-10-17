import { useEffect, useRef, useState } from "react";
import useLastInteractionKeyboard from "../../functions/useLastInteractionKeyboard";
import { useFetchStatus } from "../../utils/fetch/useFetchStatus";

// Configuring interface for propos to be used within the button
export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'access' | 'critical' | 'tertiary';
    icon?: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
    label?: string | React.ReactNode;
    disabled?: boolean;
    className?: string;
    type?: "submit" | "reset" | "button" | undefined;
    tabIndex?: number;
}

// Declaration of Button component with its configured props and styles
const Button: React.FC<ButtonProps> = ({ children, label = children, variant='primary', tabIndex = 0, icon, onClick, disabled = false, className, type}) => {
    const lastInteractionWasKeyboard = useLastInteractionKeyboard();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(disabled);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if(!label && !children) throw new Error("Missing required prop: 'label' or 'children' must be provided, but received 'undefined'");
    // if(typeof label !== undefined && typeof children !== undefined) throw new Error("Invalid prop combination: 'label' and 'children' provided, but expected either 'label' or 'children'");
    // CONSIDER CLEANUP!
    const fetchStatus = useFetchStatus();

    const handleFocus = () => {
        if(lastInteractionWasKeyboard) {
            buttonRef.current?.classList.add("focused");
        }
    }

    const handleBlur = () => {
        buttonRef.current?.classList.remove("focused");
    }

    const handleClick = (/*e: React.MouseEvent<HTMLButtonElement>*/) => {
        if(onClick) onClick();

        // expand for further use
    }

    useEffect(() => {
        if(type !== "submit" || disabled) return;

        setIsDisabled(fetchStatus);
        setIsLoading(fetchStatus);

        return () => {
            setIsDisabled(disabled);
            setIsLoading(false);
        }
    }, [fetchStatus])

    return (
        <button className={[
            className, // optional external classes
            variant,   // 'primary', 'secondary', etc.
            icon && 'icon', // if icon exists, add 'icon' class
            isLoading && "loading"
            ].filter(Boolean).join(' ')}
            onFocus={handleFocus} 
            onBlur={handleBlur}
            type={type}
            ref={buttonRef}
            tabIndex={tabIndex}

            // Declaration of classes based on button type

            onClick={handleClick} disabled={isDisabled}>
            {icon && <span className="button__icon-container">{icon}</span>}
            {label}
        </button>
    );
};

export default Button;