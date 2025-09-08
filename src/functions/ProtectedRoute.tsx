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

    useEffect(() => {
        const token = "w21r"


        if(!token) {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true)
        }
    }, [])

    if(isAuthenticated === null) return <main><h1>Loading...</h1></main>
    if(!isAuthenticated) return <Navigate to="/login" replace />

    return <>{children}</>; // isAuthenticated === true return
}

export default ProtectedRoute;