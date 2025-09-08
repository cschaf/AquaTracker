/**
 * @file Contains a custom React hook for accessing the use cases.
 * @licence MIT
 */

import { useContext } from 'react';
import { UseCaseContext } from './provider';
import type { UseCases } from './usecases';

/**
 * A custom hook that provides easy access to the use cases container.
 * It ensures that components can access business logic in a clean and type-safe way.
 * This hook must be used within a component that is a descendant of UseCaseProvider.
 * @returns The container with all application use cases.
 */
export const useUseCases = (): UseCases => {
  const context = useContext(UseCaseContext);
  if (!context) {
    // This error should not be reachable in a correctly configured application,
    // as the provider should wrap the entire component tree.
    throw new Error('useUseCases must be used within a UseCaseProvider');
  }
  return context;
};
