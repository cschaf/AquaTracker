import React from 'react';
import type { Log, Entry } from '../../../domain';
import { Card } from '../../components/Card';

interface WeeklyChartProps {
  logs: Log[];
  dailyGoal: number;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ logs, dailyGoal }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  let weeklyTotal = 0;
  let daysWithIntake = 0;

  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const log = logs.find(l => l.date === dateStr);
    const total = log ? log.entries.reduce((sum: number, entry: Entry) => sum + entry.amount, 0) : 0;
    if (total > 0) {
      weeklyTotal += total;
      daysWithIntake++;
    }
    return {
      day: days[d.getDay()],
      total: total,
    };
  }).reverse();

  const maxIntake = Math.max(...last7DaysData.map(d => d.total), dailyGoal);
  const avgIntake = daysWithIntake > 0 ? weeklyTotal / daysWithIntake : 0;

  return (
    <Card>
      <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Weekly Consumption</h2>
      <div className="grid grid-cols-7 items-end gap-2 px-4 h-64">
        {last7DaysData.map((data, index) => {
          const percentage = maxIntake > 0 ? (data.total / maxIntake) * 100 : 0;
          const barHeight = `${percentage}%`;
          const textColor = percentage > 15 ? 'text-text-on-primary' : 'text-text-primary';
          const amountPosition = percentage > 15 ? '' : 'bar-amount-outside';

          return (
            <div key={index} className="flex flex-col items-center justify-end h-full">
              <div className="relative w-full h-full flex items-end justify-center">
                {data.total > 0 && (
                  <div
                    className="bg-accent-primary rounded-t-lg w-full flex items-center justify-center"
                    style={{ height: barHeight }}
                    title={`${data.total} ml`}
                  >
                    <div className={`bar-amount ${textColor} ${amountPosition} text-xs sm:text-sm`}>{data.total} ml</div>
                  </div>
                )}
              </div>
              <span className="text-sm text-text-secondary mt-2">{data.day}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <p className="text-text-secondary">Average: <span className="font-bold text-accent-primary">{(avgIntake / 1000).toFixed(1)}L</span> per day</p>
      </div>
    </Card>
  );
};

export default WeeklyChart;
