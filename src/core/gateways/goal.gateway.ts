import type { DailyGoal } from '../entities/goal';

export interface GoalGateway {
  getDailyGoal(): Promise<DailyGoal>;
  saveDailyGoal(goal: DailyGoal): Promise<void>;
}
