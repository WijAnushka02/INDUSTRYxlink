import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white shadow rounded-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg leading-6 font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-4 py-5 border-b border-gray-200 sm:px-6 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`px-4 py-5 sm:p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 ${className}`}>
    {children}
  </div>
);
