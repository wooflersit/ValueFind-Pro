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
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminSettings } from './components/admin/settings/AdminSettings';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
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
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/master-admin/settings"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* Network Operator Routes */}
      <Route
        path="/network-operator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Store Owner Routes */}
      <Route
        path="/store-owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Delivery Partner Routes */}
      <Route
        path="/delivery-partner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['delivery_partner']}>
            <CustomerDashboard />
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
