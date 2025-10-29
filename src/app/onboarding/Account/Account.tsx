import IntroLayout from "../../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import PadSelect from "../../../components/misc/intro/PadSelect";
import InputString, { InputStringRef } from "../../../components/common/Input/StringInput";
import FileUpload from "../../../components/common/Input/FileUpload/FileUpload";
import { OnboardingDataType } from "../Index";
import { useRef, useState } from "react";
import Link from "next/link";

interface OnboardingProps {
    onNext: (addSteps: number, data: OnboardingDataType) => void;
    data: OnboardingDataType;
}

const OnboardingAccount: React.FC<OnboardingProps> = ({ onNext, data }) => {
    const { t } = useTranslation('intro')
    const nameRef = useRef<InputStringRef>(null)
    const emailRef = useRef<InputStringRef>(null)
    const [errors, setErrors] = useState<{ name?: string; email?: string, picture?: string }>({});

    const handleSubmit = () => {
        if(nameRef.current && emailRef.current) {
            // Check if name is filled out
            if(nameRef.current.value.length < 1) {
                nameRef.current.error(t("fillOutError", { ns: "general" }))
                return;
            }

            // Collect data from fields and push
            data.account.name = nameRef.current.value;
            data.account.email = emailRef.current.value;
            console.log(data);
            onNext(1, data);
        }
    }

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('personalDetails.title')}</h1>
                <InputString ref={nameRef} autoComplete={"name"} label={t('personalDetails.name')} isMandatory={true} type="string"></InputString>
                <InputString ref={emailRef} autoComplete={"email"} label={t('personalDetails.email')} value="gsafiannikov@b9creators.co.uk" disabled={true} isMandatory={true} type="string">
                    <small>
                        {t('personalDetails.wrongEmail')} <Link href={'/login/reset'}>{t('personalDetails.otherEmail')}</Link>
                    </small>
                </InputString>
                <FileUpload accept=".png" label={t('personalDetails.picture')} description={t('personalDetails.pictureInstructions')} allowMultiple={false}></FileUpload>
                <Button onClick={handleSubmit}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingAccount;