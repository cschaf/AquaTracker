import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateQuickAddValuesUseCase } from '../../../src/domain/usecases/update-quick-add-values.usecase';
import { mockQuickAddRepository } from '../__mocks__/repositories/mock-quick-add.repository';
import type { QuickAddRepository } from '../../../src/domain/repositories';
import { DomainError } from '../../../src/domain/errors';

describe('UpdateQuickAddValuesUseCase', () => {
  let useCase: UpdateQuickAddValuesUseCase;
  let mockRepository: QuickAddRepository;

  beforeEach(() => {
    mockRepository = mockQuickAddRepository();
    useCase = new UpdateQuickAddValuesUseCase(mockRepository);
  });

  it('should save valid quick add values', async () => {
    const validValues: [number, number, number] = [100, 200, 300];
    await useCase.execute(validValues);
    expect(mockRepository.saveQuickAddValues).toHaveBeenCalledWith(validValues);
  });

  it('should throw an error for non-array values', async () => {
    await expect(useCase.execute(null as any)).rejects.toThrow(DomainError);
  });

  it('should throw an error for arrays not of length 3', async () => {
    await expect(useCase.execute([100, 200] as any)).rejects.toThrow('Invalid quick add values format.');
    await expect(useCase.execute([100, 200, 300, 400] as any)).rejects.toThrow('Invalid quick add values format.');
  });

  it('should throw an error for non-numeric values', async () => {
    await expect(useCase.execute(['a', 'b', 'c'] as any)).rejects.toThrow('Quick add values must be positive integers not greater than 5000.');
  });

  it('should throw an error for non-integer values', async () => {
    await expect(useCase.execute([100.5, 200, 300])).rejects.toThrow('Quick add values must be positive integers not greater than 5000.');
  });

  it('should throw an error for zero or negative values', async () => {
    await expect(useCase.execute([0, 200, 300])).rejects.toThrow('Quick add values must be positive integers not greater than 5000.');
    await expect(useCase.execute([-100, 200, 300])).rejects.toThrow('Quick add values must be positive integers not greater than 5000.');
  });

  it('should throw an error for values greater than 5000', async () => {
    await expect(useCase.execute([5001, 200, 300])).rejects.toThrow('Quick add values must be positive integers not greater than 5000.');
  });
});
