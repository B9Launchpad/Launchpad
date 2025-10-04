import { createContext, useContext, useState } from "react";
import securityConfig from "../../config/security.json"
import { useNavigate } from "react-router-dom";

export type loginCredentials = { email: string} | null
export type ResetData = 
{ 
    email: string | null
    emailValid: boolean | null, 
    codeValid: boolean | null, 
    changeAccepted: boolean | null
}
interface ResetContextProps {
    data: ResetData;
    setData: (data: ResetData) => void;

    handleEmail: (email: string) => void;
    handleCode: (code: number) => void;
    handleReset: (newPassword: string) => void;
}

const ResetContext = createContext<ResetContextProps | undefined>(undefined);

export const ResetProvider = ({ children }: {children: React.ReactNode}) => {
    const [data, setData] = useState<ResetData>(
        {
            email: null,
            emailValid: null,
            codeValid: null,
            changeAccepted: null
        }
    )
    const navigate = useNavigate()

    const handleEmail = async (email: string) => {
        try {
            const response = await fetch('http://localhost:8080/login/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(email),
                mode: 'cors', // явно указываем CORS режим
                credentials: "include"
            });

            const status = response.status;

            if(status === 202) {
                setData((prev) => ({ ...prev, emailValid: true, email: email }))
            } else if (status === 401) (
                setData((prev) => ({ ...prev, emailValid: false }))
            )
        } catch (error: any) {
            console.log(error);
        }
    } 

    const handleCode = async (code: number) => {
        try {
            const response = await fetch('http://localhost:8080/login/by-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify([code, data.email]),
                mode: 'cors', // явно указываем CORS режим
                credentials: "include"
            });

            const status = response.status;

            if(status === 202) {
                setData((prev) => ({ ...prev, codeValid: true }))
            } else if (status === 401) (
                setData((prev) => ({ ...prev, codeValid: false }))
            )
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleReset = async (newPassword: string) => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(newPassword),
                mode: 'cors', // явно указываем CORS режим
                credentials: "include"
            });

            const status = response.status;

            if(status === 202) {
                setData((prev) => ({ ...prev, changeAccepted: true }))
            } else if (status === 401) (
                setData((prev) => ({ ...prev, changeAccepted: false }))
            )
        } catch (error: any) {
            console.log(error);
        }
    }

    

    return (
        <ResetContext.Provider value={{data, setData, handleEmail, handleCode, handleReset}}>
            { children }
        </ResetContext.Provider>

    )
}

export const useReset = () => {
  const ctx = useContext(ResetContext);
  if (!ctx) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return ctx;
};