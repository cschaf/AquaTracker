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

A singleton `EventBus` is used to decouple different parts of the application and create a reactive system.

-   **Location**: `src/app/event-bus.ts`

-   **Key Methods**: `eventBus.on()`, `eventBus.off()`, `eventBus.emit()`.

-   **State Synchronization Flow**:
    1.  After a core data change, a hook emits an event: `eventBus.emit('intakeDataChanged')`.
    2.  Other hooks across different features listen for this event: `eventBus.on('intakeDataChanged', ...)`.
    3.  The listener's callback function is triggered, which typically refetches data to keep the UI in sync.

**When to use**: When a state change in one feature needs to trigger a state update in another, otherwise unrelated, feature.

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
