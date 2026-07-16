import { Colors } from "../Tag";
import { ProfilePictureSize } from "./Profile";
import ProfilePicturePlaceholder from './PicturePlaceholder'

interface ProfilePicture {
    displayName?: string[];
    url?: string;
    color?: Colors;
    size?: ProfilePictureSize;
}

const ProfilePicture: React.FC<ProfilePicture> = ({displayName, url, color = "secondary", size = "base"}) => {

    if(!displayName && !url) {
        throw new Error("<ProfilePicture> has nothing to display. Expected either `url` or `label` but received `undefined` for both");
    }

    return (
        <>
            {url ? (
                    <img className={`profile__picture profile__picture-${size}`} src={url}></img>
                ) : (
                    <ProfilePicturePlaceholder size={size} label={displayName![0]} color="secondary"></ProfilePicturePlaceholder>
            )}
        </>
    )
}

export default ProfilePicture;