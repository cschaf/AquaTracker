import React from 'react';

const Tips: React.FC = () => {
  return (
    <div className="bg-warning/10 rounded-2xl shadow-xl p-6 border border-warning/20">
      <h2 className="text-xl font-bold text-warning mb-3 flex items-center">
        <i className="fas fa-lightbulb mr-2"></i>Hydration Tips
      </h2>
      <ul className="space-y-2 text-text-secondary">
        <li className="flex items-start">
          <i className="fas fa-check-circle mt-1 mr-2 text-warning/80"></i>
          <span>Drink a glass of water first thing in the morning</span>
        </li>
        <li className="flex items-start">
          <i className="fas fa-check-circle mt-1 mr-2 text-warning/80"></i>
          <span>Carry a reusable water bottle with you</span>
        </li>
        <li className="flex items-start">
          <i className="fas fa-check-circle mt-1 mr-2 text-warning/80"></i>
          <span>Set reminders to drink water throughout the day</span>
        </li>
      </ul>
    </div>
  );
};

export default Tips;
