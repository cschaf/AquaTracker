import React from 'react';
import type { Log } from '../../../domain/entities';
import { Card } from '../../components/Card';

interface DailyLogListProps {
  logs: Log[];
}

const DailyLogList: React.FC<DailyLogListProps> = ({ logs }) => {
  const dailyLogs = logs
    .map(log => ({
      date: log.date,
      totalIntake: log.entries.reduce((sum, entry) => sum + entry.amount, 0),
      entryCount: log.entries.length,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="!p-0">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-primary">Daily Intake Log</h2>
        <i className="fas fa-list-alt text-2xl text-accent-primary opacity-80"></i>
      </div>
      <div className="p-4 pt-0">
        {dailyLogs.length === 0 ? (
          <p className="text-center text-text-secondary py-8">No water intake logged yet.</p>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {dailyLogs.map((log) => (
              <li key={log.date} className="flex items-center justify-between p-4 bg-bg-tertiary rounded-xl shadow-sm">
                <div>
                  <p className="font-semibold text-text-primary">
                    {new Date(`${log.date}T00:00:00`).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-text-secondary">{log.entryCount} {log.entryCount === 1 ? 'entry' : 'entries'}</p>
                </div>
                <p className="text-lg font-bold text-accent-primary">{log.totalIntake.toLocaleString()} ml</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default DailyLogList;