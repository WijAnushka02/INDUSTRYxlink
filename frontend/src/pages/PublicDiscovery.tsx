import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Building, Calendar, Clock, Users, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const PublicDiscovery: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await axios.get('/api/v1/opportunities/public');
        setOpportunities(res.data.opportunities || []);
      } catch (err) {
        console.error('Failed to fetch opportunities', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpps();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Smart Discovery</h1>
            <p className="text-gray-500 mt-2 text-lg">Browse public industry visit opportunities.</p>
          </div>
          <Link to="/register">
            <Button>Sign up to Apply</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-64 bg-gray-100" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <Card key={opp._id} className="hover:shadow-lg transition-shadow border-gray-200 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900 font-bold leading-tight">{opp.topic}</CardTitle>
                      <div className="flex items-center text-indigo-600 mt-2 text-sm font-medium">
                        <Building className="w-4 h-4 mr-1" />
                        Company Visit
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{new Date(opp.visitDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{opp.durationHours} Hours</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Cap: {opp.capacity}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-700 font-medium mb-2 text-sm">
                      <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                      Eligible Degrees
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opp.eligibleDegrees.map((degree: string) => (
                        <Badge key={degree} variant="secondary" className="bg-gray-100 text-gray-700 border-none font-normal">
                          {degree}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {opportunities.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                No public opportunities available at the moment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDiscovery;
