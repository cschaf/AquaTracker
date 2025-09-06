import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MainPage extends BasePage {
  readonly goalInput: Locator;
  readonly quickAddButtons: Locator;
  readonly customAmountInput: Locator;
  readonly customAmountAddButton: Locator;
  readonly todaysEntriesList: Locator;

  constructor(page: Page) {
    super(page);
    this.goalInput = page.getByTestId('goal-input');
    this.quickAddButtons = page.getByTestId('quick-add-buttons');
    this.customAmountInput = page.getByTestId('custom-amount-input');
    this.customAmountAddButton = page.getByTestId('custom-amount-add-button');
    this.todaysEntriesList = page.getByTestId('todays-entries-list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async addCustomAmount(amount: number) {
    await this.customAmountInput.fill(amount.toString());
    await this.customAmountAddButton.click();
  }

  getEntry(entryId: string): Locator {
    return this.page.getByTestId(`entry-item-${entryId}`);
  }

  getEntryDeleteButton(entry: Locator): Locator {
    return entry.getByTestId('delete-entry-button');
  }
}
