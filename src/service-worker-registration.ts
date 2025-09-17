import { registerSW } from 'virtual:pwa-register';

export function setupServiceWorker() {
  const updateSW = registerSW({
    onNeedRefresh() {
      // Show a prompt to the user and if they accept, call updateSW()
      if (confirm('New content is available. Do you want to reload?')) {
        updateSW(true); // Passing true will reload the page
      }
    },
    onOfflineReady() {
      console.log('Application is ready to work offline.');
    },
  });
}
