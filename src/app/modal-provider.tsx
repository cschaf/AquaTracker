import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Achievement } from '../core/entities/achievement';

interface ModalContextType {
  isAchievementModalOpen: boolean;
  selectedAchievements: Achievement[];
  isSelectedAchievementUnlocked: boolean;
  showAchievementModal: (achievements: Achievement[], isUnlocked: boolean) => void;
  hideAchievementModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState<Achievement[]>([]);
  const [isSelectedAchievementUnlocked, setIsSelectedAchievementUnlocked] = useState(false);

  const showAchievementModal = useCallback((achievements: Achievement[], isUnlocked: boolean) => {
    setSelectedAchievements(achievements);
    setIsSelectedAchievementUnlocked(isUnlocked);
    setIsAchievementModalOpen(true);
  }, []);

  const hideAchievementModal = useCallback(() => {
    setIsAchievementModalOpen(false);
    setSelectedAchievements([]);
  }, []);

  const value = {
    isAchievementModalOpen,
    selectedAchievements,
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
