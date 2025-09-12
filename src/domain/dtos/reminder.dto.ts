/**
 * @file Defines the DTO for a reminder.
 * @licence MIT
 */

export interface ReminderDto {
  id: string;
  title: string;
  time: string;
  createdAt: string;
  isActive: boolean;
}
