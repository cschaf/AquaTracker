import type { GeneralSettings } from '../entities/general-settings';

export interface GeneralSettingsGateway {
  get(): Promise<GeneralSettings | null>;
  save(settings: GeneralSettings): Promise<void>;
}
