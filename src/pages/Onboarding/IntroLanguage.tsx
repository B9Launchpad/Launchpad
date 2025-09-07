import InputSelect from "../../components/common/Input/SelectInput";
import IntroLayout from "../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import { supportedCountries } from "../../functions/SupportedCountries";
import Button from "../../components/common/Button";
import { id } from "../../components/common/Input/Checkbox";
import { OnboardingDataType } from "./Index";
import { useState } from "react";

interface OnboardingProps {
    onNext: (addSteps: number, data: OnboardingDataType) => void;
    data: OnboardingDataType
}

const OnboardingLanguage: React.FC<OnboardingProps> = ({onNext, data}) => {
    const { t, i18n } = useTranslation('intro')
    const currentLanguage = i18n.language

    const [preferredLanguage, setPreferredLanguage] = useState<string>(currentLanguage);
    const [currentRegion, setCurrentRegion] = useState<string>("US")

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.currentTarget.value;
        i18n.changeLanguage(value)
    }

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = e.currentTarget.value;
        setCurrentRegion(value);
    }

    const handleSubmit = () => {
        data.account.language = preferredLanguage;
        data.account.region = currentRegion;
        
        onNext(1, data)
        // TO DO: Region variable only updates when actually selected. Consider automatic region detection, etc.
    }

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('greeting')}</h1>
                <InputSelect value={currentLanguage} onChange={handleChange} title={t('chooseYourLanguage')}>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="pl">Polski</option>
                    <option value="ru">Русский</option>
                </InputSelect>
                <InputSelect onChange={handleRegionChange} title={t('chooseYourRegion')}>
                    {
                        supportedCountries.map((country: string) => {
                            return (
                                <option value={country}>{t(country, {ns: "countries"})}</option>
                            )
                        }) 
                    }
                </InputSelect>
                <Button onClick={handleSubmit}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingLanguage;