import { DisplayedProfile } from "@/components/common/User/Profile"
import ProfilePicture from "@/components/common/User/ProfilePicture";

interface MessengerSenderProfileProps {
    user: DisplayedProfile;
}

const MessengerSenderProfile: React.FC<MessengerSenderProfileProps> = ({user}) => {
    return (
        <div className="profile__wrap">
            <ProfilePicture url={user.pictureUrl} size={"semi-md"} displayName={user.name}/>
            <div className="profile__info">
                <p>{user.name.join(" ")}</p>
                <small>{user.email}</small>
            </div>
        </div>
    )
}

export default MessengerSenderProfile;