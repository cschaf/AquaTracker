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
  const now = new Date();
  // We check for reminders in a 5-minute window to avoid issues with timing.
  const gracePeriod = 5 * 60 * 1000;

  for (const reminder of reminders) {
    if (!reminder.isActive) {
      continue;
    }

    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    const timeDiff = now.getTime() - reminderTime.getTime();

    // Check if the reminder time is in the past and within the grace period.
    if (timeDiff > 0 && timeDiff < gracePeriod) {
      // Use a unique tag for each reminder instance to avoid duplicates.
      const notificationTag = `${reminder.id}-${reminderTime.getTime()}`;
      const shownNotifications = await self.registration.getNotifications({
        tag: notificationTag,
      });

      if (shownNotifications.length === 0) {
        self.registration.showNotification(reminder.title, {
          body: reminder.body,
          icon: '/icons/icon-192-192.png',
          tag: notificationTag,
        });
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

// The 'periodicsync' event is the ideal way to run tasks in the background at regular intervals.
// We register this in the main application, and the browser will trigger this event
// periodically, even if the app tab is closed.
self.addEventListener('periodicsync', (event: PeriodicSyncEvent) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders());
  }
});
