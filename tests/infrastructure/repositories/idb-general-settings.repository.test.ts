import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdbGeneralSettingsRepository } from '../../../src/infrastructure/repositories/idb-general-settings.repository';
import type { GeneralSettings } from '../../../src/domain/entities';
import { get, set } from 'idb-keyval';

vi.mock('idb-keyval', () => ({
  get: vi.fn(),
  set: vi.fn(),
}));

const STORAGE_KEY = 'generalSettings';

describe('IdbGeneralSettingsRepository', () => {
  let repository: IdbGeneralSettingsRepository;

  beforeEach(() => {
    repository = new IdbGeneralSettingsRepository();
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('should return null if no settings are in IndexedDB', async () => {
      (get as vi.Mock).mockResolvedValue(null);
      const settings = await repository.get();
      expect(get).toHaveBeenCalledWith(STORAGE_KEY);
      expect(settings).toBeNull();
    });

    it('should return the stored settings object from IndexedDB', async () => {
      const storedSettings: GeneralSettings = { theme: 'dark' };
      (get as vi.Mock).mockResolvedValue(storedSettings);

      const settings = await repository.get();
      expect(get).toHaveBeenCalledWith(STORAGE_KEY);
      expect(settings).toEqual(storedSettings);
    });
  });

  describe('save', () => {
    it('should save the provided settings to IndexedDB', async () => {
      const settingsToSave: GeneralSettings = { theme: 'light' };
      (set as vi.Mock).mockResolvedValue(undefined);

      await repository.save(settingsToSave);

      expect(set).toHaveBeenCalledWith(STORAGE_KEY, settingsToSave);
    });
  });
});
