import React, { useState } from 'react';
import { useReminders } from '../hooks/useReminders';
import { CreateReminderForm } from '../components/CreateReminderForm';
import { RemindersList } from '../components/RemindersList';
import { EditReminderModal } from '../components/EditReminderModal';
import type { ReminderDto, UpdateReminderDto } from '../../domain/dtos';


export const RemindersPage: React.FC = () => {
  const { reminders, loading, addReminder, removeReminder, toggleReminder, editReminder } = useReminders();
  const [editingReminder, setEditingReminder] = useState<ReminderDto | null>(null);

  const handleEdit = (reminder: ReminderDto) => {
    setEditingReminder(reminder);
  };

  const handleCloseModal = () => {
    setEditingReminder(null);
  };

  const handleSave = async (dto: UpdateReminderDto) => {
    await editReminder(dto);
    handleCloseModal();
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-4xl font-bold text-center text-text-primary">Water Reminders</h1>

      <div className="max-w-md mx-auto space-y-6">
        <CreateReminderForm onSubmit={addReminder} isLoading={loading} />
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
        onClose={handleCloseModal}
        isLoading={loading}
      />
    </div>
  );
};
