import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '../../infrastructure/services/notification.service';

type PermissionStatus = 'granted' | 'denied' | 'default';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<PermissionStatus>('default');

  useEffect(() => {
    // Set initial permission status
    if (NotificationService.hasPermission()) {
        setPermission('granted');
    } else if (Notification.permission === 'denied') {
        setPermission('denied');
    } else {
        setPermission('default');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const status = await NotificationService.requestPermission();
    setPermission(status);
    return status;
  }, []);

  return { permission, requestPermission };
};
