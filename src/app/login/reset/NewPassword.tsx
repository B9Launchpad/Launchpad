import { useEffect, useRef } from "react"
import NewPassword, {NewPasswordRef} from "@components/common/Input/NewPassword";
import { useReset } from "@functions/Auth/ResetContext";
import FormComponent from "@components/common/Input/Form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";


const ResetNewPasswordPage = () => {
    const newPasswordRef = useRef<NewPasswordRef>(null);
    const t = useTranslations('auth');
    const tg = useTranslations('general');
    const { data, handleReset } = useReset();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!newPasswordRef.current) return;

        const password = newPasswordRef.current.validate();

        if(typeof password !== "string") return;
        
        handleReset(password)
    }

    useEffect(() => {
        if(data.changeAccepted === true) {
            router.push("/login")
        }
    }, [data.changeAccepted]);

    return (
        <FormComponent onSubmit={handleSubmit}>
            <div className="hero__content">
                <div>
                    <em>{tg('greeting', {name: 'Tatiana'})}</em>
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