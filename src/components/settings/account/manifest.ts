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
        }
    ]
};

export default metadata;