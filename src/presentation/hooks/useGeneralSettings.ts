import { useUseCases } from '../../di';
import { useEffect, useState } from 'react';
import type { GeneralSettings } from '../../domain';
import { eventBus } from '../lib/event-bus/event-bus'; // This will be moved later

export const useGeneralSettings = () => {
  const { getGeneralSettings, updateGeneralSettings } = useUseCases();

  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    getGeneralSettings.execute().then(setSettings);
  }, [getGeneralSettings]);

  const updateSettings = (newSettings: GeneralSettings) => {
    updateGeneralSettings.execute(newSettings).then(() => {
      setSettings(newSettings);
      // The use case is now responsible for persistence.
      // The hook is responsible for updating local state and notifying other parts of the UI.
      eventBus.emit('settingsChanged', newSettings);
    });
  };

  return {
    settings,
    updateSettings,
  };
};
