import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageReminderRepository } from '../../../src/infrastructure/repositories/local-storage-reminder.repository';
import { Reminder } from '../../../src/domain/entities/reminder.entity';

const REMINDERS_KEY = 'aquatracker_reminders';

describe('LocalStorageReminderRepository', () => {
  let repository: LocalStorageReminderRepository;
  let reminder1: Reminder;
  let reminder2: Reminder;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageReminderRepository();
    // Use real Reminder instances for testing
    reminder1 = new Reminder({ id: '1', title: 'Test 1', time: '10:00' });
    reminder2 = new Reminder({ id: '2', title: 'Test 2', time: '12:00' });
  });

  // Helper to get raw data from localStorage
  const getStoredData = () => JSON.parse(localStorage.getItem(REMINDERS_KEY) || 'null');

  describe('findAll', () => {
    it('should return an empty array if no reminders are in localStorage', async () => {
      const reminders = await repository.findAll();
      expect(reminders).toEqual([]);
    });

    it('should return all reminders as Reminder instances', async () => {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify([reminder1, reminder2]));

      const reminders = await repository.findAll();

      expect(reminders).toHaveLength(2);
      expect(reminders[0]).toBeInstanceOf(Reminder);
      expect(reminders[1]).toBeInstanceOf(Reminder);
      expect(reminders[0].id).toBe(reminder1.id);
      expect(reminders[1].title).toBe(reminder2.title);
    });
  });

  describe('findById', () => {
    it('should return null if the reminder is not found', async () => {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify([reminder1]));
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });

    it('should return the correct reminder as a Reminder instance', async () => {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify([reminder1, reminder2]));

      const found = await repository.findById('2');

      expect(found).not.toBeNull();
      expect(found).toBeInstanceOf(Reminder);
      expect(found!.id).toBe(reminder2.id);
      expect(found!.time).toBe(reminder2.time);
    });
  });

  describe('save', () => {
    it('should add a new reminder to localStorage', async () => {
      await repository.save(reminder1);
      const stored = getStoredData();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(reminder1.id);
    });

    it('should update an existing reminder in localStorage', async () => {
      await repository.save(reminder1);
      const updatedReminder = new Reminder({ ...reminder1, title: 'Updated Title' });
      await repository.save(updatedReminder);

      const stored = getStoredData();
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    it('should remove the specified reminder from localStorage', async () => {
      await repository.save(reminder1);
      await repository.save(reminder2);
      await repository.delete('1');

      const stored = getStoredData();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('2');
    });

    it('should do nothing if reminder to delete is not found', async () => {
        await repository.save(reminder1);
        await repository.delete('non-existent-id');

        const stored = getStoredData();
        expect(stored).toHaveLength(1);
    });
  });

  describe('deleteAll', () => {
    it('should remove all reminders from localStorage', async () => {
      await repository.save(reminder1);
      await repository.save(reminder2);
      await repository.deleteAll();

      const stored = getStoredData();
      expect(stored).toEqual([]);
    });
  });
});
