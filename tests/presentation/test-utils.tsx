import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { UseCaseContext } from '../../src/di/provider';
import type { UseCases } from '../../src/di/usecases';
import { vi } from 'vitest';

// Create a mock object for all use cases.
// Each use case is a mock function.
const createMockUseCases = (): UseCases => ({
  addWaterIntake: { execute: vi.fn().mockResolvedValue(undefined) },
  deleteWaterIntake: { execute: vi.fn().mockResolvedValue(undefined) },
  exportData: { execute: vi.fn().mockResolvedValue('{}') },
  getAllAchievements: { execute: vi.fn().mockResolvedValue([]) },
  getDailyGoal: { execute: vi.fn().mockResolvedValue(2000) },
  getDailySummary: { execute: vi.fn().mockResolvedValue({ total: 0, entries: [] }) },
  getGeneralSettings: { execute: vi.fn().mockResolvedValue({ theme: 'light' }) },
  getLogs: { execute: vi.fn().mockResolvedValue([]) },
  getQuickAddValues: { execute: vi.fn().mockResolvedValue([250, 500, 1000]) },
  getUnlockedAchievements: { execute: vi.fn().mockResolvedValue([]) },
  importData: { execute: vi.fn().mockResolvedValue(undefined) },
  recalculateAchievements: { execute: vi.fn().mockResolvedValue([]) },
  setDailyGoal: { execute: vi.fn().mockResolvedValue(undefined) },
  updateGeneralSettings: { execute: vi.fn().mockResolvedValue(undefined) },
  updateQuickAddValues: { execute: vi.fn().mockResolvedValue(undefined) },
  updateWaterIntake: { execute: vi.fn().mockResolvedValue(undefined) },
});

// Define a custom render function
const customRender = (
  ui: ReactElement,
  {
    mockUseCases = createMockUseCases(),
    ...renderOptions
  }: { mockUseCases?: UseCases } & Omit<RenderOptions, 'wrapper'> = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <UseCaseContext.Provider value={mockUseCases}>
      {children}
    </UseCaseContext.Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override the default render method with our custom one
export { customRender as render, createMockUseCases };
