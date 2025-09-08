import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../test-utils';
import MainPage from '../../../src/presentation/pages/MainPage';
import * as DailyTrackerHook from '../../../src/presentation/hooks/useDailyTracker';

describe('MainPage', () => {
  it('renders the DailyTracker and Tips components', async () => {
    // We can spy on the hook to ensure it's being used by the components on the page
    const useDailyTrackerSpy = vi.spyOn(DailyTrackerHook, 'useDailyTracker');

    render(<MainPage />);

    // Check that the hook was called, which confirms DailyTracker is rendered and using it
    expect(useDailyTrackerSpy).toHaveBeenCalled();

    // We can also check for text that we expect to be on the page.
    // The DailyTracker component shows a loading state initially,
    // and then shows the total. We can wait for the loading to finish.
    await waitFor(() => {
      // Assuming DailyTracker shows the total, which comes from the mocked hook
      expect(screen.getByText(/Today's Intake/i)).toBeInTheDocument();
    });

    // We can also check for the Tips component
    expect(screen.getByText(/Hydration Tips/i)).toBeInTheDocument();
  });
});
