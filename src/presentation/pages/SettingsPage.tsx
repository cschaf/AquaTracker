import React from 'react';
import GeneralSettings from '../features/settings/GeneralSettings.tsx';
import NotificationSettings from '../features/settings/NotificationSettings.tsx';
import QuickAddSettings from '../features/stats/QuickAddSettings';
import ImportData from '../features/settings/ImportData.tsx';
import ExportData from '../features/settings/ExportData.tsx';
import { useStats } from '../hooks/useStats';

const SettingsPage: React.FC = () => {
  const { importData, exportData } = useStats();

  return (
    <div className="space-y-8">
      <GeneralSettings />
      <NotificationSettings />
      <QuickAddSettings />
      <ImportData importData={importData} />
      <ExportData exportData={exportData} />
    </div>
  );
};

export default SettingsPage;
