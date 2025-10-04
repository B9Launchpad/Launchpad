interface TagProps {
    children: React.ReactNode;
    color?: "access" | "warning" | "critical" | "success" | "pink" | "purple" | "orange" | "blue" | "brown" | "primary" | "secondary" | "muted";
    onClick?: () => void;
    icon?: React.ReactNode;
    iconAfterText?: true;
}

const Tag: React.FC<TagProps> = ({ children, color = "secondary", onClick, icon, iconAfterText = false }) => {
    return (
        <div 
            role={"button"}
            onClick={onClick}
            className={`tag__wrap ${color} 
            ${onClick ? "clickable" : ""}`}
        >
            {(!iconAfterText && icon) && icon}
            {children}
            {(iconAfterText && icon) && icon}
        </div>
    )
}

export default Tag;