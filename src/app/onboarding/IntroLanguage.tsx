import InputSelect from "../../components/common/Input/SelectInput";
import IntroLayout from "../../components/layout/IntroLayout";
import { supportedCountries } from "../../functions/SupportedCountries";
import Button from "../../components/common/Button";
import { OnboardingDataType } from "./Index";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCookie } from "@/functions/useCookie";
import makeFetchRequest from "@/utils/fetch/makeFetchRequest";
import { useRouter } from "next/navigation";

interface OnboardingProps {
    onNext: (addSteps: number, data: OnboardingDataType) => void;
    data: OnboardingDataType
}

const OnboardingLanguage: React.FC<OnboardingProps> = ({onNext, data}) => {
    const t = useTranslations('intro')
    const tc = useTranslations('countries')
    const tg = useTranslations('general')
    const { getCookie } = useCookie()
    const router = useRouter()

    const [preferredLanguage, setPreferredLanguage] = useState<string>(getCookie("i18next") as string);
    const [currentRegion, setCurrentRegion] = useState<string>("US");

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        let newLocale = e.currentTarget.value;
        setPreferredLanguage(newLocale);
        await makeFetchRequest({
            url: '/locale',
            body: {locale: newLocale},
            includeCredentials: true,
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

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('greeting')}</h1>
                <InputSelect value={preferredLanguage} onChange={handleChange} title={t('chooseYourLanguage')}>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="pl">polski</option>
                    <option value="ru">русский</option>
                </InputSelect>
                <InputSelect onChange={handleRegionChange} title={t('chooseYourRegion')}>
                    {
                        supportedCountries.map((country: string) => ({
                            key: country,
                            label: tc(country)
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map(({key, label}) => (
                            <option value={key} key={key}>{label}</option>
                        ))
                    }
                </InputSelect>
                <Button onClick={handleSubmit}>{tg("continue")}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingLanguage;