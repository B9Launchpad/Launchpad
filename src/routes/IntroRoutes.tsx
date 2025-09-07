import { Route, Routes } from "react-router-dom"
import PlaygroundPage from "../pages/Playground"
import OnboardingStage from "../pages/Onboarding/Index"

export default function IntroRoutes() {
    return (
    <Routes>
        <Route path="/" element={<OnboardingStage/>} />
        <Route path="/playground" element={<PlaygroundPage />} />
    </Routes>
    )
}