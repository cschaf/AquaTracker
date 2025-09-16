import React, { useState, useEffect } from 'react';
import type { ReminderDto, UpdateReminderDto } from '../../domain/dtos';
import { Button } from './Button';
import { Card } from './Card';

interface EditReminderModalProps {
  reminder: ReminderDto | null;
  onSave: (dto: UpdateReminderDto) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export const EditReminderModal: React.FC<EditReminderModalProps> = ({ reminder, onSave, onClose, isLoading }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setTime(reminder.time);
    }
  }, [reminder]);

  if (!reminder) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ id: reminder.id, title, time });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-center text-text-primary">Edit Reminder</h2>

          <div>
            <label htmlFor="edit-reminder-title" className="block mb-1 text-sm font-medium text-text-secondary">
              Title
            </label>
            <input
              id="edit-reminder-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-text-primary placeholder:text-text-secondary border rounded-md bg-bg-primary border-border-card focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="e.g., Morning hydration"
            />
          </div>

          <div>
            <label htmlFor="edit-reminder-time" className="block mb-1 text-sm font-medium text-text-secondary">
              Time
            </label>
            <input
              id="edit-reminder-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-text-primary placeholder:text-text-secondary border rounded-md bg-bg-primary border-border-card focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
