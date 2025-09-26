import { generateRandomId } from '../utils/id.generator';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

interface ReminderProps {
  id?: string;
  title: string;
  time: string;
  createdAt?: Date;
  isActive?: boolean;
  lastNotified?: Date;
}

export class Reminder {
  public readonly id: string;
  public title: string;
  public time: string;
  public readonly createdAt: Date;
  public isActive: boolean;
  public lastNotified: Date | null;

  constructor(props: ReminderProps) {
    if (!TIME_REGEX.test(props.time)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }

    this.id = props.id || generateRandomId();
    this.title = props.title;
    this.time = props.time;
    this.createdAt = props.createdAt || new Date();
    this.isActive = props.isActive === undefined ? true : props.isActive;
    this.lastNotified = props.lastNotified || null;
  }

  public setLastNotified(date: Date): void {
    this.lastNotified = date;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public updateTitle(newTitle: string): void {
    if (!newTitle) {
      throw new Error('Title cannot be empty');
    }
    this.title = newTitle;
  }

  public updateTime(newTime: string): void {
    if (!TIME_REGEX.test(newTime)) {
      throw new Error('Invalid time format. Expected HH:MM');
    }
    this.time = newTime;
  }
}
