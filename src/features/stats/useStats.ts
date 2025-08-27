import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import type { Log } from '../../core/entities/water-intake';
import type { DailyGoal } from '../../core/entities/goal';
import type { Achievement } from '../../core/entities/achievement';

export const useStats = () => {
  const {
    getLogs,
    getDailyGoal,
    getAllAchievements,
    getUnlockedAchievements,
    importData: importDataUseCase,
    exportData: exportDataUseCase,
  } = useUseCases();

  const [logs, setLogs] = useState<Log[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(2000);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [logsData, goalData, allAchievementsData, unlockedIdsData] = await Promise.all([
        getLogs.execute(),
        getDailyGoal.execute(),
        getAllAchievements.execute(),
        getUnlockedAchievements.execute(),
      ]);
      setLogs(logsData);
      setDailyGoal(goalData);
      setAllAchievements(allAchievementsData);
      setUnlockedAchievementIds(unlockedIdsData);
    } catch (error) {
      console.error("Failed to load stats data", error);
    } finally {
      setIsLoading(false);
    }
  }, [getLogs, getDailyGoal, getAllAchievements, getUnlockedAchievements]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleImportData = async (file: File) => {
    const result = await importDataUseCase.execute(file);
    alert(result.message);
    if (result.success) {
      // The use case message says the page will reload, so we do it here.
      window.location.reload();
    }
  };

  const handleExportData = async () => {
    const result = await exportDataUseCase.execute();
    if (!result.success) {
      alert(result.message);
    }
  };

  return {
    logs,
    dailyGoal,
    allAchievements,
    unlockedAchievements: unlockedAchievementIds, // Renaming for clarity in the consuming component
    isLoading,
    importData: handleImportData,
    exportData: handleExportData,
  };
};
