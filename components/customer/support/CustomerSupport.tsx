import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const CustomerSupport: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Support</h1>
        <p>Support tickets...</p>
      </div>
    </DashboardLayout>
  );
};
