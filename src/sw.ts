/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { get, set } from 'idb-keyval';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

const REMINDERS_KEY = 'aquatracker_reminders_sw';

interface ReminderPayload {
  id: string;
  title: string;
  time: string;
  body: string;
}

const checkReminders = async () => {
  const reminders = (await get<ReminderPayload[]>(REMINDERS_KEY)) || [];
  const now = new Date();

  for (const reminder of reminders) {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const reminderTimeToday = new Date();
    reminderTimeToday.setHours(hours, minutes, 0, 0);

    const timeDiff = now.getTime() - reminderTimeToday.getTime();
    if (timeDiff > 0 && timeDiff < 5 * 60 * 1000) {
      const shownNotifications = await self.registration.getNotifications({ tag: reminder.id });
      if (shownNotifications.length === 0) {
        self.registration.showNotification(reminder.title, {
          body: reminder.body,
          icon: '/icons/icon-192-192.png',
          tag: reminder.id,
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

self.addEventListener('activate', (event) => {
  event.waitUntil(checkReminders());
});

self.addEventListener('fetch', (event) => {
  // Periodically check reminders on fetch events to increase reliability
  event.waitUntil(checkReminders());
});
