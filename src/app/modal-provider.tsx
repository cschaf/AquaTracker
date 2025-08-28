import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Achievement } from '../core/entities/achievement';

interface ModalContextType {
  isAchievementModalOpen: boolean;
  selectedAchievements: Achievement[];
  isSelectedAchievementUnlocked: boolean;
  showAchievementModal: (achievements: Achievement[], isUnlocked: boolean) => void;
  hideAchievementModal: () => void;

  isAchievementDetailModalOpen: boolean;
  selectedAchievementDetail: Achievement | null;
  isSelectedAchievementDetailUnlocked: boolean;
  showAchievementDetailModal: (achievement: Achievement, isUnlocked: boolean) => void;
  hideAchievementDetailModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for the multi-achievement modal
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState<Achievement[]>([]);
  const [isSelectedAchievementUnlocked, setIsSelectedAchievementUnlocked] = useState(false);

  // State for the single achievement detail modal
  const [isAchievementDetailModalOpen, setIsAchievementDetailModalOpen] = useState(false);
  const [selectedAchievementDetail, setSelectedAchievementDetail] = useState<Achievement | null>(null);
  const [isSelectedAchievementDetailUnlocked, setIsSelectedAchievementDetailUnlocked] = useState(false);

  const showAchievementModal = useCallback((achievements: Achievement[], isUnlocked: boolean) => {
    setSelectedAchievements(achievements);
    setIsSelectedAchievementUnlocked(isUnlocked);
    setIsAchievementModalOpen(true);
  }, []);

  const hideAchievementModal = useCallback(() => {
    setIsAchievementModalOpen(false);
    setSelectedAchievements([]);
  }, []);

  const showAchievementDetailModal = useCallback((achievement: Achievement, isUnlocked: boolean) => {
    setSelectedAchievementDetail(achievement);
    setIsSelectedAchievementDetailUnlocked(isUnlocked);
    setIsAchievementDetailModalOpen(true);
  }, []);

  const hideAchievementDetailModal = useCallback(() => {
    setIsAchievementDetailModalOpen(false);
    setSelectedAchievementDetail(null);
  }, []);

  const value = {
    isAchievementModalOpen,
    selectedAchievements,
    isSelectedAchievementUnlocked,
    showAchievementModal,
    hideAchievementModal,

    isAchievementDetailModalOpen,
    selectedAchievementDetail,
    isSelectedAchievementDetailUnlocked,
    showAchievementDetailModal,
    hideAchievementDetailModal,
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
