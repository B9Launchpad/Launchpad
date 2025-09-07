import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
//import AppleLogo from "../../components/icons/Logos/AppleLogo";
import { useCookie } from "../../../functions/useCookie";
import securityConfig from "../../../config/security.json"
import LoginPromptPage from "./Login";
import LoginErrorPage from "./Error";
import { useLogin } from "../../../functions/LoginContext";

// Declaration of useQuery hook to render a different page on login request.

const LoginPage: React.FC = () => {
    const { t } = useTranslation('auth');
    //const query = useQuery();
    //const isProcessing = query.has("request");
    //const isError = query.has("error");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isError, setIsError] = useState<any>(null)
    const { setCookie } = useCookie();

    const { status, handleRequest, handleRetry} = useLogin();

    {/* Konfiguration für Animation des zusammneklappbares Elements */}


    if(status === "isProcessing") {
        return (
            <>
                <div className="hero__content">
                    <div>
                        <h1>{t('processing.working')}</h1>
                        <small>{t('processing.instructions')}</small>
                    </div>
                </div>
                <div className="">
                    <div className="loading-bar">
                        <div className="loading-bar__progress"></div>
                    </div>
                    <small>{t('processing.tooLongPrompt')} <NavLink to={'/help'}>{t('processing.supportPrompt')}</NavLink></small>
                </div>
                <div>
            </div>
            </>
        )
    }

    if(status === "isError") {
        return <LoginErrorPage ></LoginErrorPage>
    }

    return (
        <LoginPromptPage/>
    )
}

export default LoginPage;