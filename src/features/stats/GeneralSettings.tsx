import React from 'react';
import { useTheme } from '../../shared/hooks/useTheme';

const GeneralSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-background rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">General Settings</h2>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Theme</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTheme('light')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              theme === 'light'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              theme === 'dark'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              theme === 'system'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
