export interface SettingsManifestPageSection {
    id: string;
    label: string;
    default?: boolean;
    fileName: string;
}

export interface ModuleManifest {
    id: string;
    locales?: boolean;
    settings: Array<{
        id: string;
        label: string;
        category: 'user' | 'panel' | 'misc';
        folderName?: string;
        sections: SettingsManifestPageSection[];
    }>;
}