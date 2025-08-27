import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import { useModal } from '../../app/modal-provider';
import type { DailySummary } from '../../core/use-cases/get-daily-summary.use-case';
import type { DailyGoal } from '../../core/entities/goal';

export const useDailyTracker = () => {
  const {
    getDailySummary,
    getDailyGoal,
    setDailyGoal: setDailyGoalUseCase,
    addWaterIntake,
    deleteWaterIntake,
    updateWaterIntake,
    checkForNewAchievements,
  } = useUseCases();
  const { showAchievementModal } = useModal();

  const [summary, setSummary] = useState<DailySummary>({ total: 0, entries: [] });
  const [goal, setGoal] = useState<DailyGoal>(2000);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryData, goalData] = await Promise.all([
        getDailySummary.execute(),
        getDailyGoal.execute(),
      ]);
      setSummary(summaryData);
      setGoal(goalData);
    } catch (error) {
      console.error("Failed to load daily tracker data", error);
      // Optionally set some error state here
    } finally {
      setIsLoading(false);
    }
  }, [getDailySummary, getDailyGoal]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddEntry = useCallback(async (amount: number) => {
    await addWaterIntake.execute(amount);
    const newlyUnlocked = await checkForNewAchievements.execute();
    if (newlyUnlocked.length > 0) {
      showAchievementModal(newlyUnlocked[0], true);
    }
    loadData(); // Refresh data after adding
  }, [addWaterIntake, loadData, checkForNewAchievements, showAchievementModal]);

  const handleDeleteEntry = useCallback(async (entryId: string) => {
    await deleteWaterIntake.execute(entryId);
    loadData(); // Refresh data after deleting
  }, [deleteWaterIntake, loadData]);

  const handleUpdateEntry = useCallback(async (entryId: string, amount: number) => {
    await updateWaterIntake.execute(entryId, amount);
    loadData(); // Refresh data after updating
  }, [updateWaterIntake, loadData]);

  const handleSetGoal = useCallback(async (newGoal: number) => {
    await setDailyGoalUseCase.execute(newGoal);
    setGoal(newGoal); // Optimistic update or refresh from source
  }, [setDailyGoalUseCase]);

  return {
    summary,
    goal,
    isLoading,
    setGoal: handleSetGoal,
    addEntry: handleAddEntry,
    deleteEntry: handleDeleteEntry,
    updateEntry: handleUpdateEntry,
  };
};
