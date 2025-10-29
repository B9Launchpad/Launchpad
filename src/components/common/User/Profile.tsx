// Configuring interface for propos to be used within the button

export interface ProfileProps {
    onClick?: () => void;
    name: [string, string];
    email: string;
    picture: string;
}

export const formatName = (name: [string, string]) => {
    let firstName: string = name[0];
    let lastName: string = name[1];

    return `${firstName} ${lastName.charAt(0)}.`
}

// Declaration of Button component with its configured props and styles
const Profile: React.FC<ProfileProps> = ({ onClick, name, email, picture }) => {

    return (
        <div className="profile__wrap">
            <img className="profile__picture" src={picture}></img>
            <div className="profile__info">
                <p className="profile__name">{formatName(name)}</p> 
                <p className="profile__email">{email}</p>
            </div>
        </div>
    );
};

export default Profile;