import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { apiCall } from '../../utils/api';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Users, Store, ShoppingCart, DollarSign, TrendingUp, Package, Settings, Map, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const response = await apiCall('/dashboard/stats', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    if (response.success && response.data) {
      setStats(response.data.stats);
    }
    setLoading(false);
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Operators',
      value: stats?.activeOperators || 0,
      icon: <Users className="h-8 w-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Sellers',
      value: stats?.totalSellers || 0,
      icon: <Store className="h-8 w-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <Users className="h-8 w-8" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Orders Today',
      value: stats?.ordersToday || 0,
      icon: <ShoppingCart className="h-8 w-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <Package className="h-8 w-8" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl text-gray-900">Master Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your platform overview.</p>
          </div>
          <Link to="/admin/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                    <p className="text-3xl text-gray-900">{kpi.value}</p>
                  </div>
                  <div className={`${kpi.bgColor} ${kpi.color} p-3 rounded-lg`}>
                    {kpi.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/admin/settings?tab=sms">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Configure SMS</span>
                </Button>
              </Link>
              <Link to="/admin/settings?tab=maps">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Map className="h-6 w-6 mb-2" />
                  <span className="text-sm">Configure Maps</span>
                </Button>
              </Link>
              <Link to="/admin/operators/create">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Add Operator</span>
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database</span>
                  <span className="text-green-600 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API Server</span>
                  <span className="text-green-600 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Authentication</span>
                  <span className="text-green-600 flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                    Operational
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integrations Status</CardTitle>
              <CardDescription>Third-party services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS Service
                  </span>
                  <Link to="/admin/settings?tab=sms">
                    <Button variant="link" size="sm">Configure</Button>
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    Maps Service
                  </span>
                  <Link to="/admin/settings?tab=maps">
                    <Button variant="link" size="sm">Configure</Button>
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Gateway</span>
                  <span className="text-gray-400 text-sm">Coming Soon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
