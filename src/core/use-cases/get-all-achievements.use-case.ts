import type { Achievement } from '../entities/achievement';
import allAchievementsData from '../data/achievements.json';

export class GetAllAchievementsUseCase {
  execute(): Promise<Achievement[]> {
    // In a real app, this might involve a gateway, but for static data this is fine.
    // The type assertion is safe because we trust our static data.
    return Promise.resolve(allAchievementsData as Achievement[]);
  }
}
