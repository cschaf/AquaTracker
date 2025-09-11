import { render, fireEvent, waitFor } from '@testing-library/react';
import QuickAddSettings from '../../../../src/presentation/features/stats/QuickAddSettings';
import { useUseCases } from '../../../../src/di';
import * as toastService from '../../../../src/presentation/services/toast.service';
import { vi } from 'vitest';

// Mock the useUseCases hook
vi.mock('../../../../src/di');
const mockedUseUseCases = useUseCases as jest.Mock;

// Mock the toast service
vi.mock('../../../../src/presentation/services/toast.service');
const mockedShowSuccess = toastService.showSuccess as jest.Mock;
const mockedShowError = toastService.showError as jest.Mock;

describe('QuickAddSettings', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
    });

    it('should call showSuccess toast on successful save', async () => {
        // Arrange
        mockedUseUseCases.mockReturnValue({
            getQuickAddValues: { execute: vi.fn().mockResolvedValue([100, 200, 300]) },
            updateQuickAddValues: { execute: vi.fn().mockResolvedValue(undefined) },
        });

        const { getByText, findByText } = render(<QuickAddSettings />);
        await findByText('Save Changes'); // Wait for component to finish loading

        // Act
        fireEvent.click(getByText('Save Changes'));

        // Assert
        await waitFor(() => {
            expect(mockedShowSuccess).toHaveBeenCalledWith('Quick add values updated successfully!');
        });
    });

    it('should call showError toast on failed save', async () => {
        // Arrange
        const errorMessage = 'Failed to save';
        mockedUseUseCases.mockReturnValue({
            getQuickAddValues: { execute: vi.fn().mockResolvedValue([100, 200, 300]) },
            updateQuickAddValues: { execute: vi.fn().mockRejectedValue(new Error(errorMessage)) },
        });

        const { getByText, findByText } = render(<QuickAddSettings />);
        await findByText('Save Changes'); // Wait for component to finish loading

        // Act
        fireEvent.click(getByText('Save Changes'));

        // Assert
        await waitFor(() => {
            expect(mockedShowError).toHaveBeenCalledWith(errorMessage);
        });
    });
});
