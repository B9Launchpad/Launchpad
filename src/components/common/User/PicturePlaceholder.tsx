import { Colors } from "../Tag";
import { ProfilePictureSize } from "./Profile";

interface ProfilePicturePlaceholderProps {
    label: string;
    color: Colors;
    size?: ProfilePictureSize;
}

const ProfilePicturePlaceholder: React.FC<ProfilePicturePlaceholderProps> = ({ label, color, size = "base"}) => {
    return (
        <div className={`profile__picture profile__picture-${size} profile__picture--placeholder ${color}`}>
            {label.charAt(0).toUpperCase()}
        </div>
    )
}

export default ProfilePicturePlaceholder;