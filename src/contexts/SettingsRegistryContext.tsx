import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SettingsScanner } from '@utils/settingsScanner';

export interface SettingsPage {
  id: string;
  label: string;
  category: 'user' | 'panel' | 'misc' | string;
  component: React.ComponentType;
}

interface SettingsRegistryContextType {
  registeredPages: SettingsPage[];
  registerSettingsPage: (page: SettingsPage) => void;
  unregisterSettingsPage: (id: string) => void;
  getPagesByCategory: (category: string) => SettingsPage[];
  isScanning: boolean;
}

const SettingsRegistryContext = createContext<SettingsRegistryContextType | undefined>(undefined);

export const SettingsRegistryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registeredPages, setRegisteredPages] = useState<SettingsPage[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const registerSettingsPage = (page: SettingsPage) => {
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
  };

  const getPagesByCategory = (category: string) => {
    return registeredPages.filter(page => page.category === category);
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
      isScanning
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