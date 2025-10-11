import IntroLayout from "../../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import PadSelect from "../../../components/misc/intro/PadSelect";
import IconSecurity from "../../../components/icons/Security";
import IconKey from "../../../components/icons/Key";

interface OnboardingProps {
    onNext: () => void;
}

const OnboardingSelect2FA: React.FC<OnboardingProps> = ({ onNext }) => {
    const { t } = useTranslation('intro')

    const handleChange = () => {
        return;
    }

    const options = [
        { id: "app", label: t('security.methods.app'), icon: <IconSecurity /> },
        { id: "key", label: t('security.methods.passkey'), description: t('security.methods.passkeyNote', {passkey: t('security.methods.passkey')}), icon: <IconKey /> },
    ];

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('security.methods.title')}</h1>

                <PadSelect options={options} onChange={handleChange} allowMultiple={true}></PadSelect>
                

                <Button onClick={() => onNext()}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingSelect2FA;