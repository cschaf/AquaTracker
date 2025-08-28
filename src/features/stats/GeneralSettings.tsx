import React from 'react';
import { useTheme } from '../../shared/hooks/useTheme';

const GeneralSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-dark-blue-lighter rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-dark-text">General Settings</h2>
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-dark-text-secondary">Theme</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              theme === 'light'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-dark-text'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              theme === 'dark'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-dark-text'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              theme === 'system'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-dark-text'
            }`}
          >
            System
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
