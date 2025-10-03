import React from 'react';
import { Card } from '../../components/Card.tsx';
import { ThemeSwitcher } from '../../components/ThemeSwitcher.tsx';
import { useTheme } from '../../hooks/useTheme.ts';
import { Button } from '../../components/Button.tsx';
import { showSuccess, showError, showInfo } from '../../services/toast.service.ts';
import { getFCMToken } from '../../../infrastructure/services/firebase.service.ts';

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

  const handleEnableNotifications = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      showError('Push notifications are not supported in this browser.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      showError('Notification permission was denied. Please enable it in your browser settings.');
      return;
    }

    showInfo('Permission granted. Enabling push notifications...');

    const token = await getFCMToken();

    if (token) {
      showSuccess('Successfully enabled push notifications! Your reminders will now be synced.');
    } else {
      showError('Failed to enable push notifications. Please try again.');
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
          <Button onClick={handleEnableNotifications} className="text-sm">
            Enable Notifications
          </Button>
        </SettingsRow>
      </div>
    </Card>
  );
};

export default GeneralSettings;