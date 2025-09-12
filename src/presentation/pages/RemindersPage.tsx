import React from 'react';
import { useReminders } from '../hooks/useReminders';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import { CreateReminderForm } from '../components/CreateReminderForm';
import { RemindersList } from '../components/RemindersList';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const NotificationPermissionPrompt: React.FC<{ onRequest: () => void }> = ({ onRequest }) => (
  <Card className="text-center">
    <h3 className="text-lg font-semibold text-text-primary">Enable Notifications</h3>
    <p className="my-2 text-text-secondary">
      To get reminders, you need to allow push notifications.
    </p>
    <Button onClick={onRequest}>Allow Notifications</Button>
  </Card>
);

export const RemindersPage: React.FC = () => {
  const { reminders, loading, addReminder, removeReminder, toggleReminder } = useReminders();
  const { permission, requestPermission } = useNotificationPermission();

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-4xl font-bold text-center text-text-primary">Water Reminders</h1>

      <div className="max-w-md mx-auto space-y-6">
        {permission === 'default' && <NotificationPermissionPrompt onRequest={requestPermission} />}
        {permission === 'denied' && (
            <Card className='text-center text-destructive'>
                <p>You have blocked notifications. You'll need to enable them in your browser settings to receive reminders.</p>
            </Card>
        )}

        {permission === 'granted' && (
          <>
            <CreateReminderForm onSubmit={addReminder} isLoading={loading} />
            <RemindersList
              reminders={reminders}
              isLoading={loading}
              onDelete={removeReminder}
              onToggle={toggleReminder}
            />
          </>
        )}
      </div>
    </div>
  );
};
