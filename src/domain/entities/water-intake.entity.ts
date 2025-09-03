/**
 * @file Defines the Water Intake entity, which includes Log and Entry structures.
 * @licence MIT
 */

/**
 * Represents a single water intake event.
 * Each entry has a unique ID, the amount of water consumed, and a timestamp.
 */
export interface Entry {
  /**
   * A unique identifier for the intake entry.
   * @example '1672531200000-abc123def456'
   */
  id: string;

  /**
   * The amount of water consumed in this entry, in milliliters (mL).
   * @example 500
   */
  amount: number;

  /**
   * The timestamp when the water was consumed, in milliseconds since the Unix epoch.
   * @example 1672531200000
   */
  timestamp: number;
}

/**
 * Represents a collection of water intake entries for a specific day.
 */
export interface Log {
  /**
   * The date of the log in 'YYYY-MM-DD' format.
   * @example '2023-01-01'
   */
  date: string;

  /**
   * A list of all water intake entries for this day.
   */
  entries: Entry[];
}
