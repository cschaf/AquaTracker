import type { GoalGateway } from '../../core/gateways/goal.gateway';
import type { DailyGoal } from '../../core/entities/goal';

const WATER_TRACKER_GOAL_KEY = 'waterTrackerGoal';
const DEFAULT_GOAL = 2000;

export class LocalStorageGoalGateway implements GoalGateway {
  async getDailyGoal(): Promise<DailyGoal> {
    const savedGoal = localStorage.getItem(WATER_TRACKER_GOAL_KEY);
    if (savedGoal) {
      const parsedGoal = parseInt(savedGoal, 10);
      return isNaN(parsedGoal) ? DEFAULT_GOAL : parsedGoal;
    }
    return DEFAULT_GOAL;
  }

  async saveDailyGoal(goal: DailyGoal): Promise<void> {
    localStorage.setItem(WATER_TRACKER_GOAL_KEY, goal.toString());
  }
}
