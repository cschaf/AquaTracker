import React, { useState, useMemo, useEffect } from 'react';
import type { Log } from '../../../domain/entities';
import { Card } from '../../components/Card';

interface StatsChartProps {
  logs: Log[];
  dailyGoal: number;
}

type Range = '1 day' | '1 week' | '1 month' | '1 year' | 'All';

const toYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const StatsChart: React.FC<StatsChartProps> = ({ logs, dailyGoal }) => {
  const [selectedRange, setSelectedRange] = useState<Range>('1 week');
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let data: { label: string; value: number }[] = [];

    switch (selectedRange) {
      case '1 day': {
        const todayStr = toYYYYMMDD(today);
        const todayLog = logs.find(l => l.date === todayStr);
        const hourlyTotals: { [hour: number]: number } = {};

        if (todayLog) {
          todayLog.entries.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            hourlyTotals[hour] = (hourlyTotals[hour] || 0) + entry.amount;
          });
        }
        data = Array.from({ length: 24 }, (_, i) => ({
          label: `${i}`,
          value: hourlyTotals[i] || 0,
        }));
        break;
      }
      case '1 week': {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay());

        data = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(firstDayOfWeek);
          d.setDate(firstDayOfWeek.getDate() + i);
          const dateStr = toYYYYMMDD(d);
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
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1);

        data = Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(firstDayOfMonth);
            d.setDate(firstDayOfMonth.getDate() + i);
            const dateStr = toYYYYMMDD(d);
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
            const monthDate = new Date(today.getFullYear(), i, 1);
            const targetMonth = monthDate.getMonth();
            const targetYear = monthDate.getFullYear();
            const total = logs.filter(log => {
                const logYear = parseInt(log.date.substring(0, 4), 10);
                const logMonth = parseInt(log.date.substring(5, 7), 10) - 1;
                return logMonth === targetMonth && logYear === targetYear;
            }).reduce((sum, log) => sum + log.entries.reduce((entrySum, entry) => entrySum + entry.amount, 0), 0);
            return {
                label: months[targetMonth],
                value: total,
            };
        });
        break;
      }
      case 'All': {
        const yearlyData: { [year: string]: number } = {};
        logs.forEach(log => {
            const year = log.date.substring(0, 4);
            const total = log.entries.reduce((sum, entry) => sum + entry.amount, 0);
            yearlyData[year] = (yearlyData[year] || 0) + total;
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

  useEffect(() => {
    let lastIndexWithValue = -1;
    for (let i = chartData.length - 1; i >= 0; i--) {
      if (chartData[i].value > 0) {
        lastIndexWithValue = i;
        break;
      }
    }

    if (lastIndexWithValue !== -1) {
      setSelectedBar(lastIndexWithValue);
    } else if (chartData.length === 1) {
      setSelectedBar(0);
    } else {
      setSelectedBar(null);
    }
  }, [chartData]);

  const maxValue = useMemo(() => {
    const values = chartData.map(d => d.value);
    const maxVal = Math.max(...values, dailyGoal);
    return Math.ceil(maxVal / 500) * 500 || 1000;
  }, [chartData, dailyGoal]);

  const yAxisLabels = useMemo(() => {
    if (maxValue === 0) {
        return [dailyGoal, Math.round(dailyGoal / 2), 0].filter((v, i, a) => a.indexOf(v) === i);
    }
    const labels = [];
    const step = Math.round(maxValue / 5);
    if (step === 0) return [maxValue, 0].filter((v, i, a) => a.indexOf(v) === i);

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
      <div className="p-4 overflow-hidden">
        <div className="flex justify-center mb-4">
          {(['1 day', '1 week', '1 month', '1 year', 'All'] as Range[]).map(range => (
            <button
              key={range}
              onClick={() => {
                setSelectedRange(range);
                setSelectedBar(null);
              }}
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

        <div className="h-8 flex items-center justify-center">
          {selectedBar !== null && chartData[selectedBar] && (
            <div className="text-lg font-bold text-text-primary">
              {chartData[selectedBar].value} ml
            </div>
          )}
        </div>

        <div className="flex">
          <div className="flex flex-col justify-between h-64 pr-4 text-xs text-text-secondary text-right">
            {yAxisLabels.map(label => (
              <div key={label}>{label}</div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto">
            <div style={{ minWidth: `${chartData.length * 2.5}rem` }}>
              <div className="h-64 grid gap-3 items-end relative" style={gridTemplateColumns}>
                {dailyGoal > 0 && maxValue > 0 && dailyGoal < maxValue && (
                  <div
                    className="absolute left-0 right-0 h-px z-20"
                    style={{
                      bottom: `${(dailyGoal / maxValue) * 100}%`,
                      backgroundColor: 'var(--color-accent-primary)',
                    }}
                  >
                    <span
                      className="absolute -translate-y-1/2 text-xs font-semibold"
                      style={{
                        color: 'var(--color-accent-primary)',
                        left: '-2.5rem',
                      }}
                    >
                      Goal
                    </span>
                  </div>
                )}

                {chartData.map((data, index) => {
                  const percentage = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
                  const barHeight = `${percentage}%`;
                  const isSelected = selectedBar === index;
                  const barColor = isSelected ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)';

                  return (
                    <div
                      key={index}
                      className="relative flex flex-col items-center justify-end h-full z-10 cursor-pointer"
                      onClick={() => setSelectedBar(isSelected ? null : index)}
                    >
                      <div
                        className="w-full rounded-lg transition-colors"
                        style={{ height: barHeight, backgroundColor: barColor }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="grid gap-3 mt-2" style={gridTemplateColumns}>
                {chartData.map((data, index) => {
                  const showLabel = (range: Range) => {
                      if (range === '1 day' && index % 6 !== 0 && index !== 0) return false;
                      if (range === '1 month' && index % 5 !== 0) return false;
                      return true;
                  }

                  if (!showLabel(selectedRange)) {
                      return <div key={index} />
                  }
                  return (
                      <div key={index} className="text-xs text-text-secondary text-center">{data.label}</div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatsChart;