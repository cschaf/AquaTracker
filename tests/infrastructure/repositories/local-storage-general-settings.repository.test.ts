import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageGeneralSettingsRepository } from '../../../src/infrastructure/repositories/local-storage-general-settings.repository';
import type { GeneralSettings } from '../../../src/domain/entities';

const STORAGE_KEY = 'general-settings';

describe('LocalStorageGeneralSettingsRepository', () => {
  let repository: LocalStorageGeneralSettingsRepository;

  beforeEach(() => {
    repository = new LocalStorageGeneralSettingsRepository();
    localStorage.clear();
  });

  describe('get', () => {
    it('should return null if no settings are in localStorage', async () => {
      const settings = await repository.get();
      expect(settings).toBeNull();
    });

    it('should return the stored settings object', async () => {
      const storedSettings: GeneralSettings = { theme: 'dark' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSettings));

      const settings = await repository.get();
      expect(settings).toEqual(storedSettings);
    });
  });

  describe('save', () => {
    it('should save the provided settings to localStorage', async () => {
      const settingsToSave: GeneralSettings = { theme: 'light' };
      await repository.save(settingsToSave);

      const storedRaw = localStorage.getItem(STORAGE_KEY);
      expect(storedRaw).not.toBeNull();
      const storedSettings = JSON.parse(storedRaw!);
      expect(storedSettings).toEqual(settingsToSave);
    });
  });
});
