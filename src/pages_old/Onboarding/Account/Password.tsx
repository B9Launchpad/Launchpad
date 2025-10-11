import IntroLayout from "../../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import InputString from "../../../components/common/Input/StringInput";
import InputCheckbox, { CheckboxState, id } from "../../../components/common/Input/Checkbox";
import { useRef, useState } from "react";
import NewPassword, { NewPasswordRef } from "../../../components/common/Input/NewPassword";
import { OnboardingDataType } from "../Index";

interface OnboardingProps {
    onNext: (addSteps: number, data: OnboardingDataType) => void;
    data: OnboardingDataType;
}

const OnboardingPassword: React.FC<OnboardingProps> = ({ onNext, data }) => {
    const { t } = useTranslation('intro')
    const newPasswordRef = useRef<NewPasswordRef>(null);
    const [stepsToAdd, setStepsToAdd] = useState<1 | 2>(2)

    const checkboxOptions = [
        { id: "TFA", label: t('security.password.configure2FA'), description: t('security.password.2FAInstructions', {productName: t('Launchpad', {ns: "general"})}) },
        { id: "TFAForAll", label: t('security.password.require2FA') },
    ]

    const handleClick = () => {
        const isValid = newPasswordRef.current?.validate();
        if(!isValid || typeof isValid === undefined) return;

        data.account.password = isValid;
        // isValid returns a the password if it has passed all the checks, use this to send a request to the server.
        onNext(stepsToAdd, data);
    }

    const handle2FAtoggle = (checkboxState: { [key in id]: CheckboxState }) => {
        if(checkboxState.TFA == true) {
            setStepsToAdd(2)
        } else {
            setStepsToAdd(1);
        }

        // TODO: Add a message to the server to enable 2FA for everyone using TFAForAll
    }

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>{t('security.password.title')}</h1>
                <NewPassword ref={newPasswordRef}></NewPassword>
                
                <InputCheckbox options={checkboxOptions} onToggle={(checkboxState) => handle2FAtoggle(checkboxState)}></InputCheckbox>

                <Button onClick={handleClick}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingPassword;