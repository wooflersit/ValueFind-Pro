import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const FranchiseManagement: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Franchise Management</h1>
          <Link to="/admin/franchises/assign">
            <Button><Plus className="mr-2 h-4 w-4" /> Assign Franchise</Button>
          </Link>
        </div>
        <p>Franchise list...</p>
      </div>
    </DashboardLayout>
  );
};
