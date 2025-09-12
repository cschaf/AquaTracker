# AquaTracker State Management Guide for AI Agents

This document outlines the state management architecture of the AquaTracker application. Understanding these patterns is crucial for making effective and maintainable changes to the codebase.

The application employs a modern, multi-layered approach to state management, combining four key patterns.

## 1. Clean Architecture with Use Cases (Business Logic & Data State)

The core application state (like water intake logs and user goals) is managed through a Clean Architecture pattern. This separates the application's business rules from the UI.

-   **Location**:
    -   Use Case definitions: `src/core/use-cases/`
    -   Gateway interfaces: `src/core/gateways/`
    -   Gateway implementations: `src/infrastructure/storage/`
    -   Dependency Injection setup: `src/app/dependencies.ts` and `src/app/use-case-provider.tsx`

-   **Key Classes & Methods**:
    -   **Use Case Classes** (e.g., `AddWaterIntakeUseCase`): Contain specific business logic. They are invoked via an `execute()` method.
    -   **Gateway Classes** (e.g., `LocalStorageWaterIntakeGateway`): Handle the actual data persistence, reading from and writing to `localStorage`.
    -   **`useUseCases()` hook**: A custom hook that provides components access to all the instantiated use cases.

-   **State Update Flow**:
    1.  A UI component (via a feature hook) calls a use case: `useCases.addWaterIntake.execute(100)`.
    2.  The use case runs its logic and uses a gateway to persist the data.
    3.  The feature hook then uses the Event Bus to notify the rest of the app that state has changed.

**When to use**: For any logic that involves creating, reading, updating, or deleting core application data (water intake, goals, settings, etc.).

## 2. Custom Hooks (Feature-Level State)

UI state for specific features is encapsulated within custom hooks. This keeps components clean and separates stateful logic from rendering.

-   **Location**: `src/features/*/use*.ts` (e.g., `src/features/daily-tracker/useDailyTracker.ts`).

-   **Key Hooks**:
    -   `useDailyTracker`: Manages state for the main water tracking screen.
    -   `useStats`: Manages state for the statistics and charts page.

-   **State Update Flow**:
    1.  A hook uses `useState` to manage its local state (e.g., `const [summary, setSummary] = useState(...)`).
    2.  It uses `useEffect` to fetch initial data via the `useUseCases` hook.
    3.  It exposes methods (e.g., `addEntry`, `setGoal`) that components can call.
    4.  These methods orchestrate calls to the use cases and manage the feature's state.

**When to use**: To manage the state and behavior of a specific feature or a complex component.

## 3. Event Bus (Cross-Feature State Synchronization)

To decouple different parts of the application, we use a type-safe singleton Event Bus powered by the `mitt` library. This creates a reactive system where one part of the app can respond to state changes in another without being directly coupled.

-   **Location**:
    -   Event Bus instance: `src/app/event-bus.ts`
    -   Event type definitions: `src/app/event.types.ts`

-   **Key Concepts**:
    -   **Strongly-Typed Events**: All events and their payloads are defined in the `ApplicationEvents` type in `src/app/event.types.ts`. This provides compile-time safety and autocompletion.
    -   **Singleton Instance**: The `eventBus` is a single instance of a `mitt` emitter, exported from `src/app/event-bus.ts`.
    -   **API**: The bus exposes the standard `mitt` API: `on(event, handler)`, `off(event, handler)`, and `emit(event, payload)`.

-   **State Synchronization Flow**:
    1.  A feature hook or use case emits an event with a typed payload. For example, after an achievement is unlocked:
        ```typescript
        // In a hook like useDailyTracker.ts
        const newlyUnlocked = await checkForNewAchievements.execute();
        if (newlyUnlocked.length > 0) {
          eventBus.emit('achievementUnlocked', newlyUnlocked);
        }
        ```
    2.  Another part of the application, like a high-level component or another hook, listens for this event:
        ```typescript
        // In a component like App.tsx
        useEffect(() => {
          const handler = (achievements: Achievement[]) => {
            showAchievementModal(achievements, true);
          };
          eventBus.on('achievementUnlocked', handler);
          return () => eventBus.off('achievementUnlocked', handler);
        }, [showAchievementModal]);
        ```
    3.  The listener's callback (`handler`) is triggered with the typed payload, allowing it to perform an action (like showing a modal or refetching data).

-   **Key Application Events**:
    -   `intakeDataChanged`: Fired when water intake is added, updated, or deleted. Listeners typically refetch data. Payload: `void`.
    -   `achievementUnlocked`: Fired when one or more achievements are newly unlocked. Payload: `Achievement[]`.
    -   `settingsChanged`: Fired when general settings (like the theme) are updated. Payload: `GeneralSettings`.
    -   `dataSync`: Fired after a data import is successfully completed. Replaces a full page reload. Payload: `{ status: 'success', operation: 'import' | 'export' }`.
    -   `quickAddValuesChanged`: Fired when the quick-add button values are changed. Payload: `void`.

**When to use**: When a state change in one feature needs to trigger a side effect or a state update in another, otherwise unrelated, feature. It is the primary mechanism for cross-feature communication.

## 4. React Context and Providers (Global UI State)

For global UI state that is not part of the core business data, the application uses the React Provider pattern.

-   **Location**: `src/app/*-provider.tsx`

-   **Key Providers/Hooks**:
    -   `ModalProvider` / `useModal`: Manages the open/closed state and content of modals.
    -   `ThemeProvider` / `useThemeContext`: Manages the app's visual theme ('light'/'dark').

-   **State Update Flow**:
    1.  A component calls a function from the context hook: `hideAchievementModal()`.
    2.  This function, defined in the provider, calls a `useState` setter (e.g., `setIsAchievementModalOpen(false)`).
    3.  All components consuming the context are re-rendered with the new state.

**When to use**: For UI state that needs to be accessible by many components at different levels of the component tree (e.g., theme, modals, notifications).

## Summary

| State Type                | Management Pattern         | Key Tool/Class                                     |
| ------------------------- | -------------------------- | -------------------------------------------------- |
| Core Business Data        | Clean Architecture         | Use Cases (e.g., `AddWaterIntakeUseCase`)          |
| Feature-specific UI State | Custom Hooks               | `useDailyTracker`, `useStats`                      |
| Cross-Feature Syncing     | Event Bus (Pub/Sub)        | `eventBus` singleton                             |
| Global UI State           | React Context API          | `ModalProvider`, `ThemeProvider`                   |
