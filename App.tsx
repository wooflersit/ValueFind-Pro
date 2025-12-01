import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Public Pages
import { LandingPage } from './components/public/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { PublicProductsPage } from './components/public/PublicProductsPage';

// Master Admin Pages
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OperatorsList } from './components/admin/operators/OperatorsList';
import { CreateOperator } from './components/admin/operators/CreateOperator';
import { OperatorDetails } from './components/admin/operators/OperatorDetails';
import { EditOperator } from './components/admin/operators/EditOperator';
import { FranchiseManagement } from './components/admin/franchises/FranchiseManagement';
import { AssignFranchise } from './components/admin/franchises/AssignFranchise';
import { SellerManagement } from './components/admin/sellers/SellerManagement';
import { CustomerManagement } from './components/admin/customers/CustomerManagement';
import { AdminAnalytics } from './components/admin/analytics/AdminAnalytics';
import { AdminSettings } from './components/admin/settings/AdminSettings';
import { TemplateManagement } from './components/admin/templates/TemplateManagement';

// Network Operator Pages
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { OperatorArea } from './components/operator/OperatorArea';
import { OperatorSellers } from './components/operator/sellers/OperatorSellers';
import { OnboardSeller } from './components/operator/sellers/OnboardSeller';
import { OperatorSellerDetails } from './components/operator/sellers/OperatorSellerDetails';
import { VerifySeller } from './components/operator/sellers/VerifySeller';
import { OperatorOrders } from './components/operator/OperatorOrders';
import { OperatorCustomers } from './components/operator/OperatorCustomers';
import { OperatorReports } from './components/operator/OperatorReports';
import { OperatorSupport } from './components/operator/OperatorSupport';

// Seller Pages
import { SellerDashboard } from './components/seller/SellerDashboard';
import { SellerProducts } from './components/seller/products/SellerProducts';
import { CreateProduct } from './components/seller/products/CreateProduct';
import { ProductDetails } from './components/seller/products/ProductDetails';
import { EditProduct } from './components/seller/products/EditProduct';
import { SellerOrders } from './components/seller/orders/SellerOrders';
import { SellerInventory } from './components/seller/inventory/SellerInventory';
import { SellerAnalytics } from './components/seller/analytics/SellerAnalytics';
import { SellerProfile } from './components/seller/profile/SellerProfile';

// Customer Pages
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CustomerProducts } from './components/customer/products/CustomerProducts';
import { CustomerProductDetails } from './components/customer/products/CustomerProductDetails';
import { Cart } from './components/customer/cart/Cart';
import { Checkout } from './components/customer/checkout/Checkout';
import { CustomerOrders } from './components/customer/orders/CustomerOrders';
import { OrderTracking } from './components/customer/orders/OrderTracking';
import { Wishlist } from './components/customer/wishlist/Wishlist';
import { CustomerProfile } from './components/customer/profile/CustomerProfile';
import { AddressManagement } from './components/customer/addresses/AddressManagement';
import { CustomerSupport } from './components/customer/support/CustomerSupport';

import { apiCall } from './utils/api';

const InitializeApp: React.FC = () => {
  useEffect(() => {
    // Initialize demo data on first load
    const initData = async () => {
      const initialized = localStorage.getItem('app_initialized');
      if (!initialized) {
        console.log('Initializing demo data...');
        const response = await apiCall('/init', { method: 'POST' }, false);
        if (response.success) {
          localStorage.setItem('app_initialized', 'true');
          console.log('Demo data initialized successfully');
        }
      }
    };
    
    initData();
  }, []);

  return null;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/products" element={<PublicProductsPage />} />

      {/* Master Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/operators"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <OperatorsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/operators/create"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <CreateOperator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/operators/:id"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <OperatorDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/operators/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <EditOperator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/franchises"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <FranchiseManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/franchises/assign"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <AssignFranchise />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sellers"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <SellerManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <CustomerManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <AdminAnalytics />
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
      <Route
        path="/admin/templates"
        element={
          <ProtectedRoute allowedRoles={['master_admin']}>
            <TemplateManagement />
          </ProtectedRoute>
        }
      />

      {/* Network Operator Routes */}
      <Route
        path="/operator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/area"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorArea />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/sellers"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorSellers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/sellers/onboard"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OnboardSeller />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/sellers/:id"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorSellerDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/sellers/:id/verify"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <VerifySeller />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/orders"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/customers"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorCustomers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/reports"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/support"
        element={
          <ProtectedRoute allowedRoles={['network_operator']}>
            <OperatorSupport />
          </ProtectedRoute>
        }
      />

      {/* Seller Routes */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <SellerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/create"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/:id"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <ProductDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <SellerOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/inventory"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <SellerInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/analytics"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <SellerAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/profile"
        element={
          <ProtectedRoute allowedRoles={['manufacturer', 'distributor', 'trader', 'retailer']}>
            <SellerProfile />
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
      <Route
        path="/customer/products"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/products/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProductDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/checkout"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders/:id"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderTracking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/wishlist"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/addresses"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <AddressManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/support"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerSupport />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <InitializeApp />
            <AppRoutes />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
