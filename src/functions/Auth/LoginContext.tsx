import { createContext, useContext, useState } from "react";
import securityConfig from "../../config/security.json"
import { useRouter } from "next/navigation";

// TO DO: Implement securityConfig (contemplate whether on backend or frontend)

export type loginCredentials = { email: string, password: string} | null
type LoginStatus = "isIdle" | "isProcessing" | "isError" | "isUnauthorised";
interface LoginContextProps {
    loginStatus: LoginStatus;
    credentials: loginCredentials;
    handleRequest: (credentials: loginCredentials) => void;
    handleRetry: () => void;
    setLoginStatus: (loginStatus: LoginStatus) => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const LoginProvider = ({ children }: {children: React.ReactNode}) => {
    const [loginStatus, setLoginStatus] = useState<LoginStatus>("isIdle")
    const [credentials, setCredentials] = useState<loginCredentials>(null);
    const router = useRouter()

    const handleRequest = async (credentials: loginCredentials) => {
        setCredentials(credentials)
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: "include"
            });
            setLoginStatus("isProcessing");

            const status = response.status;

            if(status === 202) {
                router.push('/') // navigate to /dashboard
            } else if (status === 401) {
                setLoginStatus("isUnauthorised");
            }
        } catch (error: any) {
            console.log(error);
            setLoginStatus("isError");
        }
    }

    const handleRetry = () => {
        if(credentials) handleRequest(credentials);
    }

    return (
        <LoginContext.Provider value={{loginStatus, credentials, handleRequest, handleRetry, setLoginStatus}}>
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