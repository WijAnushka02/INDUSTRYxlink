import React, { useState } from 'react';
import { PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { DataView } from '../components/ui/DataView';
import { Badge } from '../components/ui/Badge';
import { useRequests, useUpdateRequestStatus } from '../hooks/useRequests';

const DashboardCompany: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useRequests(page);
  const updateStatusMutation = useUpdateRequestStatus();

  const handleStatusUpdate = (id: string, newStatus: string) => {
    updateStatusMutation.mutate(
      { id, status: newStatus },
      { onError: (error: any) => alert(error.response?.data?.message || 'Failed to update status') }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="warning">PENDING</Badge>;
      case 'ACCEPTED': return <Badge variant="success">ACCEPTED</Badge>;
      case 'REJECTED': return <Badge variant="error">REJECTED</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-blue-600 flex justify-between items-center">
        <CardContent>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Company Dashboard</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>Manage your industry visit slots and respond to university requests.</p>
          </div>
        </CardContent>
        <div className="pr-6">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> New Opportunity
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Incoming Visit Requests</h3>
        </CardHeader>
        
        <DataView 
          isLoading={isLoading} 
          isError={isError} 
          isEmpty={!isLoading && !isError && data?.requests?.length === 0}
          emptyTitle="No Requests Yet"
          emptyMessage="Universities haven't requested any visits yet."
          onRetry={refetch}
          loadingCount={1}
        >
          <ul className="divide-y divide-gray-200">
            {data?.requests?.map((req: any) => (
              <li key={req._id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-blue-600 truncate">{req.universityId?.name || 'University'}</p>
                    <p className="mt-1 text-sm text-gray-500">Topic: {req.opportunityId?.topic} | {req.studentCount} students | Date: {new Date(req.requestedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(req.status)}
                    
                    {req.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'ACCEPTED')} 
                          disabled={updateStatusMutation.isPending}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(req._id, 'REJECTED')} 
                          disabled={updateStatusMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination controls */}
          {data && data.pages > 1 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="py-1 px-3 text-sm text-gray-700">Page {page} of {data.pages}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
              >
                Next
              </Button>
            </div>
          )}
        </DataView>
      </Card>
    </div>
  );
};

export default DashboardCompany;
