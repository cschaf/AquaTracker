import React, { useState, useRef } from 'react';

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
    <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Import Your Data</h2>
      <p className="text-gray-600 mb-6">Import a previously exported JSON file to restore your data.</p>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="w-full max-w-xs text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <button
          onClick={handleImportClick}
          disabled={!selectedFile}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-file-import mr-2"></i>Import from JSON
        </button>
      </div>
    </div>
  );
};

export default ImportData;
