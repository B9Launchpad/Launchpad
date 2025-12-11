import modulesManifest from '@/modules/modules.manifest.json';
import { CachedSettingsPageSection, SettingsPage } from '@/contexts/SettingsRegistryContext';
import React from 'react';
import { ModuleManifest, SettingsManifestPageSection } from '@/modules/module.utils';

// section
export interface SettingsPageSection {
    id: string;
    label: string;
    default?: boolean;
    loader: () => Promise<React.ComponentType>;
}

// manifest
export interface SettingsManifestPage {
    id: string;
    label: string;
    folderName?: string;
    category: 'user' | 'panel' | 'misc' | string;
    sections: SettingsManifestPageSection[];
    nested?: SettingsManifestPage[];
}

// modules manifest
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
        // should protect from double-scan but commented due to bugs
        // if (this.registered) return;

        try {
            for (const moduleItem of modulesManifest as ModulesManifest[]) {
                if (!moduleItem.hasSettings) continue;

                try {
                    const moduleManifestImport = await import(
                        `@/modules/${moduleItem.manifestPath}`
                    );

                    const settingsConfig: ModuleManifest = moduleManifestImport.default || moduleManifestImport.moduleManifest;

                    if (!settingsConfig.settings) {
                        console.warn(`No settings configuration found in module manifest for ${moduleItem.module}`);
                        continue;
                    }

                    // single page processing helper function
                    const processPage = (pageConfig: any, parentFolderName: string | undefined, isNested: boolean) => {
                        const pageSections: SettingsPageSection[] = [];
                        
                        // own or parent folder
                        const currentFolderName = pageConfig.folderName || parentFolderName;

                        for (const section of pageConfig.sections) {
                            const loader = async (): Promise<React.ComponentType> => {
                                const cacheKey = `${pageConfig.id}-${section.id}`;

                                if (this.componentCache.has(cacheKey)) {
                                    return this.componentCache.get(cacheKey)!;
                                }

                                try {
                                    const sectionFileName = section.fileName.replace(/\.(tsx|ts)$/, '');
                                    const importPath = currentFolderName
                                        ? `${moduleItem.module}/settings/${currentFolderName}/${sectionFileName}`
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
                                    console.error(`Failed to load component for ${pageConfig.id}.${section.id}:`, error);
                                    return () => React.createElement('div', null, `Failed to load: ${pageConfig.label} - ${section.label}`);
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
                            id: pageConfig.id,
                            label: pageConfig.label,
                            ns: moduleItem.locales === false ? undefined : `module-${moduleItem.module}`,
                            category: pageConfig.category || 'misc',
                            sections: pageSections,
                            isNested: isNested
                        });

                        // recursive nested processing
                        if (pageConfig.nested && Array.isArray(pageConfig.nested)) {
                            for (const nestedPage of pageConfig.nested) {
                                // inherit parent category
                                const nestedConfig = {
                                    ...nestedPage,
                                    category: nestedPage.category || pageConfig.category
                                };
                                processPage(nestedConfig, currentFolderName, true);
                            }
                        }
                    };

                    // root settings tabs
                    for (const settingsPage of settingsConfig.settings) {
                        processPage(settingsPage, undefined, false);
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

    async loadComponent(id: string, sectionId: string, pages: Array<SettingsPage | any>): Promise<React.ComponentType | null> {
        // checked cached.
        const page = pages.find((p: any) => p.id === id);
        
        if (page && 'sections' in page) {
            // check cached section.
            const section = page.sections.find((s: any) => s.id === sectionId);
            if (section && 'component' in section) {
                return section.component;
            }
            
            // Check loader
            if (section && 'loader' in section) {
                try {
                    const component = await section.loader();
                    return component;
                } catch (error) {
                    console.error(`Failed to load component for ${id}:`, error);
                    return null;
                }
            }
        }
        return null;
    }
}