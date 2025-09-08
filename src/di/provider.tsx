/**
 * @file Contains the React Context Provider for the use cases.
 * @licence MIT
 */

import React, { createContext } from 'react';
import { useCases, type UseCases } from './usecases';

/**
 * React Context for providing the use cases container.
 * The context is initialized with the actual use cases object.
 */
export const UseCaseContext = createContext<UseCases>(useCases);

/**
 * A React component that provides the use cases to its children via context.
 * This should wrap the entire application or the parts of it that need access to business logic.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 */
export const UseCaseProvider = ({ children }: { children: React.ReactNode }) => {
  // The value provided is the singleton `useCases` object.
  // This ensures that the same instances of use cases are used throughout the app.
  return (
    <UseCaseContext.Provider value={useCases}>
      {children}
    </UseCaseContext.Provider>
  );
};
