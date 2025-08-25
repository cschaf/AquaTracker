import React from 'react';
import DailyIntakeCard from './DailyIntakeCard';
import TodaysEntriesCard from './TodaysEntriesCard';
import type { Log } from '../types';

interface DailyTrackerProps {
  logs: Log[];
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  addWaterEntry: (amount: number) => void;
  deleteEntry: (timestamp: number) => void;
  updateEntry: (timestamp: number, newAmount: number) => void;
  dailyTotal: number;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ logs, dailyGoal, setDailyGoal, addWaterEntry, deleteEntry, updateEntry, dailyTotal }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === todayStr);

  return (
    <div className="space-y-8">
      <DailyIntakeCard
        todayLog={todayLog}
        dailyGoal={dailyGoal}
        setDailyGoal={setDailyGoal}
        addWaterEntry={addWaterEntry}
        dailyTotal={dailyTotal}
      />
      <TodaysEntriesCard
        todayLog={todayLog}
        deleteEntry={deleteEntry}
        updateEntry={updateEntry}
      />
    </div>
  );
};

export default DailyTracker;
