import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface NavigationEntry {
    pageId: string;
    sectionId: string | null;
    params?: any;
}

interface SettingsRouterContextType {
    stack: NavigationEntry[];
    push: (pageId: string, sectionId?: string | null, params?: any) => void;
    pop: () => void;
    reset: (pageId: string, sectionId?: string | null, params?: any) => void;
    currentEntry: NavigationEntry | null;
    getParams: <T>() => T;
}

const SettingsRouterContext = createContext<SettingsRouterContextType | undefined>(undefined);

export const SettingsRouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stack, setStack] = useState<NavigationEntry[]>([]);

    const push = useCallback((pageId: string, sectionId: string | null = null, params: any = {}) => {
        setStack(prev => [...prev, { pageId, sectionId, params }]);
    }, []);

    // return back
    const pop = useCallback(() => {
        setStack(prev => {
            if (prev.length <= 1) return prev; // no root deletion
            return prev.slice(0, -1);
        });
    }, []);

    // history reset
    const reset = useCallback((pageId: string, sectionId: string | null = null, params: any = {}) => {
        setStack([{ pageId, sectionId, params }]);
    }, []);

    const currentEntry = stack.length > 0 ? stack[stack.length - 1] : null;

    const getParams = <T,>() => {
        return (currentEntry?.params || {}) as T;
    };

    return (
        <SettingsRouterContext.Provider value={{ stack, push, pop, reset, currentEntry, getParams }}>
            {children}
        </SettingsRouterContext.Provider>
    );
};

export const useSettingsRouter = () => {
    const context = useContext(SettingsRouterContext);
    if (context === undefined) {
        throw new Error('useSettingsRouter must be used within a SettingsRouterProvider');
    }
    return context;
};