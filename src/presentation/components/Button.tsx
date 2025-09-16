import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-md hover:bg-opacity-90";

  const variantClasses = {
    primary: 'bg-accent-primary text-text-on-primary',
    secondary: 'bg-bg-secondary text-text-primary border border-border-card',
  };

  // A simple className merger. For more complex scenarios, a library like clsx or tailwind-merge would be better.
  const mergedClasses = [baseClasses, variantClasses[variant], className].filter(Boolean).join(' ');

  return (
    <button
      className={mergedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
