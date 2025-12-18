import { useUser } from "@/contexts/UserContext"
import SettingsAccountWindow from "./components/AccountComponent"


const SettingsAccount: React.FC = () => {
    const user = useUser();

    return (
        <SettingsAccountWindow user={user}/>
    )
}

export default SettingsAccount;