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
  registerSW({
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        console.log('Service worker registered.');
        setupPeriodicSync(registration);
      }
    },
    onNeedRefresh() {
      if (confirm('New content is available. Do you want to reload?')) {
        // The update function is passed as the second argument to onNeedRefresh
        // but we can get it from the registration object as well.
        registration && registration.update();
      }
    },
    onOfflineReady() {
      console.log('Application is ready to work offline.');
    },
  });
}

interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  getTags(): Promise<string[]>;
  unregister(tag: string): Promise<void>;
}

interface ServiceWorkerRegistrationWithPeriodicSync extends ServiceWorkerRegistration {
  readonly periodicSync: PeriodicSyncManager;
}

async function setupPeriodicSync(registration: ServiceWorkerRegistration) {
  const swRegistration = registration as ServiceWorkerRegistrationWithPeriodicSync;
  if ('periodicSync' in swRegistration) {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync' as any,
    });

    if (status.state === 'granted') {
      try {
        await swRegistration.periodicSync.register('UPDATE_REMINDERS', {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });
        console.log('Periodic background sync registered for reminders.');
      } catch (error) {
        console.error('Failed to register periodic background sync:', error);
      }
    } else {
      console.log('Periodic background sync permission not granted.');
    }
  } else {
    console.log('Periodic background sync is not supported.');
  }
}
