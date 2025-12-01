import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const OperatorCustomers: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Customers</h1>
        <p>Customers in your area...</p>
      </div>
    </DashboardLayout>
  );
};
