import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import { useModal } from '../../app/modal-provider';
import { eventBus } from '../../app/event-bus';
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
    } finally {
      setIsLoading(false);
    }
  }, [getDailySummary, getDailyGoal]);

  useEffect(() => {
    loadData(); // Initial load

    // Subscribe to data changes
    eventBus.on('intakeDataChanged', loadData);

    // Unsubscribe on cleanup
    return () => {
      eventBus.off('intakeDataChanged', loadData);
    };
  }, [loadData]);

  const handleAddEntry = useCallback(async (amount: number) => {
    await addWaterIntake.execute(amount);
    const newlyUnlocked = await checkForNewAchievements.execute();
    if (newlyUnlocked.length > 0) {
      showAchievementModal(newlyUnlocked, true);
    }
    eventBus.emit('intakeDataChanged');
  }, [addWaterIntake, checkForNewAchievements, showAchievementModal]);

  const handleDeleteEntry = useCallback(async (entryId: string) => {
    await deleteWaterIntake.execute(entryId);
    // Recalculate achievements after deleting an entry.
    // It's unlikely to unlock one, but it correctly handles locking them again.
    await checkForNewAchievements.execute();
    eventBus.emit('intakeDataChanged');
  }, [deleteWaterIntake, checkForNewAchievements]);

  const handleUpdateEntry = useCallback(async (entryId: string, amount: number) => {
    await updateWaterIntake.execute(entryId, amount);
    const newlyUnlocked = await checkForNewAchievements.execute();
    if (newlyUnlocked.length > 0) {
      showAchievementModal(newlyUnlocked, true);
    }
    eventBus.emit('intakeDataChanged');
  }, [updateWaterIntake, checkForNewAchievements, showAchievementModal]);

  const handleSetGoal = useCallback(async (newGoal: number) => {
    await setDailyGoalUseCase.execute(newGoal);
    // We also optimistically update the local state for immediate feedback
    setGoal(newGoal);
    eventBus.emit('intakeDataChanged');
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
