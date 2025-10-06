import { FcmConfig } from '../entities/fcm-config.entity';

/**
 * @file Defines the interface for the FCM configuration repository.
 * This abstracts the data storage mechanism for the user's Firebase settings.
 */

export interface IFcmConfigRepository {
  /**
   * Saves the user's FCM configuration.
   * @param config - The configuration to save.
   * @returns A promise that resolves when the operation is complete.
   */
  save(config: FcmConfig): Promise<void>;

  /**
   * Retrieves the user's FCM configuration.
   * @returns A promise that resolves with the configuration, or null if none is found.
   */
  get(): Promise<FcmConfig | null>;

  /**
   * Deletes the user's FCM configuration.
   * @returns A promise that resolves when the operation is complete.
   */
  delete(): Promise<void>;
}