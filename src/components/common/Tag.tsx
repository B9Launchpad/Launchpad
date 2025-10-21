interface TagProps {
    children?: React.ReactNode;
    label?: string;
    color?: Colors | "transparent";
    onClick?: () => void;
    icon?: React.ReactNode;
    iconAfterText?: true;
}

export type Colors = "access" | "warning" | "critical" | "success" | "pink" | "purple" | "orange" | "blue" | "brown" | "primary" | "secondary" | "muted";

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
            tabIndex={onClick ? 0 : -1}
        >
            {(!iconAfterText && icon) && icon}
            {children}{label}
            {(iconAfterText && icon) && icon}
        </div>
    )
}

export default Tag;