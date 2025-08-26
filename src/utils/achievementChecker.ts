import type { Log, Achievement } from '../types';

function checkConsecutiveDays(dates: string[], days: number) {
    if (dates.length < days) return false;
    let consecutiveCount = 0;
    let lastDate: Date | null = null;

    for (const dateStr of dates) {
        const currentDate = new Date(dateStr);
        if (lastDate && (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
            consecutiveCount++;
        } else {
            consecutiveCount = 1;
        }
        if (consecutiveCount >= days) return true;
        lastDate = currentDate;
    }
    return false;
}

function checkConsecutiveGoals(dailyTotals: Map<string, number>, goal: number, days: number) {
    const datesWithGoalMet = [...dailyTotals.entries()]
        .filter(([, total]) => total >= goal)
        .map(([date]) => date)
        .sort();
    return checkConsecutiveDays(datesWithGoalMet, days);
}

function checkGoalsInWeek(dailyTotals: Map<string, number>, goal: number, count: number) {
    const weeks: { [key: string]: number } = {};
    for (const [dateStr, total] of dailyTotals.entries()) {
        if (total >= goal) {
            const date = new Date(dateStr);
            const year = date.getUTCFullYear();
            const week = getWeekNumber(date);
            const weekId = `${year}-${week}`;
            if (!weeks[weekId]) weeks[weekId] = 0;
            weeks[weekId]++;
            if (weeks[weekId] >= count) return true;
        }
    }
    return false;
}

function checkLogsPerDayForDays(logs: Log[], logCount: number, numDays: number) {
    const datesWithEnoughLogs = logs
        .filter(log => log.entries.length >= logCount)
        .map(log => log.date)
        .sort();
    return checkConsecutiveDays(datesWithEnoughLogs, numDays);
}

function checkLogDateRange(dailyTotals: Map<string, number>, goal: number, start: string, end: string) {
    const [startMonth, startDay] = start.split('-').map(Number);
    const [endMonth, endDay] = end.split('-').map(Number);

    const years = new Set([...dailyTotals.keys()].map(d => new Date(d).getFullYear()));

    for(const year of years) {
        let allDaysMet = true;
        const startDate = new Date(year, startMonth - 1, startDay);
        const endDate = new Date(year, endMonth - 1, endDay);

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (!dailyTotals.has(dateStr) || dailyTotals.get(dateStr)! < goal) {
                allDaysMet = false;
                break;
            }
        }
        if(allDaysMet) return true;
    }
    return false;
}

function checkLogAfterBreak(dailyTotals: Map<string, number>, breakDays: number) {
    const sortedDates = [...dailyTotals.keys()].sort();
    if (sortedDates.length < 2) return false;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i-1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > breakDays) {
            return true;
        }
    }
    return false;
}

function checkLogStreak(dailyTotals: Map<string, number>, days: number) {
    const sortedDates = [...dailyTotals.keys()].sort();
    return checkConsecutiveDays(sortedDates, days);
}

function checkLogAtTimeForDays(logs: Log[], hour: number, numDays: number) {
    const datesWithSpecificLog = new Set<string>();
    logs.forEach(log => {
        if (log.entries.some(e => new Date(e.timestamp).getHours() === hour)) {
            datesWithSpecificLog.add(log.date);
        }
    });

    const sortedDates = [...datesWithSpecificLog].sort();
    if(sortedDates.length < numDays) return false;

    let consecutiveCount = 0;
    let lastDate: Date | null = null;

    for(const dateStr of sortedDates) {
        const currentDate = new Date(dateStr);
         if (lastDate && (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
            consecutiveCount++;
        } else {
            consecutiveCount = 1;
        }
        if (consecutiveCount >= numDays) return true;
        lastDate = currentDate;
    }
    return false;
}

function checkWeekendGoal(dailyTotals: Map<string, number>, goal: number, weeks: number) {
    const weekendGoalsMet = new Set<string>();
    for (const [dateStr, total] of dailyTotals.entries()) {
        if (total >= goal) {
            const date = new Date(dateStr);
            const dayOfWeek = date.getUTCDay();
            if (dayOfWeek === 6 || dayOfWeek === 0) { // Saturday or Sunday
                const year = date.getUTCFullYear();
                const week = getWeekNumber(date);
                weekendGoalsMet.add(`${year}-${week}-${dayOfWeek}`);
            }
        }
    }

    const weekCounts: { [key: string]: Set<string> } = {};
    for(const item of weekendGoalsMet){
        const [year, week, day] = item.split('-');
        const weekId = `${year}-${week}`;
        if(!weekCounts[weekId]) weekCounts[weekId] = new Set();
        weekCounts[weekId].add(day);
    }

    let completeWeekendCount = 0;
    for(const weekId in weekCounts){
        if(weekCounts[weekId].has('0') && weekCounts[weekId].has('6')){
            completeWeekendCount++;
        }
    }

    return completeWeekendCount >= weeks;
}


export function checkAchievements(logs: Log[], dailyGoal: number, unlockedAchievements: string[], allAchievements: Achievement[]): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    const dailyTotals = new Map<string, number>();
    logs.forEach(log => {
        const total = log.entries.reduce((sum, entry) => sum + entry.amount, 0);
        dailyTotals.set(log.date, total);
    });

    allAchievements.forEach(achievement => {
        if (unlockedAchievements.includes(achievement.id)) {
            return;
        }

        let earned = false;
        const trigger = achievement.trigger;

        switch (trigger.type) {
            case 'log_count':
                earned = dailyTotals.size >= trigger.days;
                break;
            case 'consecutive_goals':
                earned = checkConsecutiveGoals(dailyTotals, dailyGoal, trigger.days);
                break;
            case 'total_volume': {
                const totalVolume = logs.reduce((sum, log) => sum + log.entries.reduce((s, e) => s + e.amount, 0), 0);
                earned = totalVolume >= trigger.amount;
                break;
            }
            case 'goal_met': {
                const goalsMetCount = [...dailyTotals.values()].filter(total => total >= dailyGoal).length;
                earned = goalsMetCount >= trigger.times;
                break;
            }
            case 'goals_in_week':
                earned = checkGoalsInWeek(dailyTotals, dailyGoal, trigger.count);
                break;
            case 'exceed_goal_by':
                earned = [...dailyTotals.values()].some(total => total >= dailyGoal * (trigger.percentage / 100));
                break;
            case 'log_before_time':
                earned = logs.some(log => log.entries.some(e => new Date(e.timestamp).getHours() < trigger.hour));
                break;
            case 'log_after_time':
                earned = logs.some(log => log.entries.some(e => new Date(e.timestamp).getHours() >= trigger.hour));
                break;
            case 'logs_per_day_for_days':
                earned = checkLogsPerDayForDays(logs, trigger.logs, trigger.days);
                break;
            case 'log_on_date':
                earned = logs.some(log => {
                    const logDate = new Date(log.date);
                    return logDate.getUTCMonth() + 1 === trigger.month && logDate.getUTCDate() === trigger.day;
                });
                break;
            case 'log_date_range':
                earned = checkLogDateRange(dailyTotals, dailyGoal, trigger.start, trigger.end);
                break;
            case 'log_after_break':
                earned = checkLogAfterBreak(dailyTotals, trigger.days);
                break;
            case 'log_streak':
                earned = checkLogStreak(dailyTotals, trigger.days);
                break;
            case 'log_at_time_for_days':
                earned = checkLogAtTimeForDays(logs, trigger.hour, trigger.days);
                break;
            case 'single_log_amount':
                earned = logs.some(log => log.entries.some(e => e.amount >= trigger.amount));
                break;
            case 'weekend_goal':
                earned = checkWeekendGoal(dailyTotals, dailyGoal, trigger.weeks);
                break;
        }

        if (earned) {
            newlyUnlocked.push(achievement);
        }
    });

    return newlyUnlocked;
}
