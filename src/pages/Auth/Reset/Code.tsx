import { useRef } from "react";
import { useTranslation } from "react-i18next"
import Button from "../../../components/common/Button";
import InputSmall, {InputSmallRef} from "../../../components/common/Input/SmallInput";
import { useReset } from "../../../functions/Auth/ResetContext";

const ResetCodePage = () => {
    const { t } = useTranslation('auth');
    const { data, handleCode } = useReset();
    const inputRef = useRef<InputSmallRef>(null);

    const validateCode = (e: React.FormEvent) => {
        e.preventDefault();
    
        if(!inputRef.current) return;

        const input = inputRef.current;
        const code = parseInt(input.get());

        handleCode(code);

        if(data.codeValid === false) {
            input.error(t('reset.codeError'));
        }
    }

    return (
        <form onSubmit={validateCode}>
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
            <div className="hero__content">
                <Button type="submit">
                    { t('submit', {ns: 'general'}) }
                </Button>
            </div>
        </form>
    )
}

export default ResetCodePage;