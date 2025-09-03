import React from 'react';
import GeneralSettings from '../features/stats/GeneralSettings';
import QuickAddSettings from '../features/stats/QuickAddSettings';
import ImportData from '../features/stats/ImportData';
import ExportData from '../features/stats/ExportData';
import { useStats } from '../hooks/useStats';

const SettingsPage: React.FC = () => {
  const { importData, exportData } = useStats();

  return (
    <div className="space-y-8">
      <GeneralSettings />
      <QuickAddSettings />
      <ImportData importData={importData} />
      <ExportData exportData={exportData} />
    </div>
  );
};

export default SettingsPage;
