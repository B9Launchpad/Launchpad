import { useEffect, useState } from "react";
import makeFetchRequest from "../../utils/fetch/makeFetchRequest";
import { useRouter } from "next/navigation";
import LoginProcessingPage from "@/app/login/Processing";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // null = loading, true/false = ready
    const router = useRouter();

    // TODO: Change token verification via backend :\

    const verifyToken = async() => {
        
        try {
            //const response = await fetch('http://localhost:8080/verify', {
            //    method: 'POST',
            //    headers: {
            //        'Content-Type': 'application/json',
            //        'Accept': 'application/json',
            //    },
            //    mode: 'cors', // явно указываем CORS режим
            //    credentials: "include"
            //});

            const res = await makeFetchRequest({
                method: "GET",
                url: '/verify',
                includeCredentials: true,
            })

            const { status } = res;

            if(status === 200) setIsAuthenticated(true);

        } catch (error: any) {
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        verifyToken();
    }, [])

    if(isAuthenticated === null) return <LoginProcessingPage/>
    if(!isAuthenticated) return () => {
        router.push('/login')
    }

    return children; // isAuthenticated === true return
}

export default ProtectedRoute;