import { supportedCountries } from "../../functions/SupportedCountries";
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

const OnboardingRegion: React.FC<OnboardingProps> = ({onNext, data}) => {
    const { t } = useTranslation('intro');

    const handleSubmit = async (region: string) => {
        data.account.region = region;
        
        onNext(1, data)
        // TO DO: Region variable only updates when actually selected. Consider automatic region detection, etc.
    }

    const regionOptions =
        supportedCountries.map((country: string) => ({
            value: country,
            content: t(country, { ns: "countries" })
        }))
            .sort((a, b) => a.content.localeCompare(b.content))

    return (
        <>
            <div className="intro__content">
                <h1>{t('chooseYourRegion')}</h1>
                <List items={regionOptions.map((item) => {
                    return {
                        content: <em>{item.content}</em>,
                        action: [
                            {
                                icon: <IconArrowRight/>,
                                onClick: () => handleSubmit(item.value)
                            }
                        ]
                    }
                })}/>
            </div>
            <p>Some shits here</p>
        </>
    )
}

export default OnboardingRegion;