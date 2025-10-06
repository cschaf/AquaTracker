/**
 * @file Custom hook for managing FCM configuration settings.
 * This hook encapsulates the logic for loading, saving, and validating
 * user-provided Firebase configuration.
 */

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { FcmConfig } from '../../domain/entities/fcm-config.entity';
import { IdbFcmConfigRepository } from '../../infrastructure/data/idb-fcm-config.repository';
import { initializeFirebase, getFcmToken } from '../../infrastructure/services/firebase';
import { notifySwOfConfigUpdate } from '../../service-worker-registration';
import { showSuccess, showError, showInfo } from '../services/toast.service';

// Zod schema for form validation
const FcmConfigSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  authDomain: z.string().min(1, 'Auth Domain is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  storageBucket: z.string().min(1, 'Storage Bucket is required'),
  messagingSenderId: z.string().min(1, 'Messaging Sender ID is required'),
  appId: z.string().min(1, 'App ID is required'),
  vapidKey: z.string().min(1, 'VAPID Key is required'),
  serviceAccount: z.string().min(1, 'Service Account JSON is required'),
});

const fcmConfigRepository = new IdbFcmConfigRepository();

export const useFcmSettings = () => {
  const [config, setConfig] = useState<FcmConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    vapidKey: '',
    serviceAccount: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      const savedConfig = await fcmConfigRepository.get();
      if (savedConfig) {
        setConfig(savedConfig);
      }
      setIsLoading(false);
    };
    loadConfig();
  }, []);

  const saveConfig = useCallback(async (newConfig: FcmConfig): Promise<boolean> => {
    try {
      const validatedConfig = FcmConfigSchema.parse(newConfig);
      await fcmConfigRepository.save(validatedConfig);
      setConfig(validatedConfig);
      showSuccess('FCM configuration saved successfully!');
      // Re-initialize firebase with the new config
      await initializeFirebase(validatedConfig);
      notifySwOfConfigUpdate(); // Tell the SW to re-init
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => e.message).join(', ');
        showError(`Validation failed: ${errorMessage}`);
      } else {
        showError('Failed to save FCM configuration.');
      }
      return false;
    }
  }, []);

  const clearConfig = useCallback(async () => {
    await fcmConfigRepository.delete();
    const defaultConfig = {
        apiKey: '', authDomain: '', projectId: '', storageBucket: '',
        messagingSenderId: '', appId: '', vapidKey: '', serviceAccount: ''
    };
    setConfig(defaultConfig);
    await initializeFirebase(defaultConfig); // Clear firebase instance
    showInfo('FCM configuration cleared.');
  }, []);

  const testConnection = useCallback(async () => {
    if (!config.vapidKey) {
        showError('VAPID key is missing.');
        return;
    }
    const isInitialized = await initializeFirebase(config);
    if (!isInitialized) {
        showError('Firebase initialization failed. Check console for errors.');
        return;
    }
    showInfo('Testing FCM connection...');
    const token = await getFcmToken(config.vapidKey);
    if (token) {
      showSuccess('FCM connection successful! Token generated.');
    } else {
      showError('Failed to get FCM token. Check permissions and configuration.');
    }
  }, [config]);

  return {
    config,
    isLoading,
    saveConfig,
    clearConfig,
    testConnection,
    setConfig
  };
};