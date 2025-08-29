import React from 'react';
import { Card } from '../../shared/components/Card';
import { ThemeSwitcher } from '../../shared/components/ThemeSwitcher';
import { useTheme } from '../../hooks/useTheme';

interface SettingsRowProps {
  title: string;
  children: React.ReactNode;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-border-card last:border-b-0">
      <span className="text-text-primary">{title}</span>
      {children}
    </div>
  );
};

const GeneralSettings: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">General Settings</h2>
      <div>
        <SettingsRow title="Theme">
          <ThemeSwitcher onChange={toggleTheme} />
        </SettingsRow>
      </div>
    </Card>
  );
};

export default GeneralSettings;
