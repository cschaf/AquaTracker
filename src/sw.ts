/**
 * @file Service Worker for AquaTracker PWA.
 *
 * This service worker is now responsible for:
 * 1. Precaching application assets for offline use via Workbox.
 * 2. Handling background push notifications from Firebase Cloud Messaging (FCM).
 * 3. Dynamically initializing Firebase based on user-provided configuration.
 */

/// <reference lib="webworker" />

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { IdbFcmConfigRepository } from './infrastructure/data/idb-fcm-config.repository';

declare const self: ServiceWorkerGlobalScope;

// --- Lifecycle Management & Precaching ---

clientsClaim();
self.skipWaiting();

precacheAndRoute(self.__WB_MANIFEST);

declare const __APP_URL__: string;

// --- FCM Background Handling ---

const fcmConfigRepository = new IdbFcmConfigRepository();

const initializeFirebaseInSW = async () => {
  const config = await fcmConfigRepository.get();

  if (config && config.apiKey) {
    try {
      const app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });

      const messaging = getMessaging(app);
      console.log('Service Worker: Firebase initialized for background messages.');

      onBackgroundMessage(messaging, (payload) => {
        console.log('[sw.ts] Received background message ', payload);

        const notificationTitle = payload.notification?.title || 'AquaTracker';
        const notificationOptions = {
          body: payload.notification?.body || 'You have a new reminder.',
          icon: '/icons/icon-192-192.png',
          data: {
            url: __APP_URL__,
          },
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });
    } catch (error) {
      console.error('Service Worker: Firebase initialization failed.', error);
    }
  } else {
    console.log('Service Worker: No FCM config found. Background notifications disabled.');
  }
};

// Initialize Firebase as soon as the service worker starts up.
initializeFirebaseInSW();


// --- Event Listeners ---

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

// Listen for a message from the client to re-initialize Firebase when the config changes.
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FCM_CONFIG_UPDATED') {
        console.log('Service Worker: Received message to re-initialize Firebase.');
        initializeFirebaseInSW();
    }
});