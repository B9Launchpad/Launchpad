
interface WindowProps {
    label?: string;
    description?: string;
    children: React.ReactNode;
}

const WindowComponent: React.FC<WindowProps> = ({ label, description, children }) => {
    return (
        <div className="content-window">
            {label || description && ( <div>
                {label && (<h2 className="content-window__label">{label}</h2>)}
                {description && (<small className="content-window__description">{description}</small>)}
            </div> )}
            {children}
        </div>
    )
}

export default WindowComponent;