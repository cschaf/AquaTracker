import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { CreateReminderDto } from '../../domain/dtos';

interface CreateReminderFormProps {
  onSubmit: (dto: CreateReminderDto) => Promise<void>;
  isLoading: boolean;
}

export const CreateReminderForm: React.FC<CreateReminderFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title cannot be empty.');
      return;
    }
    if (!time) {
      setError('Time must be set.');
      return;
    }
    setError('');
    await onSubmit({ title, time });
    // Reset form after submission
    setTitle('');
    setTime('09:00');
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-center text-text-primary">New Reminder</h2>

        {error && <p className="text-sm text-center text-destructive">{error}</p>}

        <div>
          <label htmlFor="reminder-title" className="block mb-1 text-sm font-medium text-text-secondary">
            Title
          </label>
          <input
            id="reminder-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-bg-primary border-border-card focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
            className="w-full px-3 py-2 border rounded-md bg-bg-primary border-border-card focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Add Reminder'}
        </Button>
      </form>
    </Card>
  );
};
