import Button from "@/components/common/Button"
import InputCheckbox from "@/components/common/Input/Checkbox"
import FileUpload from "@/components/common/Input/FileUpload/FileUpload"
import InputString from "@/components/common/Input/StringInput"
import WindowComponent from "@/components/common/Window"
import WindowBlock from "@/components/modules/FormBlock"


const SettingsGeneral: React.FC = () => {

    return (
        <WindowComponent>
            <Company/>
            <Dashboard/>
            <Security/>
        </WindowComponent>
    )
}

const Company: React.FC = () => {
    return (
        <WindowBlock label="Company">
            <InputString type="string" label="Company name" description="It is recommended to use your legal trading name or trademark"></InputString>
            <WindowBlock label="Company logo">
                <FileUpload accept=".png .webp .jpeg .jpg .svg" />
            </WindowBlock>
        </WindowBlock>
    )
}

const Dashboard: React.FC = () => {

    return (
        <WindowBlock label="Dashboard and UI">
            <InputCheckbox onToggle={() => { return }} options={[
                { id: "helloworld", label: "Show company logo", description: "Company logo will replace B9 Creators in Launchpad." }
            ]}></InputCheckbox>
            <InputCheckbox onToggle={() => { return }} options={[
                { id: "helloworld", label: "Dashboard message", description: "Create a message that will appear on the dashboard for all users." }
            ]}></InputCheckbox>
            <div>
                <Button variant="secondary" label="Send custom notification" />
            </div>
        </WindowBlock>
    )
}

const Security: React.FC = () => {
    return (
        <WindowBlock label="Security & Authentication">
            <InputCheckbox onToggle={() => { return }} options={[
                { id: "helloworld", label: "Require 2FA for all users", description: "If checked, all users will need to set up two-factor authentication (2FA), such as a passkey or an authenticatior app to use their accounts. Users without 2FA set up will not have access to Launchpad until they have set up 2FA." }
            ]}></InputCheckbox>
            <InputCheckbox onToggle={() => { return }} options={[
                { id: "helloworld", label: "Require regular password changes", description: "All users will be required to change their password after a configurable period of time." }
            ]}></InputCheckbox>
        </WindowBlock>
    )
}

export default SettingsGeneral;