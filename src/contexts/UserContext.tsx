'use client'
import { createContext, useContext } from "react";

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

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider (within MainLayout.tsx)");
  }
  return ctx;
};