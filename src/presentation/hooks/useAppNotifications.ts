import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../di';
import { checkWaterIntake, INTAKE_STATUS } from '../utils/intakeWarnings';
import { eventBus } from '../lib/event-bus/event-bus'; // This will be moved later

export const useAppNotifications = () => {
  const { getDailySummary } = useUseCases();
  const [isCriticalModalOpen, setIsCriticalModalOpen] = useState(false);
  const [intakeStatus, setIntakeStatus] = useState({ status: INTAKE_STATUS.OK, message: '' });

  const checkIntake = useCallback(async () => {
    const summary = await getDailySummary.execute();
    const currentIntakeStatus = checkWaterIntake(summary.total);
    setIntakeStatus(currentIntakeStatus);

    if (currentIntakeStatus.status === INTAKE_STATUS.CRITICAL) {
      setIsCriticalModalOpen(true);
    }
  }, [getDailySummary]);

  useEffect(() => {
    checkIntake(); // Check on mount
    const handleDataChanged = () => checkIntake();
    eventBus.on('intakeDataChanged', handleDataChanged); // Subscribe to changes

    return () => {
      eventBus.off('intakeDataChanged', handleDataChanged); // Unsubscribe on cleanup
    };
  }, [checkIntake]);

  return {
    isCriticalModalOpen,
    setIsCriticalModalOpen,
    intakeStatus,
  };
};
