import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { AchievementGateway } from '../gateways/achievement.gateway';
import type { Achievement } from '../entities/achievement';
import allAchievementsData from '../data/achievements.json';
import { checkAchievements } from '../utils/achievementChecker';

export class CheckForNewAchievementsUseCase {
  private readonly waterIntakeGateway: WaterIntakeGateway;
  private readonly goalGateway: GoalGateway;
  private readonly achievementGateway: AchievementGateway;

  constructor(
    waterIntakeGateway: WaterIntakeGateway,
    goalGateway: GoalGateway,
    achievementGateway: AchievementGateway
  ) {
    this.waterIntakeGateway = waterIntakeGateway;
    this.goalGateway = goalGateway;
    this.achievementGateway = achievementGateway;
  }

  async execute(): Promise<Achievement[]> {
    const [logs, dailyGoal, unlockedIds] = await Promise.all([
      this.waterIntakeGateway.getLogs(),
      this.goalGateway.getDailyGoal(),
      this.achievementGateway.getUnlockedAchievementIds(),
    ]);

    const allAchievements = allAchievementsData as Achievement[];

    const newlyUnlocked = checkAchievements(logs, dailyGoal, unlockedIds, allAchievements);

    if (newlyUnlocked.length > 0) {
      const newUnlockedIds = newlyUnlocked.map(a => a.id);
      const allUnlockedIds = [...unlockedIds, ...newUnlockedIds];
      await this.achievementGateway.saveUnlockedAchievementIds(allUnlockedIds);
      return newlyUnlocked;
    }

    return [];
  }
}
