/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { IdbReminderRepository } from './infrastructure/data/idb-reminder.repository';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

clientsClaim();
self.skipWaiting();

const reminderRepository = new IdbReminderRepository();
let activeTimers: number[] = [];

const scheduleNotifications = async () => {
  activeTimers.forEach(clearTimeout);
  activeTimers = [];

  try {
    const reminders = await reminderRepository.findAll();
    const activeReminders = reminders.filter((r) => r.isActive);

    activeReminders.forEach((reminder) => {
      const now = new Date();
      const [hours, minutes] = reminder.time.split(':').map(Number);

      let nextNotificationTime = new Date();
      nextNotificationTime.setHours(hours, minutes, 0, 0);

      if (nextNotificationTime.getTime() < now.getTime()) {
        nextNotificationTime.setDate(nextNotificationTime.getDate() + 1);
      }

      const timeDifference = nextNotificationTime.getTime() - now.getTime();

      const timerId = setTimeout(() => {
        self.registration.showNotification('AquaTracker Reminder', {
          body: reminder.title,
          icon: '/icons/icon-192-192.png',
          tag: reminder.id,
          data: {
            url: `/reminders?id=${reminder.id}`,
          },
        });
      }, timeDifference);

      activeTimers.push(timerId);
    });
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

self.addEventListener('activate', (event) => {
  event.waitUntil(scheduleNotifications());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_REMINDERS') {
    scheduleNotifications();
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus().then(c => c.navigate(urlToOpen));
      }
      return self.clients.openWindow(urlToOpen);
    })
  );
});
