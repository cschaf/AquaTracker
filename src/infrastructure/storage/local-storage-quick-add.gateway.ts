import type { QuickAddGateway } from '../../core/gateways/quick-add.gateway';
import type { QuickAddValues } from '../../core/entities/quick-add-values';

const QUICK_ADD_VALUES_KEY = 'quickAddValues';
const DEFAULT_QUICK_ADD_VALUES: QuickAddValues = [250, 500, 1000];

export class LocalStorageQuickAddGateway implements QuickAddGateway {
  async getQuickAddValues(): Promise<QuickAddValues> {
    const savedValues = localStorage.getItem(QUICK_ADD_VALUES_KEY);
    if (savedValues) {
      try {
        const parsedValues = JSON.parse(savedValues);
        if (Array.isArray(parsedValues) && parsedValues.length === 3 && parsedValues.every(v => typeof v === 'number')) {
          return parsedValues as QuickAddValues;
        }
      } catch (error) {
        console.error("Failed to parse quick add values from local storage", error);
        return DEFAULT_QUICK_ADD_VALUES;
      }
    }
    return DEFAULT_QUICK_ADD_VALUES;
  }

  async saveQuickAddValues(values: QuickAddValues): Promise<void> {
    localStorage.setItem(QUICK_ADD_VALUES_KEY, JSON.stringify(values));
  }
}
