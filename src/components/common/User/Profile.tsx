// Configuring interface for propos to be used within the button

import ProfilePicturePlaceholder from "./PicturePlaceholder";

export interface ProfileProps {
    onClick?: () => void;
    name: string[];
    email: string;
    picture?: string;
    displayFullName?: boolean;
}

export const formatName = (name: string[]) => {
    let firstName: string = name[0];
    if(!name[1]) return firstName;
    let lastName: string = name[1];

    return `${firstName} ${lastName.charAt(0)}.`
}

// Declaration of Button component with its configured props and styles
const Profile: React.FC<ProfileProps> = ({ onClick, displayFullName = false, name, email, picture }) => {

    return (
        <div className="profile__wrap">
            {picture ? (
                <img className="profile__picture" src={picture}></img>
            ) : (
                <ProfilePicturePlaceholder label={name[0]} color="secondary"></ProfilePicturePlaceholder>
            )}
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