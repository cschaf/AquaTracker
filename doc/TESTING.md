# AquaTracker Testing Strategy

This document outlines the comprehensive testing strategy for the AquaTracker application, which is structured following Clean Architecture principles. This architecture allows us to test each layer of the application in isolation, ensuring a robust and maintainable codebase.

## 1. Running Tests

This project contains several test suites, each targeting a different layer of the application.

- **Run all unit and integration tests:**
  ```bash
  npm test
  ```
  This command runs all tests located in the `tests/` directory using the main `vitest.config.ts`.

- **Run domain layer tests with coverage:**
  ```bash
  npm run test:domain
  ```
  This command specifically runs the tests for the domain layer and generates a coverage report. It uses the dedicated `vitest.config.domain.ts`.

- **Run End-to-End (E2E) tests:**
  ```bash
  npm run test:e2e
  ```
  This command runs the Playwright E2E test suite, which starts the application's dev server and simulates real user interactions in a browser.

## 2. Domain Layer Testing

**Purpose:** To test the core business logic of the application in complete isolation from any UI or external dependencies. These are pure, fast-running unit tests.

**Location:** `tests/domain/`

**Key Principles:**
- **Isolation:** Use cases, utility functions, and domain errors are tested independently.
- **Mocking Repositories:** All repository interfaces are mocked to provide controlled data to the use cases. Mock implementations are located in `tests/domain/__mocks__/repositories`.
- **High Coverage:** This layer should have the highest test coverage, as it contains the most critical business logic.

### Example: Testing a Use Case
```typescript
// tests/domain/usecases/add-water-intake.usecase.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AddWaterIntakeUseCase } from '../../../src/domain/usecases/add-water-intake.usecase';
import { mockWaterIntakeRepository } from '../__mocks__/repositories/mock-water-intake.repository';
// ...

describe('AddWaterIntakeUseCase', () => {
  let useCase: AddWaterIntakeUseCase;
  let mockRepository: WaterIntakeRepository;

  beforeEach(() => {
    mockRepository = mockWaterIntakeRepository();
    useCase = new AddWaterIntakeUseCase(mockRepository);
  });

  it('should add a new entry to an existing log for today', async () => {
    // Arrange
    const initialLogs: Log[] = [/* ... */];
    (mockRepository.getLogs as any).mockResolvedValue(initialLogs);

    // Act
    await useCase.execute(250);

    // Assert
    expect(mockRepository.saveLogs).toHaveBeenCalledTimes(1);
    // ... more assertions
  });
});
```

## 3. Infrastructure Layer Testing

**Purpose:** To test the implementation details of the infrastructure layer, such as how data is persisted and retrieved. These are integration tests that verify the connection between the domain layer's repository interfaces and the actual storage mechanism.

**Location:** `tests/infrastructure/`

**Key Principles:**
- **Testing Implementations:** These tests focus on the concrete repository classes.
- **Real Dependencies (Mocked Environment):** Tests run against a real (but mocked) `localStorage` instance provided by the `jsdom` environment in Vitest.

### Example: Testing a LocalStorage Repository
```typescript
// tests/infrastructure/repositories/local-storage-goal.repository.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageGoalRepository } from '../../../src/infrastructure/repositories/local-storage-goal.repository';

const GOAL_KEY = 'waterTrackerGoal';

describe('LocalStorageGoalRepository', () => {
  let repository: LocalStorageGoalRepository;

  beforeEach(() => {
    repository = new LocalStorageGoalRepository();
    localStorage.clear();
  });

  it('should return the stored goal', async () => {
    const storedGoal = 3000;
    localStorage.setItem(GOAL_KEY, JSON.stringify(storedGoal));

    const goal = await repository.getDailyGoal();
    expect(goal).toBe(storedGoal);
  });
});
```

## 4. Presentation Layer Testing

**Purpose:** To test the React components and hooks that make up the UI. These tests ensure that the UI behaves correctly from a user's perspective, without rendering to a real browser.

**Location:** `tests/presentation/`

**Key Principles:**
- **User-Centric:** Tests focus on what the user sees and does, using `@testing-library/react`.
- **Mocking the Domain Layer:** The entire domain layer (use cases) is mocked at the dependency injection boundary. This isolates the UI and prevents re-testing business logic.
- **Custom Render Utility:** A custom render function in `tests/presentation/test-utils.tsx` wraps every component in a mock `UseCaseProvider`, making it easy to provide mock use cases to any component under test.

### Example: Testing a Hook
```typescript
// tests/presentation/hooks/useDailyTracker.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDailyTracker } from '../../../src/presentation/hooks/useDailyTracker';
import { createMockUseCases } from '../test-utils';
// ...

describe('useDailyTracker', () => {
  let mockUseCases = createMockUseCases();

  const wrapper = ({ children }) => (
    <UseCaseContext.Provider value={mockUseCases}>{children}</UseCaseContext.Provider>
  );

  it('should handle adding an entry', async () => {
    const { result } = renderHook(() => useDailyTracker(), { wrapper });

    await act(async () => {
      await result.current.addEntry(500);
    });

    expect(mockUseCases.addWaterIntake.execute).toHaveBeenCalledWith(500);
  });
});
```

### Example: Testing a Component
```typescript
// tests/presentation/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import { Button } from '../../../src/presentation/components/Button';

describe('Button', () => {
  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Components with Toast Notifications

When testing a component that triggers a toast notification, you should not test the toast's appearance itself. Instead, you should test that the correct function from our `toast.service.ts` is called with the expected message.

This is achieved by mocking the `toast.service.ts` module.

**Example: Testing a component that shows a success/error toast**

```typescript
// tests/presentation/features/stats/QuickAddSettings.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import QuickAddSettings from '../../../../src/presentation/features/stats/QuickAddSettings';
import { useUseCases } from '../../../../src/di';
import * as toastService from '../../../../src/presentation/services/toast.service';
import { vi } from 'vitest';

// Mock the toast service
vi.mock('../../../../src/presentation/services/toast.service');
const mockedShowSuccess = toastService.showSuccess as jest.Mock;
const mockedShowError = toastService.showError as jest.Mock;

// Mock other dependencies like useUseCases
vi.mock('../../../../src/di');
const mockedUseUseCases = useUseCases as jest.Mock;


describe('QuickAddSettings', () => {
  it('should call showSuccess toast on successful save', async () => {
    // Arrange
    mockedUseUseCases.mockReturnValue({
      getQuickAddValues: { execute: vi.fn().mockResolvedValue([100, 200, 300]) },
      updateQuickAddValues: { execute: vi.fn().mockResolvedValue(undefined) },
    });
    const { getByText } = render(<QuickAddSettings />);
    // ... wait for component to be ready

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
    const { getByText } = render(<QuickAddSettings />);
    // ... wait for component to be ready

    // Act
    fireEvent.click(getByText('Save Changes'));

    // Assert
    await waitFor(() => {
      expect(mockedShowError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
```

## 5. End-to-End (E2E) Testing

**Purpose:** To test the entire application stack from a real user's perspective. These tests run in a real browser, interacting with the application just as a user would.

**Location:** `e2e/`

**Key Principles:**
- **Real User Scenarios:** Tests follow critical user journeys from start to finish.
- **Page Object Model (POM):** The tests use the Page Object Model pattern for maintainability. Page objects are located in `e2e/page-objects`.
- **Reliable Selectors:** The application uses `data-testid` attributes on key elements to provide stable selectors for tests.

### Example: E2E Test
```typescript
// e2e/tests/features/daily-tracker.spec.ts
import { test, expect } from '@playwright/test';
import { MainPage } from '../../page-objects/MainPage';

test.describe('Daily Tracker Feature', () => {
  test('should allow a user to add a water intake entry', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();

    await mainPage.addCustomAmount(123);

    const newEntry = mainPage.todaysEntriesList.getByText(`123 ml`);
    await expect(newEntry).toBeVisible();
  });
});
```
