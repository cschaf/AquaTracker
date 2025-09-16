import type { UiStateRepository } from '../repositories';
import type { Page } from '../entities';

export class GetActivePageUseCase {
  private readonly uiStateRepository: UiStateRepository;

  constructor(uiStateRepository: UiStateRepository) {
    this.uiStateRepository = uiStateRepository;
  }

  async execute(): Promise<Page | undefined> {
    return this.uiStateRepository.getActivePage();
  }
}
