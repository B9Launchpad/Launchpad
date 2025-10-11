import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next";
import NewPassword, {NewPasswordRef} from "../../../components/common/Input/NewPassword";
import Button from "../../../components/common/Button";
import { useReset } from "../../../functions/Auth/ResetContext";
import { useNavigate } from "react-router-dom";
import FormComponent from "../../../components/common/Input/Form";


const ResetNewPasswordPage = () => {
    const newPasswordRef = useRef<NewPasswordRef>(null);
    const { t } = useTranslation('auth');
    const { data, handleReset } = useReset();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!newPasswordRef.current) return;

        const password = newPasswordRef.current.validate();

        if(typeof password !== "string") return;
        
        handleReset(password)
    }

    useEffect(() => {
        if(data.changeAccepted === true) {
            navigate("/login")
        }
    }, [data.changeAccepted]);

    return (
        <FormComponent onSubmit={handleSubmit}>
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
        </FormComponent>
    )
}

export default ResetNewPasswordPage;