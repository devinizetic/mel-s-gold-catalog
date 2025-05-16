
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonLoaderProps {
  type: 'card' | 'detail' | 'list';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <Skeleton className="h-64 w-full" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4 mb-4" />
      {Array(count).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
