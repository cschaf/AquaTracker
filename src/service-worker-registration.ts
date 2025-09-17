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
    /**
     * This callback is triggered when a new version of the service worker
     * is available and waiting to be installed.
     */
    onNeedRefresh() {
      // Show a confirmation dialog to the user.
      if (confirm('New content is available. Do you want to reload?')) {
        // If the user agrees, call the update function to apply the new
        // service worker and reload the page.
        updateSW(true);
      }
    },
    /**
     * This callback is triggered when the service worker has precached all
     * assets and the application is ready to work offline.
     */
    onOfflineReady() {
      console.log('Application is ready to work offline.');
    },
  });
}
