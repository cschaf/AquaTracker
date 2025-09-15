import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme/theme-provider';
import { eventBus } from './lib/event-bus/event-bus';
import type { Achievement } from '../domain/entities';
import Header from './components/Header';
import Footer from './components/Footer';
import AchievementModal from './components/AchievementModal';
import AchievementDetailModal from './components/AchievementDetailModal';
import CriticalWarningModal from './components/CriticalWarningModal';
import { useModal } from './modal/modal-provider';
import { useAppNotifications } from './hooks/useAppNotifications';
import { useNotificationPermission } from './hooks/useNotificationPermission';
import { NotificationService } from '../infrastructure/services/notification.service';
import BottomNavBar from './components/BottomNavBar';
import MainPage from './pages/MainPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import SettingsPage from './pages/SettingsPage';
import { RemindersPage } from './pages/RemindersPage';

type Page = 'main' | 'stats' | 'achievements' | 'settings' | 'reminders';

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
  const { permission } = useNotificationPermission();

  useEffect(() => {
    const handleAchievementUnlocked = (achievements: Achievement[]) => {
      showAchievementModal(achievements, true);
    };
    eventBus.on('achievementUnlocked', handleAchievementUnlocked);
    return () => {
      eventBus.off('achievementUnlocked', handleAchievementUnlocked);
    };
  }, [showAchievementModal]);

  // Effect for handling periodic sync registration
  useEffect(() => {
    const registerSyncOnInteraction = () => {
      NotificationService.registerPeriodicSync();
    };

    if (permission === 'granted') {
      // If permission is already granted, we wait for the first user interaction
      // to register the sync. This is a common strategy to comply with browser
      // security policies that prevent background registrations on page load.
      window.addEventListener('click', registerSyncOnInteraction, { once: true });
      window.addEventListener('keydown', registerSyncOnInteraction, { once: true });
    }

    // Cleanup function to remove listeners if the component unmounts
    // or if the permission state changes before an interaction.
    return () => {
      window.removeEventListener('click', registerSyncOnInteraction);
      window.removeEventListener('keydown', registerSyncOnInteraction);
    };
  }, [permission]);

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
      case 'reminders':
        return <RemindersPage />;
      default:
        return <MainPage />;
    }
  };

  // I'm assuming ThemeProvider and ModalProvider will be fixed later.
  // The user prompt only asked me to move them.
  // I will fix the imports inside those files too.
  return (
    <ThemeProvider>
      <Toaster position="bottom-center" />
      <div className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
          <Header />
          <main>{renderPage()}</main>
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
