'use client'
import SuspenseLoader from "@/components/common/Loader";
import GuestLayout from "@/components/layout/GuestLayout";
import makeFetchRequest from "@/utils/fetch/makeFetchRequest";
import { createContext, useContext, useEffect, useState } from "react";

export interface UserProps {
    os: string;
    name: string[];
    email: string;
    isVerified: boolean;
    country: string;
    picture: string;
    role: string;
}

export interface UserDataProps {
    country: string;
    email: string;
    username: string;
    picture: string;
    role: "user" | "admin" | "owner";
    is_verified: boolean;
    id: number;
}

const UserContext = createContext<UserProps | undefined>(undefined);

export const parseUserData = (data: UserDataProps) => {
    return {
        name: data.username.split(" "),
        email: data.email,
        isVerified: data.is_verified,
        country: data.country,
        picture: data.picture,
        role: data.role,
        id: data.id
    };
}

export const UserProvider = ({ children, os }: {children: React.ReactNode, os: string}) => {
    const [userData, setUserData] = useState<UserDataProps>();
    const [fatal, setFatal] = useState<boolean>(false);


    useEffect(() => {
        const RetrieveUserData = async () => {
            try {
                const { response } = await makeFetchRequest({
                    url: "/profile",
                    method: "GET",
                    credentials: 'include'
                })

                setUserData(await response.json());
            } catch(e) {
                console.error(e)
                setFatal(true);
            }
        }

        RetrieveUserData();
    }, [])

    if(fatal) return (
        <GuestLayout backgroundURL="/static/guest-layout/dusseldorf.webp">
            <div className="hero__content">
                <h1>Launchpad ran into a fatal error</h1>
                <p>Launchpad failed to fetch user data from backend. Please contact your IT administrator or support.</p>
            </div>
        </GuestLayout>
    )

    if(!userData) return (
        <SuspenseLoader></SuspenseLoader>
    )

    return (
        <UserContext.Provider value={{os, name: userData.username.split(" "), email: userData.email, isVerified: userData.is_verified, country: userData.country, picture: userData.picture, role: userData.role}}>
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