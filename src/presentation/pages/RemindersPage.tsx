import React, { useState, useEffect } from 'react';
import { useReminders } from '../hooks/useReminders';
import { showInfo } from '../services/toast.service';
import { RemindersList } from '../components/RemindersList';
import { EditReminderModal } from '../components/EditReminderModal';
import { CreateReminderModal } from '../components/CreateReminderModal';
import type { ReminderDto, UpdateReminderDto, CreateReminderDto } from '../../domain/dtos';
import { Button } from '../components/Button';
import { Card } from '../components/Card';


export const RemindersPage: React.FC = () => {
  const { reminders, loading, addReminder, removeReminder, toggleReminder, editReminder } = useReminders();
  const [editingReminder, setEditingReminder] = useState<ReminderDto | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // On component mount, check and request notification permissions.
  useEffect(() => {
    // Check if the browser supports notifications.
    if (!('Notification' in window)) {
      showInfo('This browser does not support desktop notification');
      return;
    }

    // If permission has not been asked yet, request it.
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // If permission has been denied, inform the user.
    if (Notification.permission === 'denied') {
      showInfo('Notification permission has been denied. Please enable it in your browser settings.');
    }
  }, []);

  const handleEdit = (reminder: ReminderDto) => {
    setEditingReminder(reminder);
  };

  const handleCloseEditModal = () => {
    setEditingReminder(null);
  };

  const handleSave = async (dto: UpdateReminderDto) => {
    await editReminder(dto);
    handleCloseEditModal();
  };

  const handleCreate = async (dto: CreateReminderDto) => {
    await addReminder(dto);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <p className="text-sm text-center text-gray-500">
            Please note: Reminders work best when the app is open. Due to browser and OS limitations, background notifications may be delayed.
          </p>
        </Card>
        <Card>
          <Button onClick={() => setCreateModalOpen(true)} className="w-full">
            New Reminder
          </Button>
        </Card>
        <RemindersList
          reminders={reminders}
          isLoading={loading}
          onDelete={removeReminder}
          onToggle={toggleReminder}
          onEdit={handleEdit}
        />
      </div>

      <EditReminderModal
        reminder={editingReminder}
        onSave={handleSave}
        onClose={handleCloseEditModal}
        isLoading={loading}
      />

      <CreateReminderModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={loading}
      />
    </div>
  );
};
