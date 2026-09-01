import React, { useState } from 'react';
import { Calendar, Users, Briefcase } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { useOpportunities } from '../hooks/useOpportunities';
import { useCreateRequest } from '../hooks/useRequests';

const DashboardUniversity: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useOpportunities(page);
  const requestMutation = useCreateRequest();

  const handleRequest = (id: string) => {
    requestMutation.mutate(id, {
      onSuccess: () => alert('Request submitted successfully!'),
      onError: (error: any) => alert(error.response?.data?.message || 'Failed to submit request')
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-indigo-600">
        <CardContent>
          <h3 className="text-lg leading-6 font-medium text-gray-900">University Dashboard</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>Welcome! Here you can discover industry visit opportunities and manage your requests.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Recommended Opportunities</h4>
        
        {isLoading && <p className="text-gray-500">Loading opportunities...</p>}
        {isError && <p className="text-red-500">Failed to load opportunities.</p>}
        
        {!isLoading && !isError && data?.opportunities.length === 0 && (
          <p className="text-gray-500">No open opportunities available right now.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.opportunities.map((opp: any) => (
            <Card key={opp._id} className="hover:shadow-md transition-shadow overflow-hidden">
              <CardContent>
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Briefcase className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{opp.companyId?.name || 'Company'}</dt>
                      <dd className="text-lg font-semibold text-gray-900 truncate">{opp.topic}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(opp.visitDate).toLocaleDateString()}</span>
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {opp.capacity} max</span>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => handleRequest(opp._id)}
                  disabled={requestMutation.isPending}
                >
                  Request Visit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Pagination controls */}
        {data && data.pages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
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
      </div>
    </div>
  );
};

export default DashboardUniversity;
