import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next"
import Button from "../../../components/common/Button";
import InputSmall, {InputSmallRef} from "../../../components/common/Input/SmallInput";
import { useReset } from "../../../functions/Auth/ResetContext";
import FormComponent from "../../../components/common/Input/Form";

const ResetCodePage = () => {
    const { t } = useTranslation('auth');
    const { data, handleCode } = useReset();
    const inputRef = useRef<InputSmallRef>(null);

    const validateCode = (e: React.FormEvent) => {
        e.preventDefault();
    
        if(!inputRef.current) return;

        const input = inputRef.current;
        const code = parseInt(input.get());

        if((""+code).split("").length < 6) {
            input.error(t('reset.codeError'));
            return;
        }

        handleCode(code);

        if(data.codeValid === false) {
            input.error(t('reset.codeError'));
        }
    }

    useEffect(() => {
        if(!inputRef.current) return;
        const input = inputRef.current;
        if(data.fetchError === true) {
            input.error(t('errors.fetch', { ns: "general" }))
        } else if (data.codeValid === false) {
            input.error(t('reset.codeError'))
        } else {
            input.error("");
        }
    }, [data])

    return (
        <FormComponent onSubmit={validateCode}>
            <div className="hero__content">
                <div>
                    <h1>{t('reset.challengeMailTitle')}</h1>
                    <small>{t('reset.challengeMailInstructions')}</small>
                </div>
                <InputSmall 
                    id="otp"
                    maxLength={6}
                    autoComplete="one-time-code"
                    label={t('reset.resetCode')}
                    ref={inputRef}
                />
            </div>
        </FormComponent>
    )
}

export default ResetCodePage;