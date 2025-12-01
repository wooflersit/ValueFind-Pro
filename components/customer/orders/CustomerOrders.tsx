import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const CustomerOrders: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">My Orders</h1>
        <p>Order history...</p>
      </div>
    </DashboardLayout>
  );
};
