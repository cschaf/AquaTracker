/**
 * @file Provides a function for generating random IDs.
 * @licence MIT
 */

/**
 * Generates a random alphanumeric string to be used as a unique identifier.
 * This is a simple implementation and may not guarantee global uniqueness
 * in a distributed system, but is sufficient for this application's needs.
 * @returns A random alphanumeric string.
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 11);
}
