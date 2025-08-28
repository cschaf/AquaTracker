import type { QuickAddGateway } from '../gateways/quick-add.gateway';
import type { QuickAddValues } from '../entities/quick-add-values';

export class GetQuickAddValuesUseCase {
  constructor(private readonly quickAddGateway: QuickAddGateway) {}

  async execute(): Promise<QuickAddValues> {
    return this.quickAddGateway.getQuickAddValues();
  }
}
