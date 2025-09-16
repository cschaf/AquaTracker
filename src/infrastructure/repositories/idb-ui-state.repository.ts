import type { UiStateRepository } from '../../domain/repositories';
import type { Page } from '../../domain/entities';
import { get, set } from 'idb-keyval';

const UI_STATE_ACTIVE_PAGE_KEY = 'uiState:activePage';

export class IdbUiStateRepository implements UiStateRepository {
  async getActivePage(): Promise<Page | undefined> {
    const savedPage = await get<Page>(UI_STATE_ACTIVE_PAGE_KEY);
    return savedPage;
  }

  async setActivePage(page: Page): Promise<void> {
    await set(UI_STATE_ACTIVE_PAGE_KEY, page);
  }
}
