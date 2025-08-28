import React from 'react';
import type { Achievement } from '../../core/entities/achievement';

interface AchievementModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  onClose: () => void;
  isUnlocked: boolean;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, achievements, onClose, isUnlocked }) => {
  if (!isOpen || achievements.length === 0) return null;

  const unlockedCount = achievements.length;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="achievement-modal-content bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
          <i className="fas fa-times text-2xl"></i>
        </button>

        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-blue-400 shadow-lg bg-blue-500 dark:bg-blue-600">
          <i className={`fas fa-trophy text-4xl text-white`}></i>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">
          {unlockedCount > 1 ? `${unlockedCount} New Achievements Unlocked!` : 'New Achievement Unlocked!'}
        </h3>

        <div className="space-y-4 my-4 max-h-60 overflow-y-auto p-2">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center bg-white/50 dark:bg-white/10 rounded-lg p-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 dark:bg-blue-600 shrink-0">
                <i className={`${achievement.icon} text-2xl text-white`}></i>
              </div>
              <p className="text-gray-800 dark:text-dark-text font-semibold ml-4 text-left">{achievement.name}</p>
            </div>
          ))}
        </div>

        {isUnlocked ? (
          <p className="text-gray-600 dark:text-dark-text-secondary">Congratulations! You're making great progress.</p>
        ) : (
          <p className="text-gray-600 dark:text-dark-text-secondary">Keep tracking your intake to unlock more achievements!</p>
        )}
      </div>
    </div>
  );
};

export default AchievementModal;
