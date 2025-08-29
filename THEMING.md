# Theming

This document explains how to use and extend the theming system in this application.

## Configuration

The theming system is configured in two main files:

1.  **`tailwind.config.ts`**: This file is where you configure Tailwind CSS itself. For our theming system, the most important part is the `content` array, which tells Tailwind where to look for class names. The `theme` object is mostly empty because we define our colors and themes directly in our CSS.

    ```typescript
    import type { Config } from 'tailwindcss'

    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    } satisfies Config
    ```

2.  **`src/theme.css`**: This is the heart of our theming system. It's where we import Tailwind's base styles and define our themes using the `@theme` directive.

To enable the theming system, you need to import `src/theme.css` in your main application entry point, which for this project is `src/main.tsx`:

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css' // <-- Import the theme file
import App from './App.tsx'
// ...
```

This setup allows Tailwind to process our theme variables and make them available as utility classes throughout the application.

## How it Works

The theming system is built with Tailwind CSS v4.1's `@theme` feature. The theme variables are defined in `src/theme.css`. We have two themes defined: `light` and `dark`.

The `useTheme` hook (`src/hooks/useTheme.ts`) manages the current theme and applies the corresponding class (`light` or `dark`) to the `<html>` element. The `ThemeSwitcher` component (`src/shared/components/ThemeSwitcher.tsx`) uses this hook to toggle between themes.

## Using Theme Colors in Components

To use the theme colors in your components, you can use Tailwind's `theme()` function in your CSS or use the generated CSS variables directly. However, for most cases, you can use the semantic color names we have defined as utility classes.

For example, to set the background color of a `div` to the primary background color, you can use the `bg-bg-primary` class:

```html
<div class="bg-bg-primary">...</div>
```

Here is a list of the available semantic color classes:

-   `bg-bg-primary`: Primary background color.
-   `bg-bg-secondary`: Secondary background color.
-   `text-text-primary`: Primary text color.
-   `text-text-on-primary`: Text color for elements with a primary background.
-   `border-border-card`: Border color for cards.
-   `text-warning`: Color for destructive actions or error messages.

You can find the full list of theme variables in `src/theme.css`.

## Adding New Colors to a Theme

To add a new color to the themes, you need to add a new CSS variable to the `@theme` block in `src/theme.css`. Make sure to add the variable for both the `light` and `dark` themes.

For example, to add a new `accent` color, you would modify `src/theme.css` like this:

```css
@theme {
  --color-bg-primary: oklch(100% 0 0);
  --color-bg-secondary: oklch(95% 0.02 264);
  --color-text-primary: oklch(29% 0.02 264);
  --color-text-on-primary: oklch(100% 0 0);
  --color-border-card: oklch(90% 0.02 264);
  --color-warning: oklch(60% 0.22 15);
  --color-accent: oklch(60% 0.22 280); /* New accent color for light theme */
}

.dark {
  --color-bg-primary: oklch(20% 0.02 264);
  --color-bg-secondary: oklch(25% 0.02 264);
  --color-text-primary: oklch(95% 0.02 264);
  --color-text-on-primary: oklch(100% 0 0);
  --color-border-card: oklch(35% 0.02 264);
  --color-warning: oklch(60% 0.22 15);
  --color-accent: oklch(70% 0.22 280); /* New accent color for dark theme */
}
```

You can then use this new color in your components with the `bg-accent`, `text-accent`, etc. utility classes.

## Creating a New Theme

To create a new theme, you need to add a new class selector to `src/theme.css` with the theme's variables. For example, to add a `sepia` theme, you would add a new `.sepia` selector:

```css
.sepia {
  --color-bg-primary: oklch(95% 0.05 80);
  --color-bg-secondary: oklch(90% 0.05 80);
  --color-text-primary: oklch(30% 0.05 80);
  --color-text-on-primary: oklch(95% 0.05 80);
  --color-border-card: oklch(85% 0.05 80);
  --color-warning: oklch(60% 0.22 15);
}
```

You would also need to update the `useTheme` hook (`src/hooks/useTheme.ts`) to include `sepia` as a possible theme and update the `ThemeSwitcher` component to allow users to select it.
