import modulesManifest from '@/modules/modules.manifest.json';
import { CachedSettingsPageSection, LazySettingsPage, SettingsPage } from '@/contexts/SettingsRegistryContext';
import React from 'react';
import { ModuleManifest, SettingsManifestPageSection } from '@/modules/module.utils';

export interface SettingsPageSection {
    id: string;
    label: string;
    default?: boolean;
    loader: () => Promise<React.ComponentType>;
}

export interface SettingsManifest {
    id: string;
    label: string;
    ns?: string;
    category: 'user' | 'panel' | 'misc';
    sections: SettingsManifestPageSection[];
}

interface ModulesManifest {
    module: string;
    manifestPath: string;
    hasSettings: boolean;
    locales?: false | [];
    settingsPages?: string[];
}

export class SettingsScanner {
    private static instance: SettingsScanner;
    private registered: boolean = false;
    private componentCache = new Map<string, React.ComponentType>();

    private constructor() { }

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
            for (const moduleItem of modulesManifest as ModulesManifest[]) {
                if (!moduleItem.hasSettings) continue;

                try {
                    const moduleManifest = await import(
                        `@/modules/${moduleItem.manifestPath}`
                    );

                    const settingsConfig: ModuleManifest = moduleManifest.default || moduleManifest.moduleManifest;

                    if (!settingsConfig.settings) {
                        console.warn(`No settings configuration found in module manifest for ${moduleItem.module} but was declared in modules-manifest.json`);
                        continue;
                    }

                    for (const settingsPage of settingsConfig.settings) {
                        const pageSections: SettingsPageSection[] = [];

                        for (const section of settingsPage.sections) {
                            const loader = async (): Promise<React.ComponentType> => {
                                const cacheKey = `${settingsPage.id}-${section.id}`;

                                if (this.componentCache.has(cacheKey)) {
                                    return this.componentCache.get(cacheKey)!;
                                }

                                try {
                                    const sectionFileName = section.fileName.replace(/\.(tsx|ts)$/, '');
                                    const importPath = settingsPage.folderName
                                        ? `${moduleItem.module}/settings/${settingsPage.folderName}/${sectionFileName}`
                                        : `${moduleItem.module}/settings/${sectionFileName}`;

                                    const lazyModule = await import(
                                        `@/modules/${importPath}`
                                    );

                                    const component = lazyModule.default;

                                    if (!component) {
                                        throw new Error(`No default export found for ${importPath}`);
                                    }

                                    this.componentCache.set(cacheKey, component);
                                    return component;
                                } catch (error) {
                                    console.error(`Failed to load component for ${settingsPage.id}.${section.id}:`, error);
                                    return () => React.createElement('div', null, `Failed to load: ${settingsPage.label} - ${section.label}`);
                                }
                            };

                            pageSections.push({
                                id: section.id,
                                label: section.label,
                                default: section?.default,
                                loader: loader
                            });
                        }

                        registerFunction({
                            id: settingsPage.id,
                            label: settingsPage.label,
                            ns: moduleItem.locales === false ? undefined : `module-${moduleItem.module}`,
                            category: settingsPage.category,
                            sections: pageSections
                        });
                    }

                } catch (error) {
                    console.error(`Failed to load settings from module ${moduleItem.module}:`, error);
                }
            }

            this.registered = true;
        } catch (error) {
            console.error('Settings scanner failed with ', error);
        }
    }

    // Load a component by ID method.
    async loadComponent(id: string, sectionId: string, pages: Array<SettingsPage | LazySettingsPage>): Promise<React.ComponentType | null> {
        // Check cached.
        const page = pages.find(page => page.id === id) as SettingsPage;
        if (page && 'sections' in page) {
            const section = page.sections.find(s => s.id === sectionId);
            if (section && 'component' in section) {
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