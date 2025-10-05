import ProtectedRoute from "../../../functions/Auth/ProtectedRoute";
import { useReset } from "../../../functions/Auth/ResetContext";
import ResetCodePage from "./Code";
import ResetEmailPage from "./Email";
import ResetNewPasswordPage from "./NewPassword";

const PasswordResetPage: React.FC = () => {

    const { data } = useReset();

    if(data.codeValid === true) {
        return (
            <ProtectedRoute>
                <ResetNewPasswordPage/>
            </ProtectedRoute>
        );
    }

    if((data.codeValid === false || data.codeValid === null) && data.emailValid === true) {
        return <ResetCodePage />
    }

    return (
        <ResetEmailPage/>
    )
}

export default PasswordResetPage;