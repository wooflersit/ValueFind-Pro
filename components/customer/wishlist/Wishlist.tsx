import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const Wishlist: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">My Wishlist</h1>
        <p>Saved items...</p>
      </div>
    </DashboardLayout>
  );
};
