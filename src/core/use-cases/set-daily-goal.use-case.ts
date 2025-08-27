import type { GoalGateway } from '../gateways/goal.gateway';
import type { DailyGoal } from '../entities/goal';

export class SetDailyGoalUseCase {
  private readonly goalGateway: GoalGateway;

  constructor(goalGateway: GoalGateway) {
    this.goalGateway = goalGateway;
  }

  async execute(goal: DailyGoal): Promise<void> {
    // Optional: Add validation logic here if needed, e.g., goal > 0
    await this.goalGateway.saveDailyGoal(goal);
  }
}
