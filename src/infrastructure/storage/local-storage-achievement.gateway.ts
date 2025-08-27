import type { AchievementGateway } from '../../core/gateways/achievement.gateway';

const UNLOCKED_ACHIEVEMENTS_KEY = 'unlockedAchievements';

export class LocalStorageAchievementGateway implements AchievementGateway {
  async getUnlockedAchievementIds(): Promise<string[]> {
    try {
      const savedAchievements = localStorage.getItem(UNLOCKED_ACHIEVEMENTS_KEY);
      return savedAchievements ? JSON.parse(savedAchievements) : [];
    } catch (error) {
      console.error('Failed to parse unlocked achievements from localStorage', error);
      return [];
    }
  }

  async saveUnlockedAchievementIds(ids: string[]): Promise<void> {
    localStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(ids));
  }
}
