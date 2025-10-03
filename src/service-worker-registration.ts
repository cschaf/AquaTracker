import { registerSW } from 'virtual:pwa-register';

/**
 * Sets up the service worker using the official `vite-plugin-pwa` helper.
 *
 * This function handles the registration of the service worker and provides
 * callbacks for handling updates and offline readiness.
 *
 * The `virtual:pwa-register` module is a virtual module that is provided by
 * the PWA plugin at build time. It abstracts away the complexity of
 * service worker registration.
 */
export function setupServiceWorker() {
  const updateSW = registerSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        console.log('Service worker registered.');
        // Obsolete periodic sync setup has been removed.
        // We now use Firebase Cloud Messaging.
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