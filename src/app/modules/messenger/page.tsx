import MainLayout from "@/components/layout/MainLayout"
import "@styles/messenger.css"

import MessengerLayout from "./MessengerLayout";



const Messenger: React.FC = () => {

    return (
        <MainLayout>
            <MessengerLayout></MessengerLayout>
        </MainLayout>
    )
}


export default Messenger;