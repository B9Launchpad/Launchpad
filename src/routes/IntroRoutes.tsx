import { Navigate, Route, Routes } from "react-router-dom"
import PlaygroundPage from "../pages/Playground"
import OnboardingStage from "../pages/Onboarding/Index"
import ProtectedRoute from "../functions/ProtectedRoute"

export default function IntroRoutes() {
    return (
    <Routes>
        <Route path="/" element={<Navigate to={"/login"} replace></Navigate>} />
        <Route path="/playground" element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} />
    </Routes>
    )
}