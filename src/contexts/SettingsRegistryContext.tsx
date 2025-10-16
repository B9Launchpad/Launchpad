import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SettingsScanner } from '@utils/settingsScanner';

export interface SettingsPage {
  id: string;
  label: string;
  category: 'user' | 'panel' | 'misc' | string;
  component: React.ComponentType;
}

export interface LazySettingsPage {
  id: string;
  label: string;
  category: 'user' | 'panel' | 'misc' | string;
  loader: () => Promise<React.ComponentType>;
}

interface SettingsRegistryContextType {
  registeredPages: Array<SettingsPage | LazySettingsPage>;
  registerSettingsPage: (page: SettingsPage | LazySettingsPage) => void;
  unregisterSettingsPage: (id: string) => void;
  getPagesByCategory: (category: string) => Array<SettingsPage | LazySettingsPage>;
  isScanning: boolean;
  loadComponent: (id: string) => Promise<React.ComponentType | null>;
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

  const loadComponent = async (id: string): Promise<React.ComponentType | null> => {
    if (loadedComponents.has(id)) {
      return loadedComponents.get(id)!;
    }

    const scanner = SettingsScanner.getInstance();
    const component = await scanner.loadComponent(id, registeredPages);
    
    if (component) {
      setLoadedComponents(prev => new Map(prev).set(id, component));
      
      // Update the page to be fully loaded
      setRegisteredPages(prev => 
        prev.map(page => 
          page.id === id 
            ? { ...page, component } as SettingsPage
            : page
        )
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