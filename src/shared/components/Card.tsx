import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-bg-secondary border border-border-card rounded-lg p-4 ${className}`}
    >
      {children}
    </div>
  );
}
