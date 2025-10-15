interface SettingsModule {
    default?: {
        id: string;
        label: string;
        category: string;
        component: React.ComponentType;
        icon?: React.ReactNode;
        type?: 'primary' | 'secondary';
        critical?: boolean;
    };
    settings?: {
        id: string;
        label: string;
        category: string;
        component: React.ComponentType;
        icon?: React.ReactNode;
        type?: 'primary' | 'secondary';
        critical?: boolean;
    };
}

import settingsManifest from '@/components/settings/settings-manifest.json';

export class SettingsScanner {
    private static instance: SettingsScanner;
    private registered: boolean = false;

    private constructor() {}

    static getInstance(): SettingsScanner {
        if (!SettingsScanner.instance) {
            SettingsScanner.instance = new SettingsScanner();
        }
        return SettingsScanner.instance;
    }

    async scanAndRegister(registerFunction: (page: any) => void): Promise<void> {
        //if (this.registered) return;

        try {
            for (const manifestItem of settingsManifest) {
                try {
                    const module: SettingsModule = await import(
                        /* @vite-ignore */ `@components/settings/${manifestItem.path}`
                    );
                    
                    const settingsConfig = module.default || module.settings;
                    
                    if (settingsConfig && settingsConfig.id && settingsConfig.component) {
                        registerFunction(settingsConfig);
                        console.log(`Registered settings page: ${settingsConfig.label}`);
                    } else {
                        console.warn(`Invalid settings module at ${manifestItem.path}: missing id or component`);
                    }
                } catch (error) {
                    console.error(`Failed to load settings module ${manifestItem.path}:`, error);
                }
            }

            this.registered = true;
        } catch (error) {
            console.error('Settings scanner failed:', error);
        }
    }
}