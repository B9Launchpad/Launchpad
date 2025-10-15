import Button, { ButtonProps } from "./Button";

interface WindowProps {
    label?: string;
    description?: string;
    children: React.ReactNode;
    action?: ButtonProps[]
}

const WindowComponent: React.FC<WindowProps> = ({ label, description, children, action }) => {
    return (
        <div className="content-window">
            {label && ( <div>
                {label && (<h2 className="content-window__label">{label}</h2>)}
                {description && (<small className="content-window__description">{description}</small>)}
            </div> )}
            {children}
            {action && ( 
                <div className="content__window--action">
                    {action.map((item, index) => (
                        <Button key={index} {...item}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WindowComponent;