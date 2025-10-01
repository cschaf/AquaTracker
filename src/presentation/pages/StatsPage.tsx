import React from 'react';
import StatsChart from '../features/stats/StatsChart';
import StatsOverview from '../features/stats/StatsOverview';
import DailyLogList from '../features/stats/DailyLogList';
import type { useStats } from '../hooks/useStats';

type StatsPageProps = ReturnType<typeof useStats>;

const StatsPage: React.FC<StatsPageProps> = ({ logs, dailyGoal, isLoading }) => {
  if (isLoading) {
    return <div className="text-center p-8">Loading stats...</div>;
  }

  return (
    <div className="space-y-8">
      <StatsChart logs={logs} dailyGoal={dailyGoal} />
      <StatsOverview logs={logs} dailyGoal={dailyGoal} />
      <DailyLogList logs={logs} />
    </div>
  );
};

export default StatsPage;