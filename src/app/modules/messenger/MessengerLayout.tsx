"use client"
import MessengerMessageList from "./MessageList";
import "@styles/messenger.css"
import PageHeader from "@/components/layout/header/PageHeader";
import { HeaderPathType } from "@/components/layout/header/HeaderPath";



const MessengerLayout: React.FC = () => {
    const path: HeaderPathType = [
        {
            slug: "Messages"
        }
    ]

    return (
        <>
            <PageHeader path={path} title="Messages"/>
            <div className="messenger__window-wrap">
                <MessengerMessageList></MessengerMessageList>
                <MessengerMessageList></MessengerMessageList>
            </div>
        </>
    )
}


export default MessengerLayout;