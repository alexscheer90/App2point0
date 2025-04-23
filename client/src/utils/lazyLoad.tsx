import React, { Suspense } from 'react';

// Fallback loading component with skeleton UI for different types of content
const SkeletonLoader = ({ type = 'default' }: { type?: 'card' | 'page' | 'default' }) => {
  if (type === 'card') {
    return (
      <div className="w-full rounded-lg bg-gray-800 animate-pulse p-4 shadow-lg">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="flex space-x-4">
          <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'page') {
    return (
      <div className="w-full h-screen bg-gray-900 p-4">
        <div className="h-8 bg-gray-800 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Default loader
  return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

// Generic lazy loading wrapper
export function lazyLoad(
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  loaderType: 'card' | 'page' | 'default' = 'default'
) {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={<SkeletonLoader type={loaderType} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}