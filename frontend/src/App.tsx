import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicDiscovery from './pages/PublicDiscovery';
import PublicAnalytics from './pages/PublicAnalytics';
import DashboardUniversity from './pages/DashboardUniversity';
import DashboardCompany from './pages/DashboardCompany';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect to a sensible default or forbidden page
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/discover" element={<PublicDiscovery />} />
      <Route path="/analytics" element={<PublicAnalytics />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes wrapped in MainLayout */}
      <Route path="/app" element={<MainLayout />}>
        <Route path="university" element={
          <ProtectedRoute allowedRoles={['UNIVERSITY_COORDINATOR']}>
            <DashboardUniversity />
          </ProtectedRoute>
        } />
        <Route path="company" element={
          <ProtectedRoute allowedRoles={['COMPANY_COORDINATOR']}>
            <DashboardCompany />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
