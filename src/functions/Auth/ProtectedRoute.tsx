'use client'
import { useEffect, useState } from "react";
import makeFetchRequest from "../../utils/fetch/makeFetchRequest";
import { useRouter } from "next/navigation";
import LoginProcessingPage from "@/app/login/Processing";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await makeFetchRequest({
                    method: "GET",
                    url: '/verify',
                    credentials: "include",
                });

                setAuthStatus(res.status === 200 ? 'authenticated' : 'unauthenticated');
            } catch (error) {
                setAuthStatus('unauthenticated');
            }
        };

        verifyToken();
    }, []);

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/login');
        }
    }, [authStatus, router]);

    if (authStatus === 'loading') {
        return <LoginProcessingPage />;
    }

    if (authStatus === 'authenticated') {
        return <>{children}</>;
    }

    return null;
};

export default ProtectedRoute;