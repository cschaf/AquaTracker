import { useUseCases } from '../../app/use-case-provider';
import { useEffect, useState } from 'react';
import type { GeneralSettings } from '../../core/entities/general-settings';

export const useGeneralSettings = () => {
  const { getGeneralSettings, updateGeneralSettings } = useUseCases();

  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    getGeneralSettings.execute().then(setSettings);
  }, [getGeneralSettings]);

  const updateSettings = (newSettings: GeneralSettings) => {
    updateGeneralSettings.execute(newSettings).then(() => {
      setSettings(newSettings);
    });
  };

  return {
    settings,
    updateSettings,
  };
};
