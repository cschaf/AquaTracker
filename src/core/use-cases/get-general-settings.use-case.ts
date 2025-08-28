import type { GeneralSettingsGateway } from '../gateways/general-settings.gateway';
import type { GeneralSettings } from '../entities/general-settings';

export class GetGeneralSettingsUseCase {
  private readonly generalSettingsGateway: GeneralSettingsGateway;

  constructor(generalSettingsGateway: GeneralSettingsGateway) {
    this.generalSettingsGateway = generalSettingsGateway;
  }

  async execute(): Promise<GeneralSettings | null> {
    return this.generalSettingsGateway.get();
  }
}
