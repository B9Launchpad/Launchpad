import { Colors } from "../Tag";

interface ProfilePicturePlaceholderProps {
    label: string;
    color: Colors;
    size?: "xs" | "sm" | "base" | "lg";
}

const ProfilePicturePlaceholder: React.FC<ProfilePicturePlaceholderProps> = ({ label, color, size = "base"}) => {
    return (
        <div className={`profile__picture profile__picture-${size} profile__picture--placeholder ${color}`}>
            {label.charAt(0).toUpperCase()}
        </div>
    )
}

export default ProfilePicturePlaceholder;