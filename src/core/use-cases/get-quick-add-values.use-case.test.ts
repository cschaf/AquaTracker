import { describe, it, expect, vi } from 'vitest';
import { GetQuickAddValuesUseCase } from './get-quick-add-values.use-case';
import type { QuickAddValues } from '../entities/quick-add-values';

const createMockQuickAddGateway = () => ({
  getQuickAddValues: vi.fn(),
  saveQuickAddValues: vi.fn(),
});

describe('GetQuickAddValuesUseCase', () => {
  it('should get the quick add values from the gateway', async () => {
    // Arrange
    const mockGateway = createMockQuickAddGateway();
    const useCase = new GetQuickAddValuesUseCase(mockGateway);
    const mockValues: QuickAddValues = [100, 200, 300];
    mockGateway.getQuickAddValues.mockResolvedValue(mockValues);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual(mockValues);
    expect(mockGateway.getQuickAddValues).toHaveBeenCalled();
  });
});
