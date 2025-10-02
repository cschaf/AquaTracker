import { useMemo } from 'react';
import type { Log } from '../../../domain/entities';

export type Range = '1 day' | '1 week' | '1 month' | '1 year' | 'All';

const toYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useChartData = (logs: Log[], selectedRange: Range) => {
  return useMemo(() => {
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
};