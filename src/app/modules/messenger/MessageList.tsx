"use client"
import Button from "@/components/common/Button"
import InputCheckbox from "@/components/common/Input/Checkbox"
import InputSearch from "@/components/common/Input/Search/SearchInput"
import Window from "@/components/common/Window"
import IconAtSymbol from "@/components/icons/AtSymbol"
import IconFolder from "@/components/icons/Folder"
import IconStar from "@/components/icons/Star"
import HeaderSectionBrowser, { SectionBrowserItem } from "@/components/layout/header/SectionBrowser"


const MessengerMessageList = () => {

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
        <Window>
            <div className="flex-col gap">
                <InputSearch placeholder="Name, email, message contents..."/>
                <div className="flex-row gap justify-space-between">
                    <HeaderSectionBrowser items={browserItems} transparentInactiveItems={false} excludeInstructions/>
                    <InputCheckbox options={[{label: "Unread", id: "messenger.launchpad.unread"}]}/>
                </div>
            </div>
        </Window>
    )
}

export default MessengerMessageList;