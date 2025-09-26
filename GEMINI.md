# Gemini Agent Instructions

This document provides specific instructions for Gemini agents working on this project.

## Pre-Submission Checklist

Before submitting any code, you **must** perform the following checks to ensure code quality and prevent build failures:

1.  **Run All Tests:**
    ```bash
    npm test
    ```
2.  **Run the Linter:**
    ```bash
    npm run lint
    ```
3.  **Run the Production Build:**
    ```bash
    npm run build
    ```

Ensuring the build passes is critical, as it catches TypeScript errors and other issues that might not be apparent during development. A successful build is required for all pull requests.

## UI/UX Guidelines

- **Button Placement**: For consistency, primary action buttons (e.g., "Save", "Confirm") should always be aligned to the right side of their container. If there is a secondary, less-important action (e.g., "Cancel"), it should be placed to the left of the primary button.