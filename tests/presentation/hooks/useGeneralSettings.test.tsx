import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeneralSettings } from '../../../src/presentation/hooks/useGeneralSettings';
import { createMockUseCases } from '../test-utils';
import { UseCaseContext } from '../../../src/di/provider';
import type { UseCases } from '../../../src/di/usecases';
import React from 'react';
import { eventBus } from '../../../src/presentation/lib/event-bus/event-bus';
import type { GeneralSettings } from '../../../src/domain/entities';

// Mock the eventBus
vi.mock('../../../src/presentation/lib/event-bus/event-bus', () => ({
  eventBus: {
    emit: vi.fn(),
  },
}));

describe('useGeneralSettings', () => {
  let mockUseCases: UseCases;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UseCaseContext.Provider value={mockUseCases}>{children}</UseCaseContext.Provider>
  );

  beforeEach(() => {
    mockUseCases = createMockUseCases();
    vi.clearAllMocks();
  });

  it('should initially have null settings and then fetch them', async () => {
    const initialSettings: GeneralSettings = { theme: 'dark' };
    (mockUseCases.getGeneralSettings.execute as ReturnType<typeof vi.fn>).mockResolvedValue(initialSettings);

    const { result } = renderHook(() => useGeneralSettings(), { wrapper });

    expect(result.current.settings).toBeNull();

    await waitFor(() => {
      expect(result.current.settings).toEqual(initialSettings);
    });

    expect(mockUseCases.getGeneralSettings.execute).toHaveBeenCalledTimes(1);
  });

  it('should update settings, call the use case, and emit an event', async () => {
    const { result } = renderHook(() => useGeneralSettings(), { wrapper });
    const newSettings: GeneralSettings = { theme: 'light' };

    await act(async () => {
      result.current.updateSettings(newSettings);
    });

    expect(mockUseCases.updateGeneralSettings.execute).toHaveBeenCalledWith(newSettings);
    expect(result.current.settings).toEqual(newSettings);
    expect(eventBus.emit).toHaveBeenCalledWith('settingsChanged', newSettings);
  });
});
