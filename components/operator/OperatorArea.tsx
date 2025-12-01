import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const OperatorArea: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">My Area</h1>
        <p>Territory details...</p>
      </div>
    </DashboardLayout>
  );
};
