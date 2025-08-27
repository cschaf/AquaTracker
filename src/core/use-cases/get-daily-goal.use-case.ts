import type { GoalGateway } from '../gateways/goal.gateway';
import type { DailyGoal } from '../entities/goal';

export class GetDailyGoalUseCase {
  private readonly goalGateway: GoalGateway;

  constructor(goalGateway: GoalGateway) {
    this.goalGateway = goalGateway;
  }

  async execute(): Promise<DailyGoal> {
    return this.goalGateway.getDailyGoal();
  }
}
