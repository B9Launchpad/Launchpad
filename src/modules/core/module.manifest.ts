import { ModuleManifest } from "../module.utils";


export const moduleManifest: ModuleManifest = {
    id: "core.launchpad.settings",
    settings: [
        {
            id: 'core.launchpad.account',
            folderName: "account",
            label: 'account.label',
            category: 'user',
            sections: [
                {
                    id: 'account',
                    label: 'account.sections.account.label',
                    default: true,
                    fileName: "account.tsx"
                },
                {
                    id: 'teams',
                    label: 'account.sections.teams.label',
                    default: false,
                    fileName: "teams.tsx"
                }
            ]
        },
        {
            id: 'core.launchpad.about',
            label: 'about.label',
            folderName: "about",
            category: 'misc',
            sections: [
                {
                    id: 'about',
                    label: 'about.label',
                    default: true,
                    fileName: "about.tsx"
                }
            ]
        },
        {
            id: 'core.launchpad.general',
            label: 'general.label',
            folderName: 'general',
            category: 'panel',
            sections: [
                {
                    id: 'general',
                    label: 'general.label',
                    default: true,
                    fileName: 'general.tsx'
                }
            ]
        }
    ]
};