import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CartProvider } from './contexts/CartContext';
import { MapsProvider } from './contexts/MapsContext';
import { LandingPage } from './components/public/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { MasterAdminDashboard } from './components/dashboards/MasterAdminDashboard';
import { NetworkOperatorDashboard } from './components/dashboards/NetworkOperatorDashboard';
import { StoreOwnerDashboard } from './components/dashboards/StoreOwnerDashboard';
import { DeliveryPartnerDashboard } from './components/dashboards/DeliveryPartnerDashboard';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import './styles/globals.css';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Master Admin Routes */}
      <Route
        path="/master-admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <MasterAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Network Operator Routes */}
      <Route
        path="/network-operator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <NetworkOperatorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Store Owner Routes */}
      <Route
        path="/store-owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <StoreOwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Delivery Partner Routes */}
      <Route
        path="/delivery-partner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['delivery_partner']}>
            <DeliveryPartnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <MapsProvider>
            <CartProvider>
              <AppRoutes />
              <Toaster />
            </CartProvider>
          </MapsProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
