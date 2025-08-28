import type { GeneralSettingsGateway } from '../gateways/general-settings.gateway';
import type { GeneralSettings } from '../entities/general-settings';

export class UpdateGeneralSettingsUseCase {
  constructor(private readonly generalSettingsGateway: GeneralSettingsGateway) {}

  async execute(settings: GeneralSettings): Promise<void> {
    await this.generalSettingsGateway.save(settings);
  }
}
