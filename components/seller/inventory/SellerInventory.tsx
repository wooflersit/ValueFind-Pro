import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const SellerInventory: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Inventory Management</h1>
        <p>Inventory overview...</p>
      </div>
    </DashboardLayout>
  );
};
