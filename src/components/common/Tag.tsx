interface TagProps {
    children?: React.ReactNode;
    label?: string;
    color?: "access" | "warning" | "critical" | "success" | "pink" | "purple" | "orange" | "blue" | "brown" | "primary" | "secondary" | "muted" | "transparent";
    onClick?: () => void;
    icon?: React.ReactNode;
    iconAfterText?: true;
}

const Tag: React.FC<TagProps> = ({ children, label, color = "secondary", onClick, icon, iconAfterText = false }) => {
    const handleClick = () => {
        if(!onClick) return
        onClick();
    }

    return (
        <div 
            role={"button"}
            onClick={handleClick}
            className={`tag__wrap ${color} 
            ${onClick ? "clickable" : ""}`}
        >
            {(!iconAfterText && icon) && icon}
            {children}{label}
            {(iconAfterText && icon) && icon}
        </div>
    )
}

export default Tag;