import { useRef } from "react";
import useLastInteractionKeyboard from "../../functions/useLastInteractionKeyboard";

// Configuring interface for propos to be used within the button
interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'access' | 'critical' | 'tertiary';
    icon?: React.ReactNode;
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    type?: "submit" | "reset" | "button" | undefined;
    tabIndex?: number;
}

// Declaration of Button component with its configured props and styles
const Button: React.FC<ButtonProps> = ({ variant='primary', tabIndex = 0, icon, onClick, children, disabled, className, type}) => {
    const lastInteractionWasKeyboard = useLastInteractionKeyboard();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleFocus = () => {
        if(lastInteractionWasKeyboard) {
            buttonRef.current?.classList.add("focused");
        }
    }

    const handleBlur = () => {
        buttonRef.current?.classList.remove("focused");
    }

    return (
        <button className={[
            className, // optional external classes
            variant,   // 'primary', 'secondary', etc.
            icon && 'icon' // if icon exists, add 'icon' class
            ].filter(Boolean).join(' ')}
            onFocus={handleFocus} 
            onBlur={handleBlur}
            type={type}
            ref={buttonRef}
            tabIndex={tabIndex}

            // Declaration of classes based on button type

            onClick={disabled ? undefined : onClick} disabled={disabled}>
            {icon && <span className="button__icon-container">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;