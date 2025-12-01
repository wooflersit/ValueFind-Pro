import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const SellerAnalytics: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Analytics</h1>
        <p>Sales analytics...</p>
      </div>
    </DashboardLayout>
  );
};
