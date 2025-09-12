import { describe, it, expect, beforeEach } from 'vitest';
import { Reminder } from '../../../src/domain/entities/reminder.entity';

describe('Reminder Entity', () => {
  let initialProps: { id: string; title: string; time: string };

  beforeEach(() => {
    initialProps = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Morning Reminder',
      time: '08:00',
    };
  });

  it('should create a new reminder with default active status', () => {
    const reminder = new Reminder(initialProps);
    expect(reminder.id).toBe(initialProps.id);
    expect(reminder.title).toBe(initialProps.title);
    expect(reminder.time).toBe(initialProps.time);
    expect(reminder.isActive).toBe(true);
    expect(reminder.createdAt).toBeInstanceOf(Date);
  });

  it('should create a reminder with a specific active status', () => {
    const reminder = new Reminder({ ...initialProps, isActive: false });
    expect(reminder.isActive).toBe(false);
  });

  it('should activate a reminder', () => {
    const reminder = new Reminder({ ...initialProps, isActive: false });
    reminder.activate();
    expect(reminder.isActive).toBe(true);
  });

  it('should deactivate a reminder', () => {
    const reminder = new Reminder({ ...initialProps, isActive: true });
    reminder.deactivate();
    expect(reminder.isActive).toBe(false);
  });

  it('should update the title', () => {
    const reminder = new Reminder(initialProps);
    const newTitle = 'New Morning Reminder';
    reminder.updateTitle(newTitle);
    expect(reminder.title).toBe(newTitle);
  });

  it('should update the time', () => {
    const reminder = new Reminder(initialProps);
    const newTime = '09:30';
    reminder.updateTime(newTime);
    expect(reminder.time).toBe(newTime);
  });

  it('should not allow an empty title when updating', () => {
    const reminder = new Reminder(initialProps);
    expect(() => reminder.updateTitle('')).toThrow('Title cannot be empty');
  });

  it('should not allow an invalid time format when updating', () => {
    const reminder = new Reminder(initialProps);
    expect(() => reminder.updateTime('invalid-time')).toThrow('Invalid time format. Expected HH:MM');
  });

  it('should not allow an invalid time format in constructor', () => {
    expect(() => new Reminder({ ...initialProps, time: '25:00' })).toThrow('Invalid time format. Expected HH:MM');
  });
});
