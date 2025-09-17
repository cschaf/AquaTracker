import { useState, useCallback, useEffect } from 'react';
import { useUseCases } from '../../di';
import type { ReminderDto, CreateReminderDto, UpdateReminderDto } from '../../domain/dtos';
import { showSuccess, showError } from '../services/toast.service';

const notifyServiceWorker = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'UPDATE_REMINDERS' });
  }
};

export const useReminders = () => {
  const {
    getAllReminders,
    createReminder,
    deleteReminder,
    toggleReminderStatus,
    updateReminder,
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
      notifyServiceWorker();
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
      notifyServiceWorker();
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
      notifyServiceWorker();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update reminder status.';
      showError(errorMessage);
      setError(errorMessage);
    }
  }, [toggleReminderStatus, refreshReminders]);

  const editReminder = useCallback(async (dto: UpdateReminderDto) => {
    try {
      setLoading(true);
      await updateReminder.execute(dto);
      showSuccess('Reminder updated successfully!');
      await refreshReminders();
      notifyServiceWorker();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to update reminder.';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [updateReminder, refreshReminders]);

  return {
    reminders,
    loading,
    error,
    addReminder,
    removeReminder,
    toggleReminder,
    editReminder,
  };
};
