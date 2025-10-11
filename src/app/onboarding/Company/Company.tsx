import IntroLayout from "../../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import InputString, { InputStringRef } from "../../../components/common/Input/StringInput";
import FileUpload from "../../../components/common/Input/FileUpload/FileUpload";
import { OnboardingDataType } from "../Index";
import { useRef } from "react";

interface OnboardingProps {
    onNext: (stepsToAdd: number, data: OnboardingDataType) => void;
    data: OnboardingDataType
}

const OnboardingCompany: React.FC<OnboardingProps> = ({ onNext, data }) => {
    const { t } = useTranslation('intro')
    const inputRef = useRef<InputStringRef>(null)

    const handleSubmit = () => {
        if(inputRef.current) {
            const nameInput = inputRef.current;
            const value = nameInput.get();
            if(value.length > 0) {
                data.company.name = value;
                // TO DO: Image upload URL.

                onNext(1, data)
            } else {
                nameInput.error(t('fillOutError', { ns: "general"}))
                return;
            }
        }
    }

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('company.title')}</h1>
                <InputString ref={inputRef} autoComplete={"name"} title={t('company.name')} isMandatory={true} type="string" error=""></InputString>
                <FileUpload accept={".png .svg .webp .jpg .jpeg"} title={t('company.logo')} description={t('company.logoInstructions', { productName: t('Launchpad', {ns: "general"})})} allowMultiple={false}></FileUpload>
                <Button onClick={handleSubmit}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingCompany;