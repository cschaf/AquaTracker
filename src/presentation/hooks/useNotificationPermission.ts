import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '../../infrastructure/services/notification.service';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>(() => NotificationService.getPermission());

  const requestPermission = useCallback(async () => {
    const status = await NotificationService.requestPermission();
    setPermission(status);
    return status;
  }, []);

  useEffect(() => {
    const onPermissionChange = () => {
        setPermission(NotificationService.getPermission());
    };

    // Browsers don't have a native event for permission changes,
    // so we rely on visibility changes as a proxy to re-check.
    document.addEventListener('visibilitychange', onPermissionChange);

    return () => {
      document.removeEventListener('visibilitychange', onPermissionChange);
    };
  }, []);

  return { permission, requestPermission };
};
