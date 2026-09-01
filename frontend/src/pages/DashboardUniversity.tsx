import React, { useState } from 'react';
import { Calendar, Users, Briefcase } from 'lucide-react';

const DUMMY_OPPORTUNITIES = [
  { _id: '1', companyName: 'TechCorp', topic: 'Software Engineering & Cloud', date: '2026-10-15', capacity: 50 },
  { _id: '2', companyName: 'DataSystems', topic: 'AI & Machine Learning in Prod', date: '2026-11-02', capacity: 30 },
];

const DashboardUniversity: React.FC = () => {
  const [opportunities] = useState(DUMMY_OPPORTUNITIES);
  
  const handleRequest = (id: string) => {
    alert(`Request submitted for opportunity ${id}!`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 border border-gray-200 border-t-4 border-t-indigo-600">
        <h3 className="text-lg leading-6 font-medium text-gray-900">University Dashboard</h3>
        <div className="mt-2 text-sm text-gray-500">
          <p>Welcome! Here you can discover industry visit opportunities and manage your requests.</p>
        </div>
      </div>

      <div className="flex flex-col">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Recommended Opportunities</h4>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp) => (
            <div key={opp._id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <Briefcase className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{opp.companyName}</dt>
                      <dd className="text-lg font-semibold text-gray-900 truncate">{opp.topic}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center border-t border-gray-200">
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {opp.date}</span>
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {opp.capacity} max</span>
                </div>
                <button
                  onClick={() => handleRequest(opp._id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                >
                  Request Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardUniversity;
