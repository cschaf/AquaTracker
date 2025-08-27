interface LogCountTrigger {
  type: 'log_count';
  days: number;
}

interface ConsecutiveGoalsTrigger {
  type: 'consecutive_goals';
  days: number;
}

interface TotalVolumeTrigger {
  type: 'total_volume';
  amount: number;
}

interface GoalMetTrigger {
  type: 'goal_met';
  times: number;
}

interface GoalsInWeekTrigger {
  type: 'goals_in_week';
  count: number;
}

interface ExceedGoalByTrigger {
  type: 'exceed_goal_by';
  percentage: number;
}

interface LogBeforeTimeTrigger {
  type: 'log_before_time';
  hour: number;
}

interface LogAfterTimeTrigger {
  type: 'log_after_time';
  hour: number;
}

interface LogsPerDayForDaysTrigger {
  type: 'logs_per_day_for_days';
  logs: number;
  days: number;
}

interface LogOnDateTrigger {
  type: 'log_on_date';
  month: number;
  day: number;
}

interface LogDateRangeTrigger {
  type: 'log_date_range';
  start: string;
  end: string;
}

interface LogAfterBreakTrigger {
  type: 'log_after_break';
  days: number;
}

interface LogStreakTrigger {
  type: 'log_streak';
  days: number;
}

interface LogAtTimeForDaysTrigger {
  type: 'log_at_time_for_days';
  hour: number;
  days: number;
}

interface SingleLogAmountTrigger {
  type: 'single_log_amount';
  amount: number;
}

interface WeekendGoalTrigger {
  type: 'weekend_goal';
  weeks: number;
}

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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  trigger: Trigger;
}
