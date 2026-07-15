import { OnboardingDataType } from "./Index";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import IconGlobe from "@/components/icons/Globe";
import List from "@/components/common/Table/List";
import IconArrowRight from "@/components/icons/ArrowRight";

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

    const handleChange = async (lng: string) => {
        setPreferredLanguage(lng);
        await i18n.changeLanguage(lng);
        //await makeFetchRequest({
        //    url: '/locale',
        //    body: { locale: lng },
        //    credentials: "include",
        //})
        router.refresh();
    }

    const handleSubmit = async (lng: string) => {
        data.account.language = lng;
        await handleChange(lng);
        
        onNext(1, data)
        // TO DO: Region variable only updates when actually selected. Consider automatic region detection, etc.
    }

    const languageOptions = [
        {
            label: "Deutsch",
            code: "de"
        },
        {
            label: "English",
            code: "en"
        },
        {
            label: "русский",
            code: "ru"
        },
        {
            label: "polski",
            code: "pl"
        }
    ]

    return (
        <>
            <div className="intro__content">
                <IconGlobe className="icon-lg"/>
                <List items={languageOptions.map((item, index) => {
                    return {
                        content: <em>{item.label}</em>,
                        action: [
                            {
                                icon: <IconArrowRight/>,
                                onClick: () => handleSubmit(item.code)
                            }
                        ]
                    }
                })}/>
            </div>
            <p>Some shits here</p>
        </>
    )
}

export default OnboardingLanguage;