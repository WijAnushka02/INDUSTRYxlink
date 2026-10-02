/**
 * INDUSTRYxLINK – Frontend Utilities
 *
 * Shared utility functions for the frontend application.
 */

/** Format a date string for display */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/** Format a percentage for display */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/** Truncate text to a maximum length */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/** Get status badge colour class */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    OPEN: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    READY: 'bg-green-100 text-green-800',
    RUNNING: 'bg-yellow-100 text-yellow-800',
    FAILED: 'bg-red-100 text-red-800',
    OPERATIONAL: 'bg-green-100 text-green-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

/** Generate a suitability score colour */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/** API base URL */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
