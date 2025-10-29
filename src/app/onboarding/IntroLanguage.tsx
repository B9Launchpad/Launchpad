import InputSelect from "../../components/common/Input/SelectInput";
import IntroLayout from "../../components/layout/IntroLayout";
import { supportedCountries } from "../../functions/SupportedCountries";
import Button from "../../components/common/Button";
import { OnboardingDataType } from "./Index";
import { useState } from "react";
import makeFetchRequest from "@/utils/fetch/makeFetchRequest";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface OnboardingProps {
    onNext: (addSteps: number, data: OnboardingDataType) => void;
    data: OnboardingDataType
}

const OnboardingLanguage: React.FC<OnboardingProps> = ({onNext, data}) => {
    const { t, i18n } = useTranslation('intro');
    const router = useRouter()
    
    const currentLanguage = i18n.language;
    const [preferredLanguage, setPreferredLanguage] = useState<string>(currentLanguage);
    const [currentRegion, setCurrentRegion] = useState<string>("US");

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        let newLocale = e.currentTarget.value;
        setPreferredLanguage(newLocale);
        await i18n.changeLanguage(newLocale);
        await makeFetchRequest({
            url: '/locale',
            body: {locale: newLocale},
            credentials: "include",
        })
        router.refresh();
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

    const regionOptions = 
    supportedCountries.map((country: string) => ({
        value: country,
        label: t(country, {ns: "countries"})
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

    const languageOptions = [
        {
            value: "en",
            label: "English",
        },
        {
            value: "de",
            label: "Deutsch"
        },
        {
            label: "русский",
            value: "ru"
        },
        {
            label: "polski",
            value: "pl"
        }
    ]

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('greeting')}</h1>
                <InputSelect options={languageOptions} value={preferredLanguage} onChange={handleChange} label={t('chooseYourLanguage')}>
                </InputSelect>
                <InputSelect options={regionOptions} onChange={handleRegionChange} label={t('chooseYourRegion')}>
                </InputSelect>
                <Button onClick={handleSubmit}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingLanguage;