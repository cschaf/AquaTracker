import React from 'react';
import WeeklyChart from './WeeklyChart';
import StatsOverview from './StatsOverview';
import Achievements from './Achievements';
import Tips from './Tips';
import ExportData from './ExportData';
import ImportData from './ImportData';
import type { Log, Achievement } from '../types';

interface StatsProps {
  logs: Log[];
  dailyGoal: number;
  unlockedAchievements: string[];
  allAchievements: Achievement[];
  exportData: () => void;
  importData: (file: File) => void;
}

const Stats: React.FC<StatsProps> = ({ logs, dailyGoal, unlockedAchievements, allAchievements, exportData, importData }) => {
  return (
    <div className="space-y-8">
      <WeeklyChart logs={logs} dailyGoal={dailyGoal} />
      <StatsOverview logs={logs} dailyGoal={dailyGoal} />
      <Achievements
        unlockedAchievements={unlockedAchievements}
        allAchievements={allAchievements}
      />
      <Tips />
      <ExportData exportData={exportData} />
      <ImportData importData={importData} />
    </div>
  );
};

export default Stats;
