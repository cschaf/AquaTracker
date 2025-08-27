import type { WaterIntakeGateway } from '../gateways/water-intake.gateway';
import type { GoalGateway } from '../gateways/goal.gateway';
import type { AchievementGateway } from '../gateways/achievement.gateway';
import type { Achievement } from '../entities/achievement';
import allAchievementsData from '../data/achievements.json';
import { calculateMetAchievements } from '../utils/achievementChecker';

export class RecalculateAchievementsUseCase {
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
    const [logs, dailyGoal, oldUnlockedIds] = await Promise.all([
      this.waterIntakeGateway.getLogs(),
      this.goalGateway.getDailyGoal(),
      this.achievementGateway.getUnlockedAchievementIds(),
    ]);

    const allAchievements = allAchievementsData as Achievement[];

    const allMetAchievements = calculateMetAchievements(logs, dailyGoal, allAchievements);
    const allMetAchievementIds = allMetAchievements.map(a => a.id);

    // Save the new complete list, overwriting the old one
    await this.achievementGateway.saveUnlockedAchievementIds(allMetAchievementIds);

    // Now, determine which achievements are newly earned to show the modal
    const oldUnlockedIdSet = new Set(oldUnlockedIds);
    const newlyEarnedAchievements = allMetAchievements.filter(
      (achievement) => !oldUnlockedIdSet.has(achievement.id)
    );

    return newlyEarnedAchievements;
  }
}
