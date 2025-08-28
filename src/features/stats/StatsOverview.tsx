import React from 'react';
import type { Log, Entry } from '../../core/entities/water-intake';

interface StatsOverviewProps {
  logs: Log[];
  dailyGoal: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ logs, dailyGoal }) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  let weeklyTotal = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(firstDayOfWeek);
    d.setDate(firstDayOfWeek.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const log = logs.find(l => l.date === dateStr);
    if (log) {
      weeklyTotal += log.entries.reduce((sum: number, entry: Entry) => sum + entry.amount, 0);
    }
  }

  const weeklyGoal = dailyGoal * 7;
  let weeklyProgress = weeklyGoal > 0 ? (weeklyTotal / weeklyGoal) * 100 : 0;
  weeklyProgress = Math.min(weeklyProgress, 100);

  const dailyTotals = new Map<string, number>();
  logs.forEach(log => {
    const total = log.entries.reduce((sum: number, entry: Entry) => sum + entry.amount, 0);
    dailyTotals.set(log.date, total);
  });

  let bestStreak = 0;
  if (dailyTotals.size > 0) {
    const sortedDates = [...dailyTotals.keys()].sort();
    let currentStreak = 0;
    let lastDate: Date | null = null;
    for (const dateStr of sortedDates) {
      const currentDate = new Date(dateStr);
      if (dailyTotals.get(dateStr)! >= dailyGoal) {
        if (lastDate && (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24) === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 0;
      }
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
      lastDate = currentDate;
    }
  }

  let currentStreak = 0;
    if (dailyTotals.size > 0) {
        const sortedDates = [...dailyTotals.keys()].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
        let lastDate = new Date();
        lastDate.setDate(lastDate.getDate() + 1);

        for (const dateStr of sortedDates) {
            const currentDate = new Date(dateStr);
            if((lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24) > 1){
                break;
            }
            if(dailyTotals.get(dateStr)! >= dailyGoal){
                currentStreak++;
                lastDate = currentDate;
            } else {
                break;
            }
        }
    }


  let streakProgress = bestStreak > 0 ? (currentStreak / bestStreak) * 100 : 0;
  streakProgress = Math.min(streakProgress, 100);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 rounded-2xl shadow-xl p-6 text-white flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg opacity-90">This Week</p>
            <p className="text-3xl font-bold mt-1">{(weeklyTotal / 1000).toFixed(1)}L</p>
          </div>
          <i className="fas fa-calendar-week text-3xl opacity-80"></i>
        </div>
        <div className="mt-4">
          <p className="text-sm opacity-90">Goal: {(weeklyGoal / 1000).toFixed(1)}L</p>
          <div className="w-full bg-white bg-opacity-30 h-2 rounded-full mt-1">
            <div className="bg-white h-2 rounded-full" style={{ width: `${weeklyProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-2xl shadow-xl p-6 text-white flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg opacity-90">Best Streak</p>
            <p className="text-3xl font-bold mt-1">{bestStreak} days</p>
          </div>
          <i className="fas fa-fire text-3xl opacity-80"></i>
        </div>
        <div className="mt-4">
          <p className="text-sm opacity-90">Current: {currentStreak} days</p>
          <div className="w-full bg-white bg-opacity-30 h-2 rounded-full mt-1">
            <div className="bg-white h-2 rounded-full" style={{ width: `${streakProgress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
