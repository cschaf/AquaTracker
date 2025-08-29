import React from 'react';

interface ProgressBarProps {
  percentage: number;
  displayPercentage: number;
  color?: string;
  overGoalColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  displayPercentage,
  color = 'bg-blue-600',
  overGoalColor = 'bg-yellow-500',
}) => {
  const progressPercentage = Math.min(percentage, 100);
  const barColor = percentage > 100 ? overGoalColor : color;

  return (
    <div>
      <div className={`h-4 rounded-full overflow-hidden relative bg-gray-200`}>
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>0%</span>
        <span className="font-medium">{Math.round(displayPercentage)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
