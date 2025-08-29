import React, { useState } from 'react';
// The new entity location
import type { Entry } from '../../core/entities/water-intake';

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
    if (newAmount > 0) {
      updateEntry(id, newAmount);
    }
    setEditingId(null);
    setEditingAmount('');
  };

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-bg-primary rounded-2xl shadow-xl overflow-hidden drop-shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Today's Entries</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <i className="fas fa-glass-water text-4xl mb-3 text-accent-primary/50"></i>
              <p>No entries yet. Add your first water intake!</p>
            </div>
          ) : (
            sortedEntries.map(entry => (
              <div key={entry.id} className="entry-item bg-bg-secondary p-4 rounded-xl flex items-center justify-between">
                {editingId === entry.id ? (
                  <>
                    <div className="flex items-center flex-grow">
                      <input
                        type="number"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        className="w-full p-2 border-2 border-border-card bg-bg-primary rounded-lg"
                      />
                    </div>
                    <div className="flex">
                      <button onClick={() => handleSave(entry.id)} className="text-success hover:text-success/80 mr-2">
                        <i className="fas fa-check"></i>
                      </button>
                      <button onClick={handleCancel} className="text-warning hover:text-warning/80">
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
                    <div>
                      <button onClick={() => handleEdit(entry)} className="edit-entry text-accent-primary hover:text-accent-primary/80 mr-2">
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button onClick={() => deleteEntry(entry.id)} className="delete-entry text-warning hover:text-warning/80">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodaysEntriesCard;
