import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export const TemplateManagement: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Template Management</h1>
        <p>Email/SMS templates...</p>
      </div>
    </DashboardLayout>
  );
};
