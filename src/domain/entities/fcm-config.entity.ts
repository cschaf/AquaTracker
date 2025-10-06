/**
 * @file Defines the FcmConfig entity.
 * This represents the configuration required to initialize Firebase for a user.
 */

export interface FcmConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
  serviceAccount: string; // JSON string of the service account key
}