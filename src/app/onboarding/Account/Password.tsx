import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import InputCheckbox, { InputCheckboxRef } from "../../../components/common/Input/Checkbox";
import { useMemo, useRef } from "react";
import NewPassword, { NewPasswordRef } from "../../../components/common/Input/NewPassword";
import { OnboardingDataType } from "../Index";
import Form from "@/components/common/Input/Form";

interface OnboardingProps {
    onNext: (addSteps: number, data: OnboardingDataType) => void;
    data: OnboardingDataType;
}

const OnboardingPassword: React.FC<OnboardingProps> = ({ onNext, data }) => {
    const { t } = useTranslation('intro')
    const newPasswordRef = useRef<NewPasswordRef>(null);
    const checkboxRef = useRef<InputCheckboxRef>(null);

    const checkboxOptions = useMemo(() => ([
        { id: "TFA", label: t('security.password.configure2FA'), description: t('security.password.2FAInstructions', {productName: t('Launchpad', {ns: "general"})}) },
        { id: "TFAForAll", label: t('security.password.require2FA') },
    ]), [])

    const handleSubmit = () => {
        const isValid = newPasswordRef.current?.validate();
        if(!isValid) {
            return;
        }

        data.account.password = isValid;
        const checkboxValues = checkboxRef.current?.get();

        let steps = checkboxValues?.TFA === true ? 1 : 2;

        onNext(steps, data);
    }

    return (
        <Form onSubmit={handleSubmit} showSubmitButton={false}>
            <div className="intro__content">
                <h1>{t('security.password.title')}</h1>
                <NewPassword ref={newPasswordRef}/>
                <InputCheckbox ref={checkboxRef} options={checkboxOptions}/>
                <Button type={"submit"} onClick={handleSubmit}>{t("continue", {ns: "general"})}</Button>
            </div>
        </Form>
    )
}

export default OnboardingPassword;