import React from 'react';
import type { Achievement } from '../../core/entities/achievement';

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
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl overflow-hidden text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Achievements</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-2">
          {sortedAchievements.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const badgeClasses = isUnlocked
              ? 'bg-white bg-opacity-40'
              : 'bg-blue-900 bg-opacity-40 filter grayscale cursor-pointer';
            const iconClass = isUnlocked ? 'text-amber-300' : 'text-gray-500';
            const textClass = isUnlocked ? 'text-indigo-800' : 'text-gray-300';

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
      </div>
    </div>
  );
};

export default Achievements;
