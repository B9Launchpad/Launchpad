"use client"
import InputCheckbox from "@/components/common/Input/Checkbox"
import InputSearch from "@/components/common/Input/Search/SearchInput"
import Window from "@/components/common/Window"
import IconAtSymbol from "@/components/icons/AtSymbol"
import IconFolder from "@/components/icons/Folder"
import IconStar from "@/components/icons/Star"
import HeaderSectionBrowser, { SectionBrowserItem } from "@/components/layout/header/SectionBrowser"
import MessengerMessageListItem from "./MessageListItem"
import { Message } from "./correspondence/Message"
import { DisplayedProfile } from "@/components/common/User/Profile"


const mockSender: DisplayedProfile = {
    name: ['Alice', 'Johnson'],
    email: '@alicej',
};

const message: Message = {
    content: {
        text: (
            <div>
                Hey! Here's that <strong>photo</strong> I promised you. 🌅
                <br />
                <em>(tap to expand)</em><em>(tap to expand)</em><em>(tap to expand)</em><em>(tap to expand)</em>
            </div>
        ),
        images: [
            { url: 'https://picsum.photos/seed/beach/800/600', alt: 'Sunset at the beach' },
            { url: 'https://picsum.photos/seed/palm/800/600', alt: 'Palm trees' },
        ],
    },
    sender: mockSender,
    sentOn: new Date('2026-07-15T14:30:00Z'),
    editedOn: new Date('2026-07-15T14:35:00Z'),
};

const MessengerMessageList: React.FC = () => {

    const handleClick = () => {
        return;
    }

    const browserItems: SectionBrowserItem[] = [
        {
            label: "Overview",
            id: "messenger.launchpad.overview",
            onClick: handleClick
        },
        {
            icon: <IconAtSymbol/>,
            id: "messenger.launchpad.mentions",
            onClick: handleClick
        },
        {
            icon: <IconStar/>,
            id: "messenger.launchpad.starred",
            onClick: handleClick
        },
        {
            icon: <IconFolder/>,
            label: "Important",
            id: "messenger.launchpad.folder_important",
            onClick: handleClick
        }
    ]

    return (
        <Window className="messenger__window">
            <div className="flex-col gap">
                <InputSearch placeholder="Name, email, message contents..."/>
                <div className="flex-row gap justify-space-between">
                    <HeaderSectionBrowser items={browserItems} transparentInactiveItems={false} hideInstructions/>
                    <InputCheckbox options={[{label: "Unread", id: "messenger.launchpad.unread"}]}/>
                </div>
            </div>
            <div className="message-list flex-col">
                <MessengerMessageListItem user={mockSender} lastMessage={message} lastOpened={new Date()}/>
                <MessengerMessageListItem user={mockSender} lastMessage={message} lastOpened={new Date()}/>
                <MessengerMessageListItem user={mockSender} lastMessage={message} lastOpened={new Date()}/>
                <MessengerMessageListItem user={mockSender} lastMessage={message} lastOpened={new Date()}/>
                <MessengerMessageListItem user={mockSender} lastMessage={message} lastOpened={new Date()}/>
                <MessengerMessageListItem user={mockSender} lastMessage={message} lastOpened={new Date()}/>
                <MessengerMessageListItem user={mockSender} lastMessage={message} lastOpened={new Date()}/>
            </div>
        </Window>
    )
}

export default MessengerMessageList;