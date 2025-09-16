import { useState, useCallback, useEffect } from 'react';
import { useUseCases } from '../../di';
import type { ReminderDto, CreateReminderDto } from '../../domain/dtos';
import { showSuccess, showError } from '../services/toast.service';

export const useReminders = () => {
  const {
    getAllReminders,
    createReminder,
    deleteReminder,
    toggleReminderStatus
  } = useUseCases();

  const [reminders, setReminders] = useState<ReminderDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshReminders = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedReminders = await getAllReminders.execute();
      // Sort by time
      fetchedReminders.sort((a, b) => a.time.localeCompare(b.time));
      setReminders(fetchedReminders);
      setError(null);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      showError('Failed to load reminders.');
    } finally {
      setLoading(false);
    }
  }, [getAllReminders]);

  useEffect(() => {
    refreshReminders();
  }, [refreshReminders]);

  const addReminder = useCallback(async (dto: CreateReminderDto) => {
    try {
      setLoading(true);
      await createReminder.execute(dto);
      showSuccess('Reminder created successfully!');
      await refreshReminders();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create reminder.';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [createReminder, refreshReminders]);

  const removeReminder = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteReminder.execute(id);
      showSuccess('Reminder deleted.');
      await refreshReminders();
    } catch (e) {
       const errorMessage = e instanceof Error ? e.message : 'Failed to delete reminder.';
       showError(errorMessage);
       setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [deleteReminder, refreshReminders]);

  const toggleReminder = useCallback(async (id: string) => {
    try {
      // No loading state change for a smoother UI on toggle
      await toggleReminderStatus.execute(id);
      await refreshReminders();
      showSuccess('Reminder status updated.');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update reminder status.';
      showError(errorMessage);
      setError(errorMessage);
    }
  }, [toggleReminderStatus, refreshReminders]);

  return {
    reminders,
    loading,
    error,
    addReminder,
    removeReminder,
    toggleReminder,
  };
};
