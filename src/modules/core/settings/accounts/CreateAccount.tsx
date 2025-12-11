import NewPassword from "@/components/common/Input/NewPassword"
import InputSelect, { InputSelectOptions, InputSelectRef } from "@/components/common/Input/SelectInput"
import InputString, { InputStringRef } from "@/components/common/Input/StringInput"
import TableCompact, { Column } from "@/components/common/Table/TableCompact"
import List, { ListProps } from "@/components/common/Table/List"
import Profile from "@/components/common/User/Profile"
import TeamDisplay, { TeamDisplayProps } from "@/components/common/User/Team"
import Window from "@/components/common/Window"
import WindowBlock from "@/components/modules/FormBlock"
import validateEmail from "@/functions/validateEmail"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "@/components/common/Button"


const SettingsAccountsCreateAccount = () => {
    const [newUserData, setNewUserData] = useState(
        {
            role: "user",
            email: "",
            teams: [{label: "Executive", color: "blue", role: "user"}, {label: "Support", color: "orange", role: "admin"}] as TeamDisplayProps[],
        }
    );
    const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
    const emailInputRef = useRef<InputStringRef>(null);
    const roleSelectRef = useRef<InputSelectRef>(null);

    const roleOptions: InputSelectOptions = [
        {label: 'User', value: 'user'},
        {label: 'Admin', value: 'admin'}
    ]

    const handleEmailChange = () => {
        const value = emailInputRef.current!.get();
        if(!validateEmail(value)) {
            setIsValidEmail(false);
            return;
        }

        setIsValidEmail(true);
        setNewUserData((prev => ({...prev, email: value})))
    }

    const handleRoleChange = () => {
        setNewUserData((prev => ({...prev, role: roleSelectRef.current!.get()})))
    }

    useEffect(() => {
        if(!roleSelectRef.current) return;

        roleSelectRef.current.addEventListener("change", handleRoleChange);

        return () => {
            roleSelectRef.current?.removeEventListener("change", handleRoleChange);
        }
    }, [roleSelectRef.current]);

    interface NewAccount {
        property: string;
        value: string;
    }

    const columns: Column<NewAccount>[] = [
        { header: 'Property', accessor: 'property' },
        { header: 'Value', accessor: 'value' }
    ]

    const reviewData: NewAccount[] = useMemo(() => {

        const teamNames = newUserData.teams
            .map(t => t.label)
            .join(', ');

        return [
            { property: 'Email', value: isValidEmail ? newUserData.email : 'Invalid email' },
            { property: 'Role', value: newUserData.role },
            { property: 'Teams', value: teamNames || 'None' }
        ];
    }, [newUserData.email, newUserData.role, newUserData.teams, isValidEmail]);

    return (
        <>
            <Window label={"Basic information"} description="This data will be used to send user an invite e-mail and determine onboarding process.">
                <WindowBlock>
                    <InputString onChange={handleEmailChange} ref={emailInputRef} label="Email" required>
                        <small>Email address will be verified by the user upon registration.</small>
                    </InputString>
                    <InputSelect ref={roleSelectRef} label="Role" options={roleOptions}/>
                </WindowBlock>
            </Window>
            <Window label="Teams" description="This user will be automatically enrolled in the teams you choose upon registration." action={[{label: 'Add team'}]}>
                <List items={newUserData.teams.map((team, index) => {
                    return {
                        content: <TeamDisplay key={index} {...team}/>
                    }
                })}/>
            </Window>
            <Window action={[{label: "Create new account", disabled: !isValidEmail, type: 'submit'}]} label="Review" description="Please verify all data is correct before creating new account.">
                <Profile name={["Invited user", ""]} email={newUserData.email}/>
                <TableCompact columns={columns} data={reviewData}></TableCompact>
            </Window>
        </>
    )
}

export default SettingsAccountsCreateAccount;