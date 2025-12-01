import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../utils/supabase/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardMap: Record<UserRole, string> = {
      master_admin: '/admin/dashboard',
      network_operator: '/operator/dashboard',
      store_owner: '/store/dashboard',
      delivery_partner: '/delivery/dashboard',
      customer: '/customer/dashboard',
    };
    
    return <Navigate to={dashboardMap[user.role]} replace />;
  }

  return <>{children}</>;
};
