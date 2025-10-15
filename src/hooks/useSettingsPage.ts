import { useEffect } from 'react';
import { useSettingsRegistry, SettingsPage } from '@/contexts/SettingsRegistryContext';

export const useSettingsPage = (page: SettingsPage) => {
  const { registerSettingsPage, unregisterSettingsPage } = useSettingsRegistry();

  useEffect(() => {
    registerSettingsPage(page);

    // Cleanup on unmount
    return () => {
      unregisterSettingsPage(page.id);
    };
  }, [page, registerSettingsPage, unregisterSettingsPage]);
};