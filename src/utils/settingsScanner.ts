interface SettingsModule {
    default?: {
        id: string;
        label: string;
        category: string;
        component: React.ComponentType;
    };
    settings?: {
        id: string;
        label: string;
        category: string;
        component: React.ComponentType;
    };
    // Handle the case where the default export is the component itself
    defaultComponent?: React.ComponentType;
}

import settingsManifest from '@/components/settings/settings-manifest.json';
import { LazySettingsPage, SettingsPage } from '@/contexts/SettingsRegistryContext';
import React from 'react';

export class SettingsScanner {
    private static instance: SettingsScanner;
    private registered: boolean = false;
    private componentCache = new Map<string, React.ComponentType>();

    private constructor() {}

    static getInstance(): SettingsScanner {
        if (!SettingsScanner.instance) {
            SettingsScanner.instance = new SettingsScanner();
        }
        return SettingsScanner.instance;
    }

    async scanAndRegister(registerFunction: (page: Omit<SettingsPage, 'component'> & { loader: () => Promise<React.ComponentType> }) => void): Promise<void> {
        if (this.registered) return;

        try {
            for (const manifestItem of settingsManifest) {
                try {
                    /* Sort of contradicts lazy loading as it is already importing the whole component
                    *  Consider a different approach with exporting metadata separately to ensure the whole component isn't loaded.
                    */
                    const module = await import(
                        /* @vite-ignore */ `@components/settings/${manifestItem.path}`
                    );
                    
                    // Handle clumsy developers who have exported more default.
                    const settingsConfig = module.default || module.settings;
                    
                    if (settingsConfig && settingsConfig.id) {
                        // In relation to above imports, this is where the actual component is meant to be imported.
                        const loader = async (): Promise<React.ComponentType> => {
                            // Check cache
                            if (this.componentCache.has(manifestItem.path)) {
                                return this.componentCache.get(manifestItem.path)!;
                            }
                            
                            try {
                                // If not, import the actual component (metadata approach mentioned)
                                const lazyModule = await import(
                                    /* @vite-ignore */ `@components/settings/${manifestItem.path}`
                                );
                                
                                const lazyConfig = lazyModule.default || lazyModule.settings;
                                let component: React.ComponentType;
                                
                                // Handle different export patterns
                                if (lazyConfig?.component) {
                                    // Case 1: { default: { component: Component, ... } }
                                    component = lazyConfig.component;
                                } else if (lazyModule.default && typeof lazyModule.default === 'function') {
                                    // Case 2: default export is the component itself
                                    component = lazyModule.default;
                                } else if (lazyModule.default?.default && typeof lazyModule.default.default === 'function') {
                                    // Case 3: Nested default export
                                    component = lazyModule.default.default;
                                } else {
                                    throw new Error(`No valid component found for ${manifestItem.path}`);
                                }
                                
                                this.componentCache.set(manifestItem.path, component);
                                return component;
                            } catch (error) {
                                console.error(`Failed to load component for ${manifestItem.path}:`, error);
                                // Fallback
                                return () => React.createElement('div', null, `Failed to load: ${manifestItem.path}`);
                            }
                        };

                        // Register metadata + loader instead of actual component
                        registerFunction({
                            id: settingsConfig.id,
                            label: settingsConfig.label,
                            category: settingsConfig.category,
                            loader
                        });
                        console.log(`Registered settings page metadata: ${settingsConfig.label}`);
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

    // Method to load a specific component by ID
    async loadComponent(id: string, pages: Array<SettingsPage | LazySettingsPage>): Promise<React.ComponentType | null> {
        // Check if it's already a loaded component
        const existingPage = pages.find(page => page.id === id) as SettingsPage;
        if (existingPage && 'component' in existingPage) {
            return existingPage.component;
        }

        // Find the lazy page and load it
        const lazyPage = pages.find(page => page.id === id) as LazySettingsPage;
        if (lazyPage && 'loader' in lazyPage) {
            try {
                const component = await lazyPage.loader();
                return component;
            } catch (error) {
                console.error(`Failed to load component for ${id}:`, error);
                return null;
            }
        }

        return null;
    }
}