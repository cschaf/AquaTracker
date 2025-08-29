import React from 'react';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';

interface ExportDataProps {
  exportData: () => void;
}

const ExportData: React.FC<ExportDataProps> = ({ exportData }) => {
  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Export Your Data</h2>
        <p className="text-text-secondary mb-6">Download your water intake history for backup or analysis</p>
        <Button onClick={exportData}>
          <i className="fas fa-file-export mr-2"></i>Export as JSON
        </Button>
      </div>
    </Card>
  );
};

export default ExportData;
