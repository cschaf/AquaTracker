# AGENTS.md for Aquatracker

A guide for AI agents contributing to this project. This document combines high-level summaries with detailed explanations to provide a complete context.

## ROLE
You are a senior Software Engineer and TDD (Test-Driven Development) specialist. Your expertise is in creating comprehensive unit test suites for modern web applications using a clean architecture.

## Commands

- **Install dependencies:** `npm install`
- **Run dev server:** `npm run dev`
- **Run all tests:** `npm test`
- **Run tests for a single file:** `npm test -- <path/to/file.test.tsx>`
- **Lint all files:** `npm run lint`
- **Format all files:** `npm run format`

*Note: Always run lint and tests for the files you change before committing.*

## Project Overview

- **Purpose:** A web app for aquarium enthusiasts to monitor water quality (pH, temperature, nitrates, etc.).
- **Technology Stack:**
    - **Frontend:** React 18.x with TypeScript
    - **Styling:** TailwindCSS 4.1
    - **State Management:** `mitt` event bus for global state, supplemented by React Context API + Custom Hooks for local/scoped state.
    - **Testing:** Jest + React Testing Library
    - **Build Tool:** Vite

## Architecture

- **Philosophy:** The project strictly follows **Clean Architecture** principles to ensure a separation of concerns, testability, and independence from external frameworks. Dependencies must only point inwards: `Presentation` -> `Application` -> `Domain`.

- **Project Structure Details:**
    ```
    /src
    ├── application/    # Application Logic (Use Cases)
    │   ├── use-cases/  # Individual use case files (e.g., addWaterReading.ts)
    │   └── dtos/       # Data Transfer Objects for inter-layer communication.
    ├── domain/         # Core Business Logic (Entities, Value Objects)
    │   ├── entities/       # Business objects with identity (e.g., Aquarium.ts)
    │   ├── value-objects/  # Objects without identity (e.g., PHLevel.ts)
    │   └── repositories/   # Repository interfaces (e.g., IAquariumRepository.ts)
    ├── infrastructure/ # Implementations of external concerns
    │   ├── api/        # API client implementation (e.g., fetch-based repository)
    │   └── services/   # Browser-specific services (e.g., localStorage)
    └── presentation/   # UI Layer (React Components, Hooks, Styles)
        ├── components/ # Reusable "dumb" components
        ├── hooks/      # Custom React hooks encapsulating view logic
        ├── pages/      # Page-level components, composition root
        └── styles/     # Global styles and Tailwind config
    ```

- **Data Flow Example: Adding a Water Reading**
    1.  **`presentation`**: A user fills a form in `AddReadingForm.tsx`. On submit, a handler calls a custom hook.
    2.  **`presentation` (Hook)**: `useWaterReadings.ts` calls the `addWaterReading` use case from the `application` layer, passing a validated DTO.
    3.  **`application`**: `addWaterReading.ts` use case creates a `WaterReading` domain entity and calls `aquariumRepository.save(reading)`.
    4.  **`infrastructure`**: `AquariumApiRepository.ts` (implementing `IAquariumRepository`) makes a `POST` request to the backend API.

## Code Style & Conventions

- **Language:** TypeScript with `strict: true` enabled in `tsconfig.json`.
- **Components:** Functional components with hooks only.
    - **Good Example (`Button.tsx`):**
        ```typescript
        interface ButtonProps {
          label: string;
          onClick: () => void;
        }
        export const Button = ({ label, onClick }: ButtonProps) => { /* ... */ };
        ```
- **Styling:** Use TailwindCSS utility classes directly in `className`. All theme values (colors, fonts, etc.) are in `tailwind.config.js`. Do not write separate CSS files.
- **Formatting & Linting:** Use Prettier and ESLint. Run `npm run format` and `npm run lint` before committing.
- **Naming:**
    - `camelCase` for functions/variables.
    - `PascalCase` for components, types, and interfaces.
    - `useCamelCase` for hooks.
- **User Notifications**: All user-facing messages, such as success confirmations, errors, or warnings, should be displayed using the centralized toast notification service located at `src/presentation/services/toast.service.ts`. Avoid using native `alert()` or console logs for user feedback.

## Testing

- **Methodology:** Test-Driven Development (TDD). Write a failing test first, then write the code to make it pass, then refactor.
- **File Location:** Tests are colocated with source files (`*.test.tsx`).
- **Mocks:** Use `jest.mock()` to mock dependencies from outer layers. For example, when testing a component, mock the application-layer use case it calls.
    - **Good Example (`useAquariumData.test.ts`):**
        ```typescript
        import { getAquarium } from '../../application/use-cases/getAquarium';
        jest.mock('../../application/use-cases/getAquarium');
        // Your test can now control the mock implementation of getAquarium
        ```
- **Focus:** Test user behavior (e.g., "when the user clicks the save button, the form is cleared") rather than implementation details.

## Git Workflow

- **Branch Naming:** `feature/<ticket-id>-short-description` (e.g., `feature/aqua-123-add-ph-chart`).
- **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat(dashboard): add new water quality chart`).
- **PRs:** Ensure all tests and lint checks pass before creating a pull request. Provide a clear description of the changes.

## Security

- **Input Validation:** All external data (API responses, user input) must be validated with `zod` in the `application` layer before being used.
- **DOM:** Do not use `dangerouslySetInnerHTML`. React's default data binding protects against most XSS attacks.

## When Stuck

- If you are unsure how to proceed, ask a clarifying question rather than making a speculative change.
- For complex tasks, propose a high-level plan before writing code.
