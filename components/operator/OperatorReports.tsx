import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';

export const OperatorReports: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Reports</h1>
        <p>Performance reports...</p>
      </div>
    </DashboardLayout>
  );
};
