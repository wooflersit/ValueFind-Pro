import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { 
  Menu, X, LogOut, Bell, User, ShoppingBag,
  LayoutDashboard, Users, MapPin, Settings, Package,
  ShoppingCart, FileText, BarChart3, Store, Truck
} from 'lucide-react';
import { UserRole } from '../../utils/supabase/types';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  // Master Admin
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/admin/dashboard', roles: ['master_admin'] },
  { label: 'Network Operators', icon: <Users className="h-5 w-5" />, path: '/admin/operators', roles: ['master_admin'] },
  { label: 'Franchises', icon: <MapPin className="h-5 w-5" />, path: '/admin/franchises', roles: ['master_admin'] },
  { label: 'Sellers', icon: <Store className="h-5 w-5" />, path: '/admin/sellers', roles: ['master_admin'] },
  { label: 'Customers', icon: <Users className="h-5 w-5" />, path: '/admin/customers', roles: ['master_admin'] },
  { label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, path: '/admin/analytics', roles: ['master_admin'] },
  { label: 'Templates', icon: <FileText className="h-5 w-5" />, path: '/admin/templates', roles: ['master_admin'] },
  { label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/admin/settings', roles: ['master_admin'] },
  
  // Network Operator
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/operator/dashboard', roles: ['network_operator'] },
  { label: 'My Area', icon: <MapPin className="h-5 w-5" />, path: '/operator/area', roles: ['network_operator'] },
  { label: 'Sellers', icon: <Store className="h-5 w-5" />, path: '/operator/sellers', roles: ['network_operator'] },
  { label: 'Orders', icon: <ShoppingCart className="h-5 w-5" />, path: '/operator/orders', roles: ['network_operator'] },
  { label: 'Customers', icon: <Users className="h-5 w-5" />, path: '/operator/customers', roles: ['network_operator'] },
  { label: 'Reports', icon: <BarChart3 className="h-5 w-5" />, path: '/operator/reports', roles: ['network_operator'] },
  { label: 'Support', icon: <Bell className="h-5 w-5" />, path: '/operator/support', roles: ['network_operator'] },
  
  // Seller
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/seller/dashboard', roles: ['manufacturer', 'distributor', 'trader', 'retailer'] },
  { label: 'Products', icon: <Package className="h-5 w-5" />, path: '/seller/products', roles: ['manufacturer', 'distributor', 'trader', 'retailer'] },
  { label: 'Orders', icon: <ShoppingCart className="h-5 w-5" />, path: '/seller/orders', roles: ['manufacturer', 'distributor', 'trader', 'retailer'] },
  { label: 'Inventory', icon: <Truck className="h-5 w-5" />, path: '/seller/inventory', roles: ['manufacturer', 'distributor', 'trader', 'retailer'] },
  { label: 'Analytics', icon: <BarChart3 className="h-5 w-5" />, path: '/seller/analytics', roles: ['manufacturer', 'distributor', 'trader', 'retailer'] },
  { label: 'Profile', icon: <User className="h-5 w-5" />, path: '/seller/profile', roles: ['manufacturer', 'distributor', 'trader', 'retailer'] },
  
  // Customer
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/customer/dashboard', roles: ['customer'] },
  { label: 'Browse Products', icon: <ShoppingBag className="h-5 w-5" />, path: '/customer/products', roles: ['customer'] },
  { label: 'Cart', icon: <ShoppingCart className="h-5 w-5" />, path: '/customer/cart', roles: ['customer'] },
  { label: 'Orders', icon: <Package className="h-5 w-5" />, path: '/customer/orders', roles: ['customer'] },
  { label: 'Wishlist', icon: <Bell className="h-5 w-5" />, path: '/customer/wishlist', roles: ['customer'] },
  { label: 'Profile', icon: <User className="h-5 w-5" />, path: '/customer/profile', roles: ['customer'] },
  { label: 'Addresses', icon: <MapPin className="h-5 w-5" />, path: '/customer/addresses', roles: ['customer'] },
  { label: 'Support', icon: <Bell className="h-5 w-5" />, path: '/customer/support', roles: ['customer'] },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const getRoleName = (role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      master_admin: 'Master Admin',
      network_operator: 'Network Operator',
      manufacturer: 'Manufacturer',
      distributor: 'Distributor',
      trader: 'Trader',
      retailer: 'Retailer',
      customer: 'Customer',
    };
    return roleNames[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="text-lg">ValueFind Pro</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="text-sm text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user && getRoleName(user.role)}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[57px] left-0 z-30 h-[calc(100vh-57px)]
          w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {filteredMenuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${location.pathname === item.path 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
