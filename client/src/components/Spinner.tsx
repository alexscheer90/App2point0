import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color = 'currentColor' }) => {
  const sizeMap = {
    small: {
      width: 'w-4',
      height: 'h-4',
      border: 'border-2'
    },
    medium: {
      width: 'w-8',
      height: 'h-8',
      border: 'border-3'
    },
    large: {
      width: 'w-12',
      height: 'h-12',
      border: 'border-4'
    }
  };
  
  const { width, height, border } = sizeMap[size];
  
  return (
    <div 
      className={`${width} ${height} rounded-full animate-spin ${border} border-solid border-t-transparent`}
      style={{ 
        borderColor: `${color} transparent transparent transparent`
      }}
    />
  );
};

export default Spinner;