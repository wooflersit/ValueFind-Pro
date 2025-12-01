import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const CreateProduct: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Create Product</h1>
        <p>Product creation form...</p>
      </div>
    </DashboardLayout>
  );
};
