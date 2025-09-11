# AGENTS.md: The Definitive Guide for AI Agents

This document provides a comprehensive guide for AI agents contributing to the Aquatracker web application. Adherence to these guidelines is mandatory to ensure code quality, consistency, and maintainability.

## 1. Project Overview

Aquatracker is a modern web application designed to help aquarium enthusiasts monitor and maintain the water quality of their tanks. It allows users to track key parameters (pH, temperature, nitrates, etc.), view historical data, and receive recommendations.

-   **Technology Stack**:
    -   **Frontend**: React `18.x` with TypeScript
    -   **Styling**: TailwindCSS `4.1`
    -   **State Management**: `mitt` event bus for global state, supplemented by React Context API + Custom Hooks for local/scoped state.
    -   **Testing**: Jest + React Testing Library
    -   **Build Tool**: Vite
-   **Architecture Philosophy**: The project strictly follows **Clean Architecture** principles, adapted for the frontend. This ensures a separation of concerns, testability, and independence from external frameworks and libraries.

## 2. Project Structure

The project is organized into directories that reflect the layers of Clean Architecture.

```
/src
├── application/    # Application Logic (Use Cases)
│   ├── use-cases/  # Individual use case files
│   ├── dtos/       # Data Transfer Objects
│   └── index.ts
├── domain/         # Core Business Logic (Entities, Value Objects)
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/ # Repository interfaces
│   └── index.ts
├── infrastructure/ # Frameworks, Drivers, External Services
│   ├── api/        # API client implementation
│   ├── services/   # Browser-specific services (e.g., localStorage)
│   └── repositories/ # Repository implementations
├── presentation/   # UI Layer (React Components, Hooks, Styles)
│   ├── components/ # Reusable components (dumb components)
│   │   ├── common/
│   │   └── layout/
│   ├── hooks/      # Custom React hooks
│   ├── pages/      # Page-level components
│   ├── styles/     # Global styles and Tailwind config
│   └── utils/      # UI-specific utility functions
└── main.tsx        # Application entry point
```

-   **File Naming Conventions**:
    -   Components: `PascalCase.tsx` (e.g., `WaterQualityChart.tsx`)
    -   Hooks: `useCamelCase.ts` (e.g., `useAquariumData.ts`)
    -   Test files: `*.test.ts` or `*.test.tsx` (e.g., `WaterQualityChart.test.tsx`)
    -   Interfaces/Types: `*.types.ts` or defined within the file they are used.

## 3. Architecture Guidelines

### Clean Architecture Layers

1.  **Domain**: The innermost layer. Contains core business logic and types. It has no dependencies on any other layer.
    -   **Entities**: Business objects with an identity (e.g., `Aquarium`, `WaterReading`).
    -   **Repository Interfaces**: Defines the contract for data persistence (e.g., `IAquariumRepository`). The implementation is in the `infrastructure` layer.

2.  **Application**: The "use case" layer. It orchestrates the flow of data between the domain and the presentation layers.
    -   **Use Cases**: Functions that represent user actions (e.g., `addWaterReading`, `getDashboardData`). They call domain logic and repository interfaces.
    -   **DTOs**: Data Transfer Objects used to pass data between layers, preventing domain entities from being exposed directly to the UI.

3.  **Infrastructure**: The outermost layer. Contains implementations of external concerns.
    -   **Repository Implementations**: Concrete implementations of the repository interfaces defined in the domain layer (e.g., `AquariumApiRepository` which calls a REST API).
    -   **Services**: Wrappers for browser/external APIs (e.g., `LocalStorageService`).

4.  **Presentation**: The UI layer (React). It is responsible for displaying data and capturing user input.
    -   It interacts with the `application` layer to execute use cases and retrieve data.
    -   It **must not** interact directly with the `domain` or `infrastructure` layers.

### Dependency Rule

Code dependencies can only point inwards.
`Presentation` -> `Application` -> `Domain`
`Infrastructure` -> `Application` -> `Domain`

**An inner layer cannot know anything about an outer layer.** For example, a file in `/domain` must never import from `/application` or `/presentation`.

### Data Flow Example: Adding a Water Reading

1.  **`presentation`**: A user fills a form in a React component (`AddReadingForm.tsx`). On submit, it calls a custom hook.
2.  **`presentation` (Hook)**: The hook (`useWaterReadings.ts`) calls the `addWaterReading` use case from the `application` layer, passing a DTO.
3.  **`application`**: The `addWaterReading` use case validates the input DTO, creates a `WaterReading` domain entity, and calls `aquariumRepository.save(reading)`.
4.  **`infrastructure`**: The `AquariumApiRepository` (which implements the `IAquariumRepository` interface) makes a `POST` request to the backend API.

## 4. Development Standards

### TypeScript

-   The `tsconfig.json` is configured with `strict: true`. All new code must be strictly typed.
-   Use `unknown` instead of `any` whenever possible.
-   Define clear `interface` or `type` definitions for all non-trivial objects, especially component props and API payloads.

### React

-   **Functional Components Only**: All components must be functional components using hooks. Class components are forbidden.
-   **Props Interfaces**: All components must have a TypeScript interface for their props, named `ComponentNameProps`.
    ```typescript
    // src/presentation/components/common/Button.tsx
    interface ButtonProps {
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary';
    }

    export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
      // ... component logic
    };
    ```
-   **Custom Hooks (`use...`)**: Encapsulate business logic, stateful UI logic, or interactions with the application layer within custom hooks. This keeps components clean and focused on rendering.
    -   **Do**: `const { data, isLoading } = useAquariumData(aquariumId);`
    -   **Don't**: Fetch data or call use cases directly inside a component's `useEffect`.

### Error Handling

-   Use cases in the `application` layer should throw custom errors (`ValidationError`, `NotFoundError`).
-   In the `presentation` layer, custom hooks should handle these errors in `try/catch` blocks and expose error state to the components.
-   A global error boundary (`ErrorBoundary.tsx`) should be used to catch unexpected runtime errors.

## 5. Styling Guidelines

-   **TailwindCSS First**: All styling must be done with TailwindCSS utility classes. Do not write custom CSS files unless absolutely necessary for a complex, dynamic animation.
-   **Component Styling**: Apply utilities directly in the `className` prop. For complex components, you can define a base class string and use a utility like `clsx` to conditionally apply other classes.
-   **Theme**: All colors, fonts, spacing, and breakpoints are defined in `tailwind.config.js`. Do not use magic numbers or hard-coded color values.
    -   **Do**: `className="bg-primary text-text-light"`
    -   **Don't**: `className="bg-[#007BFF] text-[#FFFFFF]"`
-   **Responsive Design**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to build responsive layouts.

## 6. Testing Strategy

This project uses **Test-Driven Development (TDD)**.

1.  **Red**: Write a failing test that describes the desired functionality or bug fix.
2.  **Green**: Write the minimum amount of code required to make the test pass.
3.  **Refactor**: Clean up the code while ensuring all tests still pass.

### Test Types

-   **Unit Tests (`*.test.ts`)**: For `domain` and `application` logic. These should be pure functions with no external dependencies. Use Jest's built-in matchers.
-   **Integration Tests (`*.test.tsx`)**: For `presentation` components. Use `@testing-library/react` to test component behavior from a user's perspective.
    -   Query for elements by accessible roles (`getByRole`, `getByLabelText`).
    -   Simulate user events with `@testing-library/user-event`.
    -   **Do not test implementation details.**

### Mocking

-   When testing components or hooks (`presentation`), mock the `application` layer use cases they depend on using `jest.mock`.
-   When testing use cases (`application`), mock the `infrastructure` layer repository implementations. This isolates the layer under test.

```typescript
// src/presentation/hooks/useAquariumData.test.ts
import { getAquarium } from '../../application/use-cases/getAquarium';
jest.mock('../../application/use-cases/getAquarium');

// Your test can now control the mock implementation of getAquarium
```

## 7. Code Quality Standards

-   **Linting & Formatting**: The project is configured with ESLint and Prettier. All code must be free of linting errors and formatted correctly before committing. Use the provided `npm run lint` and `npm run format` scripts.
-   **Imports**: Imports should be organized and sorted automatically by the IDE or Prettier plugin.
-   **Naming**:
    -   Variables/Functions: `camelCase`
    -   Components/Types/Interfaces/Enums: `PascalCase`
    -   Booleans: `is...`, `has...`, `should...` (e.g., `isLoading`)
-   **Comments**: Write comments to explain *why* something is done, not *what* is being done. The code itself should be self-explanatory.

## 8. Domain-Specific Context

-   **Key Entities**:
    -   `Aquarium`: Represents a user's fish tank. Has an `id`, `name`, `volume`, etc.
    -   `WaterReading`: A snapshot of water parameters at a specific time. Belongs to an `Aquarium`.
-   **Value Objects**:
    -   `PHLevel`: A value object that ensures pH is always within a valid range (0-14).
    -   `Temperature`: Represents temperature and handles unit conversions (Celsius/Fahrenheit).
-   **Use Cases**:
    -   `addWaterReading(dto)`: Adds a new water reading to an aquarium.
    -   `getAquariumDashboard(aquariumId)`: Fetches all data needed for the main dashboard view.

## 9. Performance Guidelines

-   **Code Splitting**: Use `React.lazy()` for route-based code splitting in the page components.
-   **Memoization**: Use `React.memo` for large, pure components that re-render often with the same props. Use `useMemo` and `useCallback` to prevent unnecessary re-renders caused by object/function re-creation.
-   **Bundle Size**: Be mindful of adding new dependencies. Analyze the bundle with a tool like `vite-bundle-visualizer` if performance issues arise.

## 10. Security Considerations

-   **Input Validation**: All data coming from an external source (API responses, user input) must be validated. We use `zod` for parsing and validating DTOs in the `application` layer.
-   **Data Sanitization**: While React protects against most XSS attacks, be cautious when using `dangerouslySetInnerHTML`. It should almost never be used.

## 11. Deployment and Build

-   **Build Process**: The application is built using `npm run build`. This command runs Vite to compile TypeScript, bundle assets, and optimize for production.
-   **Environments**: The application uses `.env` files for configuration (`.env.development`, `.env.production`). API endpoints and other environment-specific variables are managed here.
-   **CI/CD**: A CI/CD pipeline (e.g., GitHub Actions) is configured to automatically run `npm run lint` and `npm test` on every pull request. Merges to the `main` branch trigger a production build and deployment.
