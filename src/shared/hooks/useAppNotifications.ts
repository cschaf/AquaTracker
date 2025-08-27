import { useState, useEffect, useCallback } from 'react';
import { useUseCases } from '../../app/use-case-provider';
import { checkWaterIntake, INTAKE_STATUS } from '../lib/intakeWarnings';
import { eventBus } from '../../app/event-bus';

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
    eventBus.on('intakeDataChanged', checkIntake); // Subscribe to changes

    return () => {
      eventBus.off('intakeDataChanged', checkIntake); // Unsubscribe on cleanup
    };
  }, [checkIntake]);

  return {
    isCriticalModalOpen,
    setIsCriticalModalOpen,
    intakeStatus,
  };
};
