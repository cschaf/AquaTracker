import { useState, useEffect } from 'react';
import { ThemeProvider } from './app/theme-provider';
import { eventBus } from './app/event-bus';
import type { Achievement } from './core/entities/achievement';
import Header from './shared/components/Header';
import WarningBanner from './shared/components/WarningBanner';
import Footer from './shared/components/Footer';
import AchievementModal from './shared/components/AchievementModal';
import AchievementDetailModal from './shared/components/AchievementDetailModal';
import CriticalWarningModal from './shared/components/CriticalWarningModal';
import { useModal } from './app/modal-provider';
import { useAppNotifications } from './shared/hooks/useAppNotifications';
import BottomNavBar from './shared/components/BottomNavBar';
import MainPage from './pages/MainPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';

type Page = 'main' | 'stats' | 'achievements' | 'settings';

function App() {
  const [activePage, setActivePage] = useState<Page>('main');
  const {
    isAchievementModalOpen,
    selectedAchievements,
    isSelectedAchievementUnlocked,
    hideAchievementModal,
    isAchievementDetailModalOpen,
    selectedAchievementDetail,
    isSelectedAchievementDetailUnlocked,
    hideAchievementDetailModal,
    showAchievementModal,
  } = useModal();

  useEffect(() => {
    const handleAchievementUnlocked = (achievements: Achievement[]) => {
      showAchievementModal(achievements, true);
    };

    eventBus.on('achievementUnlocked', handleAchievementUnlocked);

    return () => {
      eventBus.off('achievementUnlocked', handleAchievementUnlocked);
    };
  }, [showAchievementModal]);

  const {
    isCriticalModalOpen,
    setIsCriticalModalOpen,
    intakeStatus,
  } = useAppNotifications();

  const renderPage = () => {
    switch (activePage) {
      case 'main':
        return <MainPage />;
      case 'stats':
        return <StatsPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <MainPage />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
          <Header />
          <WarningBanner status={intakeStatus.status} message={intakeStatus.message} />
          <main>
            {renderPage()}
          </main>
          <Footer />
        </div>
        <BottomNavBar activePage={activePage} setActivePage={setActivePage} />
        <AchievementModal
          isOpen={isAchievementModalOpen}
          achievements={selectedAchievements}
          onClose={hideAchievementModal}
          isUnlocked={isSelectedAchievementUnlocked}
        />
        <AchievementDetailModal
          isOpen={isAchievementDetailModalOpen}
          achievement={selectedAchievementDetail}
          onClose={hideAchievementDetailModal}
          isUnlocked={isSelectedAchievementDetailUnlocked}
        />
        <CriticalWarningModal
          isOpen={isCriticalModalOpen}
          message={intakeStatus.message}
          onClose={() => setIsCriticalModalOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
