import React from 'react';
import { INTAKE_STATUS } from '../lib/intakeWarnings';

interface WarningBannerProps {
  message: string;
  status: string;
}

const WarningBanner: React.FC<WarningBannerProps> = ({ message, status }) => {
  if (status !== INTAKE_STATUS.WARNING) {
    return null;
  }

  return (
    <div
      id="intake-warning-banner"
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-lg shadow-md"
      role="alert"
    >
      <p className="font-bold">Warning</p>
      <p id="intake-warning-message">{message}</p>
    </div>
  );
};

export default WarningBanner;
