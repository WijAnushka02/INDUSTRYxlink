import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-indigo-600">
            INDUSTRY<span className="text-gray-900">x</span>LINK
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2">
              Log in
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            The Digital Bridge Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Universities</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Industry</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover, coordinate, and manage industry visits seamlessly. Stop relying on endless emails and spreadsheets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-12">
          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-7 w-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Discovery</h3>
            <p className="text-gray-600 leading-relaxed">
              Our recommendation engine matches university requirements with the perfect company visit opportunities.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Streamlined Management</h3>
            <p className="text-gray-600 leading-relaxed">
              Handle visit requests, approvals, quotas, and cancellations securely from a single dashboard.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-7 w-7 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Engagement Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Track historical engagement data, measure student impact, and optimize future academia-industry collaborations.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
