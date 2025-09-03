/**
 * @file Defines the Achievement entity and its related types.
 * @licence MIT
 */

/**
 * Represents a trigger condition for unlocking an achievement.
 * Each trigger has a `type` and additional properties specific to that type.
 */
type BaseTrigger<T extends string, P> = { type: T } & P;

type LogCountTrigger = BaseTrigger<'log_count', { days: number }>;
type ConsecutiveGoalsTrigger = BaseTrigger<'consecutive_goals', { days: number }>;
type TotalVolumeTrigger = BaseTrigger<'total_volume', { amount: number }>;
type GoalMetTrigger = BaseTrigger<'goal_met', { times: number }>;
type GoalsInWeekTrigger = BaseTrigger<'goals_in_week', { count: number }>;
type ExceedGoalByTrigger = BaseTrigger<'exceed_goal_by', { percentage: number }>;
type LogBeforeTimeTrigger = BaseTrigger<'log_before_time', { hour: number }>;
type LogAfterTimeTrigger = BaseTrigger<'log_after_time', { hour: number }>;
type LogsPerDayForDaysTrigger = BaseTrigger<'logs_per_day_for_days', { logs: number; days: number }>;
type LogOnDateTrigger = BaseTrigger<'log_on_date', { month: number; day: number }>;
type LogDateRangeTrigger = BaseTrigger<'log_date_range', { start: string; end: string }>;
type LogAfterBreakTrigger = BaseTrigger<'log_after_break', { days: number }>;
type LogStreakTrigger = BaseTrigger<'log_streak', { days: number }>;
type LogAtTimeForDaysTrigger = BaseTrigger<'log_at_time_for_days', { hour: number; days: number }>;
type SingleLogAmountTrigger = BaseTrigger<'single_log_amount', { amount: number }>;
type WeekendGoalTrigger = BaseTrigger<'weekend_goal', { weeks: number }>;

/**
 * A union type representing all possible achievement triggers.
 * This allows for strong typing and exhaustiveness checks when processing triggers.
 */
export type Trigger =
  | LogCountTrigger
  | ConsecutiveGoalsTrigger
  | TotalVolumeTrigger
  | GoalMetTrigger
  | GoalsInWeekTrigger
  | ExceedGoalByTrigger
  | LogBeforeTimeTrigger
  | LogAfterTimeTrigger
  | LogsPerDayForDaysTrigger
  | LogOnDateTrigger
  | LogDateRangeTrigger
  | LogAfterBreakTrigger
  | LogStreakTrigger
  | LogAtTimeForDaysTrigger
  | SingleLogAmountTrigger
  | WeekendGoalTrigger;

/**
 * Represents a user-unlockable achievement in the application.
 * Achievements are defined by a unique ID, descriptive metadata, and a trigger condition.
 */
export interface Achievement {
  /**
   * The unique identifier for the achievement.
   * @example 'first-log'
   */
  id: string;

  /**
   * The display name of the achievement.
   * @example 'First Drop'
   */
  name: string;

  /**
   * A short description of what the achievement is for.
   * @example 'Log your first water intake.'
   */
  description: string;

  /**
   * An identifier for the icon associated with the achievement.
   * @example '💧'
   */
  icon: string;

  /**
   * The specific condition that must be met to unlock this achievement.
   */
  trigger: Trigger;
}
