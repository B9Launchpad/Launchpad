import IntroLayout from "../../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import PadSelect from "../../../components/misc/intro/PadSelect";
import IconSecurity from "../../../components/icons/Security";

interface OnboardingProps {
    onNext: () => void;
}

const OnboardingSpecialty: React.FC<OnboardingProps> = ({ onNext }) => {
    const { t } = useTranslation('intro')

    const options = [
        { id: "1", label: t('security.methods.app'), icon: <IconSecurity /> },
        { id: "2", label: t('security.methods.passkey'), icon: <IconSecurity /> },
        { id: "3", label: t('security.methods.app'), icon: <IconSecurity /> },
        { id: "4", label: t('security.methods.passkey'), icon: <IconSecurity /> },
    ];

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>My company specialises in...</h1>

                <PadSelect options={options} allowMultiple={false} onChange={() => {return}}></PadSelect>

                <Button onClick={onNext}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingSpecialty;