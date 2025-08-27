# ROLE

You are a senior Software Engineer and TDD (Test-Driven Development) specialist. Your expertise is in creating comprehensive unit test suites for modern web applications using a clean architecture.

# Gemini Development Guide for AquaTracker

Welcome, developer! This guide will walk you through the process of adding a new feature to the AquaTracker application. We follow a **Clean Architecture** and a **Test-Driven Development (TDD)** workflow to ensure our code is maintainable, scalable, and robust.

## 1. Understanding the Architecture

First, a quick refresher on our project structure from the `README.md`:

-   `src/core`: The heart of the application. Contains all business logic, entities, and interfaces to the outside world (gateways). It has no dependencies on any specific framework.
-   `src/app`: The bridge between the core logic and the UI framework (React). It handles dependency injection.
-   `src/features`: The React components that make up the UI.
-   `src/infrastructure`: The concrete implementations of the gateways defined in the core (e.g., `localStorage` access).
-   `src/shared`: Reusable components, hooks, and utilities.

The key principle is **separation of concerns**. The core business logic knows nothing about React, and the React components know nothing about how the data is stored.

## 2. The Workflow: Adding a New Feature

We will walk through adding a new feature: **allowing the user to edit their daily goal**.

The process will be:
1.  Define and test the core business logic (the use case).
2.  Implement the UI component (the React part).
3.  Connect the UI to the use case.
4.  Test the UI component.

---

### Part 1: The Core Logic (Use Case) with TDD

We always start with the core logic. We will follow the **Red-Green-Refactor** TDD cycle.

#### Step 1.1: Write a Failing Test (Red)

We need an `EditDailyGoalUseCase`. Before we create it, we create its test file: `src/core/use-cases/edit-daily-goal.use-case.test.ts`.

```typescript
// src/core/use-cases/edit-daily-goal.use-case.test.ts
import { describe, it, expect, vi } from 'vitest';
import { EditDailyGoalUseCase } from './edit-daily-goal.use-case';
import type { GoalGateway } from '../gateways/goal.gateway';

// 1. Mock the dependency (the gateway)
const createMockGateway = (): GoalGateway => ({
  getDailyGoal: vi.fn(),
  saveDailyGoal: vi.fn(),
});

describe('EditDailyGoalUseCase', () => {
  it('should save the updated daily goal via the gateway', async () => {
    // Arrange
    const mockGateway = createMockGateway();
    const useCase = new EditDailyGoalUseCase(mockGateway);
    const newGoal = 2500;

    // Act
    await useCase.execute(newGoal);

    // Assert
    expect(mockGateway.saveDailyGoal).toHaveBeenCalledTimes(1);
    expect(mockGateway.saveDailyGoal).toHaveBeenCalledWith(newGoal);
  });
});
```

Running `npm test` now will fail because `EditDailyGoalUseCase` does not exist. This is the **Red** step.

#### Step 1.2: Make the Test Pass (Green)

Now, we create the use case file at `src/core/use-cases/edit-daily-goal.use-case.ts` and write the *minimum* amount of code to make the test pass.

```typescript
// src/core/use-cases/edit-daily-goal.use-case.ts
import type { GoalGateway } from '../gateways/goal.gateway';

export class EditDailyGoalUseCase {
  private readonly goalGateway: GoalGateway;

  constructor(goalGateway: GoalGateway) {
    this.goalGateway = goalGateway;
  }

  async execute(newGoal: number): Promise<void> {
    await this.goalGateway.saveDailyGoal(newGoal);
  }
}
```

Running `npm test` again will result in all tests passing. This is the **Green** step.

#### Step 1.3: Refactor

Our code is very simple, so no refactoring is needed. If the logic were more complex, we would now improve the code's structure without changing its behavior, relying on our test to ensure we don't break anything.

---

### Part 2: The UI Layer (React)

Now that our business logic is implemented and tested, we can build the UI for it.

Let's create a new component in `src/features/daily-tracker/EditGoalForm.tsx`.

```tsx
// src/features/daily-tracker/EditGoalForm.tsx
import React, { useState } from 'react';
import { useUseCases } from '../../app/use-case-provider';

export const EditGoalForm = ({ currentGoal, onGoalUpdated }: { currentGoal: number, onGoalUpdated: () => void }) => {
  const [goal, setGoal] = useState(currentGoal);
  const { editDailyGoal } = useUseCases(); // This use case doesn't exist yet in the provider

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (goal > 0) {
      await editDailyGoal.execute(goal);
      onGoalUpdated();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        New Daily Goal:
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
        />
      </label>
      <button type="submit">Save Goal</button>
    </form>
  );
};
```

*Note: For this to work, we would also need to add `EditDailyGoalUseCase` to our dependency injection setup in `src/app/dependencies.ts` and `src/app/use-case-provider.tsx`, but we will skip that for this guide.*

---

### Part 3: UI Testing

We test the UI in isolation from the business logic. We don't care if the `editDailyGoal` use case *actually* works (we already tested that); we only care that our component *calls* it when the user clicks the button.

Create a new test file: `src/features/daily-tracker/EditGoalForm.test.tsx`.

```tsx
// src/features/daily-tracker/EditGoalForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditGoalForm } from './EditGoalForm';
import * as UseCaseProvider from '../../app/use-case-provider';

// 1. Mock the use cases hook
const mockEditDailyGoal = { execute: vi.fn() };
vi.mock('../../app/use-case-provider', () => ({
  useUseCases: () => ({
    editDailyGoal: mockEditDailyGoal,
  }),
}));

describe('EditGoalForm', () => {
  it('should call the editDailyGoal use case with the new goal amount on submit', async () => {
    // Arrange
    const handleGoalUpdated = vi.fn();
    render(<EditGoalForm currentGoal={2000} onGoalUpdated={handleGoalUpdated} />);
    const input = screen.getByLabelText(/new daily goal/i);
    const button = screen.getByText(/save goal/i);

    // Act
    fireEvent.change(input, { target: { value: '3000' } });
    fireEvent.click(button);

    // Assert
    // We expect the execute function on our MOCKED use case to be called.
    expect(mockEditDailyGoal.execute).toHaveBeenCalledTimes(1);
    expect(mockEditDailyGoal.execute).toHaveBeenCalledWith(3000);
  });
});
```

By following this workflow, you can build features that are robust, well-tested, and easy to maintain.
