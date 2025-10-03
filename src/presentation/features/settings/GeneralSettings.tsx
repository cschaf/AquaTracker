import React from 'react';
import { Card } from '../../components/Card.tsx';
import { ThemeSwitcher } from '../../components/ThemeSwitcher.tsx';
import { useTheme } from '../../hooks/useTheme.ts';
import { Button } from '../../components/Button.tsx';
import { showSuccess, showError, showInfo } from '../../services/toast.service.ts';
import { setupPeriodicSync } from '../../../service-worker-registration.ts';

interface SettingsRowProps {
  title: string;
  children: React.ReactNode;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-border-card last:border-b-0">
      <span className="text-text-primary">{title}</span>
      {children}
    </div>
  );
};

const GeneralSettings: React.FC = () => {
  const { toggleTheme } = useTheme();

  const handlePermissionRequest = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      showError('This browser does not support notifications or service workers.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showSuccess('Notification permissions have been granted.');

      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const syncEnabled = await setupPeriodicSync(registration);
        if (syncEnabled) {
          showSuccess('Background sync for reminders is enabled.');
        } else {
          showInfo(
            'For the most reliable reminders, install the app to your home screen. This allows background sync to work correctly.',
          );
        }
      }
    } else {
      showError('Notification permissions have been denied.');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 text-text-primary">General Settings</h2>
      <div>
        <SettingsRow title="Theme">
          <ThemeSwitcher onChange={toggleTheme} />
        </SettingsRow>
        <SettingsRow title="Reminder Notifications">
          <Button onClick={handlePermissionRequest} className="text-sm">
            Grant Permission
          </Button>
        </SettingsRow>
      </div>
    </Card>
  );
};

export default GeneralSettings;
