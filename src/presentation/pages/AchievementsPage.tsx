import React from 'react';
import Achievements from '../features/achievements/Achievements.tsx';
import { useStats } from '../hooks/useStats';
import { useModal } from '../modal/modal-provider';

const AchievementsPage: React.FC = () => {
  const { allAchievements, unlockedAchievements, isLoading } = useStats();
  const { showAchievementDetailModal } = useModal();

  if (isLoading) {
    return <div className="text-center p-8">Loading achievements...</div>;
  }

  return (
    <Achievements
      unlockedAchievements={unlockedAchievements}
      allAchievements={allAchievements}
      onAchievementClick={showAchievementDetailModal}
    />
  );
};

export default AchievementsPage;
