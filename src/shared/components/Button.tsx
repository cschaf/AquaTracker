import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="px-4 py-2 bg-bg-primary text-text-on-primary rounded-md hover:bg-opacity-90"
      {...props}
    >
      {children}
    </button>
  );
}
