import { Route, Routes } from "react-router-dom"
import GuestLayout from "../components/layout/GuestLayout"
import LoginPage from "../pages/Auth/Login/Index"
import SessionTimeoutPage from "../pages/Auth/Timeout"
import PasswordResetPage from "../pages/Auth/PasswordReset"
import useIsDarkTheme from "../functions/useIsDarkTheme"
import { LoginProvider } from "../functions/LoginContext"

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
        <Route path="/timeout" element={<GuestLayout backgroundURL='/static/guest-building.webp'><SessionTimeoutPage/></GuestLayout>} />
        <Route path="/reset" element={<GuestLayout backgroundURL='/static/guest-soviet.webp'><PasswordResetPage/></GuestLayout>} />
    </Routes>
    )
}