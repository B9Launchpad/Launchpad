import IntroLayout from "../../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import InputChips, { InputChipsRef } from "../../../components/common/Input/Chips";
import validateEmail from "../../../functions/validateEmail";
import { useRef } from "react";
import { OnboardingDataType } from "../Index";

interface OnboardingProps {
    onNext: (stepsToAdd: number, data: OnboardingDataType) => void;
    data: OnboardingDataType;
}

const OnboardingAddUsers: React.FC<OnboardingProps> = ({ onNext, data }) => {
    const { t } = useTranslation('intro')
    const addUsersRef = useRef<InputChipsRef>(null);

    const handleSubmit = () => {
        const chips = addUsersRef.current?.get();
        if(chips) {
            const invitedUsers = chips.map(email => ({
                email: email,
                admin: false,
            }))
            data.invitedUsers = invitedUsers;
            onNext(1, data)
        } else {
            onNext(2, data)
        }
        
    }

    return (
        <IntroLayout>
            <div className="intro__content">
                <h1>Your employees</h1>
                <InputChips maxArrayLength={10} ref={addUsersRef} type="string" autoComplete="email" required={false} label="Invite users to register" description="Please type the e-mail addresses of people you would like to add to this panel. You may add up to 10 people here – you will be able to add more later in settings."></InputChips>
                <Button onClick={handleSubmit}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingAddUsers;