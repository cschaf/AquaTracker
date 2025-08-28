import React from 'react';
import type { Achievement } from '../../core/entities/achievement';

interface AchievementDetailModalProps {
  isOpen: boolean;
  achievement: Achievement | null;
  onClose: () => void;
  isUnlocked: boolean;
}

const AchievementDetailModal: React.FC<AchievementDetailModalProps> = ({ isOpen, achievement, onClose, isUnlocked }) => {
  if (!isOpen || !achievement) return null;

  const iconContainerClasses = isUnlocked
    ? 'bg-blue-500'
    : 'bg-gray-300';
  const iconClasses = isUnlocked
    ? 'text-white'
    : 'text-gray-500';

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
      <div className="achievement-modal-content bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <i className="fas fa-times text-2xl"></i>
        </button>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg ${iconContainerClasses}`}>
          <i className={`${achievement.icon} text-4xl ${iconClasses}`}></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{achievement.name}</h3>
        {isUnlocked ? (
          <p className="text-gray-600">{achievement.description}</p>
        ) : (
          <p className="text-gray-600">This achievement is still locked. Keep tracking your intake to unlock it!</p>
        )}
      </div>
    </div>
  );
};

export default AchievementDetailModal;
