import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetQuickAddValuesUseCase } from '../../../src/domain/usecases/get-quick-add-values.usecase';
import { mockQuickAddRepository } from '../__mocks__/repositories/mock-quick-add.repository';
import type { QuickAddRepository } from '../../../src/domain/repositories';
import type { QuickAddValues } from '../../../src/domain/entities';

describe('GetQuickAddValuesUseCase', () => {
  let useCase: GetQuickAddValuesUseCase;
  let mockRepository: QuickAddRepository;

  beforeEach(() => {
    mockRepository = mockQuickAddRepository();
    useCase = new GetQuickAddValuesUseCase(mockRepository);
  });

  it('should return the quick add values from the repository', async () => {
    // Arrange
    const expectedValues: QuickAddValues = [100, 200, 300];
    (mockRepository.getQuickAddValues as ReturnType<typeof vi.fn>).mockResolvedValue(expectedValues);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockRepository.getQuickAddValues).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedValues);
  });
});
