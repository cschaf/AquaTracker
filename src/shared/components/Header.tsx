import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <div className="flex justify-center mb-4">
<div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center water-icon">
          <i className="fas fa-tint text-primary-foreground text-2xl"></i>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">AquaTracker</h1>
      <p className="text-lg text-muted-foreground">Stay hydrated, stay healthy</p>
    </header>
  );
};

export default Header;
