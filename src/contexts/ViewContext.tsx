// contexts/ViewContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

type ViewContextType = {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ViewContext.Provider value={{ showSettings, setShowSettings }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}