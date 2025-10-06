/**
 * @file Manages Firebase Cloud Messaging (FCM) initialization and token generation.
 * This service allows for dynamic configuration of the Firebase app, which is
 * essential for letting users connect their own Firebase projects.
 */

import { initializeApp, FirebaseApp, deleteApp } from 'firebase/app';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';
import { FcmConfig } from '../../domain/entities/fcm-config.entity';

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

/**
 * Initializes the Firebase application with the user's custom configuration.
 * If an app is already initialized, it's deleted and re-created.
 *
 * @param config - The user-provided Firebase configuration.
 * @returns A boolean indicating whether initialization was successful.
 */
export const initializeFirebase = async (config: FcmConfig): Promise<boolean> => {
  try {
    if (app) {
      await deleteApp(app);
      app = null;
      messaging = null;
    }

    if (!config || !config.apiKey) {
      console.log('Firebase config is missing or incomplete. Skipping initialization.');
      return false;
    }

    app = initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });

    messaging = getMessaging(app);
    console.log('Firebase initialized successfully.');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    app = null;
    messaging = null;
    return false;
  }
};

/**
 * Retrieves the FCM registration token for the current device.
 * This token is required to send push notifications to this specific client.
 *
 * @param vapidKey - The VAPID key from the user's Firebase project settings.
 * @returns The FCM token as a string, or null if an error occurs or Firebase is not initialized.
 */
export const getFcmToken = async (vapidKey: string): Promise<string | null> => {
  if (!messaging) {
    console.error('Firebase messaging is not initialized. Cannot get FCM token.');
    return null;
  }

  try {
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('FCM Token retrieved:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    return null;
  }
};

/**
 * Requests permission from the user to show notifications.
 * @returns The permission status ('granted', 'denied', or 'default').
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    return await Notification.requestPermission();
}