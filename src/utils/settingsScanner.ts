interface SettingsManifestPageSection {
    id: string;
    label: string;
    default?: boolean;
    fileName: string;
}

export interface SettingsPageSection {
    id: string;
    label: string;
    default?: boolean;
    loader: () => Promise<React.ComponentType>;
}

export interface SettingsManifest {
    id: string;
    label: string;
    category: 'user' | 'panel' | 'misc';
    sections: SettingsManifestPageSection[];
}

import settingsManifest from '@/components/settings/settings-manifest.json';
import { CachedSettingsPageSection, LazySettingsPage, SettingsPage } from '@/contexts/SettingsRegistryContext';
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

    async scanAndRegister(
        registerFunction: (
            page: Omit<SettingsPage, 'sections'> & {
                sections: (
                    Omit<CachedSettingsPageSection, 'component'> & {
                      loader: () => Promise<React.ComponentType>;
                    }
                )[];
            }
        ) => void
    ): Promise<void> {
        //if (this.registered) return;

        try {
            for (const manifestItem of settingsManifest) {
                try {
                    /* Resolve metadata first.
                    *  
                    */
                    const manifest = await import(
                        /* @vite-ignore */ `@components/settings/${manifestItem.path}`
                    );
                    
                    // Handle clumsy developers who have exported more default.
                    const settingsConfig: SettingsManifest = manifest.default || manifest.settings;
                    
                    const pageSections: SettingsPageSection[] = []

                    if (settingsConfig && settingsConfig.id) {
                        for(const section of settingsConfig.sections) {
                            const loader = async (): Promise<React.ComponentType> => {
                                const cacheKey = `${manifestItem.name}-${section.id}`;
                                // Check cache
                                if (this.componentCache.has(cacheKey)) {
                                    return this.componentCache.get(cacheKey)!;
                                }

                                // if no cache then...
                                try {
                                    const lazyModule = await import(
                                        /* @vite-ignore */ `@components/settings/${manifestItem.name}/${section.fileName}`
                                    );

                                    const lazyConfig = lazyModule.default;
                                    let component: React.ComponentType;

                                    try {
                                        component = lazyConfig;
                                    } catch {
                                        throw new Error(`No valid component found for ${manifestItem.path}`);
                                    }

                                    this.componentCache.set(cacheKey, component);
                                    return component;
                                } catch (error) {
                                    console.error(`Failed to load component for ${manifestItem.path}:`, error);
                                    // Fallback
                                    return () => React.createElement('div', null, `Failed to load module from: ${manifestItem.path}`);
                                }
                            };
                            pageSections.push({id: section.id, label: section.label, default: section?.default, loader: loader})
                        }
                        registerFunction({
                            id: settingsConfig.id,
                            label: settingsConfig.label,
                            category: settingsConfig.category,
                            sections: pageSections
                        });
                        console.log(`Registered settings page metadata: ${settingsConfig.label}`);
                    } /**/ else {
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

    // Load a component by ID method.
    async loadComponent(id: string, sectionId: string, pages: Array<SettingsPage | LazySettingsPage>): Promise<React.ComponentType | null> {
        // Check cached.
        const page = pages.find(page => page.id === id) as SettingsPage;
        if(page && 'sections' in page) {
            const section = page.sections.find(s => s.id === sectionId);
            if(section && 'component' in section) {
                return section.component;
            }
        }

        // Find page if not in cache:
        const lazyPage = pages.find(page => page.id === id) as LazySettingsPage;
        const lazySection = lazyPage.sections.find(s => s.id === sectionId);
        if (lazySection && 'loader' in lazySection) {
            try {
                const component = await lazySection.loader();
                return component;
            } catch (error) {
                console.error(`Failed to load component for ${id}:`, error);
                return null;
            }
        }

        return null;
    }
}