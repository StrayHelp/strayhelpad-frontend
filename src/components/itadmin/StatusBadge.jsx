import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const isActive = status === 'Active' || status === 'active';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${
      isActive
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
    }`}>
      <span className="h-2 w-2 rounded-full" style={{backgroundColor: 'currentColor'}}></span>
      {isActive ? 'Active' : 'Suspended'}
    </span>
  );
};
