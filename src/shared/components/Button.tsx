import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  const baseClasses = "px-4 py-2 bg-accent-primary text-text-on-primary rounded-md hover:bg-opacity-90";

  // A simple className merger. For more complex scenarios, a library like clsx or tailwind-merge would be better.
  const mergedClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <button
      className={mergedClasses}
      {...props}
    >
      {children}
    </button>
  );
}
