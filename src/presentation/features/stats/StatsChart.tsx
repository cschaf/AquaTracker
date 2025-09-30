import React, { useState, useMemo } from 'react';
import type { Log } from '../../../domain/entities';
import { Card } from '../../components/Card';

interface StatsChartProps {
  logs: Log[];
  dailyGoal: number;
}

type Range = '1 day' | '1 week' | '1 month' | '1 year' | 'All';

const StatsChart: React.FC<StatsChartProps> = ({ logs, dailyGoal }) => {
  const [selectedRange, setSelectedRange] = useState<Range>('1 week');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let data: { label: string; value: number }[] = [];

    switch (selectedRange) {
      case '1 day': {
        const dateStr = today.toISOString().split('T')[0];
        const log = logs.find(l => l.date === dateStr);
        const total = log ? log.entries.reduce((sum, entry) => sum + entry.amount, 0) : 0;
        data = [{ label: 'Today', value: total }];
        break;
      }
      case '1 week': {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        data = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6 - i));
          const dateStr = d.toISOString().split('T')[0];
          const log = logs.find(l => l.date === dateStr);
          const total = log ? log.entries.reduce((sum, entry) => sum + entry.amount, 0) : 0;
          return {
            label: days[d.getDay()],
            value: total,
          };
        });
        break;
      }
      case '1 month': {
        data = Array.from({ length: 30 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (29 - i));
            const dateStr = d.toISOString().split('T')[0];
            const log = logs.find(l => l.date === dateStr);
            const total = log ? log.entries.reduce((sum, entry) => sum + entry.amount, 0) : 0;
            return {
                label: `${d.getDate()}`,
                value: total,
            };
        });
        break;
      }
      case '1 year': {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data = Array.from({ length: 12 }, (_, i) => {
            const monthDate = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
            const month = monthDate.getMonth();
            const year = monthDate.getFullYear();
            const total = logs.filter(log => {
                const logDate = new Date(log.date);
                return logDate.getMonth() === month && logDate.getFullYear() === year;
            }).reduce((sum, log) => sum + log.entries.reduce((entrySum, entry) => entrySum + entry.amount, 0), 0);
            return {
                label: months[month],
                value: total,
            };
        });
        break;
      }
      case 'All': {
        const yearlyData: { [year: string]: number } = {};
        logs.forEach(log => {
            const year = new Date(log.date).getFullYear().toString();
            const total = log.entries.reduce((sum, entry) => sum + entry.amount, 0);
            if (!yearlyData[year]) {
                yearlyData[year] = 0;
            }
            yearlyData[year] += total;
        });
        data = Object.entries(yearlyData).map(([year, total]) => ({
            label: year,
            value: total,
        }));
        break;
      }
    }
    return data;
  }, [logs, selectedRange]);

  const maxValue = useMemo(() => {
    const values = chartData.map(d => d.value);
    const maxVal = Math.max(...values, dailyGoal);
    return Math.ceil(maxVal / 500) * 500 || 1000;
  }, [chartData, dailyGoal]);

  const yAxisLabels = useMemo(() => {
    if (maxValue === 0) {
        return [dailyGoal, Math.round(dailyGoal / 2), 0];
    }
    const labels = [];
    const step = Math.round(maxValue / 5);
    if (step === 0) return [maxValue, 0]

    for (let i = maxValue; i >= 0; i -= step) {
        labels.push(i);
    }
    if (labels.length < 2) return [labels[0], 0];
    return labels;
  }, [maxValue, dailyGoal]);

  const gridTemplateColumns = {
    gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-center mb-4">
          {(['1 day', '1 week', '1 month', '1 year', 'All'] as Range[]).map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                selectedRange === range
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-text-secondary hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex h-64">
          <div className="flex flex-col justify-between h-full pr-2 text-xs text-text-secondary text-right">
            {yAxisLabels.map(label => (
              <div key={label}>{label}</div>
            ))}
          </div>

          <div className="flex-1 grid gap-3 items-end relative" style={gridTemplateColumns}>
            {dailyGoal > 0 && maxValue > 0 && dailyGoal < maxValue && (
              <div
                className="absolute left-0 right-0 h-px"
                style={{
                  bottom: `${(dailyGoal / maxValue) * 100}%`,
                  backgroundColor: 'var(--color-accent-primary)',
                }}
              >
                <span
                  className="absolute -right-12 -translate-y-1/2 text-xs font-semibold"
                  style={{ color: 'var(--color-accent-primary)' }}
                >
                  Goal
                </span>
              </div>
            )}

            {chartData.map((data, index) => {
              const percentage = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
              const barHeight = `${percentage}%`;
              const isHovered = hoveredBar === index;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center justify-end h-full"
                  onMouseEnter={() => setHoveredBar(index)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHovered && (
                    <div className="absolute -top-10 bg-success text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                      {data.value}
                    </div>
                  )}
                  <div
                    className="w-full rounded-lg transition-colors"
                    style={{ height: barHeight, backgroundColor: isHovered ? 'var(--color-success)' : 'var(--color-text-secondary)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 pl-8 pr-1 mt-2" style={gridTemplateColumns}>
          {chartData.map((data, index) => {
            if (selectedRange === '1 month' && index % 5 !== 0) {
                return <div key={index} />
            }
            return (
                <div key={index} className="text-xs text-text-secondary text-center">{data.label}</div>
            )
          })}
        </div>
      </div>
    </Card>
  );
};

export default StatsChart;