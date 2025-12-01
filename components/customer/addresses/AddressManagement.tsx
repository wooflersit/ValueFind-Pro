import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const AddressManagement: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Manage Addresses</h1>
        <p>Delivery addresses...</p>
      </div>
    </DashboardLayout>
  );
};
