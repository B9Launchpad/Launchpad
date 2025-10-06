//import AppleLogo from "../../components/icons/Logos/AppleLogo";
import LoginPromptPage from "./Login";
import LoginErrorPage from "./Error";
import { useLogin } from "../../../functions/Auth/LoginContext";
import LoginProcessingPage from "./Processing";

const LoginPage: React.FC = () => {

    const { loginStatus } = useLogin();


    switch (loginStatus) {
        case "isProcessing":
            return <LoginProcessingPage />
        case "isError":
            return <LoginErrorPage />
        default:
            return <LoginPromptPage />
    }
}

export default LoginPage;