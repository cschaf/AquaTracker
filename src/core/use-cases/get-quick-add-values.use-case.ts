import type { QuickAddGateway } from '../gateways/quick-add.gateway';
import type { QuickAddValues } from '../entities/quick-add-values';

export class GetQuickAddValuesUseCase {
  private readonly quickAddGateway: QuickAddGateway;

  constructor(quickAddGateway: QuickAddGateway) {
    this.quickAddGateway = quickAddGateway;
  }

  async execute(): Promise<QuickAddValues> {
    return this.quickAddGateway.getQuickAddValues();
  }
}
