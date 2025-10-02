import React, { useState, useMemo, useEffect, createRef } from 'react';
import type { Log } from '../../../domain/entities';
import { Card } from '../../components/Card';
import { useChartData, Range } from './useChartData';

interface StatsChartProps {
  logs: Log[];
  dailyGoal: number;
}

const StatsChart: React.FC<StatsChartProps> = ({ logs, dailyGoal }) => {
  const [selectedRange, setSelectedRange] = useState<Range>('1 week');
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const chartData = useChartData(logs, selectedRange);
  const barRefs = useMemo(() => Array.from({ length: chartData.length }, () => createRef<HTMLDivElement>()), [chartData.length]);

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
    } else if (chartData.length > 0) {
      setSelectedBar(chartData.length -1);
    } else {
      setSelectedBar(null);
    }
  }, [chartData]);

  useEffect(() => {
    if (selectedBar !== null && barRefs[selectedBar]?.current) {
      barRefs[selectedBar].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedBar, barRefs]);

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
                {dailyGoal > 0 &&
                  (selectedRange === '1 day' ||
                    selectedRange === '1 week' ||
                    selectedRange === '1 month') && (
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
                      ref={barRefs[index]}
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