import React from 'react';
import DailyTracker from '../features/daily-tracker/DailyTracker';
import Tips from '../features/daily-tracker/Tips';

const MainPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <DailyTracker />
      <Tips />
    </div>
  );
};

export default MainPage;
