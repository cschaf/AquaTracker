import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateQuickAddValuesUseCase } from './update-quick-add-values.use-case';
import type { QuickAddGateway } from '../gateways/quick-add.gateway';
import type { QuickAddValues } from '../entities/quick-add-values';
import { eventBus } from '../../app/event-bus';

vi.mock('../../app/event-bus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  },
}));

const createMockQuickAddGateway = (): QuickAddGateway => ({
  getQuickAddValues: vi.fn(),
  saveQuickAddValues: vi.fn(),
});

describe('UpdateQuickAddValuesUseCase', () => {
  let mockGateway: QuickAddGateway;
  let useCase: UpdateQuickAddValuesUseCase;

  beforeEach(() => {
    mockGateway = createMockQuickAddGateway();
    useCase = new UpdateQuickAddValuesUseCase(mockGateway);
    vi.clearAllMocks();
  });

  it('should save the quick add values and emit an event for valid values', async () => {
    // Arrange
    const validValues: QuickAddValues = [100, 200, 300];

    // Act
    await useCase.execute(validValues);

    // Assert
    expect(mockGateway.saveQuickAddValues).toHaveBeenCalledWith(validValues);
    expect(eventBus.emit).toHaveBeenCalledWith('quickAddValuesChanged');
  });

  it('should throw an error for invalid format (not an array)', async () => {
    // Arrange
    const invalidValues: any = 'not-an-array';

    // Act & Assert
    await expect(useCase.execute(invalidValues)).rejects.toThrow('Invalid quick add values format');
    expect(mockGateway.saveQuickAddValues).not.toHaveBeenCalled();
    expect(eventBus.emit).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid format (not 3 elements)', async () => {
    // Arrange
    const invalidValues: any = [100, 200];

    // Act & Assert
    await expect(useCase.execute(invalidValues)).rejects.toThrow('Invalid quick add values format');
    expect(mockGateway.saveQuickAddValues).not.toHaveBeenCalled();
    expect(eventBus.emit).not.toHaveBeenCalled();
  });

  it.each([
    [[0, 200, 300]],
    [[-100, 200, 300]],
    [[100, 6000, 300]],
    [[100, '200', 300]],
  ])('should throw an error for invalid values: %j', async (invalidValues: any) => {
    // Act & Assert
    await expect(useCase.execute(invalidValues)).rejects.toThrow('Quick add values must be positive numbers not greater than 5000');
    expect(mockGateway.saveQuickAddValues).not.toHaveBeenCalled();
    expect(eventBus.emit).not.toHaveBeenCalled();
  });
});
