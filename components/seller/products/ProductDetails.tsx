import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const ProductDetails: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Product Details</h1>
        <p>Product information...</p>
      </div>
    </DashboardLayout>
  );
};
