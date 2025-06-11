import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

export default function Button({ className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
