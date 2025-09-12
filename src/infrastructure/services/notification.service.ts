import Push from 'react-pwa-push-notifications';
import { Reminder } from '../../domain/entities/reminder.entity';

const scheduleNotification = async (reminder: Reminder) => {
  try {
    const { title, time } = reminder;
    const [hours, minutes] = time.split(':').map(Number);

    // Note: This schedules for the *next* occurrence of this time.
    // The library handles calculating the delay.
    await Push.create(title, {
      body: `It's time for your ${time} reminder to drink water!`,
      icon: '/icons/icon-192-192.png',
      tag: reminder.id, // Use reminder ID as tag to update/cancel it
      // timeout: 12000, // Notification will be dismissed automatically
      // onClick: () => {
      //   window.focus();
      //   // Maybe navigate to the app's reminder page
      // },
      schedule: {
        hour: hours,
        minute: minutes,
        repeats: true, // Daily notifications
      }
    });
  } catch (error) {
    console.error('Failed to schedule notification:', error);
  }
};

const cancelNotification = async (reminderId: string) => {
  try {
    await Push.clear(reminderId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};

const requestPermission = async (): Promise<NotificationPermission> => {
  try {
    const permission = await Push.Permission.request();
    return permission;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return 'denied';
  }
};

const hasPermission = (): boolean => {
    return Push.Permission.has();
}

export const NotificationService = {
  requestPermission,
  scheduleNotification,
  cancelNotification,
  hasPermission
};
