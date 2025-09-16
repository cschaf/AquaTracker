import type { UiStateRepository } from '../repositories';
import type { Page } from '../entities';

export class GetActivePageUseCase {
  constructor(private readonly uiStateRepository: UiStateRepository) {}

  async execute(): Promise<Page | undefined> {
    return this.uiStateRepository.getActivePage();
  }
}
