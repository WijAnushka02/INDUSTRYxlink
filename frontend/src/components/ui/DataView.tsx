import React from 'react';
import { AlertCircle, Inbox } from 'lucide-react';
import { CardSkeleton } from './Skeleton';
import Button from './Button';

interface DataViewProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingCount?: number;
  emptyTitle?: string;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const DataView: React.FC<DataViewProps> = ({
  isLoading,
  isError,
  isEmpty,
  loadingCount = 3,
  emptyTitle = 'No data available',
  emptyMessage = 'There is nothing to display here right now.',
  errorMessage = 'An error occurred while loading data.',
  onRetry,
  children
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: loadingCount }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border-2 border-dashed border-red-300 p-8 text-center bg-red-50">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" aria-hidden="true" />
        <h3 className="mt-2 text-sm font-semibold text-red-800">Error Loading Data</h3>
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        {onRetry && (
          <div className="mt-6">
            <Button variant="secondary" onClick={onRetry}>Try again</Button>
          </div>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center bg-gray-50">
        <Inbox className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};
