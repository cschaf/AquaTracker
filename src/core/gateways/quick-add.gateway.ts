import type { QuickAddValues } from '../entities/quick-add-values';

export interface QuickAddGateway {
  getQuickAddValues(): Promise<QuickAddValues>;
  saveQuickAddValues(values: QuickAddValues): Promise<void>;
}
