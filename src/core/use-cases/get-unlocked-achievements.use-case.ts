import type { AchievementGateway } from '../gateways/achievement.gateway';

export class GetUnlockedAchievementsUseCase {
  private readonly achievementGateway: AchievementGateway;

  constructor(achievementGateway: AchievementGateway) {
    this.achievementGateway = achievementGateway;
  }

  async execute(): Promise<string[]> {
    return this.achievementGateway.getUnlockedAchievementIds();
  }
}
