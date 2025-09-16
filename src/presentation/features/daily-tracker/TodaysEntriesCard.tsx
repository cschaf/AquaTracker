import React, { useState } from 'react';
import type { Entry } from '../../../domain/entities';
import { Card } from '../../components/Card';
import { showWarning } from '../../services/toast.service';

interface TodaysEntriesCardProps {
  entries: Entry[];
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, newAmount: number) => void;
}

const TodaysEntriesCard: React.FC<TodaysEntriesCardProps> = ({ entries, deleteEntry, updateEntry }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<string>('');

  const handleEdit = (entry: Entry) => {
    setEditingId(entry.id);
    setEditingAmount(entry.amount.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingAmount('');
  };

  const handleSave = (id: string) => {
    const newAmount = parseInt(editingAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      showWarning('Please enter a positive number.');
      return;
    }
    updateEntry(id, newAmount);
    setEditingId(null);
    setEditingAmount('');
  };

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Today's Entries</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2" data-testid="todays-entries-list">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <i className="fas fa-glass-water text-4xl mb-3 text-accent-primary/50"></i>
              <p>No entries yet. Add your first water intake!</p>
            </div>
          ) : (
            sortedEntries.map(entry => (
              <div key={entry.id} className="entry-item bg-bg-tertiary p-4 rounded-xl flex items-center justify-between" data-testid={`entry-item-${entry.id}`}>
                {editingId === entry.id ? (
                  <>
                    <div className="flex items-center flex-grow">
                      <input
                        type="number"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        className="w-full p-2 border-2 border-border-card bg-bg-primary rounded-lg"
                        data-testid="edit-entry-input"
                      />
                    </div>
                    <div className="flex">
                      <button onClick={() => handleSave(entry.id)} className="text-success hover:text-success/80 mr-2" data-testid="save-entry-button">
                        <i className="fas fa-check"></i>
                      </button>
                      <button onClick={handleCancel} className="text-warning hover:text-warning/80" data-testid="cancel-edit-button">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center mr-3">
                        <i className="fas fa-tint text-text-on-primary"></i>
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">{entry.amount} ml</p>
                        <p className="text-sm text-text-secondary">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-2 text-text-secondary rounded-full transition-colors duration-200 hover:bg-accent-primary/10 hover:text-accent-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
                        aria-label={`Edit entry ${entry.amount}ml`}
                        data-testid="edit-entry-button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-text-secondary rounded-full transition-colors duration-200 hover:bg-destructive/10 hover:text-[var(--color-destructive)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-destructive)]"
                        aria-label={`Delete entry ${entry.amount}ml`}
                        data-testid="delete-entry-button"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default TodaysEntriesCard;
