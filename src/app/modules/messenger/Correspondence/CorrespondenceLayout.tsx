import Button from "@/components/common/Button";
import InputSearch from "@/components/common/Input/SearchInput";
import { DisplayedProfile } from "@/components/common/User/Profile";
import ProfilePicture from "@/components/common/User/ProfilePicture";
import Window from "@/components/common/Window"
import IconSearch from "@/components/icons/Search";
import { useState } from "react";
import MessengerSenderProfile from "./SenderProfile";


export type MessengerActiveChat = {
    id: number;
    user: DisplayedProfile
}

interface MessengerCorrespondenceLayoutProps {
    activeChat: MessengerActiveChat;
}

const MessengerCorrespondenceLayout: React.FC<MessengerCorrespondenceLayoutProps> = ({ activeChat }) => {
    const [isSearching, setIsSearching] = useState<boolean>(false);


    return (
        <Window className="messenger__window">
            <div className="flex-col gap-sm">
                <div className="flex-col gap">
                    <div className="flex-row justify-space-between">
                        <MessengerSenderProfile user={activeChat.user}/>
                        <div className="flex-row gap">
                            <Button icon={<IconSearch/>} onClick={() => setIsSearching(!isSearching)} inline variant="secondary"/>
                        </div>
                    </div>
                    {isSearching && (
                        <InputSearch/>
                    )}
                    <>{/* message history */}</>
                </div>
            </div>
        </Window>
    )
}

export default MessengerCorrespondenceLayout;