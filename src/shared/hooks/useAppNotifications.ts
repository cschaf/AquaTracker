import { useState, useEffect } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import { checkWaterIntake, INTAKE_STATUS } from '../lib/intakeWarnings';

export const useAppNotifications = () => {
  const { getDailySummary } = useUseCases();
  const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false);
  const [intakeStatus, setIntakeStatus] = useState({ status: INTAKE_STATUS.OK, message: '' });

  useEffect(() => {
    // This logic is tricky in a hook-based world without a global state manager.
    // How do we know when to re-check the summary?
    // For now, we check on an interval. A better solution might be a pub/sub system.
    const checkIntake = async () => {
      const summary = await getDailySummary.execute();
      const currentIntakeStatus = checkWaterIntake(summary.total);
      setIntakeStatus(currentIntakeStatus);

      if (currentIntakeStatus.status === INTAKE_STATUS.CRITICAL) {
        setIsCriticalModalOpen(true);
      }
    };

    checkIntake(); // Check on mount
    const interval = setInterval(checkIntake, 30000); // Re-check every 30 seconds

    return () => clearInterval(interval);
  }, [getDailySummary]);

  return {
    isCriticalModalOpen,
    setIsCriticalModalOpen,
    intakeStatus,
  };
};
