/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { get, set } from 'idb-keyval';

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
  console.log('[SW] checkReminders triggered at:', new Date().toLocaleTimeString());

  const reminders = (await get<ReminderPayload[]>(REMINDERS_KEY)) || [];
  console.log(`[SW] Found ${reminders.length} reminders in IndexedDB.`);

  const now = new Date();

  for (const reminder of reminders) {
    console.log('[SW] Processing reminder:', reminder);

    if (!reminder.isActive) {
      console.log(`[SW] Reminder ${reminder.id} is inactive. Skipping.`);
      continue;
    }

    const [hours, minutes] = reminder.time.split(':').map(Number);
    console.log(`[SW] Current time: ${now.getHours()}:${now.getMinutes()}. Reminder time: ${hours}:${minutes}`);

    if (now.getHours() === hours && now.getMinutes() === minutes) {
      console.log(`[SW] Time match for reminder ${reminder.id}!`);
      const shownNotifications = await self.registration.getNotifications({ tag: reminder.id });

      if (shownNotifications.length === 0) {
        console.log(`[SW] No existing notification found. Showing notification for reminder ${reminder.id}.`);
        self.registration.showNotification(reminder.title, {
          body: reminder.body,
          icon: '/icons/icon-192-192.png',
          tag: reminder.id,
        });
      } else {
        console.log(`[SW] Notification for reminder ${reminder.id} already shown. Skipping.`);
      }
    }
  }
};

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    const newReminder = event.data.payload;
    const reminders = (await get<ReminderPayload[]>(REMINDERS_KEY)) || [];
    const existingIndex = reminders.findIndex(r => r.id === newReminder.id);
    if (existingIndex > -1) {
      reminders[existingIndex] = newReminder;
    } else {
      reminders.push(newReminder);
    }
    await set(REMINDERS_KEY, reminders);
  }

  if (event.data && event.data.type === 'CANCEL_REMINDER') {
    const { id } = event.data.payload;
    let reminders = (await get<ReminderPayload[]>(REMINDERS_KEY)) || [];
    reminders = reminders.filter(r => r.id !== id);
    await set(REMINDERS_KEY, reminders);
  }
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
