import React from 'react';
import DailyTracker from '../features/daily-tracker/DailyTracker';
import Tips from '../features/daily-tracker/Tips';
import type { useDailyTracker } from '../hooks/useDailyTracker';

type MainPageProps = ReturnType<typeof useDailyTracker>;

const MainPage: React.FC<MainPageProps> = (props) => {
  return (
    <div className="space-y-8">
      <DailyTracker {...props} />
      <Tips />
    </div>
  );
};

export default MainPage;