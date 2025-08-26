import React from 'react';
import DailyIntakeCard from './DailyIntakeCard';
import TodaysEntriesCard from './TodaysEntriesCard';
import type { Log } from '../types';

interface DailyTrackerProps {
  todayLog: Log | undefined;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  addWaterEntry: (amount: number) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, newAmount: number) => void;
  dailyTotal: number;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ todayLog, dailyGoal, setDailyGoal, addWaterEntry, deleteEntry, updateEntry, dailyTotal }) => {
  return (
    <div className="space-y-8">
      <DailyIntakeCard
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
