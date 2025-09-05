import { describe, it, expect } from 'vitest';
import { calculateMetAchievements } from '../../../src/domain/utils/achievement.checker';
import type { Achievement, Log } from '../../../src/domain/entities';

describe('calculateMetAchievements', () => {
  const dailyGoal = 2000;

  // Helper to create a log for a specific date with a total amount
  const createLog = (date: string, amounts: number[]): Log => ({
    date,
    entries: amounts.map((amount, i) => ({
      id: `${date}-${i}`,
      amount,
      timestamp: new Date(`${date}T12:00:00Z`).getTime(),
    })),
  });

  describe('log_count trigger', () => {
    const achievement: Achievement = {
      id: 'log_count_3',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'log_count', days: 3 },
    };

    it('should be earned if log count is sufficient', () => {
      const logs = [createLog('2023-01-01', [500]), createLog('2023-01-02', [500]), createLog('2023-01-03', [500])];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([achievement]);
    });

    it('should not be earned if log count is insufficient', () => {
      const logs = [createLog('2023-01-01', [500])];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([]);
    });
  });

  describe('consecutive_goals trigger', () => {
    const achievement: Achievement = {
      id: 'consecutive_goals_2',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'consecutive_goals', days: 2 },
    };

    it('should be earned for consecutive days meeting goal', () => {
      const logs = [createLog('2023-01-01', [2000]), createLog('2023-01-02', [2500])];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([achievement]);
    });

    it('should not be earned for non-consecutive days', () => {
      const logs = [createLog('2023-01-01', [2000]), createLog('2023-01-03', [2500])];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([]);
    });
  });

  describe('total_volume trigger', () => {
    const achievement: Achievement = {
      id: 'total_volume_3000',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'total_volume', amount: 3000 },
    };

    it('should be earned when total volume is met', () => {
        const logs = [createLog('2023-01-01', [1500]), createLog('2023-01-02', [1500])];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });

  describe('goal_met trigger', () => {
    const achievement: Achievement = {
      id: 'goal_met_2',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'goal_met', times: 2 },
    };

    it('should be earned when goal is met enough times', () => {
        const logs = [createLog('2023-01-01', [2000]), createLog('2023-01-03', [2000])];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });

  describe('single_log_amount trigger', () => {
    const achievement: Achievement = {
        id: 'single_log_1000',
        name: 'Test',
        description: 'Test',
        icon: 'T',
        trigger: { type: 'single_log_amount', amount: 1000 },
    };

    it('should be earned with a single large log', () => {
        const logs = [createLog('2023-01-01', [500, 1000])];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });

  describe('log_on_date trigger', () => {
    const achievement: Achievement = {
      id: 'log_on_date_01_01',
      name: 'New Year',
      description: 'Log on Jan 1st',
      icon: '🎆',
      trigger: { type: 'log_on_date', month: 1, day: 1 },
    };

    it('should be earned if a log exists on the specified month and day', () => {
      const logs = [createLog('2023-01-01', [500])];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([achievement]);
    });

    it('should not be earned if no log exists on the specified date', () => {
      const logs = [createLog('2023-01-02', [500])];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([]);
    });
  });

  // Add more describe blocks for other trigger types...
  describe('exceed_goal_by trigger', () => {
    const achievement: Achievement = {
      id: 'exceed_goal_by_150',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'exceed_goal_by', percentage: 150 },
    };

    it('should be earned when goal is exceeded by percentage', () => {
      const logs = [createLog('2023-01-01', [dailyGoal * 1.5])];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([achievement]);
    });
  });

  describe('log_before_time trigger', () => {
    const achievement: Achievement = {
      id: 'log_before_9',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'log_before_time', hour: 9 },
    };

    it('should be earned if log is made before specified hour', () => {
      const log = createLog('2023-01-01', [500]);
      log.entries[0].timestamp = new Date('2023-01-01T08:00:00Z').getTime();
      const result = calculateMetAchievements([log], dailyGoal, [achievement]);
      expect(result).toEqual([achievement]);
    });
  });

  describe('log_streak trigger', () => {
    const achievement: Achievement = {
        id: 'log_streak_3',
        name: 'Test',
        description: 'Test',
        icon: 'T',
        trigger: { type: 'log_streak', days: 3 },
    };

    it('should be earned for a 3-day logging streak', () => {
        const logs = [
            createLog('2023-01-01', [500]),
            createLog('2023-01-02', [500]),
            createLog('2023-01-03', [500]),
        ];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });

  describe('goals_in_week trigger', () => {
    const achievement: Achievement = {
      id: 'goals_in_week_2',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'goals_in_week', count: 2 },
    };

    it('should be earned if goal is met twice in the same week', () => {
      const logs = [
        createLog('2023-01-02', [dailyGoal]), // Monday
        createLog('2023-01-04', [dailyGoal]), // Wednesday
      ];
      const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
      expect(result).toEqual([achievement]);
    });
  });

  describe('log_after_time trigger', () => {
    const achievement: Achievement = {
      id: 'log_after_21',
      name: 'Test',
      description: 'Test',
      icon: 'T',
      trigger: { type: 'log_after_time', hour: 21 },
    };

    it('should be earned if log is made at or after specified hour', () => {
      const log = createLog('2023-01-01', [500]);
      log.entries[0].timestamp = new Date('2023-01-01T21:00:00Z').getTime();
      const result = calculateMetAchievements([log], dailyGoal, [achievement]);
      expect(result).toEqual([achievement]);
    });
  });

  describe('logs_per_day_for_days trigger', () => {
    const achievement: Achievement = {
        id: 'logs_per_day_for_days_2_3',
        name: 'Test',
        description: 'Test',
        icon: 'T',
        trigger: { type: 'logs_per_day_for_days', logs: 2, days: 3 },
    };
    it('should be earned for 2 logs per day for 3 consecutive days', () => {
        const logs = [
            createLog('2023-01-01', [500, 500]),
            createLog('2023-01-02', [500, 500]),
            createLog('2023-01-03', [500, 500]),
        ];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });

  describe('log_after_break trigger', () => {
    const achievement: Achievement = {
        id: 'log_after_break_7',
        name: 'Test',
        description: 'Test',
        icon: 'T',
        trigger: { type: 'log_after_break', days: 7 },
    };
    it('should be earned for logging after a 7 day break', () => {
        const logs = [
            createLog('2023-01-01', [500]),
            createLog('2023-01-10', [500]),
        ];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });

  describe('weekend_goal trigger', () => {
    const achievement: Achievement = {
        id: 'weekend_goal_1',
        name: 'Test',
        description: 'Test',
        icon: 'T',
        trigger: { type: 'weekend_goal', weeks: 1 },
    };
    it('should be earned for meeting goal on a full weekend', () => {
        const logs = [
            createLog('2023-01-07', [dailyGoal]), // Saturday
            createLog('2023-01-08', [dailyGoal]), // Sunday
        ];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });

  describe('log_date_range trigger', () => {
    const achievement: Achievement = {
        id: 'log_date_range_test',
        name: 'Test',
        description: 'Test',
        icon: 'T',
        trigger: { type: 'log_date_range', start: '02-10', end: '02-12' },
    };
    it('should be earned for meeting goal every day in a date range', () => {
        const logs = [
            createLog('2023-02-10', [dailyGoal]),
            createLog('2023-02-11', [dailyGoal]),
            createLog('2023-02-12', [dailyGoal]),
        ];
        const result = calculateMetAchievements(logs, dailyGoal, [achievement]);
        expect(result).toEqual([achievement]);
    });
  });
});
