import Tag, { Colors } from "../Tag";
import ProfilePicturePlaceholder from "./PicturePlaceholder";

interface TeamDisplayProps {
    label: string;
    color: Colors;
    inline?: boolean;
    role?: "user" | "admin"
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ label, color, inline = false, role }) => {
    let displayRole: string | null;
    switch(role) {
        case "user":
            displayRole = "Member";
            break;
        case "admin":
            displayRole = "Leader";
            break;
        default:
            displayRole = null;
            break;
    }

    return (
        <>
            {inline === false ? (
                <div className="flex-row gap-sm">
                    <ProfilePicturePlaceholder label={label} color={color}></ProfilePicturePlaceholder>
                    <div className="flex-col">
                        <strong>{label}</strong>
                        <small>{displayRole && displayRole}</small>
                    </div>
                </div>
                ) : (
                    <Tag label={label} color={color}></Tag>
                )
            }
        </>
    )
}

export default TeamDisplay;