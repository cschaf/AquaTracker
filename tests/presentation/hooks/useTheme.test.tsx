import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider } from '../../../src/presentation/theme/theme-provider';
import { useTheme } from '../../../src/presentation/hooks/useTheme';
import * as GeneralSettingsHook from '../../../src/presentation/hooks/useGeneralSettings';
import React from 'react';

// Mock the useGeneralSettings hook
const mockUpdateSettings = vi.fn();
vi.spyOn(GeneralSettingsHook, 'useGeneralSettings').mockReturnValue({
  settings: { theme: 'light' },
  updateSettings: mockUpdateSettings,
});

describe('useTheme', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the document element class for each test
    document.documentElement.className = '';
  });

  it('should return the initial theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe('light');
  });

  it('should toggle the theme when toggleTheme is called', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.className).toContain('dark');
  });

  it('should call updateSettings when toggleTheme is called', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(mockUpdateSettings).toHaveBeenCalledWith({ theme: 'dark' });
  });
});
