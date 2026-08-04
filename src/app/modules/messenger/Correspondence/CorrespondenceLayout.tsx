import Button from "@/components/common/Button";
import InputSearch from "@/components/common/Input/SearchInput";
import { DisplayedProfile } from "@/components/common/User/Profile";
import ProfilePicture from "@/components/common/User/ProfilePicture";
import Window from "@/components/common/Window"
import IconSearch from "@/components/icons/Search";
import { useState } from "react";
import MessengerSenderProfile from "./SenderProfile";
import HeaderSectionBrowser, { SectionBrowserItem } from "@/components/layout/header/SectionBrowser";
import InputMessenger from "./InputMessenger";
import MessengerMessageHistory from "./History";
import message from "./Message";


export type MessengerActiveChat = {
    id: number;
    user: DisplayedProfile
}

interface MessengerCorrespondenceLayoutProps {
    activeChat: MessengerActiveChat;
}

const headerItems: SectionBrowserItem[] = [
    {
        id: "messenger.launchpad.chat-chat",
        label: "Chat",
        onClick: () => {}
    },
    {
        id: "messenger.launchpad.chat-pinned",
        label: "Pinned",
        onClick: () => {}
    },
    {
        id: "messenger.launchpad.chat-media",
        label: "Media",
        onClick: () => {}
    },
    {
        id: "messenger.launchpad.chat-links",
        label: "Links",
        onClick: () => {}
    },
    {
        id: "messenger.launchpad.chat-files",
        label: "Files",
        onClick: () => {}
    },
] 

const MessengerCorrespondenceLayout: React.FC<MessengerCorrespondenceLayoutProps> = ({ activeChat }) => {
    const [isSearching, setIsSearching] = useState<boolean>(false);


    return (
        <Window className="messenger__window">
            <div className="flex-col gap-sm messenger__utility-wrapper">
                <div className="flex-col gap messenger__utility-wrapper">
                    <div className="flex-row justify-space-between">
                        <MessengerSenderProfile user={activeChat.user}/>
                        <div className="flex-row gap">
                            <Button icon={<IconSearch/>} onClick={() => setIsSearching(!isSearching)} inline variant="secondary"/>
                        </div>
                    </div>
                    {isSearching && (
                        <InputSearch/>
                    )}
                    <HeaderSectionBrowser items={headerItems} hideInstructions/>
                    <MessengerMessageHistory history={[message]}/>
                    <InputMessenger/>
                </div>
            </div>
        </Window>
    )
}

export default MessengerCorrespondenceLayout;