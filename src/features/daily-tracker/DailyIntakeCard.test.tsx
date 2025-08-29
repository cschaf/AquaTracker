import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DailyIntakeCard from './DailyIntakeCard';
import { useUseCases } from '../../app/use-case-provider';

vi.mock('../../app/use-case-provider', () => ({
  useUseCases: vi.fn(),
}));

const getQuickAddValues = {
  execute: vi.fn().mockResolvedValue([100, 200, 1000]),
};

describe('DailyIntakeCard', () => {
  const defaultProps = {
    dailyGoal: 2000,
    setDailyGoal: vi.fn(),
    addWaterEntry: vi.fn(),
    dailyTotal: 500,
  };

  beforeEach(() => {
    (useUseCases as any).mockReturnValue({ getQuickAddValues });
  });

  const renderComponent = async (props = defaultProps) => {
    await act(async () => {
      render(<DailyIntakeCard {...props} />);
    });
  };

  it('should render the component with initial values', async () => {
    await renderComponent();
    expect(screen.getByText("Today's Intake")).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
  });

  it('should display quick add buttons with correct formatting', async () => {
    await renderComponent();
    expect(await screen.findByText('100 ml')).toBeInTheDocument();
    expect(await screen.findByText('200 ml')).toBeInTheDocument();
    expect(await screen.findByText('1L')).toBeInTheDocument();
  });

  it('should show an error message when a negative number is entered', async () => {
    await renderComponent();
    const input = screen.getByPlaceholderText('Enter amount in ml');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '-100' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Please enter a positive number.')).toBeInTheDocument();
  });

  it('should call addWaterEntry when a valid number is entered', async () => {
    await renderComponent();
    const input = screen.getByPlaceholderText('Enter amount in ml');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '500' } });
    fireEvent.click(addButton);

    expect(defaultProps.addWaterEntry).toHaveBeenCalledWith(500);
  });

  it('should display the correct progress percentage', async () => {
    await renderComponent();
    expect(screen.getByText('25%')).toBeInTheDocument();
  });
});
