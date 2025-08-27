import Header from './shared/components/Header';
import WarningBanner from './shared/components/WarningBanner';
import DailyTracker from './features/daily-tracker/DailyTracker';
import Stats from './features/stats/Stats';
import Footer from './shared/components/Footer';
import AchievementModal from './shared/components/AchievementModal';
import CriticalWarningModal from './shared/components/CriticalWarningModal';
import { useModal } from './app/modal-provider';
import { useAppNotifications } from './shared/hooks/useAppNotifications';

function App() {
  const {
    isAchievementModalOpen,
    selectedAchievement,
    isSelectedAchievementUnlocked,
    hideAchievementModal,
  } = useModal();

  const {
    isCriticalModalOpen,
    setIsCriticalModalOpen,
    intakeStatus,
  } = useAppNotifications();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <WarningBanner status={intakeStatus.status} message={intakeStatus.message} />
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DailyTracker />
          <Stats />
        </main>
        <Footer />
      </div>
      <AchievementModal
        isOpen={isAchievementModalOpen}
        achievement={selectedAchievement}
        onClose={hideAchievementModal}
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
