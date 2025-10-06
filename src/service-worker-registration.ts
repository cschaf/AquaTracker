import { registerSW } from 'virtual:pwa-register';

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

/**
 * Notifies the active service worker that the FCM configuration has been updated.
 * This prompts the service worker to re-initialize itself with the new settings.
 */
export const notifySwOfConfigUpdate = () => {
  if (serviceWorkerRegistration && serviceWorkerRegistration.active) {
    serviceWorkerRegistration.active.postMessage({ type: 'FCM_CONFIG_UPDATED' });
    console.log('Notified service worker of FCM config update.');
  }
};

/**
 * Sets up the service worker using the official `vite-plugin-pwa` helper.
 *
 * This function handles the registration of the service worker and provides
 * callbacks for handling updates and offline readiness.
 */
export function setupServiceWorker() {
  const updateSW = registerSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        serviceWorkerRegistration = registration;
        console.log('Service worker registered.');
      }
    },
    onNeedRefresh() {
      if (confirm('New content is available. Do you want to reload?')) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log('Application is ready to work offline.');
    },
  });
}