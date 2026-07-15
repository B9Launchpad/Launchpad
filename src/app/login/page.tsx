'use client'

import { LoginProvider } from '@/contexts/LoginContext'
import LoginFlow from './Index'
import GuestLayout from '@/components/layout/GuestLayout'
import { useContext, useEffect } from 'react'
import ThemeContext from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import makeFetchRequest from '@/utils/fetch/makeFetchRequest'

export default function Page() {
    const { inferredTheme } = useContext(ThemeContext);
    const isDarkTheme = inferredTheme === 'dark';
    const router = useRouter();

    
    //Check if user has already logged in and redirect to dashboard.
    useEffect(() => {
        async function redirectIfAuthenticated(): Promise<void> {
            const { status } = await makeFetchRequest({
                url: '/verify',
                method: 'GET',
                credentials: 'include'
            })

            if(status === 200) {
                router.push('/')
            }
        }

        redirectIfAuthenticated();
    }, [])

    return (
        <LoginProvider>
            <GuestLayout backgroundURL={`/static/guest-layout/dusseldorf.webp`}>
                <LoginFlow />
            </GuestLayout>
        </LoginProvider>
    )
}
