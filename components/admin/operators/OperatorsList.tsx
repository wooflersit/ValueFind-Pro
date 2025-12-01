import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const OperatorsList: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Network Operators</h1>
          <Link to="/admin/operators/create">
            <Button><Plus className="mr-2 h-4 w-4" /> Add Operator</Button>
          </Link>
        </div>
        <p>List of all network operators...</p>
      </div>
    </DashboardLayout>
  );
};
