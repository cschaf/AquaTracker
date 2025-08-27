import React from 'react';
import WeeklyChart from './WeeklyChart';
import StatsOverview from './StatsOverview';
import Achievements from './Achievements';
import Tips from '../../shared/components/Tips';
import ExportData from './ExportData';
import ImportData from './ImportData';
import { useStats } from './useStats';
import { useModal } from '../../app/modal-provider';

const Stats: React.FC = () => {
  const {
    logs,
    dailyGoal,
    allAchievements,
    unlockedAchievements,
    isLoading,
    importData,
    exportData,
  } = useStats();

  const { showAchievementModal } = useModal();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">Loading Stats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WeeklyChart logs={logs} dailyGoal={dailyGoal} />
      <StatsOverview logs={logs} dailyGoal={dailyGoal} />
      <Achievements
        unlockedAchievements={unlockedAchievements}
        allAchievements={allAchievements}
        onAchievementClick={showAchievementModal}
      />
      <Tips />
      <ExportData exportData={exportData} />
      <ImportData importData={importData} />
    </div>
  );
};

export default Stats;
