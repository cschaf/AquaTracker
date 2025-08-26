import Header from './components/Header';
import WarningBanner from './components/WarningBanner';
import DailyTracker from './components/DailyTracker';
import Stats from './components/Stats';
import Footer from './components/Footer';
import AchievementModal from './components/AchievementModal';
import CriticalWarningModal from './components/CriticalWarningModal';
import { useWaterTracker } from './hooks/useWaterTracker';

function App() {
  const {
    logs,
    dailyGoal,
    setDailyGoal,
    unlockedAchievements,
    selectedAchievement,
    isAchievementModalOpen,
    setIsAchievementModalOpen,
    isCriticalModalOpen,
    setIsCriticalModalOpen,
    intakeStatus,
    isSelectedAchievementUnlocked,
    addWaterEntry,
    deleteEntry,
    updateEntry,
    exportData,
    importData,
    handleAchievementClick,
    dailyTotal,
    allAchievements,
    todayLog
  } = useWaterTracker();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <WarningBanner status={intakeStatus.status} message={intakeStatus.message} />
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DailyTracker
            todayLog={todayLog}
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
            onAchievementClick={handleAchievementClick}
            exportData={exportData}
            importData={importData}
          />
        </main>
        <Footer />
      </div>
      <AchievementModal
        isOpen={isAchievementModalOpen}
        achievement={selectedAchievement}
        onClose={() => setIsAchievementModalOpen(false)}
        isUnlocked={isSelectedAchievementUnlocked}
      />
      <CriticalWarningModal
        isOpen={isCriticalModalOpen}
        message={intakeStatus.message}
        onClose={() => setIsCriticalModalOpen(false)}
      />
    </div>
  );
}

export default App;
