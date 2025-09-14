import React from 'react';
import { useNotificationPermission } from '../../hooks/useNotificationPermission';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const NotificationSettings: React.FC = () => {
  const { permission, requestPermission } = useNotificationPermission();

  const getPermissionText = () => {
    switch (permission) {
      case 'granted':
        return 'You have granted permission for notifications.';
      case 'denied':
        return 'You have denied permission for notifications. You will need to change this in your browser settings.';
      case 'default':
        return 'You have not yet granted or denied notification permissions.';
    }
  };

  return (
    <Card>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-text-primary">Notifications</h2>
        <p className="text-text-secondary mb-4">{getPermissionText()}</p>
        <Button
          onClick={requestPermission}
          disabled={permission !== 'default'}
        >
          Enable Notifications
        </Button>
      </div>
    </Card>
  );
};

export default NotificationSettings;
