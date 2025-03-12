import React from 'react';

const sizes = {
  xs: "h-4 w-4 border-2",
  sm: "h-6 w-6 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-3",
  xl: "h-12 w-12 border-4"
};

const LoadingSpinner = ({ size = "md", className = "" }) => {
  return (
    <div className={`animate-spin rounded-full border-t-transparent border-primary ${sizes[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
