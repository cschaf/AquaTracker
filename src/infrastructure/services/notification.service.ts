const timeoutMap = new Map<string, number>();

interface ScheduleOptions {
  id: string;
  title: string;
  time: string; // HH:MM
  body: string;
}

const scheduleNotification = (options: ScheduleOptions) => {
  // First, clear any existing notification with the same ID
  cancelNotification(options.id);

  const [hours, minutes] = options.time.split(':').map(Number);
  const now = new Date();

  const notificationTime = new Date();
  notificationTime.setHours(hours, minutes, 0, 0);

  // If the time is already past for today, schedule it for tomorrow
  if (notificationTime.getTime() <= now.getTime()) {
    notificationTime.setDate(notificationTime.getDate() + 1);
  }

  const delay = notificationTime.getTime() - now.getTime();

  const timeoutId = window.setTimeout(() => {
    new Notification(options.title, {
      body: options.body,
      icon: '/icons/icon-192-192.png',
      tag: options.id,
    });
    // Re-schedule for the next day
    scheduleNotification(options);
  }, delay);

  timeoutMap.set(options.id, timeoutId);
};

const cancelNotification = (reminderId: string) => {
  const timeoutId = timeoutMap.get(reminderId);
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutMap.delete(reminderId);
  }
};

const requestPermission = async (): Promise<NotificationPermission> => {
  // Safari uses a callback-based permission system, while others use Promises.
  // This check handles both.
  if ('Notification' in window && Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission || 'default');
};

const getPermission = (): NotificationPermission => {
    return Notification.permission;
}

export const NotificationService = {
  requestPermission,
  getPermission,
  scheduleNotification,
  cancelNotification,
};
