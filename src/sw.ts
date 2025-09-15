/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { get } from 'idb-keyval';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

const REMINDERS_KEY = 'reminders';

interface ReminderPayload {
  id: string;
  title: string;
  time: string;
  body: string;
  isActive: boolean;
}

/**
 * Checks for reminders that are due and triggers a notification.
 * This function is the core of the reminder logic in the service worker.
 */
const checkReminders = async () => {
  const reminders = (await get<ReminderPayload[]>(REMINDERS_KEY)) || [];

  for (const reminder of reminders) {
    if (!reminder.isActive) {
      continue;
    }

    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);

    if (now.getHours() === hours && now.getMinutes() === minutes) {
      const shownNotifications = await self.registration.getNotifications({ tag: reminder.id });
      if (shownNotifications.length === 0) {
        try {
          console.log(`[SW] Attempting to show notification for: ${reminder.title}`);
          await self.registration.showNotification(reminder.title, {
            body: reminder.body,
            icon: '/icons/icon-192-192.png',
            tag: reminder.id,
          });
          console.log(`[SW] Notification for ${reminder.id} successfully shown.`);
        } catch (error) {
          console.error(`[SW] Error showing notification for ${reminder.id}:`, error);
        }
      }
    }
  }
};

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data && event.data.type === 'CHECK_REMINDERS') {
    checkReminders();
    return;
  }

  // The main application is now the single source of truth for the reminder list.
  // The service worker's only job is to read that list and show notifications.
  // The SCHEDULE_REMINDER and CANCEL_REMINDER logic was redundant and caused data corruption.
});

// The 'activate' event is fired when the service worker is first installed and activated.
// This is a good time to run an initial check for any reminders that might be due.
self.addEventListener('activate', (event) => {
  event.waitUntil(checkReminders());
});

// The 'fetch' event is fired for every network request the browser makes that falls
// within the service worker's scope. We use this as a frequent, battery-efficient
// way to periodically run our reminder check. It's more reliable than a setInterval
// that could be throttled by the browser.
self.addEventListener('fetch', (event) => {
  event.waitUntil(checkReminders());
});

// The 'periodicsync' event is the ideal way to run tasks in the background at regular intervals.
// We register this in the main application, and the browser will trigger this event
// periodically, even if the app tab is closed.
self.addEventListener('periodicsync', (event: PeriodicSyncEvent) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders());
  }
});
