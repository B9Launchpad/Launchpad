import { SettingsManifest } from "@/utils/settingsScanner";

const metadata: SettingsManifest = {
    id: 'account',
    label: 'Account',
    category: 'user',
    sections: [
        {
            id: 'account',
            label: 'Account',
            default: true,
            fileName: "account.tsx"
        },
        {
            id: 'teams',
            label: 'Teams',
            default: false,
            fileName: "teams.tsx"
        }
    ]
};

export default metadata;