/**
 * @file React component for managing FCM (Firebase Cloud Messaging) settings.
 * This component provides a form for users to input, save, and test their
 * Firebase project configuration.
 */

import React from 'react';
import { useFcmSettings } from '../../hooks/useFcmSettings';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

const FcmSettings: React.FC = () => {
  const { config, isLoading, saveConfig, clearConfig, testConnection, setConfig } = useFcmSettings();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveConfig(config);
  };

  if (isLoading) {
    return <p>Loading FCM configuration...</p>;
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Firebase Cloud Messaging (FCM) Settings</h2>
      <p className="mb-4 text-sm text-gray-600">
        Configure your own Firebase project to enable reliable push notifications.
        This is required for reminders to work when the app is closed.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-text-secondary">API Key</label>
            <input type="text" id="apiKey" name="apiKey" value={config.apiKey} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="authDomain" className="block text-sm font-medium text-text-secondary">Auth Domain</label>
            <input type="text" id="authDomain" name="authDomain" value={config.authDomain} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-text-secondary">Project ID</label>
            <input type="text" id="projectId" name="projectId" value={config.projectId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="storageBucket" className="block text-sm font-medium text-text-secondary">Storage Bucket</label>
            <input type="text" id="storageBucket" name="storageBucket" value={config.storageBucket} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="messagingSenderId" className="block text-sm font-medium text-text-secondary">Messaging Sender ID</label>
            <input type="text" id="messagingSenderId" name="messagingSenderId" value={config.messagingSenderId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="appId" className="block text-sm font-medium text-text-secondary">App ID</label>
            <input type="text" id="appId" name="appId" value={config.appId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="vapidKey" className="block text-sm font-medium text-text-secondary">VAPID Key</label>
            <input type="text" id="vapidKey" name="vapidKey" value={config.vapidKey} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="serviceAccount" className="block text-sm font-medium text-text-secondary">Service Account JSON</label>
            <textarea id="serviceAccount" name="serviceAccount" value={config.serviceAccount} onChange={handleInputChange} rows={8} className="mt-1 block w-full rounded-md border-border-primary bg-bg-primary p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" onClick={clearConfig} variant="secondary">Clear</Button>
          <Button type="button" onClick={testConnection} variant="secondary">Test Connection</Button>
          <Button type="submit" variant="primary">Save Configuration</Button>
        </div>
      </form>
    </Card>
  );
};

export default FcmSettings;