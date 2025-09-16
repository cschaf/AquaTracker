import type { UiStateRepository } from '../repositories';
import type { Page } from '../entities';

export class SetActivePageUseCase {
  private readonly uiStateRepository: UiStateRepository;

  constructor(uiStateRepository: UiStateRepository) {
    this.uiStateRepository = uiStateRepository;
  }

  async execute(page: Page): Promise<void> {
    await this.uiStateRepository.setActivePage(page);
  }
}
