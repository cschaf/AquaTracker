import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center water-icon">
          <i className="fas fa-tint text-white text-2xl"></i>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">AquaTracker</h1>
      <p className="text-lg text-gray-600">Stay hydrated, stay healthy</p>
    </header>
  );
};

export default Header;
