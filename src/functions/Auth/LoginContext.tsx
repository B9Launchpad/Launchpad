import { createContext, useContext, useState } from "react";
import securityConfig from "../../config/security.json"
import { useNavigate } from "react-router-dom";

// TO DO: Implement securityConfig (contemplate whether on backend or frontend)

export type loginCredentials = { username: string, password: string} | null
type LoginStatus = "isIdle" | "isProcessing" | "isError" | "isUnauthorised";
interface LoginContextProps {
    status: LoginStatus;
    credentials: loginCredentials;
    handleRequest: (credentials: loginCredentials) => void;
    handleRetry: () => void;
    setStatus: (status: LoginStatus) => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const LoginProvider = ({ children }: {children: React.ReactNode}) => {
    const [status, setStatus] = useState<LoginStatus>("isIdle")
    const [credentials, setCredentials] = useState<loginCredentials>(null);
    const navigate = useNavigate()

    const handleRequest = async (credentials: loginCredentials) => {
        setCredentials(credentials)
        try {
            const response = await fetch('http://localhost:8080/new-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials),
                mode: 'cors', // явно указываем CORS режим
                credentials: "include"
            });
            setStatus("isProcessing");

            const status = response.status;

            if(status === 202) {
                navigate("/onboarding/playground");
            } else if (status === 401) (
                setStatus("isUnauthorised")
            )
        } catch (error: any) {
            console.log(error);
            setStatus("isError");
        }
    }

    const handleRetry = () => {
        if(credentials) handleRequest(credentials);
    }

    return (
        <LoginContext.Provider value={{status, credentials, handleRequest, handleRetry, setStatus}}>
            { children }
        </LoginContext.Provider>

    )
}

export const useLogin = () => {
  const ctx = useContext(LoginContext);
  if (!ctx) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return ctx; // TypeScript now knows this is LoginContextProps, not undefined
};