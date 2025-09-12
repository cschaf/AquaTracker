# AquaTracker Architecture Guide

Welcome to the AquaTracker development team! This document is your comprehensive guide to understanding and working with the codebase. Its purpose is to be the single source of truth for all architectural decisions, patterns, and conventions.

## Table of Contents
1.  [Architecture Overview](#1-architecture-overview)
2.  [Project Structure Deep Dive](#2-project-structure-deep-dive)
3.  [Layer-by-Layer Guide](#3-layer-by-layer-guide)
4.  [Adding New Features Guide](#4-adding-new-features-guide)
5.  [Common Development Tasks](#5-common-development-tasks)
6.  [Code Examples and Templates](#6-code-examples-and-templates)
7.  [Best Practices and Conventions](#7-best-practices-and-conventions)
8.  [Troubleshooting Guide](#8-troubleshooting-guide)
9.  [Development Workflow](#9-development-workflow)
10. [Reference Section](#10-reference-section)

---

## 1. Architecture Overview

### Clean Architecture Principles
This project is built using the **Clean Architecture** pattern. The core idea is to create a separation of concerns by organizing the code into independent layers. The most important rule is the **Dependency Rule**: source code dependencies can only point inwards. Nothing in an inner layer can know anything at all about an outer layer.

### Why This Architecture?
*   **Indepenence**: The core business logic (the "domain") is completely independent of frameworks (like React), UI, and infrastructure (like databases or APIs). This means we can change our database or UI framework without changing the business rules.
*   **Testability**: Because the layers are decoupled, they can be tested in isolation. We can test our business logic without needing to render a UI or connect to a database.
*   **Maintainability**: The clear separation of concerns makes the code easier to understand, maintain, and scale. When you need to fix a bug or add a feature, you know exactly where to look.

### High-Level Architecture Diagram
We can visualize our architecture as a series of concentric circles, with the most important code in the center.

```
+-------------------------------------------------------------------------+
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |                                                                 |   |
|   |    +-------------------------------------------------------+    |   |
|   |    |                                                       |    |   |
|   |    |         +---------------------------------+           |    |   |
|   |    |         |                                 |           |    |   |
|   |    |         |           DOMAIN                |           |    |   |
|   |    |         | (Entities, Use Cases, Repos)    |           |    |   |
|   |    |         |                                 |           |    |   |
|   |    |         +---------------------------------+           |    |   |
|   |    |                                                       |    |   |
|   |    |              INFRASTRUCTURE                           |    |   |
|   |    |      (DB, localStorage, API Clients)                  |    |   |
|   |    |                                                       |    |   |
|   |    +-------------------------------------------------------+    |   |
|   |                                                                 |   |
|   |                     PRESENTATION (UI)                           |   |
|   |            (React Components, Hooks, Pages)                     |   |
|   |                                                                 |   |
|   +-----------------------------------------------------------------+   |
|                                                                         |
|                              DI (Dependency Injection)                  |
|                                                                         |
+-------------------------------------------------------------------------+
```
*Arrows represent dependencies. They all point **inwards** towards the DOMAIN.*

---

## 2. Project Structure Deep Dive

The `src/` directory is organized into our main architectural layers:

*   **`src/domain`**: The core of the application. Contains all business logic, models, and rules. It has no dependencies on any other layer.
*   **`src/infrastructure`**: Contains the concrete implementations for external services. This includes things like our `localStorage` repositories. It depends only on the `domain` layer.
*   **`src/presentation`**: The UI layer. Contains all React components, hooks, pages, and UI-related logic. It depends on the `di` and `domain` layers.
*   **`src/di`**: The Dependency Injection layer. This is the glue that connects the other layers. It instantiates our use cases and repositories and provides them to the UI. It depends on `domain` and `infrastructure`.

---

## 3. Layer-by-Layer Guide

### The `domain` Layer
*   **Purpose**: To contain the enterprise-wide business rules and entities. This is the most stable and independent part of the application.
*   **Rules**:
    *   **CANNOT** depend on any other layer.
    *   **CANNOT** contain any framework-specific code (e.g., no `import React`).
    *   **CANNOT** know how the data is stored or displayed.
*   **Subdirectories**:
    *   `entities`: The core data structures (e.g., `Achievement`, `WaterIntake`).
    *   `repositories`: Interfaces defining the contracts for data access (e.g., `WaterIntakeRepository`). These interfaces are part of the domain.
    *   `usecases`: Classes that orchestrate the flow of data to and from the entities to achieve a specific business goal (e.g., `AddWaterIntakeUseCase`).

### The `infrastructure` Layer
*   **Purpose**: To provide the concrete implementations for the interfaces defined in the `domain` layer. It's the "how" to the domain's "what".
*   **Rules**:
    *   **MUST** implement the repository interfaces from the `domain` layer.
    *   **DEPENDS ONLY** on the `domain` layer.
*   **Subdirectories**:
    *   `repositories`: The concrete classes that implement the repository interfaces (e.g., `LocalStorageWaterIntakeRepository`).
    *   `storage`: Wrappers for storage APIs like `localStorage`.

### The `presentation` Layer
*   **Purpose**: To display information to the user and handle user interaction.
*   **Rules**:
    *   **CANNOT** contain any core business logic. All business operations must be delegated to use cases.
    *   **DEPENDS** on the `di` layer to get use cases and on the `domain` layer for types and entities.
*   **Subdirectories**:
    *   `components`: Reusable, "dumb" UI components.
    *   `features`: Components that represent a specific feature of the application (e.g., the `daily-tracker`).
    *   `hooks`: Custom React hooks that contain UI logic and calls to use cases.
    *   `pages`: Top-level components that correspond to a route.
    *   `services`: UI-specific services that encapsulate a piece of functionality used across the UI layer. For example, `toast.service.ts` wraps the `react-hot-toast` library to provide a consistent way of showing notifications.

### The `di` (Dependency Injection) Layer
*   **Purpose**: To act as the "main" function of the application, wiring all the layers together.
*   **Rules**:
    *   This is the only layer that is "allowed" to know about all other layers.
    *   It instantiates the concrete repository implementations from `infrastructure`.
    *   It injects these concrete repositories into the constructors of the use cases from `domain`.
    *   It provides the fully instantiated use cases to the `presentation` layer via a React Context.

---

## 4. Adding New Features Guide

Let's say we want to add a new feature: **"Mood Tracking"**.

1.  **Planning**: Think about the data. A "Mood" has an `id`, a `rating` (1-5), a `comment` (optional), and a `timestamp`.

2.  **Domain First**:
    *   **Entity**: Create `src/domain/entities/mood.entity.ts` with a `Mood` interface.
    *   **Repository Interface**: Create `src/domain/repositories/mood.repository.ts`. It will need methods like `save(mood: Mood): Promise<void>` and `getForDate(date: string): Promise<Mood | null>`.
    *   **Use Cases**:
        *   Create `src/domain/usecases/save-mood.usecase.ts`. It will take a mood rating and comment, create a `Mood` entity, and use the `MoodRepository` to save it.
        *   Create `src/domain/usecases/get-mood-for-today.usecase.ts`.

3.  **Infrastructure**:
    *   Create `src/infrastructure/repositories/local-storage-mood.repository.ts`. This class will implement the `MoodRepository` interface using our `localStorage` wrapper.

4.  **Dependency Injection**:
    *   Update `src/di/repositories.ts` to create an instance of `LocalStorageMoodRepository`.
    *   Update `src/di/usecases.ts` to create instances of `SaveMoodUseCase` and `GetMoodForTodayUseCase`, injecting the new repository.

5.  **Presentation**:
    *   **Component**: Create a new feature component in `src/presentation/features/mood-tracker/MoodTracker.tsx`. It will have radio buttons for the rating and a text input.
    *   **Hook**: Create a `src/presentation/hooks/useMoodTracker.ts`.
        *   It will use our `useUseCases` hook to get `saveMood` and `getMoodForToday`.
        *   It will manage the state for the rating and comment.
        *   It will have a `handleSaveMood` function that calls the `saveMood` use case.
    *   **Page**: Add the `MoodTracker` component to a page, like `MainPage.tsx`.

---

## 5. Common Development Tasks

### Adding a new API endpoint
1.  Add the new methods to the appropriate repository interface in `src/domain/repositories/`.
2.  Create a new repository implementation in `src/infrastructure/repositories/` (e.g., `ApiWaterIntakeRepository.ts`).
3.  This new class will use an HTTP client (like `axios` or `fetch`) to make the API calls.
4.  In `src/di/repositories.ts`, swap the `localStorage` implementation for the new `Api` implementation. The rest of the app will work without any other changes.

### Creating a new form with validation
1.  UI state (input values, errors) should be managed in a presentation hook using `useState`.
2.  Validation logic can be in the hook for simple UI validation (e.g., "field cannot be empty").
3.  Core business rule validation should be in the **use case**. The use case should throw a `DomainError` if validation fails.
4.  The hook should call the use case in a `try...catch` block and set a UI error state if a `DomainError` is caught.

---

## 6. Code Examples and Templates

### New Use Case (`save-mood.usecase.ts`)
```typescript
import type { Mood } from '../entities/mood.entity';
import type { MoodRepository } from '../repositories/mood.repository';
import { DomainError } from '../errors';

export class SaveMoodUseCase {
  constructor(private readonly moodRepository: MoodRepository) {}

  async execute(rating: number, comment?: string): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new DomainError('Mood rating must be between 1 and 5.');
    }

    const newMood: Mood = {
      id: crypto.randomUUID(),
      rating,
      comment: comment || '',
      timestamp: Date.now(),
    };

    await this.moodRepository.save(newMood);
  }
}
```

### New Presentation Hook (`useMoodTracker.ts`)
```typescript
import { useState } from 'react';
import { useUseCases } from '../../di';

export const useMoodTracker = () => {
  const { saveMood } = useUseCases();
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await saveMood.execute(rating, comment);
      // Handle success (e.g., show a success message)
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { rating, setRating, comment, setComment, error, isLoading, handleSave };
};
```

---

## 7. Best Practices and Conventions

*   **File Naming**: Use kebab-case. Add suffixes for clarity (e.g., `.entity.ts`, `.repository.ts`, `.usecase.ts`).
*   **Imports**: Always use relative paths. Avoid deep imports; import from the barrel `index.ts` file of a module where possible.
*   **Error Handling**: Use cases should throw `DomainError`. The presentation layer must catch these errors and display them to the user.
*   **Testing**:
    *   **Domain**: Test use cases with mocked repositories. These should be simple unit tests.
    *   **Presentation**: Use React Testing Library. Mock the `useUseCases` hook to provide mock use cases to the component under test.

---

## 8. Troubleshooting Guide

*   **Circular Dependency**: If you get a circular dependency error, it means you have violated the Dependency Rule. A common mistake is a `domain` file importing from `presentation`.
*   **DI Container Issues**: If a use case is `undefined`, make sure you have registered it correctly in `src/di/usecases.ts` and provided its dependencies.
*   **Test Timeouts**: This can happen if you have an unhandled async operation in a component's `useEffect`. In your test, ensure you `await` the `render` and any subsequent actions that cause state updates.

---

## 9. Development Workflow

1.  **Setup**: Run `npm install`.
2.  **Run Dev Server**: Run `npm run dev`.
3.  **Run Tests**: Run `npm test`.
4.  **Build for Production**: Run `npm run build`.

---

## 10. Reference Section

| Layer          | Responsibilities                                      | Depends On                       |
|----------------|-------------------------------------------------------|----------------------------------|
| **Domain**     | Business rules, entities, use cases, repo interfaces  | Nothing                          |
| **Infrastructure**| Data persistence, API calls, external services      | `Domain`                         |
| **Presentation** | UI components, pages, hooks, user interaction       | `DI`, `Domain` (for types)       |
| **DI**         | Wires all layers together                             | `Domain`, `Infrastructure`       |
