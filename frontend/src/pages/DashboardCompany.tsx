import React, { useState } from 'react';
import { PlusCircle, CheckCircle, XCircle } from 'lucide-react';

const DUMMY_REQUESTS = [
  { _id: 'r1', university: 'University of ABC', topic: 'Software Engineering', date: '2026-10-15', students: 45, status: 'PENDING' },
  { _id: 'r2', university: 'XYZ Institute', topic: 'Cloud Computing', date: '2026-10-20', students: 30, status: 'ACCEPTED' },
];

const DashboardCompany: React.FC = () => {
  const [requests, setRequests] = useState(DUMMY_REQUESTS);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setRequests(requests.map(req => req._id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 flex justify-between items-center border border-gray-200 border-t-4 border-t-blue-600">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Company Dashboard</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>Manage your industry visit slots and respond to university requests.</p>
          </div>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
          <PlusCircle className="mr-2 h-5 w-5" /> New Opportunity
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Incoming Visit Requests</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {requests.map((req) => (
            <li key={req._id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-blue-600 truncate">{req.university}</p>
                  <p className="mt-1 text-sm text-gray-500">Topic: {req.topic} | {req.students} students | Date: {req.date}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    req.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {req.status}
                  </span>
                  
                  {req.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button onClick={() => handleStatusUpdate(req._id, 'ACCEPTED')} className="text-green-600 hover:text-green-900">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleStatusUpdate(req._id, 'REJECTED')} className="text-red-600 hover:text-red-900">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardCompany;
