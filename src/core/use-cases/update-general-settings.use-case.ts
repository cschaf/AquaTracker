import type { GeneralSettingsGateway } from '../gateways/general-settings.gateway';
import type { GeneralSettings } from '../entities/general-settings';

export class UpdateGeneralSettingsUseCase {
  private readonly generalSettingsGateway: GeneralSettingsGateway;

  constructor(generalSettingsGateway: GeneralSettingsGateway) {
    this.generalSettingsGateway = generalSettingsGateway;
  }

  async execute(settings: GeneralSettings): Promise<void> {
    await this.generalSettingsGateway.save(settings);
  }
}
