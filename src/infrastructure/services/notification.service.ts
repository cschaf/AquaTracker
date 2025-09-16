interface ScheduleOptions {
  id: string;
  title: string;
  time: string; // HH:MM
  body: string;
}

const postMessageToSw = (message: any) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
    }
}

const scheduleNotification = (options: ScheduleOptions) => {
  postMessageToSw({
      type: 'SCHEDULE_REMINDER',
      payload: options
  });
};

const cancelNotification = (reminderId: string) => {
  postMessageToSw({
      type: 'CANCEL_REMINDER',
      payload: { id: reminderId }
  });
};

const requestPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window && Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission || 'default');
};

const getPermission = (): NotificationPermission => {
    return Notification.permission;
}

const registerPeriodicSync = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration && 'periodicSync' in registration) {
      try {
        await registration.periodicSync.register('check-reminders', {
          minInterval: 5 * 60 * 1000, // 5 minutes
        });
        console.log('Periodic reminder check registered!');
      } catch (error) {
        console.error('Periodic reminder check could not be registered!', error);
      }
    }
  }
};

export const NotificationService = {
  requestPermission,
  getPermission,
  scheduleNotification,
  cancelNotification,
  registerPeriodicSync,
};
