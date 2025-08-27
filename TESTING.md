# Testing Strategy for AquaTracker

This document outlines the testing strategy for the AquaTracker application, enabled by the new Clean Architecture-inspired structure. The primary benefit of this architecture is **testability**, allowing us to test different layers of the application in isolation.

We use **Vitest** as our test runner, which is configured in this project.

## 1. Testing Core Logic (Use Cases)

The most critical part of our application is the core business logic, which is encapsulated in Use Cases (`src/core/use-cases/`). These can and should be tested thoroughly without needing a browser or any React-specific testing utilities.

**Key Principles:**
- **Isolation:** Use cases are tested independently of the UI and database/storage.
- **Mocking Gateways:** We provide mock (or "fake") implementations of our gateway interfaces to control the data the use case receives.
- **Speed:** These are pure TypeScript/JavaScript tests that run very quickly in Node.js.

### Example: Testing `AddWaterIntakeUseCase`

Here is an example of how you would test that the `AddWaterIntakeUseCase` correctly adds a new entry.

```typescript
// src/core/use-cases/add-water-intake.use-case.test.ts
import { describe, it, expect, vi } from 'vitest';
import { AddWaterIntakeUseCase } from './add-water-intake.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { Log } from '../entities/water-intake';

// 1. Create a mock gateway that implements the interface
const createMockGateway = (initialLogs: Log[] = []): WaterIntakeGateway => {
  let logs: Log[] = [...initialLogs];
  return {
    getLogs: vi.fn().mockResolvedValue(logs),
    saveLogs: vi.fn().mockImplementation(async (updatedLogs: Log[]) => {
      logs = updatedLogs;
    }),
  };
};

describe('AddWaterIntakeUseCase', () => {
  it('should add a new entry to an existing log for today', async () => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    const mockGateway = createMockGateway([
      { date: today, entries: [{ id: '1', amount: 500, timestamp: Date.now() }] }
    ]);
    const useCase = new AddWaterIntakeUseCase(mockGateway);

    // Act
    await useCase.execute(250);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    expect(savedLogs[0].entries).toHaveLength(2);
    expect(savedLogs[0].entries[1].amount).toBe(250);
  });

  it('should create a new log for today if one does not exist', async () => {
    // Arrange
    const mockGateway = createMockGateway([]); // No initial logs
    const useCase = new AddWaterIntakeUseCase(mockGateway);

    // Act
    await useCase.execute(500);

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    expect(savedLogs).toHaveLength(1);
    expect(savedLogs[0].entries[0].amount).toBe(500);
  });
});
```

## 2. Testing UI (React Components & Hooks)

The UI layer, which includes React components and our feature-specific hooks (`useDailyTracker`, `useStats`), is tested using **React Testing Library**.

**Key Principles:**
- **User-Centric:** We test the UI from the user's perspective, interacting with it as they would.
- **Mocking Use Cases:** We do not test the business logic again in our UI tests. Instead, we mock the entire use case layer. This isolates the UI, ensuring we are only testing rendering and event handling.

### Example: Testing the `DailyTracker` Feature

To test the `DailyTracker` component, we would mock the `useDailyTracker` hook it relies on, or even deeper, mock the `useUseCases` hook.

```tsx
// src/features/daily-tracker/DailyTracker.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DailyTracker } from './DailyTracker';
import * as UseCaseProvider from '../../app/use-case-provider';

// Mock the entire use cases module
vi.mock('../../app/use-case-provider', () => ({
  useUseCases: () => ({
    // Provide mock implementations of the use cases
    addWaterIntake: { execute: vi.fn() },
    // ... other use cases
  })
}));

describe('DailyTracker', () => {
  it('should call the addWaterIntake use case when a quick add button is clicked', async () => {
    // Arrange
    render(<DailyTracker />);
    const add250mlButton = screen.getByText('250 ml');
    const { addWaterIntake } = UseCaseProvider.useUseCases();

    // Act
    fireEvent.click(add250mlButton);

    // Assert
    expect(addWaterIntake.execute).toHaveBeenCalledWith(250);
  });
});
```

By following this strategy, we can build a robust and reliable test suite that covers our application's logic and UI separately, leading to a more maintainable and stable codebase.

## 3. TDD Workflow: Creating a New Use Case

For new developers, the best way to ensure your code is correct and maintainable is to follow a **Test-Driven Development (TDD)** workflow. TDD is a process where you write your tests *before* you write your implementation code. This might feel backward at first, but it has several key advantages:

-   **It forces you to think about requirements first.** You can't test a feature until you know what it's supposed to do.
-   **It guarantees 100% test coverage** for your new logic.
-   **It makes development faster in the long run** by catching bugs early and making your code easier to refactor.

The TDD workflow follows a simple cycle: **Red, Green, Refactor**.

1.  **Red**: Write a test that fails. This is because the feature you're testing doesn't exist yet.
2.  **Green**: Write the *simplest possible* code to make the test pass. Don't worry about making it perfect.
3.  **Refactor**: Clean up your code, remove duplication, and improve its design, all while making sure the test still passes.

### Example: Creating a `ClearTodaysIntakeUseCase` with TDD

Let's say we want to create a new feature that allows the user to clear all of today's water intake entries at once.

#### Step 1: Write the Failing Test (Red)

First, we create a new test file: `src/core/use-cases/clear-todays-intake.use-case.test.ts`. We will write a test for a use case that doesn't exist yet.

```typescript
// src/core/use-cases/clear-todays-intake.use-case.test.ts
import { describe, it, expect, vi } from 'vitest';
import { ClearTodaysIntakeUseCase } from './clear-todays-intake.use-case';
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { Log } from '../entities/water-intake';

// Mock the gateway, as we always do for use case tests
const createMockGateway = (initialLogs: Log[] = []): WaterIntakeGateway => {
  let logs: Log[] = [...initialLogs];
  return {
    getLogs: vi.fn().mockResolvedValue(logs),
    saveLogs: vi.fn().mockImplementation(async (updatedLogs: Log[]) => {
      logs = updatedLogs;
    }),
  };
};

describe('ClearTodaysIntakeUseCase', () => {
  it('should remove the log for today, but keep other days', async () => {
    // Arrange
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const initialLogs: Log[] = [
      { date: today, entries: [{ id: '1', amount: 500, timestamp: Date.now() }] },
      { date: yesterday, entries: [{ id: '2', amount: 1000, timestamp: Date.now() }] },
    ];
    const mockGateway = createMockGateway(initialLogs);
    const useCase = new ClearTodaysIntakeUseCase(mockGateway);

    // Act
    await useCase.execute();

    // Assert
    expect(mockGateway.saveLogs).toHaveBeenCalledTimes(1);
    const savedLogs = (mockGateway.saveLogs as any).mock.calls[0][0];
    expect(savedLogs).toHaveLength(1);
    expect(savedLogs[0].date).toBe(yesterday);
  });
});
```

If we run `npm test` now, it will fail because `ClearTodaysIntakeUseCase` doesn't exist. This is our **Red** step.

#### Step 2: Write the Code to Make it Pass (Green)

Now, we create the use case file at `src/core/use-cases/clear-todays-intake.use-case.ts` and write the simplest code to make the test pass.

```typescript
// src/core/use-cases/clear-todays-intake.use-case.ts
import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';

export class ClearTodaysIntakeUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;

  constructor(waterIntakeGateway: WaterIntakeGateway) {
    this.waterIntakeGateway = waterIntakeGateway;
  }

  async execute(): Promise<void> {
    const logs = await this.waterIntakeGateway.getLogs();
    const todayStr = new Date().toISOString().split('T')[0];

    const updatedLogs = logs.filter(log => log.date !== todayStr);

    await this.waterIntakeGateway.saveLogs(updatedLogs);
  }
}
```

If we run `npm test` again, the test will now pass. This is our **Green** step.

#### Step 3: Refactor

In this case, our code is already quite simple, so there's not much to refactor. However, if our implementation was more complex, this would be the time to clean it up, for example, by extracting a helper function or improving variable names, all while continuously re-running the test to ensure it still passes.

By following this TDD cycle, you can build robust, well-tested features with confidence.
