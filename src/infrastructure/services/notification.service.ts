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

export const NotificationService = {
  requestPermission,
  getPermission,
  scheduleNotification,
  cancelNotification,
};
