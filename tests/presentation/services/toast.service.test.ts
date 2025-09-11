import { showSuccess, showError, showWarning, showInfo } from '../../../src/presentation/services/toast.service';
import toast from 'react-hot-toast';
import { vi } from 'vitest';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: Object.assign(vi.fn(), {
        success: vi.fn(),
        error: vi.fn(),
    }),
}));


describe('Toast Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('showSuccess', () => {
        it('should call toast.success with the correct message and styling options', () => {
            // Arrange
            const message = 'Success!';

            // Act
            showSuccess(message);

            // Assert
            expect(toast.success).toHaveBeenCalledWith(message, {
                style: {
                    background: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)',
                },
                iconTheme: {
                    primary: 'var(--color-success)',
                    secondary: 'var(--color-text-on-primary)',
                },
            });
        });
    });

    describe('showError', () => {
        it('should call toast.error with the correct message and styling options', () => {
            // Arrange
            const message = 'Error!';

            // Act
            showError(message);

            // Assert
            expect(toast.error).toHaveBeenCalledWith(message, {
                style: {
                    background: 'var(--color-warning)',
                    color: 'var(--color-text-on-primary)',
                },
                iconTheme: {
                    primary: 'var(--color-text-on-primary)',
                    secondary: 'var(--color-warning)',
                },
            });
        });
    });

    describe('showWarning', () => {
        it('should call toast with the correct message, icon, and styling options', () => {
            // Arrange
            const message = 'Warning!';

            // Act
            showWarning(message);

            // Assert
            expect(toast).toHaveBeenCalledWith(message, {
                icon: '⚠️',
                style: {
                    padding: '16px',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                },
            });
        });
    });

    describe('showInfo', () => {
        it('should call toast with the correct message, icon, and styling options', () => {
            // Arrange
            const message = 'Info!';

            // Act
            showInfo(message);

            // Assert
            expect(toast).toHaveBeenCalledWith(message, {
                icon: 'ℹ️',
                style: {
                    padding: '16px',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                },
            });
        });
    });
});
