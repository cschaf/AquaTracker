import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10 relative">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center water-icon">
          <i className="fas fa-tint text-text-on-primary text-2xl"></i>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">AquaTracker</h1>
      <p className="text-lg text-text-primary">Stay hydrated, stay healthy</p>
    </header>
  );
};

export default Header;
