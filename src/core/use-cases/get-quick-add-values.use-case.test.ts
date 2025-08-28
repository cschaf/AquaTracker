import { describe, it, expect, vi } from 'vitest';
import { GetQuickAddValuesUseCase } from './get-quick-add-values.use-case';
import type { QuickAddGateway } from '../gateways/quick-add.gateway';
import type { QuickAddValues } from '../entities/quick-add-values';

const createMockQuickAddGateway = (): QuickAddGateway => ({
  getQuickAddValues: vi.fn(),
  saveQuickAddValues: vi.fn(),
});

describe('GetQuickAddValuesUseCase', () => {
  it('should get the quick add values from the gateway', async () => {
    // Arrange
    const mockGateway = createMockQuickAddGateway();
    const useCase = new GetQuickAddValuesUseCase(mockGateway);
    const mockValues: QuickAddValues = [100, 200, 300];
    (mockGateway.getQuickAddValues as vi.Mock).mockResolvedValue(mockValues);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toEqual(mockValues);
    expect(mockGateway.getQuickAddValues).toHaveBeenCalled();
  });
});
