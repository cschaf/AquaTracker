import React from 'react';

interface CriticalWarningModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const CriticalWarningModal: React.FC<CriticalWarningModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-red-100 border-4 border-red-500 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-auto text-center relative">
        <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
          <i className="fas fa-exclamation-triangle text-white text-4xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-red-800 mb-2">CRITICAL WARNING</h3>
        <p className="text-red-700">{message}</p>
        <button onClick={onClose} className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all">
          I Understand
        </button>
      </div>
    </div>
  );
};

export default CriticalWarningModal;
