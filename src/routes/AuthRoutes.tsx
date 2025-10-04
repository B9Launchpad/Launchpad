import { Route, Routes } from "react-router-dom"
import GuestLayout from "../components/layout/GuestLayout"
import LoginPage from "../pages/Auth/Login/Index"
import SessionTimeoutPage from "../pages/Auth/Timeout"
import PasswordResetPage from "../pages/Auth/Reset/Index"
import useIsDarkTheme from "../functions/useIsDarkTheme"
import { LoginProvider } from "../functions/Auth/LoginContext"
import { ResetProvider } from "../functions/Auth/ResetContext"

export default function AuthRoutes() {
    const isDarkTheme = useIsDarkTheme();

    return (
    <Routes>
        <Route path="/" element={
            <GuestLayout backgroundURL={`/static/GuestLayout/Skyline${isDarkTheme === true ? 'dark.png' : '.webp'}`}>
                <LoginProvider>
                    <LoginPage/>
                </LoginProvider>
            </GuestLayout>} />
        <Route path="/timeout" element={<GuestLayout backgroundURL='/static/GuestLayout/guest-spacious.webp'><SessionTimeoutPage/></GuestLayout>} />
        <Route path="/reset" element={<GuestLayout backgroundURL='/static/guest-soviet.webp'>
            <ResetProvider>
                <PasswordResetPage/>
            </ResetProvider>
        </GuestLayout>} />
    </Routes>
    )
}