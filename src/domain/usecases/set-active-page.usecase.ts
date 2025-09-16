import type { UiStateRepository } from '../repositories';
import type { Page } from '../entities';

export class SetActivePageUseCase {
  constructor(private readonly uiStateRepository: UiStateRepository) {}

  async execute(page: Page): Promise<void> {
    await this.uiStateRepository.setActivePage(page);
  }
}
