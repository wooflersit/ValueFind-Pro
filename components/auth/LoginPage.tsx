import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PublicHeader } from '../shared/PublicHeader';
import { UserRole } from '../../utils/supabase/types';
import { Lock, Mail, UserCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserRole | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const dashboardMap: Record<UserRole, string> = {
    master_admin: '/admin/dashboard',
    network_operator: '/operator/dashboard',
    store_owner: '/store/dashboard',
    delivery_partner: '/delivery/dashboard',
    customer: '/customer/dashboard',
  };

  const userTypeOptions = [
    { value: 'customer', label: 'Customer', description: 'Shop products and track orders' },
    { value: 'store_owner', label: 'Store Owner', description: 'Manufacturer, Distributor, Trader, or Retailer' },
    { value: 'delivery_partner', label: 'Delivery Partner', description: 'Deliver orders with bike, auto, or van' },
    { value: 'network_operator', label: 'Network Operator', description: 'Manage territory operations' },
    { value: 'master_admin', label: 'Master Admin', description: 'Platform administrator' },
  ];

  React.useEffect(() => {
    if (user) {
      navigate(dashboardMap[user.role]);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userType) {
      setError('Please select your user type');
      return;
    }

    setLoading(true);

    const result = await login(email, password);

    if (result.success && result.user) {
      // Verify user type matches selection
      if (result.user.role !== userType) {
        setError(`This account is registered as ${result.user.role}, but you selected ${userType}. Please select the correct user type.`);
        setLoading(false);
        // Logout the user since type doesn't match
        return;
      }
      showSuccess('Login successful!');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }

    setLoading(false);
  };

  const quickLogin = (email: string, password: string, type: UserRole) => {
    setEmail(email);
    setPassword(password);
    setUserType(type);
  };

  const demoAccounts = [
    { email: 'master@valuefind.com', role: 'Master Admin', password: 'Master@123', type: 'master_admin' as UserRole, category: 'Admin' },
    { email: 'operator@valuefind.com', role: 'Network Operator', password: 'Operator@123', type: 'network_operator' as UserRole, category: 'Operations' },
    { email: 'manufacturer@valuefind.com', role: 'Store Owner (Manufacturer)', password: 'Store@123', type: 'store_owner' as UserRole, category: 'Store' },
    { email: 'distributor@valuefind.com', role: 'Store Owner (Distributor)', password: 'Store@123', type: 'store_owner' as UserRole, category: 'Store' },
    { email: 'trader@valuefind.com', role: 'Store Owner (Trader)', password: 'Store@123', type: 'store_owner' as UserRole, category: 'Store' },
    { email: 'retailer@valuefind.com', role: 'Store Owner (Retailer)', password: 'Store@123', type: 'store_owner' as UserRole, category: 'Store' },
    { email: 'delivery@valuefind.com', role: 'Delivery Partner (Bike)', password: 'Delivery@123', type: 'delivery_partner' as UserRole, category: 'Delivery' },
    { email: 'delivery2@valuefind.com', role: 'Delivery Partner (Van)', password: 'Delivery@123', type: 'delivery_partner' as UserRole, category: 'Delivery' },
    { email: 'customer@valuefind.com', role: 'Customer', password: 'Customer@123', type: 'customer' as UserRole, category: 'Customer' },
    { email: 'premium@valuefind.com', role: 'Premium Customer', password: 'Premium@123', type: 'customer' as UserRole, category: 'Customer' },
  ];

  const groupedAccounts = {
    Admin: demoAccounts.filter(a => a.category === 'Admin'),
    Operations: demoAccounts.filter(a => a.category === 'Operations'),
    Store: demoAccounts.filter(a => a.category === 'Store'),
    Delivery: demoAccounts.filter(a => a.category === 'Delivery'),
    Customer: demoAccounts.filter(a => a.category === 'Customer'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <PublicHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign In to Your Account</CardTitle>
              <CardDescription>
                Select your user type and enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="userType">I am a *</Label>
                  <Select value={userType} onValueChange={(value) => setUserType(value as UserRole)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-gray-500">{option.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!userType && (
                    <p className="text-xs text-gray-500">
                      Please select your account type to continue
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                      disabled={!userType}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                      disabled={!userType}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  disabled={loading || !userType}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="mt-6 space-y-3 text-center">
                <Link to="/forgot-password" className="block text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Register Now
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="shadow-xl overflow-auto max-h-[700px]">
            <CardHeader className="sticky top-0 bg-white z-10 border-b">
              <CardTitle>Demo Accounts</CardTitle>
              <CardDescription>
                Click any account below to auto-fill credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {Object.entries(groupedAccounts).map(([category, accounts]) => (
                <div key={category}>
                  <h3 className="text-sm text-gray-700 mb-2 px-2 flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {accounts.map((account, index) => (
                      <button
                        key={index}
                        onClick={() => quickLogin(account.email, account.password, account.type)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all hover:shadow-md"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1">
                            <div className="text-sm text-gray-900 font-medium">{account.role}</div>
                            <div className="text-xs text-gray-500">{account.email}</div>
                          </div>
                          <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                            {account.password}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
