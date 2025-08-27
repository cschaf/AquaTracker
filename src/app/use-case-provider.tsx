import React, { createContext, useContext } from 'react';
import { useCases, type UseCases } from './dependencies';

const UseCaseContext = createContext<UseCases | null>(null);

export const UseCaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UseCaseContext.Provider value={useCases}>
      {children}
    </UseCaseContext.Provider>
  );
};

export const useUseCases = (): UseCases => {
  const context = useContext(UseCaseContext);
  if (!context) {
    throw new Error('useUseCases must be used within a UseCaseProvider');
  }
  return context;
};
