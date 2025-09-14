/// <reference types="vite/client" />

declare module '*.css';
declare module 'react-pwa-push-notifications';

// Extend the existing ServiceWorkerRegistration interface
interface ServiceWorkerRegistration {
  readonly periodicSync: PeriodicSyncManager;
}

// Define the PeriodicSyncManager interface
interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  getTags(): Promise<string[]>;
  unregister(tag: string): Promise<void>;
}

// Define the PeriodicSyncEvent interface
interface PeriodicSyncEvent extends ExtendableEvent {
  readonly tag: string;
}

// Augment the global event map to include 'periodicsync'
interface ServiceWorkerGlobalScopeEventMap {
  periodicsync: PeriodicSyncEvent;
}
