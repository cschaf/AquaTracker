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
        setupPeriodicSync(registration);
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

interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  getTags(): Promise<string[]>;
  unregister(tag: string): Promise<void>;
}

interface ServiceWorkerRegistrationWithPeriodicSync extends ServiceWorkerRegistration {
  readonly periodicSync: PeriodicSyncManager;
}

export async function setupPeriodicSync(registration: ServiceWorkerRegistration): Promise<boolean> {
  const swRegistration = registration as ServiceWorkerRegistrationWithPeriodicSync;
  if (!('periodicSync' in swRegistration)) {
    console.log('Periodic background sync is not supported.');
    return false;
  }

  const status = await navigator.permissions.query({
    name: 'periodic-background-sync' as any,
  });

  if (status.state !== 'granted') {
    console.log('Periodic background sync permission not granted.');
    return false;
  }

  try {
    await swRegistration.periodicSync.register('UPDATE_REMINDERS', {
      minInterval: 60 * 60 * 1000, // 1 hour
    });
    console.log('Periodic background sync registered for reminders.');
    return true;
  } catch (error) {
    console.error('Failed to register periodic background sync:', error);
    return false;
  }
}
