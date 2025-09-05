import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import DailyTracker from '../../../../src/presentation/features/daily-tracker/DailyTracker';
import * as DailyTrackerHook from '../../../../src/presentation/hooks/useDailyTracker';

// Mock the child components to prevent their logic from running in this test
// and to avoid passing non-DOM props to a div.
vi.mock('../../../../src/presentation/features/daily-tracker/DailyIntakeCard', () => ({
  default: () => <div data-testid="daily-intake-card" />,
}));
vi.mock('../../../../src/presentation/features/daily-tracker/TodaysEntriesCard', () => ({
  default: () => <div data-testid="todays-entries-card" />,
}));

const mockUseDailyTracker = (isLoading: boolean) => ({
  summary: { total: 1000, entries: [{ id: '1', amount: 1000, timestamp: 123 }] },
  goal: 2500,
  setGoal: vi.fn(),
  addEntry: vi.fn(),
  deleteEntry: vi.fn(),
  updateEntry: vi.fn(),
  isLoading,
});

describe('DailyTracker', () => {
  it('should render the loading state', () => {
    vi.spyOn(DailyTrackerHook, 'useDailyTracker').mockReturnValue(mockUseDailyTracker(true));
    render(<DailyTracker />);
    expect(screen.getAllByText('Loading...')).toHaveLength(2);
  });

  it('should render its child components when not loading', () => {
    vi.spyOn(DailyTrackerHook, 'useDailyTracker').mockReturnValue(mockUseDailyTracker(false));
    render(<DailyTracker />);

    // The main responsibility of DailyTracker is to render its children.
    // By mocking the children and the hook, we can test that it does this
    // without testing the children's implementation details.
    expect(screen.getByTestId('daily-intake-card')).toBeInTheDocument();
    expect(screen.getByTestId('todays-entries-card')).toBeInTheDocument();
  });
});
