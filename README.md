# AquaTracker - Water Intake Tracker

AquaTracker is a web-based application designed to help you monitor and log your daily water intake. Staying hydrated is crucial for good health, and AquaTracker makes it easy and enjoyable to track your progress, achieve your hydration goals, and build healthy habits.

![AquaTracker Screenshot](https://via.placeholder.com/800x400.png?text=AquaTracker+Application+Screenshot)

## Features

*   **Daily Goal Setting:** Set a personal daily water intake goal to stay motivated.
*   **Quick and Custom Logging:** Log your water intake with predefined quick-add buttons (250ml, 500ml, 1L) or enter a custom amount.
*   **Real-time Progress Tracking:** Visualize your daily progress with an animated water level and percentage display.
*   **Today's Entries:** View a detailed list of your water intake entries for the day, including timestamps.
*   **Edit and Delete Entries:** Easily correct mistakes by editing or deleting individual entries.
*   **Weekly Consumption Chart:** Get an overview of your water intake for the past week with a bar chart.
*   **Key Statistics:** Track important stats like your weekly total, best streak, and current streak of meeting your goal.
*   **Achievements System:** Unlock a variety of achievements for reaching milestones and maintaining consistency.
*   **Data Import/Export:** Backup your data by exporting it to a JSON file, and restore it later using the import feature.
*   **Responsive Design:** The application is fully responsive and works on all devices, from desktops to mobile phones.
*   **Excessive Intake Warnings:** The app provides warnings if your water intake reaches potentially unsafe levels.
*   **Modern Notifications:** Uses toast notifications for a clean and modern user experience when providing feedback.

## How to Use

1.  **Set Your Goal:** Start by setting your daily water intake goal in the "Today's Intake" section. The default is 2000ml.
2.  **Log Your Intake:**
    *   Use the "Quick Add" buttons to log common amounts.
    *   Enter a custom amount in the "Custom Amount" section and click "Add".
3.  **Track Your Progress:** Watch the water level rise as you log your intake.
4.  **Review Your Entries:** See all your entries for the day in the "Today's Entries" list.
5.  **Explore Your Stats:** Check your weekly chart, streaks, and achievements to stay motivated.
6.  **Manage Your Data:** Use the "Export Data" button to save your progress and "Import Data" to restore it.

## Technologies Used

*   **HTML5:** For the structure of the application.
*   **Typescript:** For the implementation of javascript code.
*   **CSS3 & Tailwind CSS:** For styling and creating a modern, responsive user interface.
*   **JavaScript (ES6+):** For the application logic, interactivity, and data management.
*   **Font Awesome:** For icons used throughout the application.
*   **React Hot Toast:** For displaying modern, non-intrusive toast notifications.
*   **Browser `localStorage`:** For storing user data persistently in the browser.

## Project Structure

This project is built using a **Clean Architecture** approach. The goal is to separate the core business logic from the UI, database, and other external concerns. This makes the application easier to maintain, test, and scale.

The `src` directory is organized as follows:

-   `src/core`: This is the heart of the application. It contains the core business logic, entities, and rules.
    -   `entities`: The core data structures of the application (e.g., `WaterIntake`, `Goal`).
    -   `use-cases`: The application-specific business rules (e.g., `AddWaterIntakeUseCase`). These orchestrate the flow of data between entities and gateways.
    -   `gateways`: Interfaces that define how the core logic communicates with the outside world (e.g., for data storage).
-   `src/app`: This layer connects the core business logic to the UI framework. It contains the dependency injection container and providers.
-   `src/features`: Contains the React components that make up the UI. Each feature (e.g., `daily-tracker`, `stats`) is a self-contained module.
-   `src/infrastructure`: This is where the external dependencies are implemented.
    -   `storage`: Concrete implementations of the gateways defined in `src/core/gateways`. For this project, we use `localStorage`.
-   `src/shared`: Contains reusable components, hooks, and utilities that are shared across multiple features.

## Testing

This project uses **Vitest** for running tests and **React Testing Library** for testing React components.

Our testing strategy is based on the principles of the Clean Architecture:

1.  **Core Logic (Use Cases) is Tested in Isolation:** We write pure TypeScript/JavaScript tests for our use cases. We use mock implementations of our gateways to ensure that we are only testing the business logic itself, without any dependencies on the UI or database.
2.  **UI Components are Tested from the User's Perspective:** We test our React components by interacting with them as a user would. We mock the use cases that the components depend on, ensuring that our UI tests are not concerned with the underlying business logic.

For a detailed guide on our testing strategy, how to run tests, and how to write new tests using a Test-Driven Development (TDD) workflow, please see the **[TESTING.md](TESTING.md)** file.

### End-to-End (E2E) Testing

This project uses **Playwright** for end-to-end testing. E2E tests simulate real user interactions with the application in a browser environment.

To run the E2E tests, follow these steps:

1.  **Install browser dependencies:**
    Before running the tests for the first time, you need to install the necessary browser binaries for Playwright. Run the following command:
    ```bash
    npx playwright install
    ```

2.  **Run the tests:**
    Once the browsers are installed, you can run the E2E tests with this command:
    ```bash
    npm run test:e2e
    ```

## How to Contribute

Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`
3.  **Make your changes.**
4.  **Commit your changes:** `git commit -m 'Add some feature'`
5.  **Push to the branch:** `git push origin feature/your-feature-name`
6.  **Open a pull request.**

Please make sure your code follows the existing style and that you test your changes thoroughly.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.