import { ModuleManifest } from "../module.utils";


export const moduleManifest: ModuleManifest = {
    id: "core.launchpad.settings",
    settings: [
        {
            id: 'core.launchpad.account',
            folderName: "account",
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
        },
        {
            id: 'about',
            label: 'About',
            folderName: "about",
            category: 'misc',
            sections: [
                {
                    id: 'about',
                    label: 'About',
                    default: true,
                    fileName: "about.tsx"
                }
            ]
        }
    ]
};