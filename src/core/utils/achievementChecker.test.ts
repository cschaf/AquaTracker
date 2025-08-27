import { describe, it, expect } from 'vitest';
import { calculateMetAchievements } from './achievementChecker';
import type { Log } from '../entities/water-intake';
import type { Achievement } from '../entities/achievement';

// Helper to create a log entry
const createLog = (date: string, amounts: number[]): Log => ({
  date,
  entries: amounts.map((amount, i) => ({
    id: `${date}-${i}`,
    amount,
    timestamp: new Date(`${date}T12:00:00Z`).getTime(),
  })),
});

// Helper to create a timed log entry
const createTimedLog = (date: string, entries: { amount: number, hour: number }[]): Log => ({
    date,
    entries: entries.map((entry, i) => ({
        id: `${date}-${i}`,
        amount: entry.amount,
        timestamp: new Date(`${date}T${String(entry.hour).padStart(2, '0')}:00:00Z`).getTime(),
    })),
});


describe('calculateMetAchievements', () => {
  const dailyGoal = 3000;

  // Mock Achievements
  const achievements: Achievement[] = [
    { id: 'log_count_1', name: 'First Drop', description: '', trigger: { type: 'log_count', days: 1 } },
    { id: 'consecutive_goals_3', name: '3 Day Goal Streak', description: '', trigger: { type: 'consecutive_goals', days: 3 } },
    { id: 'total_volume_10000', name: '10L Club', description: '', trigger: { type: 'total_volume', amount: 10000 } },
    { id: 'goal_met_5', name: '5 Goals Met', description: '', trigger: { type: 'goal_met', times: 5 } },
    { id: 'goals_in_week_3', name: '3 Goals in a Week', description: '', trigger: { type: 'goals_in_week', count: 3 } },
    { id: 'exceed_goal_by_150', name: 'Super Hydrated', description: '', trigger: { type: 'exceed_goal_by', percentage: 150 } },
    { id: 'log_before_time_8', name: 'Early Bird', description: '', trigger: { type: 'log_before_time', hour: 8 } },
    { id: 'log_after_time_22', name: 'Night Owl', description: '', trigger: { type: 'log_after_time', hour: 22 } },
    { id: 'logs_per_day_for_days_5_2', name: 'Consistent Logger', description: '', trigger: { type: 'logs_per_day_for_days', logs: 5, days: 2 } },
    { id: 'log_on_date_NY', name: 'New Year Hydration', description: '', trigger: { type: 'log_on_date', month: 1, day: 1 } },
    { id: 'log_date_range', name: 'Hydration Week', description: '', trigger: { type: 'log_date_range', start: '08-01', end: '08-07' } },
    { id: 'log_after_break_3', name: 'Back on Track', description: '', trigger: { type: 'log_after_break', days: 3 } },
    { id: 'log_streak_7', name: '7-Day Streak', description: '', trigger: { type: 'log_streak', days: 7 } },
    { id: 'log_at_time_for_days', name: 'Lunchtime Hydration', description: '', trigger: { type: 'log_at_time_for_days', hour: 12, days: 3 } },
    { id: 'single_log_amount_1000', name: 'Big Gulp', description: '', trigger: { type: 'single_log_amount', amount: 1000 } },
    { id: 'weekend_goal_2', name: 'Weekend Warrior', description: '', trigger: { type: 'weekend_goal', weeks: 1 } },
  ];

  it('should return no achievements if none are met', () => {
    const met = calculateMetAchievements([], dailyGoal, achievements);
    expect(met).toHaveLength(0);
  });

  it('should trigger log_count', () => {
    const logs = [createLog('2023-01-01', [500])];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_count_1')).toBe(true);
  });

  it('should trigger consecutive_goals', () => {
    const logs = [
      createLog('2023-01-01', [3000]),
      createLog('2023-01-02', [3500]),
      createLog('2023-01-03', [3000]),
    ];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'consecutive_goals_3')).toBe(true);
  });

  it('should trigger total_volume', () => {
    const logs = [createLog('2023-01-01', [5000, 5000])];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'total_volume_10000')).toBe(true);
  });

  it('should trigger goal_met', () => {
    const logs = [
      createLog('2023-01-01', [3000]),
      createLog('2023-01-02', [3000]),
      createLog('2023-01-03', [3000]),
      createLog('2023-01-04', [3000]),
      createLog('2023-01-05', [3000]),
    ];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'goal_met_5')).toBe(true);
  });

  it('should trigger goals_in_week', () => {
    const logs = [
      createLog('2023-01-02', [3000]), // Monday of Week 1
      createLog('2023-01-03', [3000]), // Tuesday of Week 1
      createLog('2023-01-04', [3000]), // Wednesday of Week 1
    ];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'goals_in_week_3')).toBe(true);
  });

  it('should trigger exceed_goal_by', () => {
    const logs = [createLog('2023-01-01', [dailyGoal * 1.5])];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'exceed_goal_by_150')).toBe(true);
  });

  it('should trigger log_before_time', () => {
    const logs = [createTimedLog('2023-01-01', [{ amount: 500, hour: 7 }])];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_before_time_8')).toBe(true);
  });

  it('should trigger log_after_time', () => {
    const logs = [createTimedLog('2023-01-01', [{ amount: 500, hour: 22 }])];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_after_time_22')).toBe(true);
  });

  it('should trigger logs_per_day_for_days', () => {
    const logs = [
      createLog('2023-01-01', [500, 500, 500, 500, 500]),
      createLog('2023-01-02', [500, 500, 500, 500, 500]),
    ];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'logs_per_day_for_days_5_2')).toBe(true);
  });

  it('should trigger log_on_date', () => {
    const logs = [createLog('2023-01-01', [500])];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_on_date_NY')).toBe(true);
  });

  it('should trigger log_date_range', () => {
    const logs = [];
    for(let i=1; i<=7; i++) {
        logs.push(createLog(`2023-08-0${i}`, [3000]));
    }
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_date_range')).toBe(true);
  });

  it('should trigger log_after_break', () => {
    const logs = [
      createLog('2023-01-01', [500]),
      createLog('2023-01-05', [500]), // 4 day difference
    ];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_after_break_3')).toBe(true);
  });

  it('should trigger log_streak', () => {
    const logs = [];
    for(let i=1; i<=7; i++) {
        logs.push(createLog(`2023-01-0${i}`, [500]));
    }
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_streak_7')).toBe(true);
  });

  it('should trigger log_at_time_for_days', () => {
    const logs = [
        createTimedLog('2023-01-01', [{ amount: 500, hour: 12 }]),
        createTimedLog('2023-01-02', [{ amount: 500, hour: 12 }]),
        createTimedLog('2023-01-03', [{ amount: 500, hour: 12 }]),
    ];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'log_at_time_for_days')).toBe(true);
  });

  it('should trigger single_log_amount', () => {
    const logs = [createLog('2023-01-01', [1000])];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'single_log_amount_1000')).toBe(true);
  });

  it('should trigger weekend_goal', () => {
    const logs = [
      createLog('2023-01-07', [3000]), // Saturday
      createLog('2023-01-08', [3000]), // Sunday
    ];
    const met = calculateMetAchievements(logs, dailyGoal, achievements);
    expect(met.some(a => a.id === 'weekend_goal_2')).toBe(true);
  });
});
