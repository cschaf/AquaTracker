import React from 'react';
import type { Achievement } from '../../core/entities/achievement';
import { Card } from '../../shared/components/Card';

interface AchievementsProps {
  unlockedAchievements: string[];
  allAchievements: Achievement[];
  onAchievementClick: (achievement: Achievement, isUnlocked: boolean) => void;
}

const Achievements: React.FC<AchievementsProps> = ({ unlockedAchievements, allAchievements, onAchievementClick }) => {
  const sortedAchievements = [...allAchievements].sort((a, b) => {
    const aUnlocked = unlockedAchievements.includes(a.id);
    const bUnlocked = unlockedAchievements.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return 0;
  });

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Your Achievements</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-2">
        {sortedAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const badgeClasses = isUnlocked
            ? 'bg-success/80'
            : 'bg-bg-tertiary cursor-pointer';
          const iconClass = isUnlocked ? 'text-white' : 'text-text-secondary';
          const textClass = isUnlocked ? 'text-white' : 'text-text-secondary';

          return (
            <div
              key={achievement.id}
              className={`achievement-badge ${badgeClasses} rounded-xl p-3 text-center transition-all duration-300 transform hover:scale-110`}
              onClick={() => onAchievementClick(achievement, isUnlocked)}
            >
              <i className={`${achievement.icon} text-2xl mb-2 ${iconClass}`}></i>
              <p className={`font-semibold text-xs ${textClass} break-words`}>{achievement.name}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default Achievements;
