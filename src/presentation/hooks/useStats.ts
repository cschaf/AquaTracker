import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../di';
import { eventBus } from '../lib/event-bus/event-bus';
import type { Log, DailyGoal, Achievement, DomainError } from '../../domain';

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
    loadData(); // initial load
    const handleDataChanged = () => loadData();
    eventBus.on('intakeDataChanged', handleDataChanged);
    eventBus.on('dataSync', handleDataChanged);

    return () => {
      eventBus.off('intakeDataChanged', handleDataChanged);
      eventBus.off('dataSync', handleDataChanged);
    };
  }, [loadData]);

  const handleExportData = async () => {
    try {
      const jsonString = await exportDataUseCase.execute();
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(jsonString)}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', 'aquatracker_data.json');
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (e) {
      const error = e as DomainError;
      alert(error.message); // Present domain error to user
    }
  };

  const handleImportData = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const fileContent = event.target?.result as string;
        if (!fileContent) {
          throw new Error('File content is empty.');
        }
        await importDataUseCase.execute(fileContent);
        alert('Data imported successfully! The page will now reload to apply the changes.');
        eventBus.emit('dataSync', { status: 'success', operation: 'import' });
      } catch (e) {
        const error = e as DomainError | Error;
        alert(`Import failed: ${error.message}`);
      }
    };
    reader.onerror = () => {
      alert('Error reading the file.');
    };
    reader.readAsText(file);
  };

  return {
    logs,
    dailyGoal,
    allAchievements,
    unlockedAchievements: unlockedAchievementIds,
    isLoading,
    importData: handleImportData,
    exportData: handleExportData,
  };
};
