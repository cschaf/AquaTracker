import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Achievement } from '../core/entities/achievement';

interface ModalContextType {
  isAchievementModalOpen: boolean;
  selectedAchievement: Achievement | null;
  isSelectedAchievementUnlocked: boolean;
  showAchievementModal: (achievement: Achievement, isUnlocked: boolean) => void;
  hideAchievementModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isSelectedAchievementUnlocked, setIsSelectedAchievementUnlocked] = useState(false);

  const showAchievementModal = useCallback((achievement: Achievement, isUnlocked: boolean) => {
    setSelectedAchievement(achievement);
    setIsSelectedAchievementUnlocked(isUnlocked);
    setIsAchievementModalOpen(true);
  }, []);

  const hideAchievementModal = useCallback(() => {
    setIsAchievementModalOpen(false);
    setSelectedAchievement(null);
  }, []);

  const value = {
    isAchievementModalOpen,
    selectedAchievement,
    isSelectedAchievementUnlocked,
    showAchievementModal,
    hideAchievementModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
