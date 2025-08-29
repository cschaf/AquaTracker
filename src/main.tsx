import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.css'
import App from './App.tsx'
import { UseCaseProvider } from './app/use-case-provider.tsx'
import { ModalProvider } from './app/modal-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UseCaseProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </UseCaseProvider>
  </StrictMode>,
)
