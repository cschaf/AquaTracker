import React, { useState } from 'react';
import type { Log, Entry } from '../types';

interface TodaysEntriesCardProps {
  todayLog: Log | undefined;
  deleteEntry: (timestamp: number) => void;
  updateEntry: (timestamp: number, newAmount: number) => void;
}

const TodaysEntriesCard: React.FC<TodaysEntriesCardProps> = ({ todayLog, deleteEntry, updateEntry }) => {
  const [editingTimestamp, setEditingTimestamp] = useState<number | null>(null);
  const [editingAmount, setEditingAmount] = useState<string>('');

  const handleEdit = (entry: Entry) => {
    setEditingTimestamp(entry.timestamp);
    setEditingAmount(entry.amount.toString());
  };

  const handleCancel = () => {
    setEditingTimestamp(null);
    setEditingAmount('');
  };

  const handleSave = (timestamp: number) => {
    const newAmount = parseInt(editingAmount);
    if (newAmount > 0) {
      updateEntry(timestamp, newAmount);
    }
    setEditingTimestamp(null);
    setEditingAmount('');
  };

  const sortedEntries = todayLog ? [...todayLog.entries].sort((a, b) => b.timestamp - a.timestamp) : [];

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden drop-shadow">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Entries</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-glass-water text-4xl mb-3 text-blue-300"></i>
              <p>No entries yet. Add your first water intake!</p>
            </div>
          ) : (
            sortedEntries.map(entry => (
              <div key={entry.timestamp} className="entry-item bg-blue-50 p-4 rounded-xl flex items-center justify-between">
                {editingTimestamp === entry.timestamp ? (
                  <>
                    <div className="flex items-center flex-grow">
                      <input
                        type="number"
                        value={editingAmount}
                        onChange={(e) => setEditingAmount(e.target.value)}
                        className="w-full p-2 border-2 border-blue-300 rounded-lg"
                      />
                    </div>
                    <div className="flex">
                      <button onClick={() => handleSave(entry.timestamp)} className="text-green-500 hover:text-green-700 mr-2">
                        <i className="fas fa-check"></i>
                      </button>
                      <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                        <i className="fas fa-tint text-white"></i>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{entry.amount} ml</p>
                        <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => handleEdit(entry)} className="edit-entry text-blue-500 hover:text-blue-700 mr-2">
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button onClick={() => deleteEntry(entry.timestamp)} className="delete-entry text-red-500 hover:text-red-700">
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
