/**
 * @file The main entry point for the application.
 * @licence MIT
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './theme.css';
import App from './presentation/App';
import { UseCaseProvider } from './di';
import { ModalProvider } from './presentation/modal/modal-provider';

// Render the app only if it's not in a test environment
if (import.meta.env.MODE !== 'test') {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <UseCaseProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </UseCaseProvider>
    </StrictMode>,
  );
}
