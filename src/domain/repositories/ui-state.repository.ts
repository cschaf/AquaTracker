import type { Page } from '../entities';

export interface UiStateRepository {
  getActivePage(): Promise<Page | undefined>;
  setActivePage(page: Page): Promise<void>;
}
