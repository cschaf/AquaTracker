import React, { useState } from 'react';
import type { CreateReminderDto } from '../../domain/dtos';
import { Button } from './Button';
import { Card } from './Card';
import { showError } from '../services/toast.service';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateReminderDto) => Promise<void>;
  isLoading: boolean;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) {
      showError('Time must be set.');
      return;
    }
    await onSubmit({ title, time });
    // Reset form after submission
    setTitle('');
    setTime('09:00');
    onClose(); // Close modal on success
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-center text-text-primary">New Reminder</h2>

          <div>
            <label htmlFor="reminder-title" className="block mb-1 text-sm font-medium text-text-secondary">
              Title
            </label>
            <input
              id="reminder-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-text-primary placeholder:text-text-secondary border rounded-md bg-bg-primary border-border-card focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="e.g., Morning hydration"
            />
          </div>

          <div>
            <label htmlFor="reminder-time" className="block mb-1 text-sm font-medium text-text-secondary">
              Time
            </label>
            <input
              id="reminder-time"
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
              {isLoading ? 'Adding...' : 'Add Reminder'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
