import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const OperatorOrders: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Orders</h1>
        <p>Orders in your area...</p>
      </div>
    </DashboardLayout>
  );
};
