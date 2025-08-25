import { useState, useEffect } from 'react';
import Header from './components/Header';
import DailyTracker from './components/DailyTracker';
import Stats from './components/Stats';
import Footer from './components/Footer';
import AchievementModal from './components/AchievementModal';
import CriticalWarningModal from './components/CriticalWarningModal';
import allAchievementsData from './data/achievements.json';
import { checkWaterIntake, INTAKE_STATUS } from './utils/intakeWarnings';
import { checkAchievements } from './utils/achievementChecker';
import type { Log, Achievement, Entry } from './types';

const allAchievements: Achievement[] = allAchievementsData;

function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(2000);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false);
  const [intakeWarningMessage, setIntakeWarningMessage] = useState('');

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('waterTrackerData') || '[]') as Log[];
    const savedGoal = parseInt(localStorage.getItem('waterTrackerGoal') || '2000');
    const savedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]') as string[];

    setLogs(savedLogs);
    setDailyGoal(savedGoal);
    setUnlockedAchievements(savedAchievements);
  }, []);

  useEffect(() => {
    localStorage.setItem('waterTrackerData', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('waterTrackerGoal', dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  const addWaterEntry = (amount: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: Entry = { amount, timestamp: Date.now() };

    setLogs(prevLogs => {
      const todayLogIndex = prevLogs.findIndex(log => log.date === todayStr);
      if (todayLogIndex > -1) {
        const newLogs = [...prevLogs];
        newLogs[todayLogIndex].entries.push(newEntry);
        return newLogs;
      } else {
        return [...prevLogs, { date: todayStr, entries: [newEntry] }];
      }
    });
  };

  const deleteEntry = (timestamp: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setLogs(prevLogs => {
      const newLogs = [...prevLogs];
      const todayLogIndex = newLogs.findIndex(log => log.date === todayStr);
      if (todayLogIndex > -1) {
        newLogs[todayLogIndex].entries = newLogs[todayLogIndex].entries.filter(entry => entry.timestamp !== timestamp);
        if (newLogs[todayLogIndex].entries.length === 0) {
          return newLogs.filter(log => log.date !== todayStr);
        }
      }
      return newLogs;
    });
  };

  const updateEntry = (timestamp: number, newAmount: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setLogs(prevLogs => {
      const newLogs = [...prevLogs];
      const todayLogIndex = newLogs.findIndex(log => log.date === todayStr);
      if (todayLogIndex > -1) {
        const entryIndex = newLogs[todayLogIndex].entries.findIndex(entry => entry.timestamp === timestamp);
        if (entryIndex > -1) {
          newLogs[todayLogIndex].entries[entryIndex].amount = newAmount;
        }
      }
      return newLogs;
    });
  };

  const exportData = () => {
    if (!logs || logs.length === 0) {
        alert("No data to export.");
        return;
    }

    const exportData = {
        goal: dailyGoal,
        logs: logs
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(exportData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "water_consumption_data.json";
    link.click();
  }

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedData = JSON.parse(event.target!.result as string);

            if (importedData && typeof importedData.goal === 'number' && Array.isArray(importedData.logs)) {
                setDailyGoal(importedData.goal);
                setLogs(importedData.logs);
                alert("Data imported successfully! The page will now reload to apply the changes.");
                location.reload();
            }
            else {
                alert("Invalid data format. Please import a valid JSON file exported from AquaTracker.");
            }
        } catch (error) {
            alert("Error reading or parsing the file. Please ensure it's a valid JSON file.");
            console.error("Import error:", error);
        }
    };
    reader.readAsText(file);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === todayStr);
  const dailyTotal = todayLog ? todayLog.entries.reduce((sum, entry) => sum + entry.amount, 0) : 0;

  useEffect(() => {
    const intakeStatus = checkWaterIntake(dailyTotal);
    if (intakeStatus.status === INTAKE_STATUS.CRITICAL) {
      setIntakeWarningMessage(intakeStatus.message);
      setIsCriticalModalOpen(true);
    } else {
      setIsCriticalModalOpen(false);
    }
  }, [dailyTotal]);

  useEffect(() => {
    const newlyUnlockedAchievements = checkAchievements(logs, dailyGoal, unlockedAchievements, allAchievements);
    if (newlyUnlockedAchievements.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlockedAchievements.map(a => a.id)]);
      setNewlyUnlocked(newlyUnlockedAchievements[0]);
      setIsAchievementModalOpen(true);
    }
  }, [logs, dailyGoal, unlockedAchievements]);


  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DailyTracker
            logs={logs}
            dailyGoal={dailyGoal}
            setDailyGoal={setDailyGoal}
            addWaterEntry={addWaterEntry}
            deleteEntry={deleteEntry}
            updateEntry={updateEntry}
            dailyTotal={dailyTotal}
          />
          <Stats
            logs={logs}
            dailyGoal={dailyGoal}
            unlockedAchievements={unlockedAchievements}
            allAchievements={allAchievements}
            exportData={exportData}
            importData={importData}
          />
        </main>
        <Footer />
      </div>
      <AchievementModal
        isOpen={isAchievementModalOpen}
        achievement={newlyUnlocked}
        onClose={() => setIsAchievementModalOpen(false)}
      />
      <CriticalWarningModal
        isOpen={isCriticalModalOpen}
        message={intakeWarningMessage}
        onClose={() => setIsCriticalModalOpen(false)}
      />
    </div>
  );
}

export default App;
