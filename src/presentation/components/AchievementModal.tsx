import React from 'react';
import type { Achievement } from '../../../domain';

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="achievement-modal-content bg-gradient-to-br from-achievement-gradient-from to-achievement-gradient-to rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary">
          <i className="fas fa-times text-2xl"></i>
        </button>

        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-border-achievement shadow-lg bg-success">
          <i className={`fas fa-trophy text-4xl text-white`}></i>
        </div>

        <h3 className="text-2xl font-bold text-text-primary mb-2">
          {unlockedCount > 1 ? `${unlockedCount} New Achievements Unlocked!` : 'New Achievement Unlocked!'}
        </h3>

        <div className="space-y-4 my-4 max-h-60 overflow-y-auto p-2">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center bg-white/50 rounded-lg p-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-success shrink-0">
                <i className={`${achievement.icon} text-2xl text-white`}></i>
              </div>
              <p className="text-text-primary font-semibold ml-4 text-left">{achievement.name}</p>
            </div>
          ))}
        </div>

        {isUnlocked ? (
          <p className="text-text-secondary">Congratulations! You're making great progress.</p>
        ) : (
          <p className="text-text-secondary">Keep tracking your intake to unlock more achievements!</p>
        )}
      </div>
    </div>
  );
};

export default AchievementModal;
