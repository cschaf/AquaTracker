/**
 * @file Custom hook to manage the application's FCM initialization process.
 * This hook orchestrates loading FCM config, initializing Firebase, requesting
 * notification permissions, and registering the FCM token with the backend.
 */
import { useEffect } from 'react';
import { IdbFcmConfigRepository } from '../../infrastructure/data/idb-fcm-config.repository';
import { IdbTokenRepository } from '../../infrastructure/data/idb-token.repository';
import { initializeFirebase, getFcmToken, requestNotificationPermission } from '../../infrastructure/services/firebase';
import { syncService } from '../../infrastructure/services/sync.service';
import { showSuccess, showError, showInfo } from '../services/toast.service';

const fcmConfigRepository = new IdbFcmConfigRepository();
const tokenRepository = new IdbTokenRepository();

export const useFcmInitialization = () => {
  useEffect(() => {
    const init = async () => {
      console.log('Starting FCM initialization process...');
      const config = await fcmConfigRepository.get();

      if (!config || !config.apiKey) {
        console.log('FCM config not found. Skipping initialization.');
        return;
      }

      const isInitialized = await initializeFirebase(config);
      if (!isInitialized) {
        showError('Firebase initialization failed.');
        return;
      }

      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        showInfo('Notification permission not granted.');
        return;
      }

      const fcmToken = await getFcmToken(config.vapidKey);
      if (!fcmToken) {
        showError('Could not retrieve FCM token.');
        return;
      }

      // Check if the token is new or has changed
      const savedToken = await tokenRepository.get();
      if (fcmToken !== savedToken) {
        await tokenRepository.save(fcmToken);
        showSuccess('New FCM token registered.');
        // Register the new token with the backend
        await syncService.registerToken(fcmToken, config);
      } else {
        console.log('FCM token is already up-to-date.');
      }
    };

    init();
  }, []);
};