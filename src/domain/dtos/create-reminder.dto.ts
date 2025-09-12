/**
 * @file Defines the DTO for creating a new reminder.
 * @licence MIT
 */

export interface CreateReminderDto {
  title: string;
  time: string; // HH:MM format
}
