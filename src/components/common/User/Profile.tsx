// Configuring interface for propos to be used within the button

import ProfilePicturePlaceholder from "./PicturePlaceholder";
import ProfilePicture from "./ProfilePicture";

export type ProfilePictureSize = "xs" | "sm" | "base" | "md" | "lg";

export type DisplayedProfile = {
    name: string[];
    email: string;
    pictureUrl?: string;
}

export interface ProfileProps {
    onClick?: () => void;
    name: string[];
    email: string;
    picture?: string;
    pictureSize?: ProfilePictureSize;
    displayFullName?: boolean;
}

export const formatName = (name: string[]) => {
    let firstName: string = name[0];
    if(!name[1]) return firstName;
    let lastName: string = name[1];

    return `${firstName} ${lastName.charAt(0)}.`
}

// Declaration of Button component with its configured props and styles
const Profile: React.FC<ProfileProps> = ({ onClick, displayFullName = false, name, email, picture, pictureSize = "base" }) => {

    return (
        <div className="profile__wrap">
            <ProfilePicture url={picture} size={pictureSize} displayName={name}/>
            <div className="profile__info">
                { displayFullName ? (
                    <p className="profile__name">{name.join(" ")}</p>
                ) : (
                    <p className="profile__name">{formatName(name)}</p> 
                )}
                <p className="profile__email">{email}</p>
            </div>
        </div>
    );
};

export default Profile;