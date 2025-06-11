import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 ${className}`}
      {...props}
    />
  );
}
