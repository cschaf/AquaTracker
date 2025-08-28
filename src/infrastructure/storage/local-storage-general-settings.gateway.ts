import type { GeneralSettingsGateway } from '../../core/gateways/general-settings.gateway';
import type { GeneralSettings } from '../../core/entities/general-settings';

const STORAGE_KEY = 'general-settings';

export class LocalStorageGeneralSettingsGateway implements GeneralSettingsGateway {
  async get(): Promise<GeneralSettings | null> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  async save(settings: GeneralSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}
