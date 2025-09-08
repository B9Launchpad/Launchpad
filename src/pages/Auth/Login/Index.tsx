//import AppleLogo from "../../components/icons/Logos/AppleLogo";
import LoginPromptPage from "./Login";
import LoginErrorPage from "./Error";
import { useLogin } from "../../../functions/LoginContext";
import LoginProcessingPage from "./Processing";

const LoginPage: React.FC = () => {

    const { status } = useLogin();


    if(status === "isProcessing") {
        return <LoginProcessingPage />
    }

    if(status === "isError") {
        return <LoginErrorPage />
    }

    return (
        <LoginPromptPage/>
    )
}

export default LoginPage;