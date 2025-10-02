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

- **Stats Chart Implementation**
    - **Overview:** The statistics page features a comprehensive and interactive bar chart for visualizing water intake data.
    - **Component:** `StatsChart.tsx` is the primary presentation component responsible for rendering the chart's UI, including the bars, axes, and labels.
    - **Data Logic:** The data processing and calculation logic is encapsulated in the `useChartData.ts` custom hook. This hook takes the raw log data and the selected time range as input and returns the data formatted for display.
    - **Features:**
        - **Time Ranges:** The chart supports "1 day," "1 week," "1 month," "1 year," and "All" views.
        - **Interactivity:** Users can tap or click on a bar to select it and view its value.
        - **Default Selection:** The chart automatically selects the most recent bar with data.
        - **Responsiveness:** The chart is horizontally scrollable on mobile devices to ensure all data is accessible.
        - **Goal Line:** A solid line indicates the user's daily goal, which is visible on relevant time ranges.

- **Service Worker and Background Notifications**
    - **Overview:** The application uses a service worker (`src/sw.ts`) to manage background notifications for reminders. This allows notifications to be delivered even when the app is closed or the device is offline.
    - **Technology:** The implementation relies on the **Periodic Background Sync API**.
    - **Logic:**
        1.  The `service-worker-registration.ts` file registers for a periodic sync event (`UPDATE_REMINDERS`) that runs approximately every 12 hours.
        2.  The `scheduleNotifications` function in the service worker is the core of the logic. It fetches all active reminders from `IndexedDB`.
        3.  For each reminder, it checks the `lastNotified` timestamp to see if a notification was missed. If so, it fires the notification immediately.
        4.  It then calculates the next notification time and uses `setTimeout` to schedule it.
    - **Data Persistence:** The `lastNotified` date is added to the `Reminder` entity and stored in `IndexedDB` via the `IdbReminderRepository`. This state is crucial for the service worker to function correctly across sessions.

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
- **Button Placement**: For consistency, primary action buttons (e.g., "Save", "Confirm") should be aligned to the right of their container. If a secondary action (e.g., "Cancel") is present, it should be placed to the left of the primary button.

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
- **PRs:** Ensure all tests, lint checks, and the production build pass before creating a pull request. Run `npm run build` to catch any type-related or build-specific errors. Provide a clear description of the changes.

## Security

- **Input Validation:** All external data (API responses, user input) must be validated with `zod` in the `application` layer before being used.
- **DOM:** Do not use `dangerouslySetInnerHTML`. React's default data binding protects against most XSS attacks.

## When Stuck

- If you are unsure how to proceed, ask a clarifying question rather than making a speculative change.
- For complex tasks, propose a high-level plan before writing code.
