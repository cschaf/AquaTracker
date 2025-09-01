import type { QuickAddGateway } from '../gateways/quick-add.gateway';
import type { QuickAddValues } from '../entities/quick-add-values';
import { eventBus } from '../../app/event-bus';

export class UpdateQuickAddValuesUseCase {
  private readonly quickAddGateway: QuickAddGateway;

  constructor(quickAddGateway: QuickAddGateway) {
    this.quickAddGateway = quickAddGateway;
  }

  async execute(values: QuickAddValues): Promise<void> {
    if (!Array.isArray(values) || values.length !== 3) {
      throw new Error('Invalid quick add values format');
    }

    for (const value of values) {
      if (typeof value !== 'number' || value <= 0 || value > 5000) {
        throw new Error('Quick add values must be positive numbers not greater than 5000');
      }
    }

    await this.quickAddGateway.saveQuickAddValues(values);
    eventBus.emit('quickAddValuesChanged', undefined);
  }
}
