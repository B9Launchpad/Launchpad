import Button from "@/components/common/Button";
import { DisplayedProfile } from "@/components/common/User/Profile";
import ProfilePicture from "@/components/common/User/ProfilePicture";
import Window from "@/components/common/Window"
import IconSearch from "@/components/icons/Search";


interface MessengerCorrespondenceLayoutProps {
    user: DisplayedProfile;
}

const MessengerCorrespondenceLayout: React.FC<MessengerCorrespondenceLayoutProps> = ({ user }) => {
    return (
        <Window>
            <div className="flex-col gap-sm">
                <div className="flex-col gap-xs">
                    <div className="flex-row justify-space-between">
                        <div className="profile__wrap">
                        <ProfilePicture url={user.pictureUrl} size={"semi-md"} displayName={user.name}/>
                        <div className="profile__info">
                            <p>{user.name.join(" ")}</p>
                            <small>{user.email}</small>
                        </div>
                        </div>
                        <div className="flex-row gap">
                            <Button icon={<IconSearch/>} inline variant="secondary"/>
                        </div>
                    </div>
                </div>
            </div>
        </Window>
    )
}

export default MessengerCorrespondenceLayout;