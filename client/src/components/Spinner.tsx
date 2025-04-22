import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * A simple loading spinner component
 */
const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = '#019E4F', // MAC green color
  className = ''
}) => {
  // Size mappings
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`${sizeClass} animate-spin rounded-full border-4 border-solid border-t-transparent`} 
        style={{ borderColor: `transparent ${color} ${color} ${color}` }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Spinner;