import React from 'react';

interface ExportDataProps {
  exportData: () => void;
}

const ExportData: React.FC<ExportDataProps> = ({ exportData }) => {
  return (
    <div className="bg-white dark:bg-dark-blue-lighter rounded-2xl shadow-xl p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">Export Your Data</h2>
      <p className="text-gray-600 dark:text-dark-text-secondary mb-6">Download your water intake history for backup or analysis</p>
      <button onClick={exportData} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
        <i className="fas fa-file-export mr-2"></i>Export as JSON
      </button>
    </div>
  );
};

export default ExportData;
