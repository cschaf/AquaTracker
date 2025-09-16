import React from 'react';
import type { ReminderDto } from '../../domain/dtos';
import { Card } from './Card';

interface ReminderCardProps {
  reminder: ReminderDto;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onEdit: (reminder: ReminderDto) => void;
}

// Simple toggle switch component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary ${
        checked ? 'bg-success' : 'bg-gray-400'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};


export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onDelete, onToggle, onEdit }) => {
  return (
    <Card className="flex items-center justify-between space-x-4">
      <div className="flex flex-col">
        <p className="text-lg font-semibold text-text-primary">{reminder.title}</p>
        <p className="text-2xl font-bold text-accent-primary">{reminder.time}</p>
      </div>
      <div className="flex items-center space-x-2">
        <ToggleSwitch checked={reminder.isActive} onChange={() => onToggle(reminder.id)} />
        <button
          onClick={() => onEdit(reminder)}
          className="p-2 text-text-secondary rounded-full transition-colors duration-200 hover:bg-accent-primary/10 hover:text-accent-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
          aria-label={`Edit reminder ${reminder.title}`}
        >
          {/* Edit Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="p-2 text-text-secondary rounded-full transition-colors duration-200 hover:bg-destructive/10 hover:text-[var(--color-destructive)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-destructive)]"
          aria-label={`Delete reminder ${reminder.title}`}
        >
          {/* Trash Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </Card>
  );
};
