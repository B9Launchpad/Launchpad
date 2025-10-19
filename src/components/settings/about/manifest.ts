import { SettingsManifest } from "@/utils/settingsScanner";

const metadata: SettingsManifest = {
    id: 'about',
    label: 'About',
    category: 'misc',
    sections: [
        {
            id: 'about',
            label: 'About',
            default: true,
            fileName: "about.tsx"
        }
    ]
};

export default metadata;