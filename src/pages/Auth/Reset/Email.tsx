import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Button from "../../../components/common/Button";
import InputSmall, {InputSmallRef} from "../../../components/common/Input/SmallInput";
import { useReset } from "../../../functions/Auth/ResetContext";
import validateEmail from "../../../functions/validateEmail";


const ResetEmailPage = () => {
    const { handleEmail, data } = useReset();
    const { t } = useTranslation('auth')
    const emailRef = useRef<InputSmallRef>(null);


    const handleEntry = (e: React.FormEvent) => {
        e.preventDefault();

        if(!emailRef.current) return;
        const input = emailRef.current;
        const email = input.get();

        if(validateEmail(email)) {
            handleEmail(email);
        } else {
            input.error(t('reset.emailNotFoundError'))
        }
    }

    useEffect(() => {
        if(!emailRef.current) return;
        if(data.fetchError === true) {
            emailRef.current.error(t('errors.fetch', { ns: "general" }))
        } else if (data.emailValid === false) {
            emailRef.current.error(t('reset.emailNotFoundError'))
        } else {
            emailRef.current.error("");
        }
    }, [data])

    return (
        <form onSubmit={handleEntry}>
            <div className="hero__content">
                <div>
                    <h1>{t('reset.title')}</h1>
                    <small>{t('reset.initialInstructions')}</small>
                </div>
                <InputSmall
                    autofocus={true}
                    id="userdata"
                    autoComplete="username email"
                    ref={emailRef}
                    label={t('loginPrompt')}
                >
                    <small>{t('reset.rememberPassword')}{' '}
                        <NavLink to={'/login'}>
                            {t('reset.backToLogin')}
                        </NavLink>
                    </small>
                </InputSmall>
            </div>
            <div className="hero__content">
                <Button type="submit">
                    { t('submit', {ns: 'general'}) }
                </Button>
            </div>
        </form>
    )
}

export default ResetEmailPage;