import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DailyIntakeCard from './DailyIntakeCard';
import { UseCaseProvider } from '../../app/use-case-provider';

// Mock the useUseCases hook
vi.mock('../../app/use-case-provider', async () => {
    const actual = await vi.importActual('../../app/use-case-provider');
    return {
        ...actual,
        useUseCases: () => ({
            getQuickAddValues: {
                execute: vi.fn().mockResolvedValue([100, 200, 300]),
            } as any,
        }),
    };
});

describe('DailyIntakeCard', () => {
  const defaultProps = {
    dailyGoal: 2000,
    setDailyGoal: vi.fn(),
    addWaterEntry: vi.fn(),
    dailyTotal: 500,
  };

  const renderComponent = (props = defaultProps) => {
    return render(
      <UseCaseProvider>
        <DailyIntakeCard {...props} />
      </UseCaseProvider>
    );
  };

  it('should show an error message when a negative number is entered', async () => {
    // Arrange
    renderComponent();
    const input = screen.getByPlaceholderText('Enter amount in ml');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Act
    fireEvent.change(input, { target: { value: '-100' } });
    fireEvent.click(addButton);

    // Assert
    expect(await screen.findByText('Please enter a positive number.')).toBeInTheDocument();
  });

  it('should show an error message when a number greater than 5000 is entered', async () => {
    // Arrange
    renderComponent();
    const input = screen.getByPlaceholderText('Enter amount in ml');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Act
    fireEvent.change(input, { target: { value: '5001' } });
    fireEvent.click(addButton);

    // Assert
    expect(await screen.findByText('Amount cannot be greater than 5000.')).toBeInTheDocument();
  });

  it('should call addWaterEntry when a valid number is entered', () => {
    // Arrange
    renderComponent();
    const input = screen.getByPlaceholderText('Enter amount in ml');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Act
    fireEvent.change(input, { target: { value: '500' } });
    fireEvent.click(addButton);

    // Assert
    expect(defaultProps.addWaterEntry).toHaveBeenCalledWith(500);
  });

  it('should clear the error message when the user starts typing', async () => {
    // Arrange
    renderComponent();
    const input = screen.getByPlaceholderText('Enter amount in ml');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Act
    fireEvent.change(input, { target: { value: '-100' } });
    fireEvent.click(addButton);
    expect(await screen.findByText('Please enter a positive number.')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '1' } });

    // Assert
    expect(screen.queryByText('Please enter a positive number.')).not.toBeInTheDocument();
  });

  it('should disable buttons when daily intake is critical', async () => {
    // Arrange
    const props = {
      ...defaultProps,
      dailyTotal: 10000,
    };
    renderComponent(props);
    const quickAddButtons = await screen.findAllByRole('button', { name: /ml/i });
    const addButton = screen.getByRole('button', { name: /add/i });
    const customAmountInput = screen.getByPlaceholderText('Enter amount in ml');

    // Assert
    quickAddButtons.forEach(button => expect(button).toBeDisabled());
    expect(addButton).toBeDisabled();
    expect(customAmountInput).toBeDisabled();
  });
});
