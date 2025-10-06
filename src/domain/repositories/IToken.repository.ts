import { FcmConfig } from '../entities/fcm-config.entity';

/**
 * @file Defines the interface for a repository that stores the active FCM token.
 */

export interface ITokenRepository {
  /**
   * Saves the user's FCM token.
   * @param token - The token to save.
   * @returns A promise that resolves when the operation is complete.
   */
  save(token: string): Promise<void>;

  /**
   * Retrieves the user's FCM token.
   * @returns A promise that resolves with the token, or null if none is found.
   */
  get(): Promise<string | null>;

  /**
   * Deletes the user's FCM token.
   * @returns A promise that resolves when the operation is complete.
   */
  delete(): Promise<void>;
}