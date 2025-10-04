import { useRef } from "react"
import { useTranslation } from "react-i18next";
import NewPassword, {NewPasswordRef} from "../../../components/common/Input/NewPassword";
import Button from "../../../components/common/Button";
import { useReset } from "../../../functions/Auth/ResetContext";


const ResetNewPasswordPage = () => {
    const newPasswordRef = useRef<NewPasswordRef>(null);
    const { t } = useTranslation('auth');
    const { handleReset } = useReset();

    const handleSubmit = () => {
        if(!newPasswordRef.current) return;

        const password = newPasswordRef.current.validate();

        if(typeof password === "string") {
            handleReset(password)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="hero__content">
                <div>
                    <em>{t('greeting', {name: 'Tatiana', ns: 'general'})}</em>
                    <h1>{t('reset.title')}</h1>
                    <small>
                        {t('reset.passwordResetInstructions')} {/*t('passwordRequirements')*/}
                    </small>
                </div>
                <NewPassword ref={newPasswordRef}></NewPassword>
            </div>
            <div className="hero__content">
                <Button type="submit">
                    { t('reset.resetPassword') }
                </Button>
            </div>
        </form>
    )
}

export default ResetNewPasswordPage;