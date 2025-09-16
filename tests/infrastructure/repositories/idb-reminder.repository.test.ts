import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdbReminderRepository } from '../../../src/infrastructure/data/idb-reminder.repository';
import { Reminder } from '../../../src/domain/entities/reminder.entity';
import { get, set } from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
}));

const REMINDERS_KEY = 'reminders';

describe('IdbReminderRepository', () => {
  let repository: IdbReminderRepository;
  let reminder1: Reminder;
  let reminder2: Reminder;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new IdbReminderRepository();
    reminder1 = new Reminder({ id: '1', title: 'Test 1', time: '10:00' });
    reminder2 = new Reminder({ id: '2', title: 'Test 2', time: '12:00' });
  });

  describe('findAll', () => {
    it('should return an empty array if no reminders are in IndexedDB', async () => {
      (get as vi.Mock).mockResolvedValue([]);
      const reminders = await repository.findAll();
      expect(get).toHaveBeenCalledWith(REMINDERS_KEY);
      expect(reminders).toEqual([]);
    });

    it('should return all reminders as Reminder instances', async () => {
      const plainReminders = [
        { ...reminder1, createdAt: reminder1.createdAt.toISOString() },
        { ...reminder2, createdAt: reminder2.createdAt.toISOString() },
      ];
      (get as vi.Mock).mockResolvedValue(plainReminders);

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
      (get as vi.Mock).mockResolvedValue([]);
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });

    it('should return the correct reminder as a Reminder instance', async () => {
      const plainReminders = [
        { ...reminder1, createdAt: reminder1.createdAt.toISOString() },
        { ...reminder2, createdAt: reminder2.createdAt.toISOString() },
      ];
      (get as vi.Mock).mockResolvedValue(plainReminders);

      const found = await repository.findById('2');

      expect(found).not.toBeNull();
      expect(found).toBeInstanceOf(Reminder);
      expect(found!.id).toBe(reminder2.id);
      expect(found!.time).toBe(reminder2.time);
    });
  });

  describe('save', () => {
    it('should add a new reminder to IndexedDB', async () => {
      (get as vi.Mock).mockResolvedValue([]);
      await repository.save(reminder1);

      expect(set).toHaveBeenCalledWith(REMINDERS_KEY, expect.any(Array));
      const savedData = (set as vi.Mock).mock.calls[0][1];
      expect(savedData[0].id).toBe(reminder1.id);
    });

    it('should update an existing reminder in IndexedDB', async () => {
      const plainReminders = [{ ...reminder1, createdAt: reminder1.createdAt.toISOString() }];
      (get as vi.Mock).mockResolvedValue(plainReminders);

      const updatedReminder = new Reminder({ ...reminder1, title: 'Updated Title' });
      await repository.save(updatedReminder);

      const expectedToSave = [{
        ...updatedReminder,
        createdAt: updatedReminder.createdAt.toISOString(),
      }];

      expect(set).toHaveBeenCalledWith(REMINDERS_KEY, expectedToSave);
    });
  });

  describe('delete', () => {
    it('should remove the specified reminder from IndexedDB', async () => {
      const plainReminders = [
        { ...reminder1, createdAt: reminder1.createdAt.toISOString() },
        { ...reminder2, createdAt: reminder2.createdAt.toISOString() },
      ];
      (get as vi.Mock).mockResolvedValue(plainReminders);

      await repository.delete('1');

      const expectedToSave = [{
        ...reminder2,
        createdAt: reminder2.createdAt.toISOString(),
      }];
      expect(set).toHaveBeenCalledWith(REMINDERS_KEY, expectedToSave);
    });

    it('should do nothing if reminder to delete is not found', async () => {
      const plainReminders = [{ ...reminder1, createdAt: reminder1.createdAt.toISOString() }];
      (get as vi.Mock).mockResolvedValue(plainReminders);

      await repository.delete('non-existent-id');
      expect(set).toHaveBeenCalledWith(REMINDERS_KEY, plainReminders);
    });
  });

  describe('deleteAll', () => {
    it('should remove all reminders from IndexedDB', async () => {
      const plainReminders = [
        { ...reminder1, createdAt: reminder1.createdAt.toISOString() },
        { ...reminder2, createdAt: reminder2.createdAt.toISOString() },
      ];
      (get as vi.Mock).mockResolvedValue(plainReminders);

      await repository.deleteAll();

      expect(set).toHaveBeenCalledWith(REMINDERS_KEY, []);
    });
  });
});
