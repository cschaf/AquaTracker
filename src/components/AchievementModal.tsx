import React from 'react';
import type { Achievement } from '../types';

interface AchievementModalProps {
  isOpen: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, achievement, onClose }) => {
  if (!isOpen || !achievement) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="achievement-modal-content bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-auto text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <i className="fas fa-times text-2xl"></i>
        </button>
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
          <i className={`${achievement.icon} text-white text-4xl`}></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Achievement Unlocked!</h3>
        <p className="text-gray-600">{achievement.description}</p>
      </div>
    </div>
  );
};

export default AchievementModal;
