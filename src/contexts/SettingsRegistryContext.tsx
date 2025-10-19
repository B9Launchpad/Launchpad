import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SettingsPageSection, SettingsScanner } from '@utils/settingsScanner';

export interface SettingsPage {
    id: string;
    label: string;
    category: 'user' | 'panel' | 'misc' | string;
    sections: CachedSettingsPageSection[]
}

export interface CachedSettingsPageSection {
    id: string,
    label: string,
    default?: boolean,
    component: React.ComponentType;
}

export interface LazySettingsPage {
    id: string;
    label: string;
    category: 'user' | 'panel' | 'misc' | string;
    sections: SettingsPageSection[];
}

interface SettingsRegistryContextType {
    registeredPages: Array<SettingsPage | LazySettingsPage>;
    registerSettingsPage: (page: SettingsPage | LazySettingsPage) => void;
    unregisterSettingsPage: (id: string) => void;
    getPagesByCategory: (category: string) => Array<SettingsPage | LazySettingsPage>;
    isScanning: boolean;
    loadComponent: (id: string, sectionId: string) => Promise<React.ComponentType | null>;
    loadedComponents: Map<string, React.ComponentType>;
}

const SettingsRegistryContext = createContext<SettingsRegistryContextType | undefined>(undefined);

export const SettingsRegistryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [registeredPages, setRegisteredPages] = useState<Array<SettingsPage | LazySettingsPage>>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [loadedComponents, setLoadedComponents] = useState(new Map<string, React.ComponentType>());

    const registerSettingsPage = (page: SettingsPage | LazySettingsPage) => {
        setRegisteredPages(prev => {
            if (prev.find(p => p.id === page.id)) {
                console.warn(`Settings page with id "${page.id}" is already registered`);
                return prev;
            }
            return [...prev, page];
        });
    };

    const unregisterSettingsPage = (id: string) => {
        setRegisteredPages(prev => prev.filter(page => page.id !== id));
        setLoadedComponents(prev => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
        });
    };

    const getPagesByCategory = (category: string) => {
        return registeredPages.filter(page => page.category === category);
    };

    const loadComponent = async (id: string, sectionId: string): Promise<React.ComponentType | null> => {
        const cacheId = `${id}-${sectionId}`;

        if (loadedComponents.has(cacheId)) {
            return loadedComponents.get(cacheId)!;
        }

        const scanner = SettingsScanner.getInstance();
        const component = await scanner.loadComponent(id, sectionId, registeredPages);

        if (component) {
            setLoadedComponents(prev => new Map(prev).set(cacheId, component));

            setRegisteredPages(prev => 
                prev.map(page => {
                    if (page.id !== id) return page;

                    // Section finder
                    const sections = (page as any).sections || [];
                    const updatedSections = sections.map((s: any) => 
                        s.id === sectionId 
                            ? { ...s, component } 
                            : s
                    );

                    // Cache bundle
                    const newPage: SettingsPage = {
                        id: page.id,
                        label: page.label,
                        category: page.category,
                        sections: updatedSections as CachedSettingsPageSection[]
                    };

                    return newPage;
                })
            );
        }

        return component;
    };

    // Auto-scan on provider mount
    useEffect(() => {
        const scanSettings = async () => {
            setIsScanning(true);
            const scanner = SettingsScanner.getInstance();
            await scanner.scanAndRegister(registerSettingsPage);
            setIsScanning(false);
        };

        scanSettings();
    }, []);

    return (
        <SettingsRegistryContext.Provider value={{
            registeredPages,
            registerSettingsPage,
            unregisterSettingsPage,
            getPagesByCategory,
            isScanning,
            loadComponent,
            loadedComponents
        }}>
            {children}
        </SettingsRegistryContext.Provider>
    );
};

export const useSettingsRegistry = () => {
    const context = useContext(SettingsRegistryContext);
    if (context === undefined) {
        throw new Error('useSettingsRegistry must be used within a SettingsRegistryProvider');
    }
    return context;
};