import React from 'react';
import QuickAddSettings from '../features/stats/QuickAddSettings';
import ImportData from '../features/stats/ImportData';
import ExportData from '../features/stats/ExportData';
import { useStats } from '../features/stats/useStats';

const SettingsPage: React.FC = () => {
  const { importData, exportData } = useStats();

  return (
    <div className="space-y-8">
      <QuickAddSettings />
      <ImportData importData={importData} />
      <ExportData exportData={exportData} />
    </div>
  );
};

export default SettingsPage;
