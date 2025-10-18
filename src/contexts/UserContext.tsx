'use client'
import { createContext } from "react";

interface UserContextProps {
    os: string;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children, os }: {children: React.ReactNode, os: string}) => {

    return (
        <UserContext.Provider value={{os}}>
            {children}
        </UserContext.Provider>
    )
}