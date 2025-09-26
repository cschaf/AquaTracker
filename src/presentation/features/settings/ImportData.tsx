import React, { useState, useRef } from 'react';
import { Button } from '../../components/Button.tsx';
import { Card } from '../../components/Card.tsx';

interface ImportDataProps {
  importData: (file: File) => void;
}

const ImportData: React.FC<ImportDataProps> = ({ importData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImportClick = () => {
    if (selectedFile) {
      importData(selectedFile);
    }
  };

  return (
    <Card>
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Import Your Data</h2>
        <p className="text-text-secondary mb-6">Import a previously exported JSON file to restore your data.</p>
        <div className="flex flex-col items-start space-y-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full max-w-xs text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bg-tertiary file:text-accent-primary hover:file:bg-bg-nav-active cursor-pointer"
          />
          <Button
            onClick={handleImportClick}
            disabled={!selectedFile}
          >
            <i className="fas fa-file-import mr-2"></i>Import from JSON
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImportData;
