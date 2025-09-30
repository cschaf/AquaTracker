import React from 'react';
import DailyIntakeCard from './DailyIntakeCard';
import TodaysEntriesCard from './TodaysEntriesCard';
import type { useDailyTracker } from '../../hooks/useDailyTracker';

type DailyTrackerProps = ReturnType<typeof useDailyTracker>;

const DailyTracker: React.FC<DailyTrackerProps> = ({
  summary,
  goal,
  setGoal,
  addEntry,
  deleteEntry,
  updateEntry,
  isLoading,
}) => {
  // A simple loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">Loading...</div>
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DailyIntakeCard
        dailyGoal={goal}
        setDailyGoal={setGoal}
        addWaterEntry={addEntry}
        dailyTotal={summary.total}
      />
      <TodaysEntriesCard
        entries={summary.entries}
        deleteEntry={deleteEntry}
        updateEntry={updateEntry}
      />
    </div>
  );
};

export default DailyTracker;