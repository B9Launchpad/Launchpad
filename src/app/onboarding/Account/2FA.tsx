import { Trans, useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import InputString from "../../../components/common/Input/StringInput";

interface OnboardingProps {
    onNext: () => void;
}

const Onboarding2FA: React.FC<OnboardingProps> = ({ onNext }) => {
    const { t } = useTranslation('intro')


    return (
        <>
            <div className="intro__content">
                <div>
                    <h1>{t('security.2FA.title')}</h1>
                    <h2>{t('security.2FA.instructions')}</h2>
                </div>

                <small>
                    <Trans
                        ns="intro"
                        i18nKey={"security.2FA.notScannable"}
                        values={{ code: 'hello world' }}
                        components={{ 1: <strong />}}
                    />
                </small>

                <InputString maxLength={6} label={t('security.2FA.6digitCode')} type="string" required={true} description={t('security.2FA.6digitCodeInstructions')}></InputString>

                <Button onClick={() => onNext()}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </>
    )
}

export default Onboarding2FA;