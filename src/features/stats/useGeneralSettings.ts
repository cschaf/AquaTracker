import { useUseCases } from '../../app/use-case-provider';
import { useEffect, useState } from 'react';
import type { GeneralSettings } from '../../core/entities/general-settings';
import { eventBus } from '../../app/event-bus';

export const useGeneralSettings = () => {
  const { getGeneralSettings, updateGeneralSettings } = useUseCases();

  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    getGeneralSettings.execute().then(setSettings);
  }, [getGeneralSettings]);

  const updateSettings = (newSettings: GeneralSettings) => {
    updateGeneralSettings.execute(newSettings).then(() => {
      setSettings(newSettings);
      eventBus.emit('settingsChanged', newSettings);
    });
  };

  return {
    settings,
    updateSettings,
  };
};
