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
  // 1. Retrieve all reminders from IndexedDB.
  //    This uses the same 'reminders' key as the main application, ensuring data consistency.
  const reminders = (await get<ReminderPayload[]>(REMINDERS_KEY)) || [];

  for (const reminder of reminders) {
    // 2. Skip any reminders that are not marked as active.
    if (!reminder.isActive) {
      continue;
    }

    // 3. Compare the current time with the reminder's scheduled time.
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);

    // Check if the current hour and minute match the reminder's time.
    // This provides a 60-second window for the notification to trigger.
    if (now.getHours() === hours && now.getMinutes() === minutes) {
      // 4. Prevent duplicate notifications.
      //    Check if a notification with the same tag (the reminder's ID) has already been shown.
      //    This is important because the 'fetch' event can trigger this check multiple times per minute.
      const shownNotifications = await self.registration.getNotifications({ tag: reminder.id });
      if (shownNotifications.length === 0) {
        // 5. If all conditions are met, show the notification.
        self.registration.showNotification(reminder.title, {
          body: reminder.body,
          icon: '/icons/icon-192-192.png',
          tag: reminder.id, // Using the reminder ID as a tag allows us to check for existing notifications.
        });
      }
    }
  }
};

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data && event.data.type === 'CHECK_REMINDERS') {
    checkReminders();
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

// The 'periodicsync' event is the ideal way to run tasks in the background at regular intervals.
// We register this in the main application, and the browser will trigger this event
// periodically, even if the app tab is closed.
self.addEventListener('periodicsync', (event: PeriodicSyncEvent) => {
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders());
  }
});
