import React from 'react';
import { Card } from '../../shared/components/Card';
import { ThemeSwitcher } from '../../shared/components/ThemeSwitcher';
import { useTheme } from '../../hooks/useTheme';

const GeneralSettings: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <Card title="General Settings">
      <div className="p-4">
        <ThemeSwitcher onChange={toggleTheme} />
      </div>
    </Card>
  );
};

export default GeneralSettings;
