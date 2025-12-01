import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { RoleSwitcher } from '../shared/RoleSwitcher';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Home, Settings, LogOut, User, Bell, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentRole = user.currentRole || user.primaryRole;
  const dashboardPath = `/${currentRole.replace('_', '-')}/dashboard`;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <nav className="flex flex-col gap-2 mt-6">
                    <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Home className="mr-2 h-4 w-4" /> Dashboard
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <Link to={dashboardPath} className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg font-bold">
                  VF
                </div>
                <span className="font-semibold text-lg hidden sm:inline">ValueFind Pro</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link to={dashboardPath}>
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <RoleSwitcher />

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/${currentRole.replace('_', '-')}/profile`)}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/${currentRole.replace('_', '-')}/settings`)}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              © 2025 ValueFind Pro. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link>
              <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link to="/support" className="text-sm text-gray-600 hover:text-gray-900">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
