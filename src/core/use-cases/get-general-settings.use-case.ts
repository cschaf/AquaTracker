import type { GeneralSettingsGateway } from '../gateways/general-settings.gateway';
import type { GeneralSettings } from '../entities/general-settings';

export class GetGeneralSettingsUseCase {
  constructor(private readonly generalSettingsGateway: GeneralSettingsGateway) {}

  async execute(): Promise<GeneralSettings | null> {
    return this.generalSettingsGateway.get();
  }
}
