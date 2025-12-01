import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const SellerProfile: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">My Profile</h1>
        <p>Profile settings...</p>
      </div>
    </DashboardLayout>
  );
};
