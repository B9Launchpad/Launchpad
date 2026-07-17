"use client"
import MessengerMessageList from "./MessageList";
import "@styles/messenger.css"
import PageHeader from "@/components/layout/header/PageHeader";
import { HeaderPathType } from "@/components/layout/header/HeaderPath";
import MessengerCorrespondenceLayout from "./CorrespondenceLayout";
import { useUser } from "@/contexts/UserContext";



const MessengerLayout: React.FC = () => {
    const user = useUser();
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
                <MessengerCorrespondenceLayout user={user}/>
            </div>
        </>
    )
}


export default MessengerLayout;