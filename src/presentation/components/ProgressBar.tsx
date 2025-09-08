import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  barClassName = '',
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const progressPercentage = Math.min(percentage, 100);
  const isOverGoal = max > 0 && value > max;

  const barColor = isOverGoal ? 'bg-success' : 'bg-accent-primary';

  return (
    <div
      className={`h-4 rounded-full overflow-hidden bg-bg-secondary ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`h-full ${barColor} transition-all duration-500 ${barClassName}`}
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};
