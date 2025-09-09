import { useEffect, useState } from "react";
import { useCookie } from "./useCookie";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // null = loading, true/false = ready
    const { getCookie } = useCookie();

    // TODO: Change token verification via backend :\

    const verifyToken = async() => {

        try {
            const response = await fetch('http://localhost:8080/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors', // явно указываем CORS режим
                credentials: "include"
            });

            const status = response.status;

            if(status === 200) setIsAuthenticated(true);

        } catch (error: any) {
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        verifyToken();
    }, [])

    if(isAuthenticated === null) return <main><h1>Loading...</h1></main>
    if(!isAuthenticated) return <Navigate to="/login" replace />

    return <>{children}</>; // isAuthenticated === true return
}

export default ProtectedRoute;