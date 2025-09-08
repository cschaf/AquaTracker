import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDailyTracker } from '../../../src/presentation/hooks/useDailyTracker';
import { createMockUseCases } from '../test-utils';
import { UseCaseContext } from '../../../src/di/provider';
import type { UseCases } from '../../../src/di/usecases';
import React from 'react';
import { eventBus } from '../../../src/presentation/lib/event-bus/event-bus';

// Mock the eventBus
vi.mock('../../../src/presentation/lib/event-bus/event-bus', () => ({
  eventBus: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

describe('useDailyTracker', () => {
  let mockUseCases: UseCases;

  // Wrapper component to provide the mock context
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UseCaseContext.Provider value={mockUseCases}>{children}</UseCaseContext.Provider>
  );

  beforeEach(() => {
    mockUseCases = createMockUseCases();
    vi.clearAllMocks();
  });

  it('should be in a loading state initially and then fetch data', async () => {
    const { result } = renderHook(() => useDailyTracker(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    // Wait for the useEffect to run and data to be loaded
    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(mockUseCases.getDailySummary.execute).toHaveBeenCalledTimes(1);
    expect(mockUseCases.getDailyGoal.execute).toHaveBeenCalledTimes(1);
    expect(result.current.summary).toEqual({ total: 0, entries: [] });
    expect(result.current.goal).toBe(2000);
  });

  it('should handle adding an entry', async () => {
    const { result } = renderHook(() => useDailyTracker(), { wrapper });

    await act(async () => {
      await result.current.addEntry(500);
    });

    expect(mockUseCases.addWaterIntake.execute).toHaveBeenCalledWith(500);
    expect(mockUseCases.recalculateAchievements.execute).toHaveBeenCalledTimes(1);
    expect(eventBus.emit).toHaveBeenCalledWith('intakeDataChanged', undefined);
  });

  it('should handle deleting an entry', async () => {
    const { result } = renderHook(() => useDailyTracker(), { wrapper });

    await act(async () => {
      await result.current.deleteEntry('entry-1');
    });

    expect(mockUseCases.deleteWaterIntake.execute).toHaveBeenCalledWith('entry-1');
    expect(mockUseCases.recalculateAchievements.execute).toHaveBeenCalledTimes(1);
    expect(eventBus.emit).toHaveBeenCalledWith('intakeDataChanged', undefined);
  });

  it('should handle updating an entry', async () => {
    const { result } = renderHook(() => useDailyTracker(), { wrapper });

    await act(async () => {
      await result.current.updateEntry('entry-1', 300);
    });

    expect(mockUseCases.updateWaterIntake.execute).toHaveBeenCalledWith('entry-1', 300);
    expect(mockUseCases.recalculateAchievements.execute).toHaveBeenCalledTimes(1);
    expect(eventBus.emit).toHaveBeenCalledWith('intakeDataChanged', undefined);
  });

  it('should handle setting a goal', async () => {
    const { result } = renderHook(() => useDailyTracker(), { wrapper });

    // Wait for the initial data load to complete to avoid race conditions
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.setGoal(3000);
    });

    expect(mockUseCases.setDailyGoal.execute).toHaveBeenCalledWith(3000);
    expect(result.current.goal).toBe(3000); // Optimistic update
    expect(eventBus.emit).toHaveBeenCalledWith('intakeDataChanged', undefined);
  });

  it('should subscribe to and unsubscribe from events', () => {
    const { unmount } = renderHook(() => useDailyTracker(), { wrapper });

    expect(eventBus.on).toHaveBeenCalledWith('intakeDataChanged', expect.any(Function));
    expect(eventBus.on).toHaveBeenCalledWith('dataSync', expect.any(Function));

    unmount();

    expect(eventBus.off).toHaveBeenCalledWith('intakeDataChanged', expect.any(Function));
    expect(eventBus.off).toHaveBeenCalledWith('dataSync', expect.any(Function));
  });
});
