import IntroLayout from "../../../components/layout/IntroLayout";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import SmallTable, { Column } from "../../../components/common/Table/Table";
import { OnboardingDataType } from "../Index";

interface OnboardingProps {
    onNext: (stepsToAdd: number, data: OnboardingDataType) => void;
    data: OnboardingDataType;
}

interface InvitedUser {
    email: string;
}

const OnboardingAssignAdmins: React.FC<OnboardingProps> = ({ onNext, data }) => {
    const { t } = useTranslation('intro')

    const handleSubmit = () => {
        
    }

    //const items: InvitedUser[] = invitedUsers.map(email => ({ email }));

    const invitedUsers: InvitedUser[] = data.invitedUsers?.map(user => ({
        email: user.email
    }))

    const columns: Column<InvitedUser>[] = [
        { header: "User", accessor: "email"}
    ]

    return (
        <IntroLayout>
            <div className="intro__content">
                <div>
                    <h1>Make them administrators?</h1>
                    <h2>Place a check next to accounts that you would like to grant administrator permissions to</h2>
                </div>
                <SmallTable allowSorting={false} allowSelection={true} columns={columns} data={invitedUsers}></SmallTable>
                <Button onClick={handleSubmit}>{t("continue", {ns: "general"})}</Button>
            </div>
            <p>Some shits here</p>
        </IntroLayout>
    )
}

export default OnboardingAssignAdmins;