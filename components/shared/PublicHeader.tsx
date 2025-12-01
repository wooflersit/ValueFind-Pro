import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { ShoppingBag, Menu, X, Home } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ValueFind Pro
              </h1>
              <p className="text-xs text-gray-500">Your Complete Commerce Solution</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`flex items-center gap-2 transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/products" 
              className={`transition-colors ${
                isActive('/products') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Browse Products
            </Link>
            <a href="/#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="/#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block">
              <Button 
                variant={isActive('/login') ? 'default' : 'outline'} 
                size="sm"
                className={isActive('/login') ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                size="sm" 
                className={isActive('/register') ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'}
              >
                Register
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-3 bg-white">
            <Link 
              to="/" 
              className="flex items-center gap-2 py-2 text-gray-700 hover:text-blue-600" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/products" 
              className="block py-2 text-gray-700 hover:text-blue-600" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Products
            </Link>
            <a 
              href="/#features" 
              className="block py-2 text-gray-700 hover:text-blue-600" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="/#contact" 
              className="block py-2 text-gray-700 hover:text-blue-600" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
