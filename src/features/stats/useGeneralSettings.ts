import { useUseCase } from '../../app/use-case-provider';
import { GetGeneralSettingsUseCase } from '../../core/use-cases/get-general-settings.use-case';
import { UpdateGeneralSettingsUseCase } from '../../core/use-cases/update-general-settings.use-case';
import { useEffect, useState } from 'react';
import { GeneralSettings } from '../../core/entities/general-settings';

export const useGeneralSettings = () => {
  const getGeneralSettingsUseCase = useUseCase(GetGeneralSettingsUseCase);
  const updateGeneralSettingsUseCase = useUseCase(UpdateGeneralSettingsUseCase);

  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    getGeneralSettingsUseCase.execute().then(setSettings);
  }, [getGeneralSettingsUseCase]);

  const updateSettings = (newSettings: GeneralSettings) => {
    updateGeneralSettingsUseCase.execute(newSettings).then(() => {
      setSettings(newSettings);
    });
  };

  return {
    settings,
    updateSettings,
  };
};
