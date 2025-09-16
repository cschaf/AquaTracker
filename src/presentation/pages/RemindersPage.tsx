import React, { useState } from 'react';
import { useReminders } from '../hooks/useReminders';
import { RemindersList } from '../components/RemindersList';
import { EditReminderModal } from '../components/EditReminderModal';
import { CreateReminderModal } from '../components/CreateReminderModal';
import type { ReminderDto, UpdateReminderDto, CreateReminderDto } from '../../domain/dtos';
import { Button } from '../components/Button';


export const RemindersPage: React.FC = () => {
  const { reminders, loading, addReminder, removeReminder, toggleReminder, editReminder } = useReminders();
  const [editingReminder, setEditingReminder] = useState<ReminderDto | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

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
      <h1 className="mb-6 text-4xl font-bold text-center text-text-primary">Water Reminders</h1>

      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setCreateModalOpen(true)}>
            New Reminder
          </Button>
        </div>
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
