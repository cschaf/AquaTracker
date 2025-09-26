import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../di';
import { showWarning } from '../services/toast.service';
import { eventBus } from '../lib/event-bus/event-bus'; // This will be moved later
import type { DailySummary } from '../../domain/usecases';
import type { DailyGoal } from '../../domain/entities';

export const useDailyTracker = () => {
  const {
    getDailySummary,
    getDailyGoal,
    setDailyGoal,
    addWaterIntake,
    deleteWaterIntake,
    updateWaterIntake,
    recalculateAchievements,
  } = useUseCases();

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
    const handleDataChanged = () => loadData();
    eventBus.on('intakeDataChanged', handleDataChanged);
    eventBus.on('dataSync', handleDataChanged);

    // Unsubscribe on cleanup
    return () => {
      eventBus.off('intakeDataChanged', handleDataChanged);
      eventBus.off('dataSync', handleDataChanged);
    };
  }, [loadData]);

  const handleAddEntry = useCallback(async (amount: number) => {
    await addWaterIntake.execute(amount);
    const newlyUnlocked = await recalculateAchievements.execute();
    if (newlyUnlocked.length > 0) {
      eventBus.emit('achievementUnlocked', newlyUnlocked);
    }
    eventBus.emit('intakeDataChanged', undefined);
  }, [addWaterIntake, recalculateAchievements]);

  const handleDeleteEntry = useCallback(async (entryId: string) => {
    await deleteWaterIntake.execute(entryId);
    await recalculateAchievements.execute();
    eventBus.emit('intakeDataChanged', undefined);
  }, [deleteWaterIntake, recalculateAchievements]);

  const handleUpdateEntry = useCallback(async (entryId: string, amount: number) => {
    await updateWaterIntake.execute(entryId, amount);
    const newlyUnlocked = await recalculateAchievements.execute();
    if (newlyUnlocked.length > 0) {
      eventBus.emit('achievementUnlocked', newlyUnlocked);
    }
    eventBus.emit('intakeDataChanged', undefined);
  }, [updateWaterIntake, recalculateAchievements]);

  const handleSetGoal = useCallback(async (newGoal: number) => {
    setGoal(newGoal); // Optimistic UI update

    if (newGoal === 0) return; // User cleared the input, don't validate/save yet

    if (isNaN(newGoal)) {
      showWarning('Please enter a valid number.');
      return;
    }
    if (newGoal < 100) {
      showWarning('Goal cannot be less than 100.');
      return;
    }
    if (newGoal > 9999) {
      showWarning('Goal cannot be greater than 9999.');
      return;
    }
    await setDailyGoal.execute(newGoal);
    eventBus.emit('intakeDataChanged', undefined);
  }, [setDailyGoal]);

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
