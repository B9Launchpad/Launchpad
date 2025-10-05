import { createContext, useContext, useState } from "react";
import securityConfig from "../../config/security.json"
import { useNavigate } from "react-router-dom";
import makeFetchRequest from "../../utils/makeFetchRequest";

export type loginCredentials = { email: string} | null
export type ResetData = 
{ 
    email: string | null
    emailValid: boolean | null, 
    codeValid: boolean | null, 
    changeAccepted: boolean | null
    fetchError: boolean,
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
            changeAccepted: null,
            fetchError: false
        }
    )
    const navigate = useNavigate()

    const setFetchError = (value: boolean) => {
        setData((prev) => ({ ...prev, fetchError: value }))
    }

    const handleEmail = async (email: string) => {
        try {
            const res = await makeFetchRequest({
                url: `/login/reset`,
                body: {
                    email: email
                }
            })

            const { status } = res;
            setFetchError(false)

            if(status === 202) {
                setData((prev) => ({ ...prev, emailValid: true, email: email }))
            } else if (status === 404) (
                setData((prev) => ({ ...prev, emailValid: false }))
            )
        } catch (error: any) {
            setFetchError(true);
            console.log(error);
        }
    } 

    const handleCode = async (code: number) => {
        try {
            const res = await makeFetchRequest({
                url: '/login/by-code',
                body: {
                    email: data.email,
                    code: String(code)
                }
            })

            const { status } = res;
            setData((prev) => ({ ...prev, fetchError: false }))

            if(status === 202) {
                setData((prev) => ({ ...prev, codeValid: true }))
            } else if (status === 400) (
                setData((prev) => ({ ...prev, codeValid: false }))
            )

        } catch (error: any) {
            setData((prev) => ({ ...prev, fetchError: true }))
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