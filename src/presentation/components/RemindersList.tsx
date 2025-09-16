import React from 'react';
import type { ReminderDto } from '../../domain/dtos';
import { ReminderCard } from './ReminderCard';

interface RemindersListProps {
  reminders: ReminderDto[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (reminder: ReminderDto) => void;
}

export const RemindersList: React.FC<RemindersListProps> = ({ reminders, isLoading, onDelete, onToggle, onEdit }) => {
  if (isLoading && reminders.length === 0) {
    return <p className="text-center text-text-secondary">Loading reminders...</p>;
  }

  if (!isLoading && reminders.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-lg border-border-card">
        <h3 className="text-lg font-semibold text-text-primary">No Reminders Yet</h3>
        <p className="mt-1 text-text-secondary">Add a reminder using the form above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map(reminder => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
